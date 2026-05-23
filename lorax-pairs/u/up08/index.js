// Next SDK Integration - Upsell Page (Lifetime Warranty - Nextcommerce)
// Product ID: 13269 | Variant ID: 13270

// ============================================
// DYNAMIC CAMPAIGN PACKAGE MAP
// Single-SKU product — no color or size variants.
// Built at runtime from window.next.getCampaignData() so ref_ids
// are always correct regardless of campaign changes.
// ============================================

// Single entry: 'default' → campaign package ref_id
const UP08_PACKAGE_MAP = {};

// Live product data from campaign
const UP08_CAMPAIGN_DATA = {
    productName: null,
    retailPrice: null,
    offerPrice:  null,
};

/**
 * Parses campaign offers/packages for product 13269 (Lifetime Warranty)
 * and stores the single ref_id under UP08_PACKAGE_MAP['default'].
 *
 * Searches BOTH cd.offers (upsell products) and cd.packages.
 * Matches by product_id 13269, or package name containing "warranty" or "lifetime".
 */
function buildUpsellPackageMap() {
    const cd = window.next?.getCampaignData?.();

    const allPackages = [...(cd?.offers || []), ...(cd?.packages || [])];

    if (!allPackages.length) {
        console.error('[UP08] No packages/offers in campaign data. Check 29next campaign setup.');
        return;
    }

    let mapped = 0;
    allPackages.forEach(pkg => {
        const matchesById   = pkg.product_id === 13269 || pkg.product_id === '13269';
        const nameLower     = (pkg.name || '').toLowerCase();
        const matchesByName = nameLower.includes('warranty') || nameLower.includes('lifetime');

        if (!matchesById && !matchesByName) return;

        // Single SKU — store the first (and only expected) match as 'default'
        if (!UP08_PACKAGE_MAP['default']) {
            UP08_PACKAGE_MAP['default'] = pkg.ref_id;

            if (pkg.price_total  != null) UP08_CAMPAIGN_DATA.offerPrice  = parseFloat(pkg.price_total);
            if (pkg.price_retail != null) UP08_CAMPAIGN_DATA.retailPrice = parseFloat(pkg.price_retail);
            if (pkg.product_name)         UP08_CAMPAIGN_DATA.productName = pkg.product_name;
            else if (pkg.name)            UP08_CAMPAIGN_DATA.productName = pkg.name.split(' - ')[0].trim();
        }

        mapped++;
    });

    console.log(`[UP08] Built package map for product 13269 (Lifetime Warranty): ${mapped} package(s) found`);
    if (!UP08_PACKAGE_MAP['default']) {
        console.error('[UP08] No package mapped for product 13269 — ensure it is added as an offer in the 29next campaign and the name contains "warranty" or "lifetime"');
    }

    // Apply live pricing from campaign data
    if (UP08_CAMPAIGN_DATA.offerPrice  !== null) UP08_PRICING.offerPrice  = UP08_CAMPAIGN_DATA.offerPrice;
    if (UP08_CAMPAIGN_DATA.retailPrice !== null) UP08_PRICING.retailPrice = UP08_CAMPAIGN_DATA.retailPrice;

    // Update price displays with live campaign values
    updatePrices();

    // Update product name display with live campaign value
    if (UP08_CAMPAIGN_DATA.productName) {
        const nameEl = document.querySelector('[data-up08-product-name]');
        if (nameEl) {
            nameEl.textContent = UP08_CAMPAIGN_DATA.productName;
            console.log('[UP08] Product name updated to:', UP08_CAMPAIGN_DATA.productName);
        }
    }
}

// Called when SDK fires 'next:initialized'
window.addEventListener('next:initialized', () => {
    buildUpsellPackageMap();
});

function calculatePackageId() {
    const packageId = UP08_PACKAGE_MAP['default'];
    if (!packageId) {
        console.error('[UP08] Package ID not found — package map may not have been built yet.');
        return null;
    }
    console.log('[UP08] Resolved package ID:', packageId);
    return packageId;
}

// Pricing Configuration (overwritten with live campaign values on next:initialized)
const UP08_PRICING = {
    retailPrice: 29.99,
    offerPrice:  19.99
};

// Update displayed prices from campaign data (or hardcoded fallback)
function updatePrices() {
    const retailTotal = (UP08_PRICING.retailPrice || 0).toFixed(2);
    const offerTotal  = (UP08_PRICING.offerPrice  || 0).toFixed(2);
    const originalPriceEl = document.getElementById('originalPrice');
    const currentPriceEl  = document.getElementById('currentPrice');
    if (originalPriceEl) originalPriceEl.textContent = `$${retailTotal}`;
    if (currentPriceEl)  currentPriceEl.textContent  = `$${offerTotal}`;
}

// Swiper/Slider Initialization
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        const thumbsSlider = new Swiper('.swiper.is-v9-thumbs', {
            spaceBetween: 12,
            slidesPerView: 'auto',
            freeMode: true,
            watchSlidesProgress: true,
        });

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

        console.log('[UP08] Swiper sliders initialized');
    } else {
        console.warn('[UP08] Swiper library not loaded');
    }
});

// Modal Functionality for Privacy Policy and Terms of Service
document.addEventListener('DOMContentLoaded', function() {
    const modalLinks      = document.querySelectorAll('[data-modal]');
    const modalOverlays   = document.querySelectorAll('.pf-modal-overlay');
    const modalCloseButtons = document.querySelectorAll('[data-modal-close]');

    modalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalType = this.getAttribute('data-modal');
            const modalId   = modalType === 'privacy' ? 'privacyModal' : 'termsModal';
            const modal     = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.pf-modal-overlay');
            if (modal) closeModal(modal);
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this);
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.pf-modal-overlay.active');
            if (activeModal) closeModal(activeModal);
        }
    });
});

// Next SDK Integration for Upsell
window.addEventListener('next:initialized', function() {
    console.log('[UP08] Next SDK initialized');

    const addButton  = document.getElementById('upsell-add-button');
    const skipButton = document.getElementById('upsell-skip-button');
    const acceptUrl  = document.querySelector('meta[name="next-upsell-accept-url"]')?.content  || '/lorax-pairs/thank-you';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-pairs/thank-you';

    if (addButton) {
        addButton.addEventListener('click', async function(e) {
            e.preventDefault();
            console.log('[UP08] Add to order clicked');

            const packageId = calculatePackageId();

            if (!packageId) {
                alert('Unable to process your selection. Please try again.');
                return;
            }

            console.log('[UP08] Adding upsell package:', packageId);
            addButton.classList.add('is-submitting', 'next-loading');

            try {
                const result = await next.addUpsell({
                    packageId: packageId,
                    quantity: 1
                });

                console.log('[UP08] Upsell added successfully:', result);

                if (window.UnifiedTrackingBridge?.track?.upsellAccepted) {
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: 1,
                        productName: UP08_CAMPAIGN_DATA.productName || 'Lifetime Warranty',
                        price: UP08_CAMPAIGN_DATA.offerPrice ?? UP08_PRICING.offerPrice,
                        brand: 'Peak Footwear',
                        sku: 'lifetime-warranty-13269'
                    });
                }

                console.log('[UP08] Navigating to:', acceptUrl);
                window.location.href = acceptUrl;

            } catch (error) {
                console.error('[UP08] Failed to add upsell:', error);
                alert('Failed to add item to order. Please try again.');
                addButton.classList.remove('is-submitting', 'next-loading');
            }
        });
    }

    if (skipButton) {
        skipButton.addEventListener('click', function(e) {
            console.log('[UP08] Upsell declined');

            if (window.UnifiedTrackingBridge?.track?.upsellDeclined) {
                window.UnifiedTrackingBridge.track.upsellDeclined({ page: 'up08' });
            }

            // href handles navigation to decline URL
        });
    }

    console.log('[UP08] Upsell button handlers initialized');
});

// Track page view on load
window.addEventListener('load', function() {
    if (window.NextDataLayer) {
        const _offerPrice  = UP08_CAMPAIGN_DATA.offerPrice  ?? UP08_PRICING.offerPrice;
        const _retailPrice = UP08_CAMPAIGN_DATA.retailPrice ?? UP08_PRICING.retailPrice;
        const _productName = UP08_CAMPAIGN_DATA.productName || 'Lifetime Warranty';
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: _offerPrice,
                items: [{
                    item_id:       'lifetime-warranty-13269',
                    item_name:     `${_productName} - Upsell Offer`,
                    item_category: 'warranty',
                    item_brand:    'Peak Footwear',
                    price:         _offerPrice,
                    quantity:      1,
                    item_sku:      'LIFETIME-WARRANTY-13269',
                    discount:      parseFloat((_retailPrice - _offerPrice).toFixed(2))
                }]
            }
        });
    }

    if (window.UnifiedTrackingBridge?.track?.pageView) {
        window.UnifiedTrackingBridge.track.pageView({
            page:      'up08',
            page_type: 'upsell',
            funnel:    'LORAX'
        });
    }
});

console.log('[UP08] Lifetime Warranty upsell (product 13269) JavaScript loaded');
