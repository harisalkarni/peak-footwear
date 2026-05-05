// Next SDK Integration - Upsell Page (Massage Insole - Nextcommerce)
// Product ID: 13045

// ============================================
// DYNAMIC UPSELL PACKAGE MAP
// Built at runtime from window.next.getCampaignData() offers/packages
// so it always uses the correct campaign ref_id automatically.
// Key format: "${color}-${wSize}/${mSize}"  e.g. "orange-w6/m5"
// ============================================

const UP04_PACKAGE_MAP = {};

// Live product data from campaign — overrides hardcoded defaults when SDK loads
const UP04_CAMPAIGN_DATA = {
    productName: null,
    retailPrice: null,
    offerPrice:  null,
};

// Color display name (lowercase, as in campaign package) → slug used in HTML select value
const UP04_COLOR_MAP = {
    'orange': 'orange',
    'black':  'black',
};

/**
 * Updates the page DOM with live product data from the campaign SDK.
 */
function updateProductDataFromCampaign() {
    if (UP04_CAMPAIGN_DATA.productName) {
        const titleEls = document.querySelectorAll('[data-up04-product-name]');
        titleEls.forEach(el => { el.textContent = UP04_CAMPAIGN_DATA.productName; });
        console.log('[UP04] Product name updated from campaign:', UP04_CAMPAIGN_DATA.productName);
    }

    const selectedToggle = document.querySelector('[data-next-upsell-quantity-toggle].next-selected');
    const currentQty = selectedToggle ? parseInt(selectedToggle.getAttribute('data-next-upsell-quantity-toggle')) : 1;
    updatePrices(currentQty);
    console.log('[UP04] Prices refreshed from campaign data at qty:', currentQty);
}

/**
 * Builds color+size → ref_id map from campaign offers/packages at runtime.
 * Package names follow: "[Campaign Name] - [Color] / [W-size] / [M-size]"
 * e.g. "Massage Insole - Nextcommerce - Orange / W6 / M5"
 */
function buildUpsellPackageMap() {
    const cd = window.next?.getCampaignData?.();
    const allPackages = [...(cd?.packages || []), ...(cd?.offers || [])];

    if (!allPackages.length) {
        console.warn('[UP04] No packages/offers in campaign data');
        return;
    }

    let mapped = 0;
    allPackages.forEach(pkg => {
        const name = (pkg.name || '').toLowerCase();
        // Match massage insole packages
        if (!name.includes('massage') && !name.includes('insole')) return;

        // Package name format: "[Campaign] - [Color] / [W-size] / [M-size]"
        // Strip campaign prefix: everything after the last " - "
        let variantPart = name;
        const dashIdx = variantPart.lastIndexOf(' - ');
        if (dashIdx !== -1) variantPart = variantPart.substring(dashIdx + 3).trim();

        // Split by " / " → [color, wSize, mSize]
        const parts = variantPart.split(' / ').map(p => p.trim());
        if (parts.length < 3) {
            console.warn('[UP04] Unexpected package name format (need Color / W-size / M-size):', pkg.name);
            return;
        }

        const [colorPart, wSizePart, mSizePart] = parts;
        const colorSlug = UP04_COLOR_MAP[colorPart];
        if (!colorSlug) {
            console.warn('[UP04] Unrecognised color in package:', pkg.name, '→', colorPart);
            return;
        }

        // Size slug combines W and M sizes: "w6/m5"
        const sizeSlug = `${wSizePart}/${mSizePart}`;
        const key = `${colorSlug}-${sizeSlug}`;
        UP04_PACKAGE_MAP[key] = pkg.ref_id;

        // Capture pricing + product name from the first matched package
        if (UP04_CAMPAIGN_DATA.offerPrice === null) {
            if (pkg.price_total  != null) UP04_CAMPAIGN_DATA.offerPrice  = parseFloat(pkg.price_total);
            if (pkg.price_retail != null) UP04_CAMPAIGN_DATA.retailPrice = parseFloat(pkg.price_retail);
            if (pkg.product_name)         UP04_CAMPAIGN_DATA.productName = pkg.product_name;
            else if (pkg.name)            UP04_CAMPAIGN_DATA.productName = pkg.name.split(' - ')[0].trim();
        }

        mapped++;
    });

    if (mapped === 0) {
        console.warn('[UP04] No massage insole packages matched in campaign');
    } else {
        console.log(`[UP04] Built upsell map: ${mapped} package(s) →`, UP04_PACKAGE_MAP);
        console.log('[UP04] Campaign product data:', UP04_CAMPAIGN_DATA);
    }

    // Apply live campaign data to pricing config and DOM
    if (UP04_CAMPAIGN_DATA.offerPrice  !== null) UP04_PRICING.offerPrice  = UP04_CAMPAIGN_DATA.offerPrice;
    if (UP04_CAMPAIGN_DATA.retailPrice !== null) UP04_PRICING.retailPrice = UP04_CAMPAIGN_DATA.retailPrice;
    updateProductDataFromCampaign();
}

// Called when SDK fires 'next:initialized'
window.addEventListener('next:initialized', () => {
    buildUpsellPackageMap();
});

function calculatePackageId(color, size) {
    const key = `${color}-${size}`;
    const packageId = UP04_PACKAGE_MAP[key];

    if (!packageId) {
        console.error('[UP04] Combination not found in package map:', key, '| Available:', Object.keys(UP04_PACKAGE_MAP));
        return null;
    }

    console.log('[UP04] Package ID resolved:', { color, size, key, packageId });
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
const UP04_PRICING = {
    retailPrice: 39.99,
    offerPrice: 9.99
};

// Update displayed prices based on quantity
function updatePrices(quantity) {
    const retailTotal = (UP04_PRICING.retailPrice * quantity).toFixed(2);
    const offerTotal = (UP04_PRICING.offerPrice * quantity).toFixed(2);
    
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
    const sizeSelect  = document.getElementById('upsell-size');
    const addButton   = document.getElementById('upsell-add-button');
    const skipButton  = document.getElementById('upsell-skip-button');
    const acceptUrl   = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/lorax-pairs/u/up05';
    const declineUrl  = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-pairs/u/up05';

    // Handle add to order button using next.addUpsell() SDK method
    if (addButton) {
        addButton.addEventListener('click', async function(e) {
            e.preventDefault();

            console.log('🔘 Add to order button clicked');

            if (!colorSelect || !sizeSelect) {
                alert('Please select a color and size before adding to order');
                return;
            }

            const color = colorSelect.value;
            const size  = sizeSelect.value;
            const packageId = calculatePackageId(color, size);

            // Get selected quantity
            const selectedQuantityToggle = document.querySelector('[data-next-upsell-quantity-toggle].next-selected');
            const quantity = selectedQuantityToggle ? parseInt(selectedQuantityToggle.getAttribute('data-next-upsell-quantity-toggle')) : 1;

            if (!packageId) {
                alert('Unable to process your selection. Please try again.');
                console.error('❌ Invalid package ID for:', { color, size });
                return;
            }

            console.log('📦 Adding upsell package:', packageId, 'for color:', color, 'size:', size, 'quantity:', quantity);
            
            // Show loading state
            addButton.classList.add('is-submitting', 'next-loading');
            
            try {
                // Use Next SDK's addUpsell method
                const result = await next.addUpsell({ 
                    packageId: packageId,
                    quantity: quantity
                });
                
                console.log('✅ Upsell added successfully:', result);
                
                // Get size label for tracking
                const sizeLabel = sizeSelect.options[sizeSelect.selectedIndex].text;
                
                // Fire tracking event
                if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: quantity,
                        productName: UP04_CAMPAIGN_DATA.productName || `Massage Insole - Nextcommerce - ${color} - ${size}`,
                        price: UP04_CAMPAIGN_DATA.offerPrice ?? UP04_PRICING.offerPrice,
                        image: 'https://cdn.29next.store/media/peakfootwear/uploads/594A0954_1_bb0429ae-1357-4dfa-bb73-6bdcd4d22ce9.jpg',
                        brand: 'Peak Footwear',
                        sku: `massage-insole-${color}-${size}`
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
                    page: 'upsell4'
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
        const _offerPrice  = UP04_CAMPAIGN_DATA.offerPrice  ?? UP04_PRICING.offerPrice;
        const _retailPrice = UP04_CAMPAIGN_DATA.retailPrice ?? UP04_PRICING.retailPrice;
        const _productName = UP04_CAMPAIGN_DATA.productName || 'Massage Insole - Nextcommerce';
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: _offerPrice,
                items: [{
                    item_id: 'massage-insole-nextcommerce-upsell',
                    item_name: `${_productName} - Upsell Offer`,
                    item_category: 'accessories',
                    item_brand: 'Peak Footwear',
                    price: _offerPrice,
                    quantity: 1,
                    item_sku: 'MASSAGE-INSOLE-UPSELL',
                    discount: parseFloat((_retailPrice - _offerPrice).toFixed(2))
                }]
            }
        });
        
        console.log('Upsell page view event fired');
    }
    
    // Also send to UnifiedTrackingBridge if available
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        window.UnifiedTrackingBridge.track.pageView({
            page: 'upsell4',
            page_type: 'upsell',
            funnel: 'LORAX-PAIRS'
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

console.log('Peak Footwear Upsell Page 4 (Massage Insole - Nextcommerce, product 13045) JavaScript loaded successfully');
