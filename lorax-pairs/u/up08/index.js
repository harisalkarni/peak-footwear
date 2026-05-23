// Next SDK Integration - Upsell Page (Lorax Pro Special Offer - Nextcommerce)
// Product ID: 13273

// ============================================
// DYNAMIC CAMPAIGN PACKAGE MAP
// Identical logic to co02/index.js — same product, same campaign.
// Built at runtime from window.next.getCampaignData() so ref_ids
// are always correct regardless of campaign changes.
// ============================================

// Maps color slug → { size string → campaign package ref_id }
const UP01_PACKAGE_MAP = {};

// Color display name (as it appears in campaign package names) → slug used in HTML selects
const UP01_COLOR_DISPLAY_TO_SLUG = {
    'white & pink':  'white-pink',
    'white & black': 'white-black',
    'white & gray':  'white-gray',
    'black':         'black',
    'white & blue':  'white-blue',
    'blue':          'blue',
    'orange':        'orange',
    'pink':          'pink',
};

// Live product data from campaign
const UP01_CAMPAIGN_DATA = {
    productName: null,
    retailPrice: null,
    offerPrice:  null,
};

/**
 * Parses campaign offers/packages for product 13273 (Lorax Pro Special Offer)
 * and extracts color + size → ref_id.
 *
 * Searches BOTH cd.offers (upsell products) and cd.packages — product 13273
 * is a Special Offer so it lives in cd.offers in the 29next campaign.
 * Package names follow: "[Campaign Name] - [Color] / [Size]"
 * e.g. "Lorax Pro Special Offer - White & Pink / US Women 8/8.5 - US Men 6/6.5"
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
        // Filter to product 13273 (Lorax Pro Special Offer) only
        const matchesById   = pkg.product_id === 13273 || pkg.product_id === '13273';
        const matchesByName = (pkg.name || '').toLowerCase().includes('special offer');
        if (!matchesById && !matchesByName) return;

        const name = pkg.name || '';

        // Strip campaign prefix: find last " - " before the first " / "
        const slashIdx = name.indexOf(' / ');
        if (slashIdx === -1) return;

        const prefix = name.substring(0, slashIdx);
        const dashIdx = prefix.lastIndexOf(' - ');
        const colorDisplay = (dashIdx !== -1 ? prefix.substring(dashIdx + 3) : prefix).trim().toLowerCase();
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

    console.log(`[UP01] Built package map for product 13273: ${mapped} packages across ${Object.keys(UP01_PACKAGE_MAP).length} colors`);
    if (mapped === 0) {
        console.error('[UP01] Zero packages mapped for product 13273 — ensure it is added as an offer in the 29next campaign and package names include "Special Offer"');
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
    retailPrice: 19.99,
    offerPrice:  10.00
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
        'white-pink': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp',
        'black': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Black.webp',
        'pink': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Pink.webp',
        'white-black': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BW.webp',
        'white-gray': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BW.webp',
        'blue': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Blue.webp',
        'orange': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Orange.webp',
        'white-blue': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BlueW.webp'
    };
    
    if (colorSelect && previewImage) {
        colorSelect.addEventListener('change', function() {
            const selectedColor = this.value;
            if (colorImageMap[selectedColor]) {
                // Fade out
                previewImage.style.opacity = '0';
                
                // Change image after fade
                setTimeout(() => {
                    previewImage.src = colorImageMap[selectedColor];
                    // Fade in
                    previewImage.style.opacity = '1';
                }, 150);
                
                console.log('Color preview updated to:', selectedColor);
            }
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
    const acceptUrl = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/lorax-pairs/u/up02';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-pairs/u/up02';
    
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
                        'white-pink': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp',
                        'black': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Black.webp',
                        'pink': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Pink.webp',
                        'white-black': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BW.webp',
                        'white-gray': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BW.webp',
                        'blue': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Blue.webp',
                        'orange': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Orange.webp',
                        'white-blue': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BlueW.webp'
                    };
                    
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: 1,
                        productName: UP01_CAMPAIGN_DATA.productName || `Lorax Pro Special Offer - ${color} - ${size}`,
                        price: UP01_CAMPAIGN_DATA.offerPrice ?? UP01_PRICING.offerPrice,
                        image: colorImageMap[color] || 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp',
                        brand: 'Peak Footwear',
                        sku: `lorax-pro-special-offer-${color}-${size}`
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
        const _productName = UP01_CAMPAIGN_DATA.productName || 'Lorax Pro - Nextcommerce';
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: _offerPrice,
                items: [{
                    item_id: 'lorax-pro-nextcommerce-upsell',
                    item_name: `${_productName} - Upsell Offer`,
                    item_category: 'footwear',
                    item_brand: 'Peak Footwear',
                    price: _offerPrice,
                    quantity: 1,
                    item_sku: 'LORAX-PRO-UPSELL',
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

console.log('Peak Footwear Upsell Page 1 (Lorax Pro - Nextcommerce, product 12939) JavaScript loaded successfully');