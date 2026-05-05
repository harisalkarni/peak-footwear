// Next SDK Integration - Upsell Page (Knee Brace - Nextcommerce)
// Product ID: 13080 | Default variant ID: 13081

// ============================================
// DYNAMIC UPSELL PACKAGE MAP
// Built at runtime from window.next.getCampaignData() offers/packages
// so it always uses the correct campaign ref_id automatically.
// ============================================

const UP05_PACKAGE_MAP = {};

// Live product data from campaign — overrides hardcoded defaults when SDK loads
const UP05_CAMPAIGN_DATA = {
    productName: null,
    retailPrice: null,
    offerPrice:  null,
};

// Size display name (lowercase, as in campaign package) → slug used in HTML select value
// Add/remove sizes here to match whatever variants exist in your campaign
const UP05_SIZE_MAP = {
    's':    's',
    'm':    'm',
    'l':    'l',
    'xl':   'xl',
    'xxl':  'xxl',
    's/m':  's-m',
    'l/xl': 'l-xl',
};

/**
 * Updates the page DOM with live product data from the campaign SDK.
 */
function updateProductDataFromCampaign() {
    if (UP05_CAMPAIGN_DATA.productName) {
        const titleEls = document.querySelectorAll('[data-up05-product-name]');
        titleEls.forEach(el => { el.textContent = UP05_CAMPAIGN_DATA.productName; });
        console.log('[UP05] Product name updated from campaign:', UP05_CAMPAIGN_DATA.productName);
    }

    const selectedToggle = document.querySelector('[data-next-upsell-quantity-toggle].next-selected');
    const currentQty = selectedToggle ? parseInt(selectedToggle.getAttribute('data-next-upsell-quantity-toggle')) : 1;
    updatePrices(currentQty);
    console.log('[UP05] Prices refreshed from campaign data at qty:', currentQty);
}

/**
 * Builds size → ref_id map from campaign offers/packages at runtime.
 * Package names follow: "[Campaign Name] - [Size]"
 * e.g. "Knee Brace - Nextcommerce - M"
 * If it's a single SKU (no size), the whole product maps to one ref_id under key "default".
 */
function buildUpsellPackageMap() {
    const cd = window.next?.getCampaignData?.();
    const allPackages = [...(cd?.packages || []), ...(cd?.offers || [])];

    if (!allPackages.length) {
        console.warn('[UP05] No packages/offers in campaign data');
        return;
    }

    let mapped = 0;
    allPackages.forEach(pkg => {
        const name = (pkg.name || '').toLowerCase();
        // Match knee brace packages
        if (!name.includes('knee') && !name.includes('brace')) return;

        // Package name format: "[Campaign] - [Size]"
        // Strip campaign prefix: everything after the last " - "
        let variantPart = name;
        const dashIdx = variantPart.lastIndexOf(' - ');
        if (dashIdx !== -1) variantPart = variantPart.substring(dashIdx + 3).trim();

        // Try to match a known size slug
        const sizeSlug = UP05_SIZE_MAP[variantPart] || variantPart.replace(/\//g, '-');

        UP05_PACKAGE_MAP[sizeSlug] = pkg.ref_id;

        // Capture pricing + product name from the first matched package
        if (UP05_CAMPAIGN_DATA.offerPrice === null) {
            if (pkg.price_total  != null) UP05_CAMPAIGN_DATA.offerPrice  = parseFloat(pkg.price_total);
            if (pkg.price_retail != null) UP05_CAMPAIGN_DATA.retailPrice = parseFloat(pkg.price_retail);
            if (pkg.product_name)         UP05_CAMPAIGN_DATA.productName = pkg.product_name;
            else if (pkg.name)            UP05_CAMPAIGN_DATA.productName = pkg.name.split(' - ')[0].trim();
        }

        mapped++;
    });

    if (mapped === 0) {
        console.warn('[UP05] No knee brace packages matched in campaign');
    } else {
        console.log(`[UP05] Built upsell map: ${mapped} package(s) →`, UP05_PACKAGE_MAP);
        console.log('[UP05] Campaign product data:', UP05_CAMPAIGN_DATA);
    }

    // Apply live campaign data to pricing config and DOM
    if (UP05_CAMPAIGN_DATA.offerPrice  !== null) UP05_PRICING.offerPrice  = UP05_CAMPAIGN_DATA.offerPrice;
    if (UP05_CAMPAIGN_DATA.retailPrice !== null) UP05_PRICING.retailPrice = UP05_CAMPAIGN_DATA.retailPrice;
    updateProductDataFromCampaign();
}

// Called when SDK fires 'next:initialized'
window.addEventListener('next:initialized', () => {
    buildUpsellPackageMap();
});

function calculatePackageId(size) {
    const packageId = UP05_PACKAGE_MAP[size];

    if (!packageId) {
        console.error('[UP05] Size not found in package map:', size, '| Available:', Object.keys(UP05_PACKAGE_MAP));
        return null;
    }

    console.log('[UP05] Package ID resolved:', { size, packageId });
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
const UP05_PRICING = {
    retailPrice: 24.99,
    offerPrice: 9.99
};

// Update displayed prices based on quantity
function updatePrices(quantity) {
    const retailTotal = (UP05_PRICING.retailPrice * quantity).toFixed(2);
    const offerTotal = (UP05_PRICING.offerPrice * quantity).toFixed(2);
    
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
    
    const sizeSelect = document.getElementById('upsell-size');
    const addButton  = document.getElementById('upsell-add-button');
    const skipButton = document.getElementById('upsell-skip-button');
    const acceptUrl  = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/lorax-pairs/thank-you';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-pairs/thank-you';

    // Handle add to order button using next.addUpsell() SDK method
    if (addButton) {
        addButton.addEventListener('click', async function(e) {
            e.preventDefault();

            console.log('🔘 Add to order button clicked');

            // Get size — falls back to 'default' if there's no size selector (single-SKU)
            const size = sizeSelect ? sizeSelect.value : 'default';
            const packageId = calculatePackageId(size);

            // Get selected quantity
            const selectedQuantityToggle = document.querySelector('[data-next-upsell-quantity-toggle].next-selected');
            const quantity = selectedQuantityToggle ? parseInt(selectedQuantityToggle.getAttribute('data-next-upsell-quantity-toggle')) : 1;

            if (!packageId) {
                alert('Unable to process your selection. Please try again.');
                console.error('❌ Invalid package ID for:', { size });
                return;
            }

            console.log('📦 Adding upsell package:', packageId, 'for size:', size, 'quantity:', quantity);

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
                        productName: UP05_CAMPAIGN_DATA.productName || 'Knee Brace - Nextcommerce',
                        price: UP05_CAMPAIGN_DATA.offerPrice ?? UP05_PRICING.offerPrice,
                        image: 'https://cdn.29next.store/media/peakfootwear/uploads/bunion-corrector-1.webp',
                        brand: 'Peak Footwear',
                        sku: `knee-brace-${size}`
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
                    page: 'upsell5'
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
        const _offerPrice  = UP05_CAMPAIGN_DATA.offerPrice  ?? UP05_PRICING.offerPrice;
        const _retailPrice = UP05_CAMPAIGN_DATA.retailPrice ?? UP05_PRICING.retailPrice;
        const _productName = UP05_CAMPAIGN_DATA.productName || 'Knee Brace - Nextcommerce';
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: _offerPrice,
                items: [{
                    item_id: 'knee-brace-nextcommerce-upsell',
                    item_name: `${_productName} - Upsell Offer`,
                    item_category: 'support',
                    item_brand: 'Peak Footwear',
                    price: _offerPrice,
                    quantity: 1,
                    item_sku: 'KNEE-BRACE-UPSELL',
                    discount: parseFloat((_retailPrice - _offerPrice).toFixed(2))
                }]
            }
        });
        
        console.log('Upsell page view event fired');
    }
    
    // Also send to UnifiedTrackingBridge if available
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        window.UnifiedTrackingBridge.track.pageView({
            page: 'upsell5',
            page_type: 'upsell',
            funnel: 'LORAX-PAIRS'
        });
    }
});

// Accessibility Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add visual feedback to quantity selectors
    const quantityItems = document.querySelectorAll('.sg_qty-item');
    quantityItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    console.log('Accessibility enhancements applied');
});

console.log('Peak Footwear Upsell Page 5 (Knee Brace - Nextcommerce, product 13080) JavaScript loaded successfully');
