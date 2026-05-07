// Next SDK Integration - Upsell Page (Compression Socks - Nextcommerce)
// Product ID: 13073

// ============================================
// DYNAMIC UPSELL PACKAGE MAP
// Built at runtime from window.next.getCampaignData() offers/packages
// so it always uses the correct campaign ref_id automatically.
// Key format: "${style}-${color}-${size}"  e.g. "long-black-s-m"
// ============================================

const UP03_PACKAGE_MAP = {};

// Live product data from campaign — overrides hardcoded defaults when SDK loads
const UP03_CAMPAIGN_DATA = {
    productName: null,
    retailPrice: null,
    offerPrice:  null,
};

// Display name → slug mappings (must match words in campaign package names)
const UP03_STYLE_MAP  = { 'long': 'long', 'short': 'short' };
const UP03_COLOR_MAP  = { 'black': 'black', 'white': 'white', 'pink': 'pink', 'orange': 'orange' };
const UP03_SIZE_MAP   = {
    's-m': 's-m', 'l-xl': 'l-xl', '2xl-3xl': '2xl-3xl',  // long sock sizes
    's/m': 's/m', 'l/xl': 'l/xl'                           // short sock sizes
};

/**
 * Updates the page DOM with live product data fetched from the campaign SDK.
 * Called after buildUpsellPackageMap() succeeds.
 */
function updateProductDataFromCampaign() {
    if (UP03_CAMPAIGN_DATA.productName) {
        const titleEls = document.querySelectorAll('[data-up03-product-name]');
        titleEls.forEach(el => { el.textContent = UP03_CAMPAIGN_DATA.productName; });
        console.log('[UP03] Product name updated from campaign:', UP03_CAMPAIGN_DATA.productName);
    }

    const selectedToggle = document.querySelector('[data-next-upsell-quantity-toggle].next-selected');
    const currentQty = selectedToggle ? parseInt(selectedToggle.getAttribute('data-next-upsell-quantity-toggle')) : 1;
    updatePrices(currentQty);
    console.log('[UP03] Prices refreshed from campaign data at qty:', currentQty);
}

// Long sock sizes use dashes (S-M, L-XL, 2XL-3XL); short sock sizes use slashes (S/M, L/XL)
const UP03_LONG_SIZES  = new Set(['s-m', 'l-xl', '2xl-3xl']);
const UP03_SHORT_SIZES = new Set(['s/m', 'l/xl']);

/**
 * Builds style+color+size → ref_id map from campaign offers/packages at runtime.
 * Package names follow: "[Campaign Name] - [Color] / [Size]"
 * e.g. "Compression Socks - Nextcommerce - Black / S-M"
 * Style (long/short) is inferred from the size value.
 */
function buildUpsellPackageMap() {
    const cd = window.next?.getCampaignData?.();
    const allPackages = [...(cd?.packages || []), ...(cd?.offers || [])];

    if (!allPackages.length) {
        console.warn('[UP03] No packages/offers in campaign data');
        return;
    }

    let mapped = 0;
    allPackages.forEach(pkg => {
        const name = (pkg.name || '').toLowerCase();
        // Match compression sock packages
        if (!name.includes('compression') && !name.includes('sock')) return;

        // Package name format: "[Campaign] - [Color] / [Size]"
        // Strip campaign prefix: everything after the last " - "
        let variantPart = name;
        const dashIdx = variantPart.lastIndexOf(' - ');
        if (dashIdx !== -1) variantPart = variantPart.substring(dashIdx + 3);

        // Split remaining part by " / " → [color, size]
        const parts = variantPart.split(' / ').map(p => p.trim());
        if (parts.length < 2) {
            console.warn('[UP03] Unexpected package name format (need Color / Size):', pkg.name);
            return;
        }

        const [colorPart, sizePart] = parts;
        const colorSlug = UP03_COLOR_MAP[colorPart];
        const sizeSlug  = UP03_SIZE_MAP[sizePart];

        // Infer style from size: long sock sizes use dashes, short use slashes
        let styleSlug = null;
        if (UP03_LONG_SIZES.has(sizePart))       styleSlug = 'long';
        else if (UP03_SHORT_SIZES.has(sizePart)) styleSlug = 'short';

        if (!colorSlug || !sizeSlug || !styleSlug) {
            console.warn('[UP03] Unrecognised color/size in package:', pkg.name, { colorPart, sizePart });
            return;
        }

        const key = `${styleSlug}-${colorSlug}-${sizeSlug}`;
        UP03_PACKAGE_MAP[key] = pkg.ref_id;

        // Capture pricing + product name from the first matched package
        if (UP03_CAMPAIGN_DATA.offerPrice === null) {
            if (pkg.price_total  != null) UP03_CAMPAIGN_DATA.offerPrice  = parseFloat(pkg.price_total);
            if (pkg.price_retail != null) UP03_CAMPAIGN_DATA.retailPrice = parseFloat(pkg.price_retail);
            if (pkg.product_name)         UP03_CAMPAIGN_DATA.productName = pkg.product_name;
            else if (pkg.name)            UP03_CAMPAIGN_DATA.productName = pkg.name.split(' - ')[0].trim();
        }

        mapped++;
    });

    if (mapped === 0) {
        console.warn('[UP03] No compression sock packages matched in campaign');
    } else {
        console.log(`[UP03] Built upsell map: ${mapped} package(s) →`, UP03_PACKAGE_MAP);
        console.log('[UP03] Campaign product data:', UP03_CAMPAIGN_DATA);
    }

    // Apply live campaign data to pricing config and DOM
    if (UP03_CAMPAIGN_DATA.offerPrice  !== null) UP03_PRICING.offerPrice  = UP03_CAMPAIGN_DATA.offerPrice;
    if (UP03_CAMPAIGN_DATA.retailPrice !== null) UP03_PRICING.retailPrice = UP03_CAMPAIGN_DATA.retailPrice;
    updateProductDataFromCampaign();
}

// Called when SDK fires 'next:initialized'
window.addEventListener('next:initialized', () => {
    buildUpsellPackageMap();
});

function calculatePackageId(style, color, size) {
    // Normalise size to lowercase slug used as map key
    const sizeSlug = size.toLowerCase();
    const key = `${style}-${color}-${sizeSlug}`;
    const packageId = UP03_PACKAGE_MAP[key];

    if (!packageId) {
        console.error('[UP03] Combination not found in package map:', key, '| Available:', Object.keys(UP03_PACKAGE_MAP));
        return null;
    }

    console.log('[UP03] Package ID resolved:', { style, color, size, key, packageId });
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

// Dynamic Style, Color and Size Selection
document.addEventListener('DOMContentLoaded', function() {
    const styleInput = document.getElementById('upsell-style');
    const colorInput = document.getElementById('upsell-color');
    const sizeSelect = document.getElementById('upsell-size');
    const mainImage = document.getElementById('main-product-image');
    const styleBoxes = document.querySelectorAll('.style-box');
    const colorSwatchesContainer = document.getElementById('color-swatches');
    
    // Image mapping for style/color combinations
    const imageMap = {
        'long-black': 'https://cdn.29next.store/media/peakfootwear/uploads/45_00d45ece-896e-4b0e-b046-c6d939822842.jpg',
        'long-white': 'https://cdn.29next.store/media/peakfootwear/uploads/47_639a5287-c826-41bf-b85a-15d99a0ca0e4.jpg',
        'short-black': 'https://cdn.29next.store/media/peakfootwear/uploads/50.jpg',
        'short-white': 'https://cdn.29next.store/media/peakfootwear/uploads/53.jpg',
        'short-pink': 'https://cdn.29next.store/media/peakfootwear/uploads/52_2b2de5f4-50b9-41ed-9c0e-6556b89f8e23.jpg',
        'short-orange': 'https://cdn.29next.store/media/peakfootwear/uploads/51_38241594-4e09-41a7-95f2-0fad2d66e80a.jpg'
    };
    
    // Color options for each style
    const colorOptions = {
        'long': [
            { value: 'black', color: '#000000', border: false },
            { value: 'white', color: '#ffffff', border: true }
        ],
        'short': [
            { value: 'black', color: '#000000', border: false },
            { value: 'white', color: '#ffffff', border: true },
            { value: 'pink', color: '#ff69b4', border: false },
            { value: 'orange', color: '#ff6b35', border: false }
        ]
    };
    
    // Size options for each style
    const sizeOptions = {
        'long': ['S-M', 'L-XL', '2XL-3XL'],
        'short': ['S/M', 'L/XL']
    };
    
    // Update color swatches based on selected style
    function updateColorSwatches(style) {
        const colors = colorOptions[style];
        colorSwatchesContainer.innerHTML = '';
        
        colors.forEach((colorOpt, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch' + (index === 0 ? ' selected' : '');
            swatch.dataset.color = colorOpt.value;
            swatch.style.backgroundColor = colorOpt.color;
            if (colorOpt.border) {
                swatch.style.border = '2px solid #e0e0e0';
            }
            swatch.title = colorOpt.value.charAt(0).toUpperCase() + colorOpt.value.slice(1);
            
            swatch.addEventListener('click', function() {
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
                colorInput.value = this.dataset.color;
                updateProductImage();
            });
            
            colorSwatchesContainer.appendChild(swatch);
        });
        
        // Set default color
        colorInput.value = colors[0].value;
    }
    
    // Update size options based on selected style
    function updateSizeOptions(style) {
        const sizes = sizeOptions[style];
        sizeSelect.innerHTML = '';
        
        sizes.forEach((size, index) => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            if (index === 0) option.selected = true;
            sizeSelect.appendChild(option);
        });
    }
    
    // Update product image based on style and color
    function updateProductImage() {
        const style = styleInput.value;
        const color = colorInput.value;
        const imageKey = `${style}-${color}`;
        
        if (imageMap[imageKey] && mainImage) {
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.src = imageMap[imageKey];
                mainImage.style.opacity = '1';
            }, 150);
        }
        
        console.log('Image updated for:', imageKey);
    }
    
    // Handle style box clicks
    styleBoxes.forEach(box => {
        box.addEventListener('click', function() {
            styleBoxes.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            const style = this.dataset.style;
            styleInput.value = style;
            
            updateColorSwatches(style);
            updateSizeOptions(style);
            updateProductImage();
            
            console.log('Style selected:', style);
        });
    });
    
    // Initialize on page load
    updateColorSwatches('long');
    updateSizeOptions('long');
});

// Pricing Configuration
const UP03_PRICING = {
    retailPrice: 29.99,
    offerPrice: 9.99
};

// Update displayed prices based on quantity
function updatePrices(quantity) {
    const retailTotal = (UP03_PRICING.retailPrice * quantity).toFixed(2);
    const offerTotal = (UP03_PRICING.offerPrice * quantity).toFixed(2);
    
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
    
    const styleSelect = document.getElementById('upsell-style');
    const colorSelect = document.getElementById('upsell-color');
    const sizeSelect = document.getElementById('upsell-size');
    const addButton = document.getElementById('upsell-add-button');
    const skipButton = document.getElementById('upsell-skip-button');
    const acceptUrl = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/lorax-pairs/u/up05';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-pairs/u/up05';
    
    // Handle add to order button using next.addUpsell() SDK method
    if (addButton) {
        addButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            console.log('🔘 Add to order button clicked');
            
            if (!styleSelect || !colorSelect || !sizeSelect) {
                alert('Please select all options before adding to order');
                return;
            }
            
            const style = styleSelect.value;
            const color = colorSelect.value;
            const size = sizeSelect.value;
            
            // Get selected quantity
            const selectedQuantityToggle = document.querySelector('[data-next-upsell-quantity-toggle].next-selected');
            const quantity = selectedQuantityToggle ? parseInt(selectedQuantityToggle.getAttribute('data-next-upsell-quantity-toggle')) : 1;
            
            const packageId = calculatePackageId(style, color, size, quantity);
            
            if (!packageId) {
                alert('Unable to process your selection. Please try again.');
                console.error('❌ Invalid package ID for:', { style, color, size, quantity });
                return;
            }
            
            console.log('📦 Adding upsell package:', packageId, 'for', style, color, size, 'quantity:', quantity);
            
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
                        productName: UP03_CAMPAIGN_DATA.productName || `Compression Socks - Nextcommerce - ${style} - ${color} - ${size}`,
                        price: UP03_CAMPAIGN_DATA.offerPrice ?? UP03_PRICING.offerPrice,
                        image: document.getElementById('main-product-image')?.src || 'https://cdn.29next.store/media/peakfootwear/uploads/55_02468975-8f80-4990-802e-843c8e4d2165.jpg',
                        brand: 'Peak Footwear',
                        sku: `compression-sock-${style}-${color}-${size}`
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
                    page: 'upsell3'
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
        const _offerPrice  = UP03_CAMPAIGN_DATA.offerPrice  ?? UP03_PRICING.offerPrice;
        const _retailPrice = UP03_CAMPAIGN_DATA.retailPrice ?? UP03_PRICING.retailPrice;
        const _productName = UP03_CAMPAIGN_DATA.productName || 'Compression Socks - Nextcommerce';
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: _offerPrice,
                items: [{
                    item_id: 'compression-socks-nextcommerce-upsell',
                    item_name: `${_productName} - Upsell Offer`,
                    item_category: 'athletic-wear',
                    item_brand: 'Peak Footwear',
                    price: _offerPrice,
                    quantity: 1,
                    item_sku: 'COMPRESSION-SOCK-UPSELL',
                    discount: parseFloat((_retailPrice - _offerPrice).toFixed(2))
                }]
            }
        });
        
        console.log('Upsell page view event fired');
    }
    
    // Also send to UnifiedTrackingBridge if available
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        window.UnifiedTrackingBridge.track.pageView({
            page: 'upsell3',
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

console.log('Peak Footwear Upsell Page 3 (Compression Socks - Nextcommerce, product 13073) JavaScript loaded successfully');

