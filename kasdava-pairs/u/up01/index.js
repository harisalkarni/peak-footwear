// Next SDK Integration - Upsell Page (1 Pair Only)

// Package ID Calculator for Kasdava Master Products (Upsell - Special Extra Pair Discount - IDs 280-372)
// Based on actual JSON package structure from campaign-packages-kasdava-master---1_2_3-pairs.json
function calculatePackageId(color, size, quantity) {
    // Kasdava Master Colors (7 colors)
    // Special Extra Pair Discount packages: 280-372 (93 packages, same structure as main tiers)
    const colorConfig = {
        'brown':      { start: 1,  sizes: 14, hasExtended: true },  // 280-293
        'blue':       { start: 15, sizes: 14, hasExtended: true },  // 294-307
        'green':      { start: 29, sizes: 14, hasExtended: true },  // 308-321
        'black':      { start: 43, sizes: 14, hasExtended: true },  // 322-335
        'dark-blue':  { start: 57, sizes: 14, hasExtended: true },  // 336-349
        'gray':       { start: 71, sizes: 14, hasExtended: true },  // 350-363
        'pink':       { start: 85, sizes: 9,  hasExtended: false }  // 364-372 (9 sizes)
    };
    
    // Size mapping from display format to index
    // Supports both "US5 Women / US3 Men" format (HTML) and "US Women 5 - US Men 3" format (backend)
    const sizeMap = {
        'US5 Women / US3 Men': 0,
        'US Women 5 - US Men 3': 0,
        'US6 Women / US4 Men': 1,
        'US Women 6 - US Men 4': 1,
        'US7 Women / US5 Men': 2,
        'US Women 7 - US Men 5': 2,
        'US7.5 Women / US5.5 Men': 3,
        'US Women 7.5 - US Men 5.5': 3,
        'US8 Women / US6 Men': 4,
        'US Women 8/8.5 - US Men 6/6.5': 4,
        'US9 Women / US7 Men': 5,
        'US Women 9/9.5 - US Men 7/7.5': 5,
        'US10 Women / US8 Men': 6,
        'US Women 10/10.5 - US Men 8/8.5': 6,
        'US11 Women / US9 Men': 7,
        'US Women 11/11.5 - US Men 9/9.5': 7,
        'US12 Women / US10 Men': 8,
        'US Women 12/12.5 - US Men 10/10.5': 8,
        'US13 Women / US11 Men': 9,
        'US Women 13/13.5 - US Men 11/11.5': 9,
        'US14 Women / US12 Men': 10,
        'US Women 14 - US Men 12': 10,
        'US15 Women / US13 Men': 11,
        'US Women 15 - US Men 13': 11,
        'US16 Women / US14 Men': 12,
        'US Women 16 - US Men 14': 12,
        'US17 Women / US15 Men': 13,
        'US Women 17 - US Men 15': 13
    };
    
    const config = colorConfig[color];
    if (!config) {
        console.error('Color not found:', color);
        return null;
    }
    
    const sizeIndex = sizeMap[size];
    if (sizeIndex === undefined) {
        console.error('Size not found:', size);
        return null;
    }
    
    console.log('Package ID calculation debug:', {
        color: color,
        size: size,
        quantity: quantity,
        sizeIndex: sizeIndex,
        colorConfig: config
    });
    
    // Validate size is available for this color
    // Extended sizes (13/13.5 and above, indices 9+) only for colors with hasExtended: true
    if (sizeIndex >= 9 && !config.hasExtended) {
        console.error('Extended sizes not available for color:', color);
        return null;
    }
    
    // Calculate size offset within color group
    let sizeOffset = sizeIndex;
    
    // Limit size offset to actual available sizes
    if (sizeOffset >= config.sizes) {
        console.error('Size offset exceeds available sizes:', { sizeOffset, availableSizes: config.sizes });
        return null;
    }
    
    // Special Extra Pair Discount packages start at 280 (offset by 279 from main packages)
    const UPSELL_BASE_OFFSET = 279;
    
    // Final package ID
    const packageId = UPSELL_BASE_OFFSET + config.start + sizeOffset;
    
    console.log('Package ID calculation result:', {
        upsellBaseOffset: UPSELL_BASE_OFFSET,
        colorStart: config.start,
        sizeOffset: sizeOffset,
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

// Color Image Preview Functionality
document.addEventListener('DOMContentLoaded', function() {
    const colorSelect = document.getElementById('upsell-color');
    const previewImage = document.getElementById('color-preview-image');
    
    // Color to image mapping (Kasdava Master)
    const colorImageMap = {
        'brown': 'https://cdn.29next.store/media/peakfootwear/uploads/brown.png',
        'blue': 'https://cdn.29next.store/media/peakfootwear/uploads/blue.jpg',
        'green': 'https://cdn.29next.store/media/peakfootwear/uploads/green.jpg',
        'black': 'https://cdn.29next.store/media/peakfootwear/uploads/black.jpg',
        'dark-blue': 'https://cdn.29next.store/media/peakfootwear/uploads/dark-blue.jpg',
        'gray': 'https://cdn.29next.store/media/peakfootwear/uploads/gray.jpg',
        'pink': 'https://cdn.29next.store/media/peakfootwear/uploads/pink.jpg'
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
    
    // Kasdava Master: Colors that have extended sizes (US13/13.5 and above)
    // Pink does NOT have extended sizes
    const extendedSizeColors = ['brown', 'blue', 'green', 'black', 'dark-blue', 'gray'];
    
    // All Kasdava colors have size US5 Women / US3 Men (no restrictions)
    const noSize5Colors = [];
    
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
                    sizeSelect.value = 'US8 Women / US6 Men';
                }
            }
        });
        
        // Handle size 6 (Orange doesn't have it)
        const size6Option = sizeSelect.querySelector('option[value="US6 Women / US4 Men"]');
        if (size6Option) {
            if (noSize6Colors.includes(selectedColor)) {
                size6Option.style.display = 'none';
                size6Option.disabled = true;
                // If currently selected size 6, reset to a valid option
                if (size6Option.selected) {
                    sizeSelect.value = 'US8 Women / US6 Men';
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
    const acceptUrl = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/kasdava-pairs/u/up02';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/kasdava-pairs/u/up02';
    
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
            const packageId = calculatePackageId(color, size, 1);
            
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
                    // Get image URL for selected color (Kasdava Master)
                    const colorImageMap = {
                        'brown': 'https://cdn.29next.store/media/peakfootwear/uploads/brown.png',
                        'blue': 'https://cdn.29next.store/media/peakfootwear/uploads/blue.jpg',
                        'green': 'https://cdn.29next.store/media/peakfootwear/uploads/green.jpg',
                        'black': 'https://cdn.29next.store/media/peakfootwear/uploads/black.jpg',
                        'dark-blue': 'https://cdn.29next.store/media/peakfootwear/uploads/dark-blue.jpg',
                        'gray': 'https://cdn.29next.store/media/peakfootwear/uploads/gray.jpg',
                        'pink': 'https://cdn.29next.store/media/peakfootwear/uploads/pink.jpg'
                    };
                    
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: 1,
                        productName: `Kasdava Master - ${color} - ${size}`,
                        price: 39.95,
                        image: colorImageMap[color] || 'https://cdn.29next.store/media/peakfootwear/uploads/brown.png',
                        brand: 'Peak Footwear',
                        sku: `kasdava-master-${color}-${size}`
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
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: 39.95,
                items: [{
                    item_id: 'kasdava-master-upsell',
                    item_name: 'Kasdava Master - Upsell Offer (73% Off)',
                    item_category: 'footwear',
                    item_brand: 'Peak Footwear',
                    price: 39.95,
                    quantity: 1,
                    item_sku: 'KASDAVA-PRO-UPSELL',
                    discount: 109.95
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

console.log('Peak Footwear Upsell Page JavaScript with Next SDK integration loaded successfully');