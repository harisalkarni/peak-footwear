/*!
 * Unified Tracking Bridge for Peak Footwear
 * Consolidates event tracking across all platforms: GA4/GTM, Axon, Upstack, TripleWhale
 * 
 * PURCHASE TRACKING FLOW (WITH UPSELLS):
 * ========================================
 * 1. CHECKOUT PAGE: User completes checkout form
 * 2. ORDER COMPLETED EVENT: Next Commerce fires 'order:completed'
 *    → Purchase event fires IMMEDIATELY (critical!)
 *    → Order stored in localStorage as 'peak_initial_purchase' (marked processed: true)
 *    → User redirected to upsell page
 * 
 * 3a. UPSELL DECLINED: User clicks "No thanks" → Thank-you page
 *     → Thank-you page checks localStorage
 *     → Sees purchase already processed → skips duplicate
 *     → Order data displays correctly from Next SDK
 * 
 * 3b. UPSELL ACCEPTED: User accepts upsell
 *     → 'upsell:accepted' event fires
 *     → Separate purchase event with '_upsell' suffix
 *     → Linked to original transaction ID
 *     → User redirected to thank-you page
 *     → Thank-you page sees initial purchase already processed
 *     → Combined order displays (original + upsell)
 * 
 * 3c. PAGE CLOSED: User closes browser on upsell page
 *     → Purchase STILL tracked ✓ (fired in step 2)
 *     → No revenue loss!
 * 
 * WHY THIS MATTERS:
 * - Prevents lost conversions if users abandon upsell page
 * - Prevents duplicate purchase events
 * - Links upsells to original transactions
 * - Maintains accurate revenue tracking across all platforms
 */

(function() {
    'use strict';

    // =================================================================
    // CONFIGURATION & STATE
    // =================================================================
    const CONFIG = {
        platforms: {
            ga4: { enabled: true, useGtag: true, useDataLayer: true },
            axon: { enabled: true, eventKey: window.nextConfig?.axon?.eventKey || 'YOUR_AXON_EVENT_KEY_HERE' },
            meta: { enabled: true },
            tripleWhale: { enabled: true }
        },
        currency: window.nextConfig?.currency || 'USD',
        debug: window.nextConfig?.debug || window.location.search.includes('debug=true'),
        categoryMapping: { 'footwear': 1, 'apparel': 2, 'accessories': 3, 'default': 1 }
    };

    const STATE = {
        processedEvents: new Set(),
        transactionMap: new Map(),
        userIdStorage: 'peak_user_id',
        initialized: false,
        platformsReady: { ga4: false, axon: false, meta: false, tripleWhale: false }
    };

    // Initialize data layers
    window.dataLayer = window.dataLayer || [];
    window.NextDataLayer = window.NextDataLayer || [];

    // =================================================================
    // UTILITIES
    // =================================================================
    const Utils = {
        log(message, data = null) {
            if (CONFIG.debug) {
                console.log(`[Unified Tracking Bridge] ${message}`, data || '');
            }
        },

        getPageType() {
            const metaTag = document.querySelector('meta[name="next-page-type"]');
            return metaTag ? metaTag.content : 'unknown';
        },

        getUserId() {
            let userId = localStorage.getItem(STATE.userIdStorage);
            if (!userId) {
                userId = 'peak_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                try {
                    localStorage.setItem(STATE.userIdStorage, userId);
                    this.log('Generated new user ID:', userId);
                } catch (e) {
                    try {
                        sessionStorage.setItem(STATE.userIdStorage, userId);
                    } catch (e2) {
                        this.log('Could not persist user ID');
                    }
                }
            }
            return userId;
        },

        getUserEmail() {
            // Try cart data first
            const cartData = sessionStorage.getItem('next_prospect_cart');
            if (cartData) {
                try {
                    const data = JSON.parse(cartData);
                    return data.email || data.cart_data?.user?.email || null;
                } catch (e) {
                    this.log('Error parsing cart data:', e);
                }
            }
            // Try form fields
            const emailInput = document.querySelector('input[type="email"], input[name="email"]');
            return emailInput?.value || null;
        },

        getCustomerInfo() {
            // Gather all customer information for lead tracking
            const customerInfo = {
                email: null,
                phone: null,
                firstName: null,
                lastName: null
            };

            // Try cart data first
            const cartData = sessionStorage.getItem('next_prospect_cart');
            if (cartData) {
                try {
                    const data = JSON.parse(cartData);
                    customerInfo.email = data.email || data.cart_data?.user?.email || null;
                    customerInfo.phone = data.phone || data.cart_data?.user?.phone || null;
                    customerInfo.firstName = data.firstName || data.first_name || data.cart_data?.user?.firstName || null;
                    customerInfo.lastName = data.lastName || data.last_name || data.cart_data?.user?.lastName || null;
                } catch (e) {
                    this.log('Error parsing cart data for customer info:', e);
                }
            }

            // Try form fields to fill in any missing data
            if (!customerInfo.email) {
                const emailInput = document.querySelector('input[type="email"], input[name="email"], input[name="customer[email]"]');
                customerInfo.email = emailInput?.value || null;
            }
            if (!customerInfo.phone) {
                const phoneInput = document.querySelector('input[type="tel"], input[name="phone"], input[name="customer[phone]"]');
                customerInfo.phone = phoneInput?.value || null;
            }
            if (!customerInfo.firstName) {
                const firstNameInput = document.querySelector('input[name="firstName"], input[name="first_name"], input[name="customer[first_name]"]');
                customerInfo.firstName = firstNameInput?.value || null;
            }
            if (!customerInfo.lastName) {
                const lastNameInput = document.querySelector('input[name="lastName"], input[name="last_name"], input[name="customer[last_name]"]');
                customerInfo.lastName = lastNameInput?.value || null;
            }

            return customerInfo;
        },

        hasGTM() {
            return window.google_tag_manager ||
                   document.querySelector('script[src*="googletagmanager.com/gtm.js"]') ||
                   window.dataLayer.some(item => item['gtm.start']);
        },

        createEventId(eventName, data) {
            const timestamp = Date.now();
            const itemId = data?.ecommerce?.items?.[0]?.item_id || data?.packageId || data?.orderId || '';
            return `${eventName}_${timestamp}_${itemId}`;
        },

        isDuplicateEvent(eventId) {
            if (STATE.processedEvents.has(eventId)) {
                this.log(`Skipping duplicate event: ${eventId}`);
                return true;
            }
            STATE.processedEvents.add(eventId);
            return false;
        }
    };

    // =================================================================
    // DATA TRANSFORMERS
    // =================================================================
    const DataTransformers = {
        // Convert cart line to unified format
        toUnified(cartLine) {
            const unitPrice = cartLine.price?.incl_tax?.value || 
                             (cartLine.price?.lineTotal?.value / cartLine.quantity) || 0;
            const discount = cartLine.price?.savings?.value || 0;

            return {
                id: String(cartLine.product?.sku || cartLine.packageId || cartLine.id),
                variant_id: String(cartLine.packageId || cartLine.id),
                name: cartLine.product?.title || 'Unknown Product',
                price: parseFloat(unitPrice),
                quantity: parseInt(cartLine.quantity || 1),
                image: cartLine.product?.image || '',
                category: 'footwear',
                brand: 'Peak Footwear',
                discount: parseFloat(discount),
                sku: cartLine.product?.sku || cartLine.packageId || cartLine.id
            };
        },

        // Transform to platform-specific formats
        toGA4(item) {
            return {
                item_id: item.id,
                item_name: item.name,
                item_brand: item.brand,
                item_category: item.category,
                item_variant: item.variant_id,
                price: item.price,
                quantity: item.quantity,
                item_sku: item.sku,
                discount: item.discount > 0 ? item.discount : undefined
            };
        },

        toAxon(item) {
            return {
                item_id: item.id,
                item_variant_id: item.variant_id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity,
                image_url: item.image,
                item_category_id: CONFIG.categoryMapping[item.category] || CONFIG.categoryMapping.default,
                item_brand: item.brand,
                discount: item.discount
            };
        },

        toMeta(item) {
            return {
                id: item.id,
                quantity: item.quantity,
                item_price: item.price
            };
        },

        toTripleWhale(item) {
            return {
                item: item.id,
                q: item.quantity,
                v: (item.price * item.quantity).toString()
            };
        },

        // Transform ecommerce data to cart data format
        ecommerceToCartData(ecommerce) {
            const cartLines = (ecommerce.items || []).map(item => ({
                packageId: item.item_id || item.id,
                product: {
                    sku: item.item_id || item.id,
                    title: item.item_name || item.name,
                    image: item.item_image || item.image
                },
                quantity: item.quantity || 1,
                price: {
                    incl_tax: { value: item.price || 0 },
                    lineTotal: { value: (item.price || 0) * (item.quantity || 1) }
                }
            }));

            const total = ecommerce.value || cartLines.reduce(
                (sum, line) => sum + line.price.lineTotal.value, 0
            );

            return {
                cartLines: cartLines,
                cartTotals: {
                    total: { value: total },
                    count: cartLines.reduce((sum, line) => sum + line.quantity, 0)
                }
            };
        }
    };

    // =================================================================
    // PLATFORM DISPATCHERS
    // =================================================================
    const Platforms = {
        ga4(eventName, eventData) {
            if (!CONFIG.platforms.ga4.enabled) return;

            // Push to dataLayer for GTM
            if (CONFIG.platforms.ga4.useDataLayer) {
                if (eventData.ecommerce) {
                    window.dataLayer.push({ ecommerce: null });
                }
                window.dataLayer.push(eventData);
                Utils.log(`GA4/GTM: Pushed ${eventName} to dataLayer`, eventData);
            }

            // Send via gtag if no GTM
            if (CONFIG.platforms.ga4.useGtag && !Utils.hasGTM() && typeof gtag !== 'undefined') {
                const gtagParams = { ...eventData.ecommerce, ...eventData.user_properties, send_to: 'default' };
                gtag('event', eventName, gtagParams);
                Utils.log(`GA4: Sent ${eventName} via gtag`, gtagParams);
            }
        },

        axon(eventName, axonData) {
            if (!CONFIG.platforms.axon.enabled || !window.axon) return;
            window.axon("track", eventName, axonData);
            Utils.log(`Axon: Tracked ${eventName}`, axonData);
        },

        meta(eventName, metaData) {
            if (!CONFIG.platforms.meta.enabled || !window._upstack) return;

            window._upstack('track', eventName, metaData);
            Utils.log(`Upstack: Tracked ${eventName}`, metaData);
        },

        tripleWhale(eventName, tripleWhaleData) {
            if (!CONFIG.platforms.tripleWhale.enabled || !window.TriplePixel) return;
            window.TriplePixel(eventName, tripleWhaleData);
            Utils.log(`TripleWhale: Tracked ${eventName}`, tripleWhaleData);
        }
    };

    // =================================================================
    // EVENT HANDLERS
    // =================================================================
    const EventHandlers = {
        pageView() {
            const eventId = Utils.createEventId('page_view', {});
            if (Utils.isDuplicateEvent(eventId)) return;

            Utils.log('Processing page view');

            Platforms.ga4('page_view', {
                event: 'page_view',
                page_type: Utils.getPageType(),
                user_id: Utils.getUserId()
            });

            if (window.axon) {
                window.axon("track", "page_view");
            }
        },

        viewItem(cartData) {
            if (!cartData?.cartLines?.length) return;

            const eventId = Utils.createEventId('view_item', cartData);
            if (Utils.isDuplicateEvent(eventId)) return;

            Utils.log('Processing view item', cartData);

            const unifiedItems = cartData.cartLines.map(DataTransformers.toUnified);
            const totalValue = cartData.cartTotals?.total?.value || 
                              unifiedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // GA4
            Platforms.ga4('view_item', {
                event: 'view_item',
                ecommerce: {
                    currency: CONFIG.currency,
                    value: totalValue,
                    items: unifiedItems.map(DataTransformers.toGA4)
                }
            });

            // Axon
            Platforms.axon('view_item', {
                currency: CONFIG.currency,
                value: totalValue,
                items: unifiedItems.map(DataTransformers.toAxon),
                user_id: Utils.getUserId()
            });

            // Upstack
            Platforms.meta('view_content', {
                value: totalValue,
                currency: CONFIG.currency,
                items: unifiedItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price,
                    variant: item.variant_id
                }))
            });
        },

        addToCart(cartData) {
            if (!cartData?.cartLines?.length) return;

            const eventId = Utils.createEventId('add_to_cart', cartData);
            if (Utils.isDuplicateEvent(eventId)) return;

            Utils.log('Processing add to cart', cartData);

            const unifiedItems = cartData.cartLines.map(DataTransformers.toUnified);
            const totalValue = cartData.cartTotals?.total?.value || 
                              unifiedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            // GA4
            Platforms.ga4('add_to_cart', {
                event: 'add_to_cart',
                ecommerce: {
                    currency: CONFIG.currency,
                    value: totalValue,
                    items: unifiedItems.map(DataTransformers.toGA4)
                }
            });

            // Axon
            Platforms.axon('add_to_cart', {
                currency: CONFIG.currency,
                value: totalValue,
                items: unifiedItems.map(DataTransformers.toAxon),
                user_id: Utils.getUserId()
            });

            // Upstack
            Platforms.meta('add_to_cart', {
                value: totalValue,
                currency: CONFIG.currency,
                items: unifiedItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price,
                    variant: item.variant_id
                }))
            });

            // TripleWhale
            unifiedItems.forEach(item => {
                Platforms.tripleWhale('AddToCart', DataTransformers.toTripleWhale(item));
            });
        },

        beginCheckout(cartData) {
            if (!cartData?.cartLines?.length) return;

            const eventId = Utils.createEventId('begin_checkout', cartData);
            if (Utils.isDuplicateEvent(eventId)) return;

            Utils.log('Processing begin checkout', cartData);

            const unifiedItems = cartData.cartLines.map(DataTransformers.toUnified);
            const totalValue = cartData.cartTotals?.total?.value || 
                              unifiedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalQuantity = unifiedItems.reduce((sum, item) => sum + item.quantity, 0);

            // GA4
            Platforms.ga4('begin_checkout', {
                event: 'begin_checkout',
                ecommerce: {
                    currency: CONFIG.currency,
                    value: totalValue,
                    items: unifiedItems.map(DataTransformers.toGA4)
                }
            });

            // Axon
            Platforms.axon('begin_checkout', {
                currency: CONFIG.currency,
                value: totalValue,
                items: unifiedItems.map(DataTransformers.toAxon),
                user_id: Utils.getUserId()
            });

            // Upstack
            Platforms.meta('initiate_checkout', {
                value: totalValue,
                currency: CONFIG.currency,
                items: unifiedItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price,
                    variant: item.variant_id
                }))
            });

            // Upstack Lead Event (EXCLUSIVE to Upstack)
            const customerInfo = Utils.getCustomerInfo();
            if (customerInfo.email || customerInfo.phone) {
                // Only fire lead if we have at least email or phone
                const leadData = {};
                if (customerInfo.email) leadData.email = customerInfo.email;
                if (customerInfo.phone) leadData.phone = customerInfo.phone;
                if (customerInfo.firstName) leadData.firstName = customerInfo.firstName;
                if (customerInfo.lastName) leadData.lastName = customerInfo.lastName;

                Platforms.meta('lead', leadData);
                Utils.log('Upstack Lead tracked on initiate checkout', leadData);
            }
        },

        purchase(orderData) {
            if (!orderData) return;

            const eventId = Utils.createEventId('purchase', orderData);
            if (Utils.isDuplicateEvent(eventId)) return;

            Utils.log('Processing purchase', orderData);

            // Store transaction data
            const transactionId = orderData.id || orderData.ref_id || orderData.orderId || Date.now().toString();
            const orderNumber = orderData.order_number || orderData.number;

            if (orderData.id || orderData.orderId) {
                STATE.transactionMap.set(
                    orderData.id || orderData.orderId,
                    { transaction_id: transactionId, order_number: orderNumber }
                );
            }

            // CRITICAL: Get items from cart data at time of purchase for accurate info
            // orderData.items may be empty or have placeholder data (0 price, "Product" name)
            let unifiedItems = [];
            const cartData = window.next?.getCartData?.();
            
            if (cartData?.cartLines?.length > 0) {
                // Use cart data - this has the real product info
                unifiedItems = cartData.cartLines.map(DataTransformers.toUnified);
                Utils.log('Using cart data for purchase items (accurate prices/names)', unifiedItems);
            } else {
                // Fallback to order data if cart not available
                const items = orderData.items || orderData.lines || [];
                unifiedItems = items.map(item => ({
                    id: String(item.sku || item.packageId || item.product_id || item.id),
                    variant_id: String(item.packageId || item.product_id || item.id),
                    name: item.name || item.product_name || item.title || 'Product',
                    price: parseFloat(item.price || item.unit_price || 0),
                    quantity: parseInt(item.quantity || 1),
                    image: item.image || item.image_url || '',
                    category: 'footwear',
                    brand: 'Peak Footwear',
                    discount: parseFloat(item.discount || 0),
                    sku: item.sku || item.product_sku || item.packageId || item.id
                }));
                Utils.log('Using order data for purchase items (cart not available)', unifiedItems);
            }

            // Get total value - use cart total if available for accuracy
            let totalValue = parseFloat(orderData.total || orderData.grandTotal || 0);
            if (cartData?.cartTotals?.total?.value) {
                totalValue = parseFloat(cartData.cartTotals.total.value);
                Utils.log('Using cart total for purchase', totalValue);
            }
            
            const shipping = parseFloat(orderData.shipping || orderData.shippingCost || 0);
            const tax = parseFloat(orderData.tax || orderData.taxAmount || 0);
            const userEmail = orderData.customer?.email || orderData.email || Utils.getUserEmail();

            // Validation - warn if data looks suspicious
            if (unifiedItems.length === 0) {
                Utils.log('WARNING: No items found for purchase event!');
                return;
            }
            if (totalValue === 0) {
                Utils.log('WARNING: Purchase total is $0!');
            }
            if (unifiedItems.some(item => item.name === 'Product' || item.price === 0)) {
                Utils.log('WARNING: Purchase has placeholder data (Product name or $0 price)', unifiedItems);
            }

            // GA4
            const ga4Data = {
                event: 'purchase',
                ecommerce: {
                    transaction_id: transactionId,
                    value: totalValue,
                    currency: orderData.currency || CONFIG.currency,
                    tax: tax,
                    shipping: shipping,
                    items: unifiedItems.map(DataTransformers.toGA4)
                }
            };

            if (orderNumber) ga4Data.ecommerce.order_number = orderNumber;
            if (userEmail) ga4Data.user_email = userEmail;

            Platforms.ga4('purchase', ga4Data);

            // Axon
            Platforms.axon('purchase', {
                currency: orderData.currency || CONFIG.currency,
                items: unifiedItems.map(DataTransformers.toAxon),
                transaction_id: transactionId,
                value: totalValue,
                shipping: shipping,
                tax: tax,
                user_id: Utils.getUserId()
            });

            // Upstack
            const upstackPurchaseData = {
                transactionId: transactionId,
                orderId: transactionId,
                orderName: orderNumber || transactionId,
                value: totalValue,
                currency: orderData.currency || CONFIG.currency,
                items: unifiedItems.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price,
                    variant: item.variant_id
                }))
            };

            // Add customer data if available
            if (userEmail) upstackPurchaseData.email = userEmail;
            if (orderData.customer?.phone || orderData.phone) {
                upstackPurchaseData.phone = orderData.customer?.phone || orderData.phone;
            }
            if (orderData.customer?.firstName || orderData.firstName) {
                upstackPurchaseData.firstName = orderData.customer?.firstName || orderData.firstName;
            }
            if (orderData.customer?.lastName || orderData.lastName) {
                upstackPurchaseData.lastName = orderData.customer?.lastName || orderData.lastName;
            }
            
            // Add address data if available
            if (orderData.shipping_address || orderData.shippingAddress || orderData.customer?.addresses) {
                const address = orderData.shipping_address || orderData.shippingAddress || orderData.customer?.addresses?.[0];
                if (address) {
                    upstackPurchaseData.addresses = [{
                        address1: address.address1 || address.street || '',
                        address2: address.address2 || '',
                        city: address.city || '',
                        province: address.province || address.state || '',
                        provinceCode: address.provinceCode || address.stateCode || '',
                        zip: address.zip || address.postal_code || address.zipCode || '',
                        country: address.country || '',
                        countryCode: address.countryCode || address.country_code || ''
                    }];
                }
            }

            Platforms.meta('nextPurchase', upstackPurchaseData);

            // TripleWhale
            if (userEmail) {
                Platforms.tripleWhale('Contact', {
                    email: userEmail,
                    phone: orderData.customer?.phone || orderData.phone || null
                });
            }
        },

        upsellAccepted(upsellData) {
            if (!upsellData) return;

            const eventId = Utils.createEventId('upsell_accepted', upsellData);
            if (Utils.isDuplicateEvent(eventId)) return;

            Utils.log('Processing upsell accepted', upsellData);

            // Get original transaction data from localStorage or STATE
            let transactionId, orderNumber;
            const orderId = upsellData.order_id || upsellData.orderId;
            
            // First, try to get from our stored purchase
            try {
                const storedPurchase = localStorage.getItem('peak_initial_purchase');
                if (storedPurchase) {
                    const purchase = JSON.parse(storedPurchase);
                    transactionId = purchase.transactionId;
                    orderNumber = purchase.orderData?.order_number || purchase.orderData?.number;
                }
            } catch (e) {
                Utils.log('Error reading stored purchase for upsell', e);
            }
            
            // Fallback to STATE map or use orderId
            if (!transactionId) {
                const transactionData = orderId ? STATE.transactionMap.get(orderId) : null;
                transactionId = transactionData?.transaction_id || orderId || Date.now().toString();
                orderNumber = transactionData?.order_number;
            }

            // Map upsell data (check various property formats)
            const packageId = String(upsellData.packageId || upsellData.package_id || upsellData.id || '');
            const productName = upsellData.productName || upsellData.product_name || 
                               upsellData.package_name || upsellData.name || 
                               `Upsell Package ${packageId}`;
            
            const upsellItem = {
                id: packageId,
                variant_id: packageId,
                name: productName,
                price: parseFloat(upsellData.price || upsellData.value || 0),
                quantity: parseInt(upsellData.quantity || 1),
                category: 'footwear',
                brand: upsellData.brand || 'Peak Footwear',
                image: upsellData.image || upsellData.imageUrl || upsellData.image_url || '',
                sku: upsellData.sku || upsellData.product_sku || packageId
            };

            const totalValue = upsellItem.price * upsellItem.quantity;
            
            Utils.log('Upsell item prepared for tracking:', upsellItem);

            // GA4 - track as purchase
            const ga4Data = {
                event: 'purchase',
                ecommerce: {
                    transaction_id: transactionId + '_upsell',
                    value: totalValue,
                    currency: upsellData.currency || CONFIG.currency,
                    items: [DataTransformers.toGA4(upsellItem)]
                }
            };

            if (orderNumber) ga4Data.ecommerce.order_number = orderNumber;
            Platforms.ga4('purchase', ga4Data);

            // Axon
            Platforms.axon('purchase', {
                currency: upsellData.currency || CONFIG.currency,
                items: [DataTransformers.toAxon(upsellItem)],
                transaction_id: transactionId + '_upsell',
                value: totalValue,
                user_id: Utils.getUserId()
            });

            // Upstack
            /*Platforms.meta('purchase', {
                transactionId: transactionId + '_upsell',
                orderId: transactionId + '_upsell',
                orderName: orderNumber ? `${orderNumber}_upsell` : `${transactionId}_upsell`,
                value: totalValue,
                currency: upsellData.currency || CONFIG.currency,
                items: [{
                    id: upsellItem.id,
                    quantity: upsellItem.quantity,
                    name: upsellItem.name,
                    price: upsellItem.price,
                    variant: upsellItem.variant_id
                }]
            });*/

            // TripleWhale
            Platforms.tripleWhale('AddToCart', DataTransformers.toTripleWhale(upsellItem));
        }
    };

    // =================================================================
    // EVENT PROCESSING
    // =================================================================
    function processDataLayerEvent(eventData) {
        if (!eventData?.event) return;

        const eventMap = {
            'dl_view_item': () => {
                if (eventData.ecommerce) {
                    const cartData = DataTransformers.ecommerceToCartData(eventData.ecommerce);
                    EventHandlers.viewItem(cartData);
                }
            },
            'dl_add_to_cart': () => {
                if (eventData.ecommerce) {
                    const cartData = DataTransformers.ecommerceToCartData(eventData.ecommerce);
                    EventHandlers.addToCart(cartData);
                }
            },
            'dl_begin_checkout': () => {
                let cartData = null;
                if (eventData.ecommerce?.items) {
                    cartData = DataTransformers.ecommerceToCartData(eventData.ecommerce);
                } else if (window.next?.getCartData) {
                    cartData = window.next.getCartData();
                }
                if (cartData?.cartLines?.length) {
                    EventHandlers.beginCheckout(cartData);
                }
            },
            'dl_purchase': () => EventHandlers.purchase(eventData.ecommerce || eventData),
            'dl_accepted_upsell': () => EventHandlers.upsellAccepted(eventData.upsell || eventData)
        };

        const handler = eventMap[eventData.event];
        if (handler) handler();
    }

    // =================================================================
    // INITIALIZATION & SETUP
    // =================================================================
    function setupEventListeners() {
        Utils.log('Setting up event listeners');

        // Next Commerce events
        if (window.next) {
            window.next.on('campaign:loaded', (campaign) => {
                const pageType = Utils.getPageType();
                if (pageType === 'product') {
                    const cartData = window.next.getCartData();
                    if (cartData?.cartLines?.length) {
                        EventHandlers.viewItem(cartData);
                    }
                } else if (pageType === 'receipt') {
                    handleReceiptPagePurchase();
                }
            });

            window.next.on('cart:item-added', () => {
                const cartData = window.next.getCartData();
                if (cartData) EventHandlers.addToCart(cartData);
            });

            window.next.on('checkout:started', () => {
                const cartData = window.next.getCartData();
                if (cartData) EventHandlers.beginCheckout(cartData);
            });

            window.next.on('order:completed', (orderData) => {
                Utils.log('Order completed - firing purchase immediately', orderData);
                
                // CRITICAL: Fire purchase event IMMEDIATELY when order completes
                // This ensures tracking happens even if user closes upsell page
                EventHandlers.purchase(orderData);
                
                // Google Ads Conversion Tracking
                if (typeof gtag !== 'undefined') {
                    const transactionId = orderData.id || orderData.ref_id || orderData.orderId || Date.now().toString();
                    const orderValue = parseFloat(orderData.total || orderData.grandTotal || 0);
                    const orderCurrency = orderData.currency || CONFIG.currency;
                    
                    gtag('event', 'conversion', {
                        'send_to': 'AW-11483263824/QvMGCNvWx5AZENDm0uMq',
                        'value': orderValue,
                        'currency': orderCurrency,
                        'transaction_id': transactionId
                    });
                    
                    Utils.log('Google Ads conversion tracked', {
                        transaction_id: transactionId,
                        value: orderValue,
                        currency: orderCurrency
                    });
                }
                
                // Store that we've tracked this order to prevent duplicate on thank-you page
                try {
                    const orderStorage = {
                        orderData: orderData,
                        timestamp: Date.now(),
                        processed: true, // Mark as already processed
                        transactionId: orderData.id || orderData.ref_id || orderData.orderId
                    };
                    localStorage.setItem('peak_initial_purchase', JSON.stringify(orderStorage));
                } catch (e) {
                    Utils.log('Error storing purchase state', e);
                }
            });

            // Track upsell acceptances
            window.next.on('upsell:accepted', (upsellData) => {
                Utils.log('Upsell accepted', upsellData);
                //EventHandlers.upsellAccepted(upsellData);
            });
        }

        // DataLayer interceptors
        const originalPush = window.dataLayer.push;
        window.dataLayer.push = function(...args) {
            const result = originalPush.apply(window.dataLayer, args);
            args.forEach(item => {
                if (item?.event) processDataLayerEvent(item);
            });
            return result;
        };

        // NextDataLayer interceptor
        if (window.NextDataLayer) {
            window.NextDataLayer.forEach(item => {
                if (item?.event) processDataLayerEvent(item);
            });

            const originalNextPush = window.NextDataLayer.push;
            window.NextDataLayer.push = function(...args) {
                const result = originalNextPush.apply(window.NextDataLayer, args);
                args.forEach(item => {
                    if (item?.event) processDataLayerEvent(item);
                });
                return result;
            };
        }
    }

    function handleCheckoutPageLoad() {
        // Try to get cart data and fire InitiateCheckout
        const fireInitiateCheckout = () => {
            if (window.next?.getCartData) {
                const cartData = window.next.getCartData();
                if (cartData?.cartLines?.length) {
                    Utils.log('Firing InitiateCheckout from checkout page load', cartData);
                    EventHandlers.beginCheckout(cartData);
                    return true;
                }
            }
            return false;
        };

        // Try immediately
        if (!fireInitiateCheckout()) {
            // If not ready, wait a bit and retry
            Utils.log('Cart data not ready, waiting...');
            let retries = 0;
            const maxRetries = 10;

            const retryInterval = setInterval(() => {
                retries++;
                if (fireInitiateCheckout() || retries >= maxRetries) {
                    clearInterval(retryInterval);
                    if (retries >= maxRetries) {
                        Utils.log('Max retries reached for InitiateCheckout');
                    }
                }
            }, 500);
        }
    }

    function handleReceiptPagePurchase() {
        try {
            // Check if we already tracked the initial purchase
            const initialPurchase = localStorage.getItem('peak_initial_purchase');
            
            if (initialPurchase) {
                const orderStorage = JSON.parse(initialPurchase);
                const fiveMinutes = 5 * 60 * 1000;
                const isRecent = (Date.now() - orderStorage.timestamp) < fiveMinutes;

                if (isRecent && orderStorage.processed) {
                    Utils.log('Purchase already tracked at checkout, skipping duplicate on thank-you page');
                    
                    // Clean up old storage format if it exists
                    localStorage.removeItem('peak_pending_purchase');
                    
                    // Keep the record for a bit longer in case of page refresh
                    setTimeout(() => localStorage.removeItem('peak_initial_purchase'), 5000);
                    return; // Don't fire duplicate purchase event
                } else if (!isRecent) {
                    localStorage.removeItem('peak_initial_purchase');
                }
            }
            
            // Fallback: If no stored purchase (old orders or direct navigation), track from window.next.order
            Utils.log('No stored purchase found, attempting to track from window.next.order');
            
            if (window.next?.order) {
                Utils.log('Firing purchase from window.next.order (fallback)', window.next.order);
                EventHandlers.purchase(window.next.order);
            } else {
                // Wait a bit for Next SDK to populate order data
                setTimeout(() => {
                    if (window.next?.order) {
                        Utils.log('Firing purchase from window.next.order (delayed fallback)', window.next.order);
                        EventHandlers.purchase(window.next.order);
                    } else {
                        Utils.log('Warning: No order data available on receipt page');
                    }
                }, 1500);
            }
        } catch (e) {
            Utils.log('Error processing receipt page purchase', e);
            // Last resort fallback
            if (window.next?.order) {
                EventHandlers.purchase(window.next.order);
            }
        }
    }

    function checkPlatformReadiness() {
        const checks = {
            ga4: () => Utils.hasGTM() || typeof gtag !== 'undefined',
            axon: () => window.axon,
            meta: () => window._upstack,
            tripleWhale: () => window.TriplePixel
        };

        let changesDetected = false;
        Object.keys(checks).forEach(platform => {
            if (!STATE.platformsReady[platform] && checks[platform]()) {
                STATE.platformsReady[platform] = true;
                Utils.log(`${platform} ready`);
                changesDetected = true;
            }
        });

        return changesDetected;
    }

    function initialize() {
        if (STATE.initialized) return;

        Utils.log('Initializing Unified Tracking Bridge', CONFIG);

        checkPlatformReadiness();
        setupEventListeners();
        EventHandlers.pageView();

        const pageType = Utils.getPageType();

        if (pageType === 'receipt') {
            setTimeout(handleReceiptPagePurchase, 500);
        } else if (pageType === 'checkout') {
            // Fire InitiateCheckout on checkout page load
            Utils.log('Checkout page detected, firing InitiateCheckout');
            handleCheckoutPageLoad();
        }

        STATE.initialized = true;
        Utils.log('Initialized successfully');

        // Continue checking for late-loading platforms
        const startTime = Date.now();
        const platformCheckInterval = setInterval(() => {
            checkPlatformReadiness();
            
            const allReady = Object.values(STATE.platformsReady).every(ready => ready);
            if (allReady || Date.now() - startTime > 30000) {
                clearInterval(platformCheckInterval);
                Utils.log(allReady ? 'All platforms ready' : 'Stopped checking after 30s');
            }
        }, 1000);
    }

    // Cleanup function
    setInterval(() => {
        if (STATE.processedEvents.size > 1000) {
            const keep = Array.from(STATE.processedEvents).slice(-500);
            STATE.processedEvents.clear();
            keep.forEach(entry => STATE.processedEvents.add(entry));
        }
        if (STATE.transactionMap.size > 100) {
            const keep = Array.from(STATE.transactionMap.entries()).slice(-50);
            STATE.transactionMap.clear();
            keep.forEach(([key, value]) => STATE.transactionMap.set(key, value));
        }
    }, 60000);

    // Start initialization
    function waitForNext() {
        if (window.next) {
            initialize();
        } else {
            setTimeout(waitForNext, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForNext);
    } else {
        waitForNext();
    }

    document.addEventListener('next:initialized', waitForNext);

    // =================================================================
    // PUBLIC API
    // =================================================================
    window.UnifiedTrackingBridge = {
        config: CONFIG,
        getState: () => ({
            initialized: STATE.initialized,
            platformsReady: {...STATE.platformsReady},
            processedEvents: STATE.processedEvents.size,
            transactions: Object.fromEntries(STATE.transactionMap)
        }),
        track: EventHandlers,
        isPlatformReady: (platform) => STATE.platformsReady[platform],
        getUserId: Utils.getUserId,
        getUserEmail: Utils.getUserEmail,
        setDebug: (enabled) => {
            CONFIG.debug = enabled;
            Utils.log('Debug mode ' + (enabled ? 'enabled' : 'disabled'));
        },
        enablePlatform: (platform, enabled = true) => {
            if (CONFIG.platforms[platform]) {
                CONFIG.platforms[platform].enabled = enabled;
                Utils.log(`Platform ${platform} ${enabled ? 'enabled' : 'disabled'}`);
            }
        }
    };

    Utils.log('Unified Tracking Bridge loaded');
})();