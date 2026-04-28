// Next SDK Integration - Upsell Page (Special Extra Pair Discount - BOGO Campaign)

// Package ID Calculator for Lorax Pro Upsell Products (IDs 203-293)
// This is for the "Special Extra Pair Discount" upsell - same 91 variants as main Lorax Pro
// but at discounted upsell price ($39.95 instead of $69.95)
//
// ACCURATE COLOR BREAKDOWN (verified against campaign data):
// - white-pink:  10 sizes (ref 203-212) - US Women 6-14
// - black:       12 sizes (ref 213-224) - US Women 6-16
// - pink:        10 sizes (ref 225-234) - US Women 6-14
// - white-black: 12 sizes (ref 235-246) - US Women 6-16
// - white-gray:  12 sizes (ref 247-258) - US Women 6-16
// - blue:        12 sizes (ref 259-270) - US Women 6-16
// - orange:      11 sizes (ref 271-281) - US Women 7-16 (NO US Women 6!)
// - white-blue:  12 sizes (ref 282-293) - US Women 6-16
function calculatePackageId(color, size) {
    // Color order matching campaign data
    const colors = [
        'white-pink',
        'black',
        'pink',
        'white-black',
        'white-gray',
        'blue',
        'orange',
        'white-blue'
    ];
    
    // Accurate size counts per color from campaign data
    const colorSizeCounts = {
        'white-pink': 10,
        'black': 12,
        'pink': 10,
        'white-black': 12,
        'white-gray': 12,
        'blue': 12,
        'orange': 11,
        'white-blue': 12
    };
    
    // HTML size values -> Campaign package ID offset mapping
    // Note: HTML uses simplified sizes without 7.5, but campaign has 10 sizes for base colors
    // The HTML values need to map to the correct campaign size indices
    const htmlSizeToCampaignIndex = {
        'US6 Women / US4 Men': 0,    // -> US Women 6 - US Men 4
        'US7 Women / US5 Men': 1,    // -> US Women 7 - US Men 5
        // Note: US Women 7.5 (index 2) is not available in HTML
        'US8 Women / US6 Men': 3,    // -> US Women 8/8.5 - US Men 6/6.5
        'US9 Women / US7 Men': 4,    // -> US Women 9/9.5 - US Men 7/7.5
        'US10 Women / US8 Men': 5,   // -> US Women 10/10.5 - US Men 8/8.5
        'US11 Women / US9 Men': 6,   // -> US Women 11/11.5 - US Men 9/9.5
        'US12 Women / US10 Men': 7,  // -> US Women 12/12.5 - US Men 10/10.5
        'US13 Women / US11 Men': 8,  // -> US Women 13/13.5 - US Men 11/11.5
        'US14 Women / US12 Men': 9,  // -> US Women 14 - US Men 12
        'US15 Women / US13 Men': 10, // -> US Women 15 - US Men 13
        'US16 Women / US14 Men': 11  // -> US Women 16 - US Men 14
    };
    
    // Orange size mapping - Orange starts at US Women 7, not US Women 6!
    // Campaign has 11 sizes for orange (index 0-10)
    const htmlSizeToCampaignIndexOrange = {
        'US7 Women / US5 Men': 0,    // -> US Women 7 - US Men 5
        // Note: US Women 7.5 (index 1) is not available in HTML
        'US8 Women / US6 Men': 2,    // -> US Women 8/8.5 - US Men 6/6.5
        'US9 Women / US7 Men': 3,    // -> US Women 9/9.5 - US Men 7/7.5
        'US10 Women / US8 Men': 4,   // -> US Women 10/10.5 - US Men 8/8.5
        'US11 Women / US9 Men': 5,   // -> US Women 11/11.5 - US Men 9/9.5
        'US12 Women / US10 Men': 6,  // -> US Women 12/12.5 - US Men 10/10.5
        'US13 Women / US11 Men': 7,  // -> US Women 13/13.5 - US Men 11/11.5
        'US14 Women / US12 Men': 8,  // -> US Women 14 - US Men 12
        'US15 Women / US13 Men': 9,  // -> US Women 15 - US Men 13
        'US16 Women / US14 Men': 10  // -> US Women 16 - US Men 14
    };
    
    // Colors that have extended sizes (12 sizes total, except orange which has 11)
    const extendedSizeColors = ['black', 'white-black', 'white-gray', 'blue', 'orange', 'white-blue'];
    
    const colorIndex = colors.indexOf(color);
    
    console.log('Package ID calculation debug (Upsell):', {
        color: color,
        size: size,
        colorIndex: colorIndex
    });
    
    if (colorIndex === -1) {
        console.error('Color not found:', color);
        return null;
    }
    
    // Upsell base offset: starts at ref_id 203
    const upsellBaseOffset = 202;
    
    // Calculate color group offset using actual size counts
    let colorOffset = 0;
    for (let i = 0; i < colorIndex; i++) {
        colorOffset += colorSizeCounts[colors[i]];
    }
    
    // Calculate size offset using HTML-to-campaign mapping
    let sizeOffset = -1;
    
    if (color === 'orange') {
        // Orange has different size range (starts at US Women 7)
        sizeOffset = htmlSizeToCampaignIndexOrange[size];
        if (sizeOffset === undefined) {
            // Check if it's US6 which isn't available for orange
            if (size === 'US6 Women / US4 Men') {
                console.error('US6 is not available for orange color');
                return null;
            }
            sizeOffset = -1;
        }
    } else {
        // Use the HTML-to-campaign mapping
        sizeOffset = htmlSizeToCampaignIndex[size];
        if (sizeOffset === undefined) {
            sizeOffset = -1;
        }
        
        // Validate extended sizes are only used with extended colors
        if (sizeOffset >= 10 && !extendedSizeColors.includes(color)) {
            console.error('Extended sizes not available for color:', color);
            return null;
        }
    }
    
    if (sizeOffset === -1) {
        console.error('Size not found for color:', size, color);
        return null;
    }
    
    const packageId = upsellBaseOffset + colorOffset + sizeOffset + 1;
    
    console.log('Package ID calculation result (Upsell):', {
        upsellBaseOffset: upsellBaseOffset,
        colorOffset: colorOffset,
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
    
    // Function to show/hide extended size options
    function updateSizeOptions() {
        const selectedColor = colorSelect.value;
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
    const acceptUrl = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/lorax-bogo/u/up02';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-bogo/u/up02';
    
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
                        productName: `Lorax Pro - ${color} - ${size}`,
                        price: 39.95,
                        image: colorImageMap[color] || 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp',
                        brand: 'Peak Footwear',
                        sku: `lorax-pro-${color}-${size}`
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
                    item_id: 'lorax-pro-upsell',
                    item_name: 'Lorax Pro - Upsell Offer (73% Off)',
                    item_category: 'footwear',
                    item_brand: 'Peak Footwear',
                    price: 39.95,
                    quantity: 1,
                    item_sku: 'LORAX-PRO-UPSELL',
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

console.log('Peak Footwear Upsell Page JavaScript with Next SDK integration loaded successfully');