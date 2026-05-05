// Next SDK Integration - Upsell Page (Toe Separator - Nextcommerce)
// Product ID: 13038 | White variant ID: 13041

// ============================================
// DYNAMIC UPSELL PACKAGE MAP
// Built at runtime from window.next.getCampaignData() offers/packages
// so it always uses the correct campaign ref_id automatically.
// ============================================

// Maps color slug → campaign package ref_id (populated on next:initialized)
const UP02_PACKAGE_MAP = {};

// Live product data from campaign — overrides hardcoded defaults when SDK loads
const UP02_CAMPAIGN_DATA = {
    productName: null,  // e.g. "Toe Separator - Nextcommerce"
    retailPrice: null,  // from pkg.price_retail
    offerPrice:  null,  // from pkg.price_total (the discounted price customer pays)
};

// Color display name (as it appears in campaign package names) → slug used in HTML
const UP02_COLOR_DISPLAY_TO_SLUG = {
    'white':  'white',
    'pink':   'pink',
    'blue':   'blue',
    'black':  'black',
    'beige':  'beige',
    'orange': 'orange',
    'purple': 'purple',
    'green':  'green',
};

/**
 * Updates the page DOM with live product data fetched from the campaign SDK.
 * Called after buildUpsellPackageMap() succeeds.
 * Falls back gracefully — if a value is null, the hardcoded HTML stays in place.
 */
function updateProductDataFromCampaign() {
    // --- Product title ---
    if (UP02_CAMPAIGN_DATA.productName) {
        const titleEls = document.querySelectorAll('[data-up02-product-name]');
        titleEls.forEach(el => { el.textContent = UP02_CAMPAIGN_DATA.productName; });
        console.log('[UP02] Product name updated from campaign:', UP02_CAMPAIGN_DATA.productName);
    }

    // --- Prices (qty=1 is the default on page load) ---
    // Re-use updatePrices() so the same logic applies — it reads UP02_PRICING which was
    // already overwritten above before this function is called.
    const selectedToggle = document.querySelector('[data-next-upsell-quantity-toggle].next-selected');
    const currentQty = selectedToggle ? parseInt(selectedToggle.getAttribute('data-next-upsell-quantity-toggle')) : 1;
    updatePrices(currentQty);
    console.log('[UP02] Prices refreshed from campaign data at qty:', currentQty);
}

/**
 * Builds color → ref_id map from campaign offers/packages at runtime.
 * Package names follow: "[Campaign Name] - [Color] / [Size]"  OR  "[Campaign Name] - [Color]"
 * Toe separator upsell packages are typically: "Toe Separator - White"
 */
function buildUpsellPackageMap() {
    const cd = window.next?.getCampaignData?.();
    const allPackages = [...(cd?.packages || []), ...(cd?.offers || [])];

    if (!allPackages.length) {
        console.warn('[UP02] No packages/offers in campaign — using fallback product variant ID 13041 for white');
        UP02_PACKAGE_MAP['white'] = 13041; // fallback: product variant ID
        return;
    }

    let mapped = 0;
    allPackages.forEach(pkg => {
        const name = (pkg.name || '').toLowerCase();
        // Match toe separator packages for this upsell
        if (!name.includes('toe') && !name.includes('separator')) return;

        // Extract color from name: look after last " - " or "/"
        let colorPart = name;
        const slashIdx = colorPart.lastIndexOf(' / ');
        if (slashIdx !== -1) colorPart = colorPart.substring(slashIdx + 3);
        else {
            const dashIdx = colorPart.lastIndexOf(' - ');
            if (dashIdx !== -1) colorPart = colorPart.substring(dashIdx + 3);
        }
        colorPart = colorPart.trim();

        const colorSlug = UP02_COLOR_DISPLAY_TO_SLUG[colorPart];
        if (colorSlug) {
            UP02_PACKAGE_MAP[colorSlug] = pkg.ref_id;

            // Capture pricing + product name from the first matched package (all colors share same prices)
            if (UP02_CAMPAIGN_DATA.offerPrice === null) {
                if (pkg.price_total  != null) UP02_CAMPAIGN_DATA.offerPrice  = parseFloat(pkg.price_total);
                if (pkg.price_retail != null) UP02_CAMPAIGN_DATA.retailPrice = parseFloat(pkg.price_retail);
                if (pkg.product_name)         UP02_CAMPAIGN_DATA.productName = pkg.product_name;
                else if (pkg.name)            UP02_CAMPAIGN_DATA.productName = pkg.name.split(' - ')[0].trim();
            }

            mapped++;
        }
    });

    if (mapped === 0) {
        console.warn('[UP02] No toe separator packages matched — using fallback product variant ID 13041 for white');
        UP02_PACKAGE_MAP['white'] = 13041;
    } else {
        console.log(`[UP02] Built upsell map: ${mapped} package(s) →`, UP02_PACKAGE_MAP);
        console.log('[UP02] Campaign product data:', UP02_CAMPAIGN_DATA);
    }

    // Apply live campaign data to pricing config and DOM
    if (UP02_CAMPAIGN_DATA.offerPrice  !== null) UP02_PRICING.offerPrice  = UP02_CAMPAIGN_DATA.offerPrice;
    if (UP02_CAMPAIGN_DATA.retailPrice !== null) UP02_PRICING.retailPrice = UP02_CAMPAIGN_DATA.retailPrice;
    updateProductDataFromCampaign();
}

// Called when SDK fires 'next:initialized'
window.addEventListener('next:initialized', () => {
    buildUpsellPackageMap();
});

function calculatePackageId(color, quantity) {
    const packageId = UP02_PACKAGE_MAP[color];

    if (!packageId) {
        console.error('[UP02] Color not found in package map:', color, '| Available:', Object.keys(UP02_PACKAGE_MAP));
        return null;
    }

    console.log('[UP02] Package ID resolved:', { color, quantity, packageId });
    return packageId;
}

// Swiper/Slider Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if Swiper is available
    if (typeof Swiper !== 'undefined') {
        // Initialize thumbnail slider
        const thumbsSlider = new Swiper('.swiper.is-v9-thumbs', {
            spaceBetween: 12,
            slidesPerView: 'auto',
            freeMode: true,
            watchSlidesProgress: true,
        });
        
        // Initialize main slider
        const mainSlider = new Swiper('.swiper.is-v9-main', {
            spaceBetween: 10,
            thumbs: {
                swiper: thumbsSlider,
            },
            navigation: {
                nextEl: '[swiper="next-button"]',
                prevEl: '[swiper="prev-button"]',
            },
        });
        
        console.log('Swiper sliders initialized successfully');
    } else {
        console.warn('Swiper library not loaded');
    }
});

// Pricing Configuration
const UP02_PRICING = {
    retailPrice: 19.99,
    offerPrice: 7.99
};

// Update displayed prices based on quantity
function updatePrices(quantity) {
    const retailTotal = (UP02_PRICING.retailPrice * quantity).toFixed(2);
    const offerTotal = (UP02_PRICING.offerPrice * quantity).toFixed(2);
    
    const originalPriceEl = document.getElementById('originalPrice');
    const currentPriceEl = document.getElementById('currentPrice');
    
    if (originalPriceEl) {
        originalPriceEl.textContent = `$${retailTotal}`;
    }
    if (currentPriceEl) {
        currentPriceEl.textContent = `$${offerTotal}`;
    }
    
    console.log('Prices updated:', { quantity, retailTotal, offerTotal });
}

// Quantity Selector Functionality
document.addEventListener('DOMContentLoaded', function() {
    const quantityToggles = document.querySelectorAll('[data-next-upsell-quantity-toggle]');
    
    quantityToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Remove selected class from all
            quantityToggles.forEach(t => t.classList.remove('next-selected'));
            
            // Add selected class to clicked
            this.classList.add('next-selected');
            
            const quantity = parseInt(this.getAttribute('data-next-upsell-quantity-toggle'));
            console.log('Quantity selected:', quantity);
            
            // Update prices based on quantity
            updatePrices(quantity);
        });
    });
});

// Modal Functionality for Privacy Policy and Terms of Service
document.addEventListener('DOMContentLoaded', function() {
    const modalLinks = document.querySelectorAll('[data-modal]');
    const modalOverlays = document.querySelectorAll('.pf-modal-overlay');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
    
    // Open modal
    modalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalType = this.getAttribute('data-modal');
            const modalId = modalType === 'privacy' ? 'privacyModal' : 'termsModal';
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                console.log('Modal opened:', modalType);
            }
        });
    });
    
    // Close modal
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        console.log('Modal closed');
    }
    
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.pf-modal-overlay');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal when clicking overlay
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.pf-modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
});

// Next SDK Integration for Upsell using next.addUpsell() method
window.addEventListener('next:initialized', function() {
    console.log('Next SDK initialized on upsell page');
    
    const colorSelect = document.getElementById('upsell-color');
    const addButton = document.getElementById('upsell-add-button');
    const skipButton = document.getElementById('upsell-skip-button');
    const acceptUrl = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/u/up03';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/u/up03';
    
    // Handle add to order button using next.addUpsell() SDK method
    if (addButton) {
        addButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            console.log('🔘 Add to order button clicked');
            
            if (!colorSelect) {
                alert('Please select a color before adding to order');
                return;
            }
            
            const color = colorSelect.value;
            
            // Get selected quantity
            const selectedQuantityToggle = document.querySelector('[data-next-upsell-quantity-toggle].next-selected');
            const quantity = selectedQuantityToggle ? parseInt(selectedQuantityToggle.getAttribute('data-next-upsell-quantity-toggle')) : 1;
            
            const packageId = calculatePackageId(color, quantity);
            
            if (!packageId) {
                alert('Unable to process your selection. Please try again.');
                console.error('❌ Invalid package ID for:', { color, quantity });
                return;
            }
            
            console.log('📦 Adding upsell package:', packageId, 'for', color, 'quantity:', quantity);
            
            // Show loading state
            addButton.classList.add('is-submitting', 'next-loading');
            
            try {
                // Use Next SDK's addUpsell method
                const result = await next.addUpsell({ 
                    packageId: packageId,
                    quantity: quantity
                });
                
                console.log('✅ Upsell added successfully:', result);
                
                // Fire tracking event
                if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: quantity,
                        productName: UP02_CAMPAIGN_DATA.productName || `Toe Separator - Nextcommerce - ${color}`,
                        price: UP02_CAMPAIGN_DATA.offerPrice ?? UP02_PRICING.offerPrice,
                        image: 'https://cdn.29next.store/media/peakfootwear/uploads/2_fca4b915-c4e6-4521-ad2d-2f02e545b508.jpg',
                        brand: 'Peak Footwear',
                        sku: `toe-separator-${color}`
                    });
                }
                
                // Navigate to accept URL
                console.log('🔀 Navigating to:', acceptUrl);
                window.location.href = acceptUrl;
                
            } catch (error) {
                console.error('❌ Failed to add upsell:', error);
                alert('Failed to add item to order. Please try again.');
                addButton.classList.remove('is-submitting', 'next-loading');
            }
        });
    }
    
    // Handle skip button
    if (skipButton) {
        skipButton.addEventListener('click', function(e) {
            console.log('❌ Upsell declined');
            
            // Fire tracking event
            if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
                window.UnifiedTrackingBridge.track.upsellDeclined({
                    page: 'upsell2'
                });
            }
            
            // Let the href handle navigation to decline URL
        });
    }
    
    console.log('Upsell button handlers initialized');
});

// Track page view on load
window.addEventListener('load', function() {
    // Fire view content event for upsell page
    if (window.NextDataLayer) {
        const _offerPrice  = UP02_CAMPAIGN_DATA.offerPrice  ?? UP02_PRICING.offerPrice;
        const _retailPrice = UP02_CAMPAIGN_DATA.retailPrice ?? UP02_PRICING.retailPrice;
        const _productName = UP02_CAMPAIGN_DATA.productName || 'Toe Separator - Nextcommerce';
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: _offerPrice,
                items: [{
                    item_id: 'toe-separator-nextcommerce-upsell',
                    item_name: `${_productName} - Upsell Offer`,
                    item_category: 'wellness',
                    item_brand: 'Peak Footwear',
                    price: _offerPrice,
                    quantity: 1,
                    item_sku: 'GEL-TOE-UPSELL',
                    discount: parseFloat((_retailPrice - _offerPrice).toFixed(2))
                }]
            }
        });
        
        console.log('Upsell page view event fired');
    }
    
    // Also send to UnifiedTrackingBridge if available
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        window.UnifiedTrackingBridge.track.pageView({
            page: 'upsell2',
            page_type: 'upsell',
            funnel: 'LORAX'
        });
    }
});

// Accessibility Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add visual feedback to selects
    const selects = document.querySelectorAll('.selector-field');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            this.style.borderColor = '#016a4c';
            setTimeout(() => {
                this.style.borderColor = '';
            }, 300);
        });
    });
    
    console.log('Accessibility enhancements applied');
});

console.log('Peak Footwear Upsell Page 2 (Toe Separator - Nextcommerce, product 13038) JavaScript loaded successfully');

