// Next SDK Integration - Bundle Page (BOGO Campaign)

// Package ID Calculator for Lorax Pro Products (BOGO Campaign)
// BOGO STRUCTURE:
// - PAID products: ref_id 1-91 ($69.95 each)
// - FREE products: ref_id 92-182 ($0.00 each)
//
// COLOR BREAKDOWN (with size counts):
// - white-pink:  10 sizes (ref 1-10 paid,  92-101 free)
// - black:       12 sizes (ref 11-22 paid, 102-113 free)
// - pink:        10 sizes (ref 23-32 paid, 114-123 free)
// - white-black: 12 sizes (ref 33-44 paid, 124-135 free)
// - white-gray:  12 sizes (ref 45-56 paid, 136-147 free)
// - blue:        12 sizes (ref 57-68 paid, 148-159 free)
// - orange:      11 sizes (ref 69-79 paid, 160-170 free) - NOTE: starts at US Women 7!
// - white-blue:  12 sizes (ref 80-91 paid, 171-182 free)
function calculatePackageId(color, size, isFree = false) {
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
    
    // Standard sizes (10 sizes: US Women 6 - US Women 14)
    const standardSizes = [
        'US Women 6 - US Men 4',
        'US Women 7 - US Men 5',
        'US Women 7.5 - US Men 5.5',
        'US Women 8/8.5 - US Men 6/6.5',
        'US Women 9/9.5 - US Men 7/7.5',
        'US Women 10/10.5 - US Men 8/8.5',
        'US Women 11/11.5 - US Men 9/9.5',
        'US Women 12/12.5 - US Men 10/10.5',
        'US Women 13/13.5 - US Men 11/11.5',
        'US Women 14 - US Men 12'
    ];
    
    // Extended sizes (US Women 15-16, only for certain colors)
    const extendedSizes = [
        'US Women 15 - US Men 13',
        'US Women 16 - US Men 14'
    ];
    
    // Orange sizes - starts at US Women 7, not US Women 6!
    const orangeSizes = [
        'US Women 7 - US Men 5',
        'US Women 7.5 - US Men 5.5',
        'US Women 8/8.5 - US Men 6/6.5',
        'US Women 9/9.5 - US Men 7/7.5',
        'US Women 10/10.5 - US Men 8/8.5',
        'US Women 11/11.5 - US Men 9/9.5',
        'US Women 12/12.5 - US Men 10/10.5',
        'US Women 13/13.5 - US Men 11/11.5',
        'US Women 14 - US Men 12',
        'US Women 15 - US Men 13',
        'US Women 16 - US Men 14'
    ];
    
    // Colors that have extended sizes (12 sizes total, except orange which has 11)
    const extendedSizeColors = ['black', 'white-black', 'white-gray', 'blue', 'orange', 'white-blue'];
    
    const colorIndex = colors.indexOf(color);
    
    console.log('Package ID calculation debug (BOGO):', {
        color: color,
        size: size,
        isFree: isFree,
        colorIndex: colorIndex
    });
    
    if (colorIndex === -1) {
        console.error('Color not found:', color);
        return null;
    }
    
    // FREE products are offset by 91 from PAID products
    const freeOffset = isFree ? 91 : 0;
    
    // Calculate color group offset using actual size counts
    let colorOffset = 0;
    for (let i = 0; i < colorIndex; i++) {
        colorOffset += colorSizeCounts[colors[i]];
    }
    
    // Calculate size offset within color group
    let sizeOffset = -1;
    
    if (color === 'orange') {
        // Orange has different size range (starts at US Women 7)
        sizeOffset = orangeSizes.indexOf(size);
    } else {
        // Check standard sizes first
        sizeOffset = standardSizes.indexOf(size);
        
        // Check extended sizes if not found and color supports them
        if (sizeOffset === -1 && extendedSizeColors.includes(color)) {
            const extendedIndex = extendedSizes.indexOf(size);
            if (extendedIndex !== -1) {
                sizeOffset = 10 + extendedIndex; // After the 10 standard sizes
            }
        }
    }
    
    if (sizeOffset === -1) {
        console.error('Size not found for color:', size, color);
        return null;
    }
    
    const packageId = freeOffset + colorOffset + sizeOffset + 1;
    
    console.log('Package ID calculation result (BOGO):', {
        isFree: isFree,
        freeOffset: freeOffset,
        colorOffset: colorOffset,
        sizeOffset: sizeOffset,
        finalPackageId: packageId
    });
    
    return packageId;
}

// Dynamic Date Calculator
document.addEventListener("DOMContentLoaded", function () {
    const monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

    function getFormattedDate(offsetDays) {
        const date = new Date();
        date.setDate(date.getDate() + offsetDays);

        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        const daySuffix = (d) => {
            if (d >= 11 && d <= 13) return "th";
            switch (d % 10) {
                case 1: return "st";
                case 2: return "nd";
                case 3: return "rd";
                default: return "th";
            }
        };

        return `${month} ${day}${daySuffix(day)} ${year}`;
    }

    const redEl = document.querySelector(".pf-lorax-buy-shop-notice-title.red");
    const greenEl = document.querySelector(".pf-lorax-buy-shop-notice-title.green");

    if (redEl) redEl.textContent = getFormattedDate(2);
    if (greenEl) greenEl.textContent = getFormattedDate(-2);
});

// Image Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    const imagesList = document.querySelector('.pf-lorax-buy-images-list');
    const leftNav = document.querySelector('.pf-lorax-buy-images-nav-left');
    const rightNav = document.querySelector('.pf-lorax-buy-images-nav-right');
    const thumbnails = document.querySelectorAll('.pf-lorax-buy-images-thumbnails-item');
    
    let currentIndex = 0;
    const totalImages = 7; // Updated to match new image count
    
    // Check if all gallery elements exist
    if (!imagesList || !leftNav || !rightNav || thumbnails.length === 0) {
        console.log('Gallery elements not found, skipping gallery initialization');
        return;
    }
    
    // Function to update gallery
    function updateGallery(index) {
        // Ensure index is within bounds
        if (index < 0) index = totalImages - 1;
        if (index >= totalImages) index = 0;
        
        currentIndex = index;
        
        // Update main image position
        const offset = -100 * currentIndex;
        imagesList.style.transform = `translateX(${offset}%)`;
        
        // Update thumbnail active state
        thumbnails.forEach((thumb, i) => {
            if (i === currentIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }
    
    // Navigation arrow clicks
    leftNav.addEventListener('click', function(e) {
        e.preventDefault();
        updateGallery(currentIndex - 1);
    });
    
    rightNav.addEventListener('click', function(e) {
        e.preventDefault();
        updateGallery(currentIndex + 1);
    });
    
    // Thumbnail clicks
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function(e) {
            e.preventDefault();
            updateGallery(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            updateGallery(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            updateGallery(currentIndex + 1);
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    imagesList.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    imagesList.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left
            updateGallery(currentIndex + 1);
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe right
            updateGallery(currentIndex - 1);
        }
    }
    
    console.log('Image gallery initialized successfully');
});

// Back Button Navigation
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.querySelector('.pf-lorax-back-btn');
    
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Navigate back to previous page
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // Fallback - redirect to main page
                window.location.href = '../index.html';
            }
        });
    }
});

// Mobile Body Padding for Sticky ATC
document.addEventListener('DOMContentLoaded', function() {
    function checkMobileLayout() {
        const stickyATC = document.querySelector('.pf-lorax-buy-shop-atc');
        const body = document.body;
        
        if (window.innerWidth <= 768 && stickyATC) {
            // Add bottom padding to prevent content from being hidden behind sticky ATC
            body.style.paddingBottom = '20px';
        } else {
            // Remove padding on desktop
            body.style.paddingBottom = '0';
        }
    }
    
    // Check on load
    checkMobileLayout();
    
    // Check on resize
    window.addEventListener('resize', checkMobileLayout);
});

// Size Guide Modal Implementation
document.addEventListener('DOMContentLoaded', function() {
    const sizeGuideButton = document.querySelector('.pf-lorax-buy-shop-sg');
    const sizeGuideModal = document.getElementById('pf-lorax-size-guide-modal');
    const closeButtons = document.querySelectorAll('[data-modal-close]');
    let previouslyFocused = null;
    
    if (!sizeGuideButton || !sizeGuideModal) {
        console.log('Size guide elements not found');
        return;
    }
    
    // Function to open modal
    function openModal() {
        previouslyFocused = document.activeElement;
        sizeGuideModal.setAttribute('aria-hidden', 'false');
        sizeGuideModal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Focus on close button for accessibility
        const closeButton = sizeGuideModal.querySelector('.pf-lorax-size-guide-modal-close');
        if (closeButton) {
            closeButton.focus();
        }
        
        // Track analytics if available
        if (window.nextCampaign && typeof window.nextCampaign.event === 'function') {
            window.nextCampaign.event('size_guide_opened', {
                page: 'bundle'
            });
        }
        
        console.log('Size guide modal opened');
    }
    
    // Function to close modal
    function closeModal() {
        sizeGuideModal.setAttribute('aria-hidden', 'true');
        sizeGuideModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        
        // Return focus to the button that opened the modal
        if (previouslyFocused) {
            previouslyFocused.focus();
        }
        
        console.log('Size guide modal closed');
    }
    
    // Function to handle keyboard navigation
    function handleKeydown(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
        
        // Trap focus within modal
        if (e.key === 'Tab') {
            const focusableElements = sizeGuideModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    }
    
    // Open modal when size guide button is clicked
    sizeGuideButton.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
    });
    
    // Close modal when close buttons are clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
        });
    });
    
    // Handle keyboard events when modal is open
    document.addEventListener('keydown', function(e) {
        if (sizeGuideModal.classList.contains('active')) {
            handleKeydown(e);
        }
    });
    
    // Prevent scroll when modal is open
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                if (document.body.classList.contains('modal-open')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });
    
    console.log('Size guide modal functionality initialized');
});

// Form Validation and Selection Tracking with Dynamic Size Options
document.addEventListener('DOMContentLoaded', function() {
    const selects = document.querySelectorAll('select[name="color"], select[name="size"]');
    
    // Colors that have extended sizes (US15-16)
    const extendedSizeColors = ['black', 'white-black', 'white-gray', 'blue', 'orange', 'white-blue'];
    
    // Color to image mapping
    const colorImageMap = {
        'white-pink': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp',
        'black': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Black.webp',
        'pink': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Pink.webp',
        'white-black': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BW.webp',
        'white-gray': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BW.webp', // Fallback to BW if no gray variant
        'blue': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Blue.webp',
        'orange': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Orange.webp',
        'white-blue': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BlueW.webp'
    };
    
    // Function to show/hide extended size options
    function updateSizeOptions(colorSelect, sizeSelect) {
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
                    sizeSelect.value = 'US6 Women / US4 Men';
                }
            }
        });
    }
    
    // Function to update product image based on color selection
    function updateProductImage(container, selectedColor) {
        const productImage = container.querySelector('.pf-lorax-buy-shop-item-conf-product-image');
        if (productImage && colorImageMap[selectedColor]) {
            productImage.src = colorImageMap[selectedColor];
        }
    }
    
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const container = this.closest('.pf-lorax-buy-shop-item-container');
            const colorSelect = container.querySelector('select[name="color"]');
            const sizeSelect = container.querySelector('select[name="size"]');
            
            // Update size options and product image when color changes
            if (this.name === 'color' && colorSelect && sizeSelect) {
                updateSizeOptions(colorSelect, sizeSelect);
                updateProductImage(container, colorSelect.value);
            }
            
            // Log selection changes and calculate package ID (BOGO logic)
            if (colorSelect && sizeSelect && colorSelect.value && sizeSelect.value) {
                const activeContainers = document.querySelectorAll('.pf-lorax-buy-shop-item-container.active');
                const currentQuantity = activeContainers.length;
                const containerIndex = Array.from(activeContainers).indexOf(container);
                
                // BOGO: First half of items are PAID, second half are FREE
                // B1G1 (2 items): index 0 = PAID, index 1 = FREE
                // B2G2 (4 items): index 0,1 = PAID, index 2,3 = FREE
                const paidCount = Math.ceil(currentQuantity / 2);
                const isFree = containerIndex >= paidCount;
                
                // Debug the calculation
                console.log('Calculating package ID for (BOGO):', {
                    color: colorSelect.value,
                    size: sizeSelect.value,
                    containerIndex: containerIndex,
                    totalItems: currentQuantity,
                    paidCount: paidCount,
                    isFree: isFree
                });
                
                const packageId = calculatePackageId(colorSelect.value, sizeSelect.value, isFree);
                
                console.log(`Pair ${container.dataset.item} configured: ${colorSelect.value} - ${sizeSelect.value} (Package ID: ${packageId}, isFree: ${isFree})`);
                
                if (!packageId) {
                    console.error('Package ID calculation failed for:', colorSelect.value, sizeSelect.value, isFree);
                }
            }
            
            // Add validation styling
            this.style.borderColor = this.value ? '#016a4c' : '#e0e0e0';
        });
        
        // Initialize size options and product images on page load
        if (select.name === 'color') {
            const container = select.closest('.pf-lorax-buy-shop-item-container');
            const sizeSelect = container.querySelector('select[name="size"]');
            if (sizeSelect) {
                updateSizeOptions(select, sizeSelect);
                updateProductImage(container, select.value);
            }
        }
    });
});

// Accessibility Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels and roles where needed
    const galleryNavButtons = document.querySelectorAll('.pf-lorax-buy-images-nav-left, .pf-lorax-buy-images-nav-right');
    galleryNavButtons.forEach(button => {
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        
        if (button.classList.contains('pf-lorax-buy-images-nav-left')) {
            button.setAttribute('aria-label', 'Previous image');
        } else {
            button.setAttribute('aria-label', 'Next image');
        }
    });
    
    // Add keyboard support for nav buttons
    galleryNavButtons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add ARIA labels to thumbnails
    const thumbnails = document.querySelectorAll('.pf-lorax-buy-images-thumbnails-item');
    thumbnails.forEach((thumb, index) => {
        thumb.setAttribute('aria-label', `View image ${index + 1}`);
        thumb.setAttribute('role', 'button');
    });
    
    console.log('Accessibility enhancements applied');
});

// Performance Optimization - Lazy Loading Images
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// Next SDK Integration for Bundle Page
window.addEventListener('next:initialized', function() {
    console.log('Next SDK initialized on bundle page - ready for cart management');
    
    // Clear any existing cart when page loads
    next.clearCart();
    
    // Listen to cart events for debugging
    next.on('cart:updated', (data) => {
        console.log('Bundle cart updated:', data);
    });
    
    next.on('cart:item-added', (data) => {
        console.log('Item added to cart:', data);
    });
    
    next.on('cart:item-removed', (data) => {
        console.log('Item removed from cart:', data);
    });
});


// URL Parameter Preservation Utility
function preserveUrlParameters(baseUrl) {
    const currentParams = new URLSearchParams(window.location.search);
    const urlObj = new URL(baseUrl, window.location.origin);
    
    // Preserve all existing parameters
    currentParams.forEach((value, key) => {
        urlObj.searchParams.set(key, value);
    });
    
    return urlObj.toString();
}

// Checkout Validation
function validateBundleForCheckout() {
    // Get cart data from SDK
    const cartData = window.next ? window.next.getCartData() : null;
    
    if (!cartData || cartData.quantity === 0) {
        alert('Please add at least one pair to your bundle before checkout');
        return false;
    }
    
    // Check if all active items have color/size selected
    const activeContainers = document.querySelectorAll('.pf-lorax-buy-shop-item-container.active');
    const incompleteSelections = [];
    
    activeContainers.forEach((container, index) => {
        const colorSelect = container.querySelector('select[name="color"]');
        const sizeSelect = container.querySelector('select[name="size"]');
        
        if (!colorSelect?.value || !sizeSelect?.value) {
            incompleteSelections.push(`Pair ${index + 1}`);
        }
    });
    
    if (incompleteSelections.length > 0) {
        alert(`Please complete color and size selection for: ${incompleteSelections.join(', ')}`);
        return false;
    }
    
    return true;
}

// Function to fire Add to Cart tracking event
function fireAddToCartEvent(bundleConfig, totalValue) {
    if (!bundleConfig || bundleConfig.length === 0) return;

    // Prepare items for tracking
    const trackingItems = bundleConfig.map((item, index) => ({
        item_id: `lorax-pro-${item.packageId}`,
        item_name: `Lorax Pro - ${item.color} - ${item.size}`,
        item_category: 'footwear',
        item_brand: 'Peak Footwear',
        item_variant: `${item.color}-${item.size}`,
        price: item.quantityBase === 1 ? 49.95 : (item.quantityBase === 2 ? 44.95 : 39.95),
        quantity: 1,
        item_sku: `LORAX-${item.packageId}`,
        item_image: 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp'
    }));

    // Calculate total if not provided
    if (!totalValue) {
        totalValue = trackingItems.reduce((sum, item) => sum + item.price, 0);
    }

    // Fire event through NextDataLayer for unified tracking
    if (window.NextDataLayer) {
        window.NextDataLayer.push({
            event: 'dl_add_to_cart',
            ecommerce: {
                currency: 'USD',
                value: totalValue,
                items: trackingItems
            }
        });

        console.log('Add to Cart event fired for bundle:', trackingItems);
    }

    // Also send directly to platforms if UnifiedTrackingBridge is available
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        const cartData = {
            cartLines: bundleConfig.map(item => ({
                packageId: item.packageId,
                product: {
                    sku: `LORAX-${item.packageId}`,
                    title: `Lorax Pro - ${item.color} - ${item.size}`,
                    image: 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp'
                },
                quantity: 1,
                price: {
                    incl_tax: { value: item.quantityBase === 1 ? 49.95 : (item.quantityBase === 2 ? 44.95 : 39.95) },
                    lineTotal: { value: item.quantityBase === 1 ? 49.95 : (item.quantityBase === 2 ? 44.95 : 39.95) }
                }
            })),
            cartTotals: {
                total: { value: totalValue },
                count: bundleConfig.length
            }
        };

        window.UnifiedTrackingBridge.track.addToCart(cartData);
    }
}

// Checkout Button Handler with SDK Cart Integration
window.addEventListener('next:initialized', function() {
    const checkoutButton = document.querySelector('.pf-lorax-buy-shop-atc-button');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', async function(e) {
            e.preventDefault();

            // Validate before adding to cart
            if (!validateBundleForCheckout()) {
                return false;
            }

            // Clear cart first
            await next.clearCart();
            console.log('Cart cleared');

            // Get bundle configuration (BOGO logic)
            const bundleConfig = [];
            const activeContainers = document.querySelectorAll('.pf-lorax-buy-shop-item-container.active');
            const currentQuantity = activeContainers.length;
            
            // BOGO: First half of items are PAID, second half are FREE
            // B1G1 (2 items): index 0 = PAID, index 1 = FREE
            // B2G2 (4 items): index 0,1 = PAID, index 2,3 = FREE
            const paidCount = Math.ceil(currentQuantity / 2);
            
            // Add each item to cart and await completion
            for (const [index, container] of activeContainers.entries()) {
                const colorSelect = container.querySelector('select[name="color"]');
                const sizeSelect = container.querySelector('select[name="size"]');
                
                if (colorSelect && sizeSelect && colorSelect.value && sizeSelect.value) {
                    const color = colorSelect.value;
                    const size = sizeSelect.value;
                    
                    // Determine if this item is FREE based on position
                    const isFree = index >= paidCount;
                    
                    const packageId = calculatePackageId(color, size, isFree);
                    
                    if (packageId) {
                        console.log(`Adding to cart: ${color} ${size} (Package ID: ${packageId}, isFree: ${isFree})`);
                        
                        try {
                            await next.addItem({
                                packageId: packageId,
                                quantity: 1
                            });
                            console.log(`Successfully added package ${packageId}`);
                            
                            bundleConfig.push({
                                pair: index + 1,
                                color: color,
                                size: size,
                                packageId: packageId,
                                isFree: isFree
                            });
                        } catch (error) {
                            console.error(`Failed to add package ${packageId}:`, error);
                        }
                    }
                }
            }
            
            // AddToCart event is now fired on page load, not on checkout button click

            // Check final cart state
            const finalCartData = next.getCartData();
            console.log('Final cart state:', finalCartData);

            // Small delay to ensure tracking events are fired
            setTimeout(() => {
                // Navigate to checkout with preserved URL parameters
                const checkoutUrl = preserveUrlParameters('/lorax-bogo/c/co01');
                console.log('Navigating to checkout with preserved parameters:', checkoutUrl);
                window.location.href = checkoutUrl;
            }, 100);
        });
    }
});

// Initialize bundle with selection from main page
document.addEventListener('DOMContentLoaded', function() {
    // Get selected quantity from main page
    const selectedQuantity = sessionStorage.getItem('pfLoraxSelectedQuantity');
    const quantity = selectedQuantity ? parseInt(selectedQuantity) : 1;
    
    // Update the pair count display
    const pairCountEl = document.querySelector('.pf-lorax-buy-shop-tb-pc');
    if (pairCountEl) {
        pairCountEl.textContent = quantity;
    }
    
    // Show the correct number of active items based on selection
    const shopItems = document.querySelectorAll('.pf-lorax-buy-shop-item-container');
    shopItems.forEach((item, index) => {
        if (index < quantity) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update pricing based on quantity
    // Note: 4th pair uses same per-pair pricing as 3-pair bundle
    const pricingData = {
        1: { total: 49.95, originalTotal: 99.95, savings: 50 },
        2: { total: 89.90, originalTotal: 199.90, savings: 55 },
        3: { total: 119.85, originalTotal: 299.85, savings: 60 },
        4: { total: 159.80, originalTotal: 399.80, savings: 60 } // 4 pairs at $39.95 each
    };
    
    const pricing = pricingData[quantity];
    if (pricing) {
        const priceMainEl = document.querySelector('.pf-lorax-buy-shop-atc-price-main');
        const priceSuEl = document.querySelector('.pf-lorax-buy-shop-atc-price-su');
        const savingsEl = document.querySelector('.pf-lorax-buy-shop-atc-price-savings');
        
        if (priceMainEl) priceMainEl.textContent = pricing.total.toFixed(2);
        if (priceSuEl) priceSuEl.textContent = pricing.originalTotal.toFixed(2);
        if (savingsEl) savingsEl.textContent = pricing.savings + '%';
    }
    
    console.log(`Bundle initialized for ${quantity} pairs`);

    // Fire AddToCart event on page load with the default bundle configuration
    const bundleConfig = [];
    const activeItems = document.querySelectorAll('.pf-lorax-buy-shop-item-container.active');

    activeItems.forEach((item, index) => {
        const itemNumber = parseInt(item.dataset.item);
        const colorSelect = item.querySelector('select[name="color"]');
        const sizeSelect = item.querySelector('select[name="size"]');

        if (colorSelect && sizeSelect) {
            bundleConfig.push({
                pair: itemNumber,
                color: colorSelect.value,
                size: sizeSelect.value,
                packageId: item.dataset.variant,
                quantityBase: quantity
            });
        }
    });

    // Fire tracking event for the initial bundle configuration
    if (bundleConfig.length > 0) {
        const totalValue = pricing ? pricing.total : 119.85;
        fireAddToCartEvent(bundleConfig, totalValue);
    }
});

// Add Button Functionality for Bundle Items
document.addEventListener('DOMContentLoaded', function() {
    const addButtons = document.querySelectorAll('.pf-lorax-buy-shop-item-ny-add-button');
    
    // Function to update bundle state and pricing
    function updateBundleState() {
        const activeContainers = document.querySelectorAll('.pf-lorax-buy-shop-item-container.active');
        const currentQuantity = activeContainers.length;
        
        // Update the pair count display
        const pairCountEl = document.querySelector('.pf-lorax-buy-shop-tb-pc');
        if (pairCountEl) {
            pairCountEl.textContent = currentQuantity;
        }
        
        // Update pricing based on new quantity
        // Note: 4th pair uses same per-pair pricing as 3-pair bundle
        const pricingData = {
            1: { total: 49.95, originalTotal: 99.95, savings: 50 },
            2: { total: 89.90, originalTotal: 199.90, savings: 55 },
            3: { total: 119.85, originalTotal: 299.85, savings: 60 },
            4: { total: 159.80, originalTotal: 399.80, savings: 60 } // 4 pairs at $39.95 each
        };
        
        const pricing = pricingData[currentQuantity];
        if (pricing) {
            const priceMainEl = document.querySelector('.pf-lorax-buy-shop-atc-price-main');
            const priceSuEl = document.querySelector('.pf-lorax-buy-shop-atc-price-su');
            const savingsEl = document.querySelector('.pf-lorax-buy-shop-atc-price-savings');
            const priceContainer = document.querySelector('.pf-lorax-buy-shop-atc-price');
            const checkoutSection = document.querySelector('.pf-lorax-buy-shop-atc');
            
            // Add price update animation
            if (priceContainer) {
                priceContainer.classList.add('price-updated');
                setTimeout(() => {
                    priceContainer.classList.remove('price-updated');
                }, 400);
            }
            
            // Add animation to checkout section
            if (checkoutSection) {
                checkoutSection.classList.add('price-updated');
                setTimeout(() => {
                    checkoutSection.classList.remove('price-updated');
                }, 500);
            }
            
            if (priceMainEl) priceMainEl.textContent = pricing.total.toFixed(2);
            if (priceSuEl) priceSuEl.textContent = pricing.originalTotal.toFixed(2);
            if (savingsEl) savingsEl.textContent = pricing.savings + '%';
        }
        
        // Update session storage with new quantity
        sessionStorage.setItem('pfLoraxSelectedQuantity', currentQuantity.toString());
        
        // Update step counter text if needed
        const stepTitle = document.querySelector('.pf-lorax-buy-shop-tb-text');
        if (stepTitle) {
            const pairText = currentQuantity === 1 ? 'pair' : 'pairs';
            stepTitle.innerHTML = `Select <span class="pf-lorax-buy-shop-tb-pc">${currentQuantity}</span> ${pairText}`;
        }
        
        console.log(`Bundle updated: ${currentQuantity} pairs active`);
    }
    
    // Function to toggle bundle item state
    function toggleBundleItem(container, activate) {
        if (activate) {
            container.classList.add('active');
            
            // Initialize with default selections if not already set
            const colorSelect = container.querySelector('select[name="color"]');
            const sizeSelect = container.querySelector('select[name="size"]');
            
            if (colorSelect && sizeSelect) {
                // Update size options based on default color
                const extendedSizeColors = ['black', 'white-black', 'white-gray', 'blue', 'orange', 'white-blue'];
                const selectedColor = colorSelect.value;
                const extendedSizeOptions = sizeSelect.querySelectorAll('.extended-size');
                
                extendedSizeOptions.forEach(option => {
                    if (extendedSizeColors.includes(selectedColor)) {
                        option.style.display = '';
                        option.disabled = false;
                    } else {
                        option.style.display = 'none';
                        option.disabled = true;
                    }
                });
                
                // Update product image
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
                
                const productImage = container.querySelector('.pf-lorax-buy-shop-item-conf-product-image');
                if (productImage && colorImageMap[selectedColor]) {
                    productImage.src = colorImageMap[selectedColor];
                }
            }
        } else {
            container.classList.remove('active');
        }
    }
    
    // Add click event listeners to Add buttons
    addButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the parent container
            const container = this.closest('.pf-lorax-buy-shop-item-container');
            if (!container) {
                console.error('Container not found for add button');
                return;
            }
            
            // Check if we've reached the maximum (4 pairs)
            const currentActiveCount = document.querySelectorAll('.pf-lorax-buy-shop-item-container.active').length;
            if (currentActiveCount >= 4) {
                alert('Maximum of 4 pairs allowed in a bundle');
                return;
            }
            
            // Toggle the item to active state
            toggleBundleItem(container, true);
            
            // Add fade-in animation to newly added item
            container.classList.add('just-added');
            setTimeout(() => {
                container.classList.remove('just-added');
            }, 500);
            
            // Update bundle state and pricing
            updateBundleState();
            
            // Log for debugging
            const itemNumber = container.dataset.item;
            console.log(`Added pair ${itemNumber} to bundle`);
            
            // Track analytics event if Next SDK is available
            if (window.nextCampaign && typeof window.nextCampaign.event === 'function') {
                window.nextCampaign.event('bundle_item_added', {
                    item_number: itemNumber,
                    bundle_size: currentActiveCount + 1
                });
            }

            // Fire Add to Cart event for the newly added item
            // Note: This tracks individual additions during bundle configuration
            // Removed individual AddToCart tracking - now fires on page load instead
        });
        
        // Add keyboard accessibility
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Optional: Add Remove functionality for bundle items (for future enhancement)
    function addRemoveButtons() {
        const configuredItems = document.querySelectorAll('.pf-lorax-buy-shop-item-conf');
        
        configuredItems.forEach(item => {
            // Check if remove button already exists
            if (item.querySelector('.pf-lorax-remove-button')) return;
            
            const removeButton = document.createElement('button');
            removeButton.className = 'pf-lorax-remove-button';
            removeButton.innerHTML = '✕ Remove';
            removeButton.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 12px;
                cursor: pointer;
                z-index: 10;
            `;
            
            removeButton.addEventListener('click', function(e) {
                e.preventDefault();
                const container = this.closest('.pf-lorax-buy-shop-item-container');
                if (container) {
                    // Don't remove if it's the last item
                    const activeCount = document.querySelectorAll('.pf-lorax-buy-shop-item-container.active').length;
                    if (activeCount <= 1) {
                        alert('At least one pair must be selected');
                        return;
                    }
                    
                    toggleBundleItem(container, false);
                    updateBundleState();
                    
                    const itemNumber = container.dataset.item;
                    console.log(`Removed pair ${itemNumber} from bundle`);
                }
            });
            
            // Add the remove button to the configured item
            item.style.position = 'relative';
            item.appendChild(removeButton);
        });
    }
    
    // Initialize remove buttons (optional feature)
    // addRemoveButtons();
    
    console.log(`Initialized ${addButtons.length} Add buttons for bundle items`);
});

console.log('Peak Footwear Bundle Page JavaScript with Next SDK integration loaded successfully');