// Next SDK Integration - Upsell Page (Premium Insoles - Pairs Campaign)

// Package ID Calculator for Premium Insoles (Kasdava Pairs Campaign)
function calculatePackageId(size) {
    // Kasdava Premium Insoles: 393-396 (4 sizes)
    // Package IDs are stored directly in the size value
    // 393: US Women 6-9.5
    // 394: US Women 10-14
    // 395: US Men 4-7.5
    // 396: US Men 8-12
    
    const packageId = parseInt(size);
    
    console.log('Package ID calculation:', {
        size: size,
        packageId: packageId
    });
    
    if (isNaN(packageId) || packageId < 393 || packageId > 396) {
        console.error('Invalid package ID:', size);
        return null;
    }
    
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
const UP04_PRICING = {
    retailPrice: 39.99,
    offerPrice: 19.99
};

// Update displayed prices based on quantity
function updatePrices(quantity) {
    const retailTotal = (UP04_PRICING.retailPrice * quantity).toFixed(2);
    const offerTotal = (UP04_PRICING.offerPrice * quantity).toFixed(2);
    
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
    const addButton = document.getElementById('upsell-add-button');
    const skipButton = document.getElementById('upsell-skip-button');
    const acceptUrl = document.querySelector('meta[name="next-upsell-accept-url"]')?.content || '/kasdava-pairs/u/up05';
    const declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/kasdava-pairs/u/up05';
    
    // Handle add to order button using next.addUpsell() SDK method
    if (addButton) {
        addButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            console.log('🔘 Add to order button clicked');
            
            if (!sizeSelect) {
                alert('Please select a size before adding to order');
                return;
            }
            
            const size = sizeSelect.value;
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
                
                // Get size label for tracking
                const sizeLabel = sizeSelect.options[sizeSelect.selectedIndex].text;
                
                // Fire tracking event
                if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
                    window.UnifiedTrackingBridge.track.upsellAccepted({
                        packageId: packageId,
                        quantity: quantity,
                        productName: `Premium Insoles - ${sizeLabel}`,
                        price: 19.99 * quantity,
                        image: 'https://cdn.29next.store/media/peakfootwear/uploads/premium-insoles-1.webp',
                        brand: 'Peak Footwear',
                        sku: `premium-insoles-${packageId}`
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
                    page: 'upsell4'
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
                value: 19.99,
                items: [{
                    item_id: 'premium-insoles-upsell',
                    item_name: 'Premium Insoles - Upsell Offer (50% Off)',
                    item_category: 'accessories',
                    item_brand: 'Peak Footwear',
                    price: 19.99,
                    quantity: 1,
                    item_sku: 'PREMIUM-INSOLES-UPSELL',
                    discount: 20.00
                }]
            }
        });
        
        console.log('Upsell page view event fired');
    }
    
    // Also send to UnifiedTrackingBridge if available
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        window.UnifiedTrackingBridge.track.pageView({
            page: 'upsell4',
            page_type: 'upsell',
            funnel: 'KASDAVA-PAIRS'
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

console.log('Peak Footwear Upsell Page 4 (Premium Insoles - Pairs Campaign) JavaScript with Next SDK integration loaded successfully');
