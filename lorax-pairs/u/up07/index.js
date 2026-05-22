// Next SDK Integration - Upsell Page (Protected Priority Shipping - $9.99)
// up06 — Fixed-price upsell, no size selector

// ============================================
// DYNAMIC UPSELL PACKAGE MAP
// Built at runtime from window.next.getCampaignData()
// ============================================

const UP06_PACKAGE_MAP = {};

const UP06_CAMPAIGN_DATA = {
    productName: null,
    retailPrice: null,
    offerPrice:  null,
};

const UP06_PRICING = {
    offerPrice: 9.99
};

/**
 * Builds package map from campaign offers/packages at runtime.
 * Looks for a "shipping" or "priority" package in the campaign.
 * Falls back to the first available offer/package if no match found.
 */
function buildUpsellPackageMap() {
    const cd = window.next?.getCampaignData?.();
    const allPackages = [...(cd?.packages || []), ...(cd?.offers || [])];

    if (!allPackages.length) {
        console.warn('[UP06] No packages/offers in campaign data');
        return;
    }

    let mapped = 0;
    allPackages.forEach(pkg => {
        const name = (pkg.name || '').toLowerCase();

        // Match shipping/priority protection packages
        const isShipping = name.includes('shipping') || name.includes('priority') || name.includes('protection') || name.includes('insurance');
        if (!isShipping) return;

        UP06_PACKAGE_MAP['default'] = pkg.ref_id;

        if (UP06_CAMPAIGN_DATA.offerPrice === null) {
            if (pkg.price_total  != null) UP06_CAMPAIGN_DATA.offerPrice  = parseFloat(pkg.price_total);
            if (pkg.price_retail != null) UP06_CAMPAIGN_DATA.retailPrice = parseFloat(pkg.price_retail);
            if (pkg.product_name)         UP06_CAMPAIGN_DATA.productName = pkg.product_name;
            else if (pkg.name)            UP06_CAMPAIGN_DATA.productName = pkg.name.split(' - ')[0].trim();
        }

        mapped++;
    });

    // Fallback: if no shipping package found, use the first available offer
    if (mapped === 0 && allPackages.length > 0) {
        const fallback = allPackages[0];
        UP06_PACKAGE_MAP['default'] = fallback.ref_id;
        if (fallback.price_total != null) UP06_CAMPAIGN_DATA.offerPrice = parseFloat(fallback.price_total);
        console.warn('[UP06] No shipping package found — using first offer as fallback:', fallback.name);
    } else {
        console.log(`[UP06] Built upsell map: ${mapped} package(s) →`, UP06_PACKAGE_MAP);
    }

    // Apply live pricing to config
    if (UP06_CAMPAIGN_DATA.offerPrice !== null) UP06_PRICING.offerPrice = UP06_CAMPAIGN_DATA.offerPrice;
    console.log('[UP06] Campaign data:', UP06_CAMPAIGN_DATA);
}

// Called when SDK fires 'next:initialized'
window.addEventListener('next:initialized', () => {
    buildUpsellPackageMap();
});

// ============================================
// UPSELL ACCEPT / DECLINE HANDLERS
// ============================================

window.addEventListener('next:initialized', function () {
    console.log('[UP06] Next SDK initialized');

    const addButton  = document.getElementById('upsell-add-button');
    const skipButton = document.getElementById('upsell-skip-button');
    const acceptUrl  = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/lorax-pairs/thank-you';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-pairs/thank-you';

    // Accept — add upsell to order
    if (addButton) {
        addButton.addEventListener('click', async function (e) {
            e.preventDefault();
            console.log('[UP06] Add to order clicked');

            const packageId = UP06_PACKAGE_MAP['default'];

            if (!packageId) {
                alert('Unable to process your selection. Please try again.');
                console.error('[UP06] No package ID found in map:', UP06_PACKAGE_MAP);
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

                console.log('[UP06] Upsell added successfully:', result);

                // Fire tracking event
                if (window.UnifiedTrackingBridge?.track?.upsellAccepted) {
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: 1,
                        productName: UP06_CAMPAIGN_DATA.productName || 'Protected Priority Shipping',
                        price: UP06_CAMPAIGN_DATA.offerPrice ?? UP06_PRICING.offerPrice,
                        brand: 'Peak Footwear',
                        sku: 'protected-priority-shipping'
                    });
                }

                console.log('[UP06] Navigating to accept URL:', acceptUrl);
                window.location.href = acceptUrl;

            } catch (error) {
                console.error('[UP06] Failed to add upsell:', error);
                alert('Failed to add item to order. Please try again.');
                addButton.classList.remove('is-submitting');
                if (btnMain) btnMain.textContent = 'YES! Upgrade my order to PROTECTED PRIORITY SHIPPING for just $9.99 →';
            }
        });
    }

    // Decline — skip upsell
    if (skipButton) {
        skipButton.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('[UP06] Upsell declined — navigating to:', declineUrl);

            if (window.UnifiedTrackingBridge?.track?.upsellDeclined) {
                window.UnifiedTrackingBridge.track.upsellDeclined({
                    productName: UP06_CAMPAIGN_DATA.productName || 'Protected Priority Shipping',
                    price: UP06_CAMPAIGN_DATA.offerPrice ?? UP06_PRICING.offerPrice
                });
            }

            window.location.href = declineUrl;
        });
    }
});
