// Next SDK Integration - Upsell Page (Peak Compression Socks)

// Package ID Calculator for Peak Compression Socks (Kasdava Campaign)
function calculatePackageId(style, color, size, quantity) {
    // Kasdava Peak Compression Socks: 379-392 (14 variants)
    // Base package ID for Kasdava pairs campaign
    const baseId = 379;
    
    console.log('Package ID calculation debug:', {
        style: style,
        color: color,
        size: size,
        quantity: quantity,
        isBogoCampaign: isBogoCampaign,
        baseId: baseId
    });
    
    let packageId = baseId;
    
    if (style === 'long') {
        // Long socks: 6 variants (2 colors × 3 sizes)
        // Black: 0-2, White: 3-5
        const longColors = ['black', 'white'];
        const longSizes = ['S-M', 'L-XL', '2XL-3XL'];
        
        const colorIndex = longColors.indexOf(color);
        const sizeIndex = longSizes.indexOf(size);
        
        if (colorIndex === -1 || sizeIndex === -1) {
            console.error('Invalid long sock combination:', { color, size });
            return null;
        }
        
        // Calculate offset: color * 3 + size
        packageId = baseId + (colorIndex * 3) + sizeIndex;
        
    } else if (style === 'short') {
        // Short socks: 8 variants (4 colors × 2 sizes)
        // Start at offset 6 (after long socks)
        // Black: 0-1, White: 2-3, Pink: 4-5, Orange: 6-7
        const shortColors = ['black', 'white', 'pink', 'orange'];
        const shortSizes = ['S/M', 'L/XL'];
        
        const colorIndex = shortColors.indexOf(color);
        const sizeIndex = shortSizes.indexOf(size);
        
        if (colorIndex === -1 || sizeIndex === -1) {
            console.error('Invalid short sock combination:', { color, size });
            return null;
        }
        
        // Calculate offset: 6 (long socks) + color * 2 + size
        packageId = baseId + 6 + (colorIndex * 2) + sizeIndex;
        
    } else {
        console.error('Invalid style:', style);
        return null;
    }
    
    console.log('Package ID calculation result:', {
        baseId: baseId,
        style: style,
        finalPackageId: packageId
    });
    
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
    offerPrice: 20.99
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
    const acceptUrl = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/kasdava-pairs/u/up04';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/kasdava-pairs/u/up04';
    
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
                        productName: `Peak Compression Socks - ${style} - ${color} - ${size}`,
                        price: 20.99,
                        image: document.getElementById('main-product-image')?.src || 'https://cdn.29next.store/media/peakfootwear/uploads/compression-sock-long-black.webp',
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
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: 20.99,
                items: [{
                    item_id: 'compression-socks-upsell',
                    item_name: 'Peak Compression Socks - Upsell Offer (30% Off)',
                    item_category: 'athletic-wear',
                    item_brand: 'Peak Footwear',
                    price: 20.99,
                    quantity: 1,
                    item_sku: 'COMPRESSION-SOCK-UPSELL',
                    discount: 9.00
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
            funnel: 'KASDAVA'
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

console.log('Peak Footwear Upsell Page 3 (Compression Socks) JavaScript with Next SDK integration loaded successfully');

