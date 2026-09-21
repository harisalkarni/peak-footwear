// ============================================
// SAFETY: the accept link is <a href="#">, which resolves against
// <base href="/snug-boot/"> to /snug-boot/ — a 404. Its real click handler is
// bound inside the 'next:initialized' callback, so a failed SDK load would let
// the browser follow that href. Swallow the default click as early as possible.
// ============================================
(function upsellAddHrefGuard() {
    function guard() {
        const addBtn = document.getElementById('upsell-add-button');
        if (addBtn && addBtn.getAttribute('href') === '#') {
            addBtn.addEventListener('click', function (e) { e.preventDefault(); });
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', guard);
    } else {
        guard();
    }
})();

// Next SDK Integration - Upsell Page (Snug Boot Special - Nextcommerce)
// Product ID: 15150 — this page sells ONLY this product.

// ============================================
// DYNAMIC CAMPAIGN PACKAGE MAP
// Identical logic to co04/index.js, but scoped to the Snug Boot Special product.
// Built at runtime from window.next.getCampaignData() so ref_ids
// are always correct regardless of campaign changes.
// ============================================

// The one 29next product this page is allowed to sell (Snug Boot ... Special).
// Nothing else in the campaign can be added from here — see the strict filter below.
const UP01_TARGET_PRODUCT_ID = 15150;

// Maps color slug → { size string → campaign package ref_id }
const UP01_PACKAGE_MAP = {};

// Color display name (as it appears in campaign package names) → slug used in HTML selects.
// Names are normalized first (lowercased, marketing suffixes like "(Almost sold out!)" stripped).
const UP01_COLOR_DISPLAY_TO_SLUG = {
    'brown':      'brown',
    'black':      'black',
    'light gray': 'light-gray',
    'coffee':     'coffee',
    'cream':      'cream',
};

/**
 * Normalizes a 29next colour label to the key used in UP01_COLOR_DISPLAY_TO_SLUG.
 * e.g. "Brown (Almost sold out!)" → "brown"
 */
function up01NormalizeColorDisplay(value) {
    return (value || '').replace(/\([^)]*\)/g, '').trim().toLowerCase();
}

// Live product data from campaign
const UP01_CAMPAIGN_DATA = {
    productName: null,
    retailPrice: null,
    offerPrice:  null,
};

/**
 * Parses campaign offers/packages for product 15150 (Snug Boot Special)
 * and extracts color + size → ref_id.
 *
 * Searches BOTH cd.offers (upsell products) and cd.packages, since a Special
 * product can live in either list depending on the 29next campaign setup.
 * Package names follow: "[Campaign Name] - [Color] / [Size]"
 * e.g. "Snug Special - Brown (Almost sold out!) / US Women 8/8.5 - US Men 6/6.5"
 */
function buildUpsellPackageMap() {
    const cd = window.next?.getCampaignData?.();

    // Search both offers (upsell products) and packages (main campaign products)
    const allPackages = [...(cd?.offers || []), ...(cd?.packages || [])];

    if (!allPackages.length) {
        console.error('[UP01] No packages/offers in campaign data. Check 29next campaign setup.');
        return;
    }

    let mapped = 0;
    allPackages.forEach(pkg => {
        // Strict allow-list: only packages belonging to UP01_TARGET_PRODUCT_ID are ever mapped.
        // Matching on the package NAME is deliberately NOT done — "special offer" also matches
        // the Lorax Pro Special Offer product, which must not be purchasable from this page.
        if (String(pkg.product_id) !== String(UP01_TARGET_PRODUCT_ID)) return;

        const name = pkg.name || '';

        // Strip campaign prefix: find last " - " before the first " / "
        const slashIdx = name.indexOf(' / ');
        if (slashIdx === -1) return;

        const prefix = name.substring(0, slashIdx);
        const dashIdx = prefix.lastIndexOf(' - ');
        const colorDisplay = up01NormalizeColorDisplay(dashIdx !== -1 ? prefix.substring(dashIdx + 3) : prefix);
        const size = name.substring(slashIdx + 3).trim();

        const colorSlug = UP01_COLOR_DISPLAY_TO_SLUG[colorDisplay];
        if (!colorSlug) {
            console.warn('[UP01] Unknown color in package name:', name);
            return;
        }

        if (!UP01_PACKAGE_MAP[colorSlug]) UP01_PACKAGE_MAP[colorSlug] = {};
        UP01_PACKAGE_MAP[colorSlug][size] = pkg.ref_id;

        // Capture pricing + product name from the first matched package
        if (UP01_CAMPAIGN_DATA.offerPrice === null) {
            if (pkg.price_total  != null) UP01_CAMPAIGN_DATA.offerPrice  = parseFloat(pkg.price_total);
            if (pkg.price_retail != null) UP01_CAMPAIGN_DATA.retailPrice = parseFloat(pkg.price_retail);
            if (pkg.product_name)         UP01_CAMPAIGN_DATA.productName = pkg.product_name;
            else if (pkg.name)            UP01_CAMPAIGN_DATA.productName = pkg.name.split(' - ')[0].trim();
        }

        mapped++;
    });

    console.log(`[UP01] Built package map for product ${UP01_TARGET_PRODUCT_ID}: ${mapped} packages across ${Object.keys(UP01_PACKAGE_MAP).length} colors`);
    if (mapped === 0) {
        console.error(`[UP01] Zero packages mapped for product ${UP01_TARGET_PRODUCT_ID} — check that it is present in the 29next campaign and its package names follow "[Campaign] - [Color] / [Size]"`);
    }

    // Apply live pricing to UP01_PRICING so updatePrices() uses campaign values
    if (UP01_CAMPAIGN_DATA.offerPrice  !== null) UP01_PRICING.offerPrice  = UP01_CAMPAIGN_DATA.offerPrice;
    if (UP01_CAMPAIGN_DATA.retailPrice !== null) UP01_PRICING.retailPrice = UP01_CAMPAIGN_DATA.retailPrice;
}

// Called when SDK fires 'next:initialized'
window.addEventListener('next:initialized', () => {
    buildUpsellPackageMap();
});

function calculatePackageId(color, size) {
    const colorMap = UP01_PACKAGE_MAP[color];
    if (!colorMap) {
        console.error('[UP01] Color not found:', color, '| Available:', Object.keys(UP01_PACKAGE_MAP));
        return null;
    }
    const packageId = colorMap[size];
    if (!packageId) {
        console.error('[UP01] Size not found for color:', { color, size }, '| Available sizes:', Object.keys(colorMap));
        return null;
    }
    console.log('[UP01] Resolved:', { color, size, packageId });
    return packageId;
}

// Pricing Configuration (overwritten with live campaign values on next:initialized)
const UP01_PRICING = {
    retailPrice: 139.90, // two pairs of Snug Boot at the regular $69.95
    offerPrice:  39.95   // campaign price of product 15150; overwritten by live data on load
};

// Update displayed prices
function updatePrices(quantity) {
    const retailTotal = (UP01_PRICING.retailPrice * quantity).toFixed(2);
    const offerTotal  = (UP01_PRICING.offerPrice  * quantity).toFixed(2);
    const originalPriceEl = document.getElementById('originalPrice');
    const currentPriceEl  = document.getElementById('currentPrice');
    if (originalPriceEl) originalPriceEl.textContent = `$${retailTotal}`;
    if (currentPriceEl)  currentPriceEl.textContent  = `$${offerTotal}`;
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

// Color Image Preview Functionality
document.addEventListener('DOMContentLoaded', function() {
    const colorSelect = document.getElementById('upsell-color');
    const previewImage = document.getElementById('color-preview-image');
    
    // Color to image mapping
    const colorImageMap = {
        'brown': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/17e2845e91bd40638c359c4b6aa75976.webp',
        'black': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/e963fb793117456b84d2612231f91d3c.webp',
        'light-gray': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/a817a65062734d23bb9f9d6d257eb12a.webp',
        'coffee': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/5b03781119254115af5c3d8f50138d0f.webp',
        'cream': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/e15d2d321e1047d8990cf01b6c62a4e3.webp'
    };
    
    if (colorSelect && previewImage) {
        colorSelect.addEventListener('change', function() {
            const selectedColor = this.value;
            const newSrc = colorImageMap[selectedColor];
            if (!newSrc) return;

            // Fade out, then swap src. Driven by a timer rather than 'transitionend':
            // that event does not fire when the opacity change is not actually animated
            // (already faded, reduced-motion, offscreen), which left the preview stuck
            // invisible on the previous colour.
            previewImage.style.opacity = '0';
            clearTimeout(previewImage._swapTimer);
            previewImage._swapTimer = setTimeout(function () {
                previewImage.src = newSrc;
                previewImage.style.opacity = '1';
            }, 300); // matches the 0.3s opacity transition in index.css

            console.log('Color preview updated to:', selectedColor);
        });
    }
});

// Dynamic Size Options Based on Color Selection
document.addEventListener('DOMContentLoaded', function() {
    const colorSelect = document.getElementById('upsell-color');
    const sizeSelect = document.getElementById('upsell-size');
    
    // Colors that have extended sizes (US15-16)
    const extendedSizeColors = ['black', 'white-black', 'white-gray', 'blue', 'orange', 'white-blue'];
    
    // Colors that DON'T have size 6 (US Women 6 - US Men 4)
    const noSize6Colors = ['orange'];

    // Function to show/hide size options based on color
    function updateSizeOptions() {
        const selectedColor = colorSelect.value;

        // Handle extended sizes (US15-16)
        const extendedSizeOptions = sizeSelect.querySelectorAll('.extended-size');
        extendedSizeOptions.forEach(option => {
            if (extendedSizeColors.includes(selectedColor)) {
                option.style.display = '';
                option.disabled = false;
            } else {
                option.style.display = 'none';
                option.disabled = true;
                // If currently selected extended size, reset to a valid option
                if (option.selected) {
                    sizeSelect.value = 'US Women 8/8.5 - US Men 6/6.5';
                }
            }
        });

        // Handle size 6 (Orange doesn't have it)
        const size6Option = sizeSelect.querySelector('option[value="US Women 6 - US Men 4"]');
        if (size6Option) {
            if (noSize6Colors.includes(selectedColor)) {
                size6Option.style.display = 'none';
                size6Option.disabled = true;
                // If currently selected size 6, reset to a valid option
                if (size6Option.selected) {
                    sizeSelect.value = 'US Women 8/8.5 - US Men 6/6.5';
                }
            } else {
                size6Option.style.display = '';
                size6Option.disabled = false;
            }
        }
        
        console.log('Size options updated for color:', selectedColor);
    }
    
    // Update on color change
    if (colorSelect && sizeSelect) {
        colorSelect.addEventListener('change', updateSizeOptions);
        
        // Initialize on page load
        updateSizeOptions();
    }
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
    const sizeSelect = document.getElementById('upsell-size');
    const addButton = document.getElementById('upsell-add-button');
    const skipButton = document.getElementById('upsell-skip-button');
    const acceptUrl = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/snug-boot/u/up08';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/snug-boot/u/up08';
    
    // Handle add to order button using next.addUpsell() SDK method
    if (addButton) {
        addButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            console.log('🔘 Add to order button clicked');
            
            if (!colorSelect || !sizeSelect) {
                alert('Please select all options before adding to order');
                return;
            }
            
            const color = colorSelect.value;
            const size = sizeSelect.value;
            const packageId = calculatePackageId(color, size);
            
            if (!packageId) {
                alert('Unable to process your selection. Please try again.');
                console.error('❌ Invalid package ID for:', { color, size });
                return;
            }
            
            console.log('📦 Adding upsell package:', packageId, 'for', color, '/', size);
            
            // Show loading state
            addButton.classList.add('is-submitting', 'next-loading');
            
            try {
                // Use Next SDK's addUpsell method
                const result = await next.addUpsell({ 
                    packageId: packageId,
                    quantity: 1
                });
                
                console.log('✅ Upsell added successfully:', result);
                
                // Fire tracking event
                if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
                    // Get image URL for selected color
                    const colorImageMap = {
                        'brown': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/17e2845e91bd40638c359c4b6aa75976.webp',
                        'black': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/e963fb793117456b84d2612231f91d3c.webp',
                        'light-gray': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/a817a65062734d23bb9f9d6d257eb12a.webp',
                        'coffee': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/5b03781119254115af5c3d8f50138d0f.webp',
                        'cream': 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/e15d2d321e1047d8990cf01b6c62a4e3.webp'
                    };
                    
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: 1,
                        productName: UP01_CAMPAIGN_DATA.productName || `Snug Boot Special - ${color} - ${size}`,
                        price: UP01_CAMPAIGN_DATA.offerPrice ?? UP01_PRICING.offerPrice,
                        image: colorImageMap[color] || 'https://d1w87fp8j98gad.cloudfront.net/media/thumbnails/17e2845e91bd40638c359c4b6aa75976.webp',
                        brand: 'Peak Footwear',
                        sku: `snug-boot-special-${color}-${size}`
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
                    page: 'upsell1'
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
        const _offerPrice  = UP01_CAMPAIGN_DATA.offerPrice  ?? UP01_PRICING.offerPrice;
        const _retailPrice = UP01_CAMPAIGN_DATA.retailPrice ?? UP01_PRICING.retailPrice;
        const _productName = UP01_CAMPAIGN_DATA.productName || 'Snug Boot Special - Nextcommerce';
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: _offerPrice,
                items: [{
                    item_id: 'snug-boot-special-upsell',
                    item_name: `${_productName} - Upsell Offer`,
                    item_category: 'footwear',
                    item_brand: 'Peak Footwear',
                    price: _offerPrice,
                    quantity: 1,
                    item_sku: 'SNUG-BOOT-SPECIAL-UPSELL',
                    discount: parseFloat((_retailPrice - _offerPrice).toFixed(2))
                }]
            }
        });
        
        console.log('Upsell page view event fired');
    }
    
    // Also send to UnifiedTrackingBridge if available
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        window.UnifiedTrackingBridge.track.pageView({
            page: 'upsell1',
            page_type: 'upsell',
            funnel: 'SNUG-BOOT'
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

console.log('Peak Footwear Upsell Page 1 (Snug Boot Special - Nextcommerce, product 15150) JavaScript loaded successfully');