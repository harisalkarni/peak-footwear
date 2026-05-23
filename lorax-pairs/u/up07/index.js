// Next SDK Integration - Upsell Page (Shipping Protection - Nextcommerce)
// Product ID: 13271 | Variant ID: 13272

// ============================================
// DYNAMIC UPSELL PACKAGE MAP
// Single-SKU product — no color or size variants.
// Built at runtime from window.next.getCampaignData()
// ============================================

const UP07_PACKAGE_MAP = {};

const UP07_CAMPAIGN_DATA = {
    productName: null,
    retailPrice: null,
    offerPrice:  null,
};

const UP07_PRICING = {
    offerPrice: 9.99
};

/**
 * Parses campaign offers/packages for product 13271 (Shipping Protection)
 * and stores the single ref_id under UP07_PACKAGE_MAP['default'].
 *
 * Matches by product_id 13271 first; falls back to name containing
 * 'shipping protection' or both 'shipping' and 'protection'.
 */
function buildUpsellPackageMap() {
    const cd = window.next?.getCampaignData?.();
    const allPackages = [...(cd?.offers || []), ...(cd?.packages || [])];

    if (!allPackages.length) {
        console.warn('[UP07] No packages/offers in campaign data');
        return;
    }

    let mapped = 0;
    allPackages.forEach(pkg => {
        const matchesById   = pkg.product_id === 13271 || pkg.product_id === '13271';
        const nameLower     = (pkg.name || '').toLowerCase();
        const matchesByName = nameLower.includes('shipping protection') ||
                              (nameLower.includes('shipping') && nameLower.includes('protection'));

        if (!matchesById && !matchesByName) return;

        // Single SKU — store the first match as 'default'
        if (!UP07_PACKAGE_MAP['default']) {
            UP07_PACKAGE_MAP['default'] = pkg.ref_id;

            if (pkg.price_total  != null) UP07_CAMPAIGN_DATA.offerPrice  = parseFloat(pkg.price_total);
            if (pkg.price_retail != null) UP07_CAMPAIGN_DATA.retailPrice = parseFloat(pkg.price_retail);
            if (pkg.product_name)         UP07_CAMPAIGN_DATA.productName = pkg.product_name;
            else if (pkg.name)            UP07_CAMPAIGN_DATA.productName = pkg.name.split(' - ')[0].trim();
        }

        mapped++;
    });

    console.log(`[UP07] Built package map for product 13271 (Shipping Protection): ${mapped} package(s) found`);
    if (!UP07_PACKAGE_MAP['default']) {
        console.error('[UP07] No package mapped for product 13271 — ensure it is added as an offer in the 29next campaign');
    }

    // Apply live pricing
    if (UP07_CAMPAIGN_DATA.offerPrice  !== null) UP07_PRICING.offerPrice = UP07_CAMPAIGN_DATA.offerPrice;

    // Update price displays with live campaign values
    updatePrices();

    // Update product name if element exists
    if (UP07_CAMPAIGN_DATA.productName) {
        const nameEl = document.querySelector('[data-up07-product-name]');
        if (nameEl) {
            nameEl.textContent = UP07_CAMPAIGN_DATA.productName;
            console.log('[UP07] Product name updated to:', UP07_CAMPAIGN_DATA.productName);
        }
    }
}

// Update price elements with live campaign values
function updatePrices() {
    const price = (UP07_PRICING.offerPrice || 0).toFixed(2);
    document.querySelectorAll('[data-up07-price]').forEach(el => {
        el.textContent = `$${price}`;
    });
    const currentPriceEl = document.getElementById('currentPrice');
    if (currentPriceEl) currentPriceEl.textContent = `$${price}`;
}

// ============================================
// SDK INITIALISATION
// ============================================

window.addEventListener('next:initialized', () => {
    buildUpsellPackageMap();
});

window.addEventListener('next:initialized', function () {
    console.log('[UP07] Next SDK initialized');

    const addButton  = document.getElementById('upsell-add-button');
    const skipButton = document.getElementById('upsell-skip-button');
    const acceptUrl  = document.querySelector('meta[name="next-upsell-accept-url"]')?.content  || '/lorax-pairs/thank-you';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-pairs/thank-you';

    // Accept — add upsell to order
    if (addButton) {
        addButton.addEventListener('click', async function (e) {
            e.preventDefault();
            console.log('[UP07] Add to order clicked');

            const packageId = UP07_PACKAGE_MAP['default'];

            if (!packageId) {
                alert('Unable to process your selection. Please try again.');
                console.error('[UP07] No package ID found in map:', UP07_PACKAGE_MAP);
                return;
            }

            // Show loading state
            addButton.classList.add('is-submitting');
            const btnMain = addButton.querySelector('.btn-main');
            if (btnMain) btnMain.textContent = 'Adding to your order...';

            try {
                const result = await next.addUpsell({
                    packageId: packageId,
                    quantity: 1
                });

                console.log('[UP07] Upsell added successfully:', result);

                if (window.UnifiedTrackingBridge?.track?.upsellAccepted) {
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: 1,
                        productName: UP07_CAMPAIGN_DATA.productName || 'Shipping Protection',
                        price: UP07_CAMPAIGN_DATA.offerPrice ?? UP07_PRICING.offerPrice,
                        brand: 'Peak Footwear',
                        sku: 'shipping-protection-13271'
                    });
                }

                console.log('[UP07] Navigating to accept URL:', acceptUrl);
                window.location.href = acceptUrl;

            } catch (error) {
                console.error('[UP07] Failed to add upsell:', error);
                alert('Failed to add item to order. Please try again.');
                addButton.classList.remove('is-submitting');
                if (btnMain) btnMain.textContent = 'YES — Protect my delivery for just $9.99 →';
            }
        });
    }

    // Decline — skip upsell
    if (skipButton) {
        skipButton.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('[UP07] Upsell declined — navigating to:', declineUrl);

            if (window.UnifiedTrackingBridge?.track?.upsellDeclined) {
                window.UnifiedTrackingBridge.track.upsellDeclined({
                    productName: UP07_CAMPAIGN_DATA.productName || 'Shipping Protection',
                    price: UP07_CAMPAIGN_DATA.offerPrice ?? UP07_PRICING.offerPrice,
                    page: 'up07'
                });
            }

            window.location.href = declineUrl;
        });
    }

    console.log('[UP07] Upsell button handlers initialized');
});

// Track page view on load
window.addEventListener('load', function () {
    if (window.UnifiedTrackingBridge?.track?.pageView) {
        window.UnifiedTrackingBridge.track.pageView({
            page:      'up07',
            page_type: 'upsell',
            funnel:    'LORAX'
        });
    }
});

console.log('[UP07] Shipping Protection upsell (product 13271) JavaScript loaded');
