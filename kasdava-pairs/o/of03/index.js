// Next SDK Integration - Main Page
// Countdown Timer functionality for pf-kasdava sale timer
document.addEventListener("DOMContentLoaded", function () {
    // Set initial time: 4 hours, 19 minutes, 31 seconds
    const totalSeconds = 4 * 3600 + 19 * 60 + 31;
    let remaining = totalSeconds;
    
    // Get all timer elements
    const daysElement = document.querySelector('.pf-kasdava-sale-timer-item-time[data-time="days"]');
    const hoursElement = document.querySelector('.pf-kasdava-sale-timer-item-time[data-time="hours"]');
    const minutesElement = document.querySelector('.pf-kasdava-sale-timer-item-time[data-time="minutes"]');
    const secondsElement = document.querySelector('.pf-kasdava-sale-timer-item-time[data-time="seconds"]');
    
    // Check if all elements exist
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error('Timer elements not found');
        return;
    }
    
    // Function to add animation class
    function animateElement(element) {
        element.classList.add('updating');
        setTimeout(() => {
            element.classList.remove('updating');
        }, 300);
    }
    
    // Function to update the timer display
    const updateTimer = () => {
        // Calculate time units
        const days = Math.floor(remaining / (24 * 3600));
        const hours = Math.floor((remaining % (24 * 3600)) / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        
        // Store previous values for animation
        const prevDays = daysElement.textContent;
        const prevHours = hoursElement.textContent;
        const prevMinutes = minutesElement.textContent;
        const prevSeconds = secondsElement.textContent;
        
        // Format and update display values
        const newDays = String(days).padStart(2, '0');
        const newHours = String(hours).padStart(2, '0');
        const newMinutes = String(minutes).padStart(2, '0');
        const newSeconds = String(seconds).padStart(2, '0');
        
        // Update display and animate changed values
        if (prevDays !== newDays) {
            daysElement.textContent = newDays;
            animateElement(daysElement);
        }
        
        if (prevHours !== newHours) {
            hoursElement.textContent = newHours;
            animateElement(hoursElement);
        }
        
        if (prevMinutes !== newMinutes) {
            minutesElement.textContent = newMinutes;
            animateElement(minutesElement);
        }
        
        if (prevSeconds !== newSeconds) {
            secondsElement.textContent = newSeconds;
            animateElement(secondsElement);
        }
        
        // Decrement remaining time
        if (remaining > 0) {
            remaining--;
        } else {
            // Timer has reached zero
            console.log('Sale timer has ended!');
        }
    };
    
    // Initialize timer display
    updateTimer();
    
    // Update timer every second
    const timerInterval = setInterval(updateTimer, 1000);
    
    console.log('Kasdava countdown timer initialized successfully');
});

// Product Carousel Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Product images for carousel
    const pfKasdavaSliImages = [
        'https://cdn.29next.store/media/peakfootwear/uploads/brown.png',
        'https://cdn.29next.store/media/peakfootwear/uploads/blue.jpg',
        'https://cdn.29next.store/media/peakfootwear/uploads/green.jpg',
        'https://cdn.29next.store/media/peakfootwear/uploads/gray.jpg',
        'https://cdn.29next.store/media/peakfootwear/uploads/pink.jpg',
    ];

    let pfKasdavaSliCurrentIndex = 0;
    const pfKasdavaSliCarouselTrack = document.getElementById('pf-kasdava-sli-carouselTrack');
    const pfKasdavaSliThumbnailsContainer = document.getElementById('pf-kasdava-sli-thumbnailsContainer');
    const pfKasdavaSliPrevBtn = document.getElementById('pf-kasdava-sli-prevBtn');
    const pfKasdavaSliNextBtn = document.getElementById('pf-kasdava-sli-nextBtn');

    // Check if carousel elements exist
    if (!pfKasdavaSliCarouselTrack || !pfKasdavaSliThumbnailsContainer || !pfKasdavaSliPrevBtn || !pfKasdavaSliNextBtn) {
        console.log('Carousel elements not found, skipping carousel initialization');
        return;
    }

    // Initialize carousel with optimized loading
    function pfKasdavaSliInitCarousel() {
        // Create slides
        pfKasdavaSliImages.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'pf-kasdava-sli-carousel-slide';
            
            if (index === 0) {
                // First image loads immediately
                slide.innerHTML = `<img src="${imgSrc}" alt="Sandal ${index + 1}" fetchpriority="high">`;
            } else if (index === 1 || index === 2) {
                // Next two images load eagerly
                slide.innerHTML = `<img src="${imgSrc}" alt="Sandal ${index + 1}">`;
            } else {
                // Remaining images lazy load
                slide.innerHTML = `<img src="${imgSrc}" alt="Sandal ${index + 1}" loading="lazy">`;
            }
            
            pfKasdavaSliCarouselTrack.appendChild(slide);
        });

        // Create thumbnails with progressive loading
        pfKasdavaSliImages.forEach((imgSrc, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'pf-kasdava-sli-thumbnail';
            if (index === 0) thumbnail.classList.add('pf-kasdava-sli-active');
            
            // First 3 thumbnails load immediately, rest lazy load
            const loadingAttr = index < 3 ? '' : 'loading="lazy"';
            thumbnail.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}" ${loadingAttr}>`;
            
            thumbnail.addEventListener('click', () => pfKasdavaSliGoToSlide(index));
            pfKasdavaSliThumbnailsContainer.appendChild(thumbnail);
        });
    }

    // Update carousel position
    function pfKasdavaSliUpdateCarousel() {
        pfKasdavaSliCarouselTrack.style.transform = `translateX(-${pfKasdavaSliCurrentIndex * 100}%)`;
        
        // Update active thumbnail
        document.querySelectorAll('.pf-kasdava-sli-thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('pf-kasdava-sli-active', index === pfKasdavaSliCurrentIndex);
        });

        // Scroll thumbnail into view
        const activeThumbnail = document.querySelector('.pf-kasdava-sli-thumbnail.pf-kasdava-sli-active');
        if (activeThumbnail) {
            activeThumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    // Go to specific slide
    function pfKasdavaSliGoToSlide(index) {
        pfKasdavaSliCurrentIndex = index;
        pfKasdavaSliUpdateCarousel();
    }

    // Next slide
    function pfKasdavaSliNextSlide() {
        pfKasdavaSliCurrentIndex = (pfKasdavaSliCurrentIndex + 1) % pfKasdavaSliImages.length;
        pfKasdavaSliUpdateCarousel();
    }

    // Previous slide
    function pfKasdavaSliPrevSlide() {
        pfKasdavaSliCurrentIndex = (pfKasdavaSliCurrentIndex - 1 + pfKasdavaSliImages.length) % pfKasdavaSliImages.length;
        pfKasdavaSliUpdateCarousel();
    }

    // Event listeners for carousel
    pfKasdavaSliPrevBtn.addEventListener('click', pfKasdavaSliPrevSlide);
    pfKasdavaSliNextBtn.addEventListener('click', pfKasdavaSliNextSlide);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') pfKasdavaSliPrevSlide();
        if (e.key === 'ArrowRight') pfKasdavaSliNextSlide();
    });

    // Touch/swipe support
    let pfKasdavaSliTouchStartX = 0;
    let pfKasdavaSliTouchEndX = 0;

    pfKasdavaSliCarouselTrack.addEventListener('touchstart', (e) => {
        pfKasdavaSliTouchStartX = e.changedTouches[0].screenX;
    });

    pfKasdavaSliCarouselTrack.addEventListener('touchend', (e) => {
        pfKasdavaSliTouchEndX = e.changedTouches[0].screenX;
        pfKasdavaSliHandleSwipe();
    });

    function pfKasdavaSliHandleSwipe() {
        if (pfKasdavaSliTouchEndX < pfKasdavaSliTouchStartX - 50) pfKasdavaSliNextSlide();
        if (pfKasdavaSliTouchEndX > pfKasdavaSliTouchStartX + 50) pfKasdavaSliPrevSlide();
    }

    // Initialize carousel
    pfKasdavaSliInitCarousel();
    
    console.log('Product carousel initialized successfully');
});

// Order Countdown Timer
document.addEventListener("DOMContentLoaded", function () {
    const countdownEl = document.querySelector(".pf-kasdava-pdp-offer-countdown");
    const expiryTextEl = document.querySelector(".pf-kasdava-pdp-offer-expiry-text");
    
    if (countdownEl && expiryTextEl) {
        let timeLeft = 10 * 60; // 10 minutes in seconds
        
        function updateOrderCountdown() {
            if (timeLeft > 0) {
                const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                const seconds = (timeLeft % 60).toString().padStart(2, '0');
                countdownEl.textContent = `${minutes}:${seconds}`;
                timeLeft--;
                setTimeout(updateOrderCountdown, 1000);
            } else {
                // Timer has reached 00:00
                expiryTextEl.innerHTML = '<b>Offer expiring soon!</b>';
            }
        }
        
        updateOrderCountdown();
        console.log('Order countdown timer initialized');
    }
});

// Shipping Date Calculator
document.addEventListener("DOMContentLoaded", function () {
    const dateElement = document.querySelector(".pf-kasdava-pdp-shipping-bar-sb-date");
    
    if (dateElement) {
        // Function to add working days to a date
        function addWorkingDays(date, days) {
            const result = new Date(date);
            let addedDays = 0;
            
            while (addedDays < days) {
                result.setDate(result.getDate() + 1);
                
                // Check if it's a weekend (Saturday = 6, Sunday = 0)
                if (result.getDay() !== 0 && result.getDay() !== 6) {
                    addedDays++;
                }
            }
            
            return result;
        }
        
        // Get date that is 3 working days from now
        const shippingDate = addWorkingDays(new Date(), 3);
        
        const options = { weekday: 'short', day: 'numeric', month: 'long' };
        const formatted = shippingDate.toLocaleDateString('en-GB', options);
        
        // Capitalize first 3 letters of weekday
        const parts = formatted.split(' ');
        parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1, 3);
        dateElement.textContent = parts.join(', ');
        
        console.log('Shipping date calculator initialized');
    }
});

// Social Proof Smooth Scrolling
document.addEventListener('DOMContentLoaded', function() {
    const socialProofLinks = document.querySelectorAll('a.pf-kasdava-pdp-social-proof');
    
    socialProofLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetElement = document.querySelector('div.pf-kasdava-reviews');
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const scrollPosition = targetPosition - 30;
                
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    if (socialProofLinks.length > 0) {
        console.log('Social proof smooth scrolling initialized');
    }
});

// FAQ Accordion Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.pf-kasdava-accordion');
    
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const summary = item.querySelector('summary');
            const content = item.querySelector('.pf-kasdava-accordion__content');
            
            if (summary && content) {
                // Add smooth transition for content
                content.style.transition = 'all 0.3s ease';
                
                // Add keyboard accessibility
                summary.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.hasAttribute('open') ? item.removeAttribute('open') : item.setAttribute('open', '');
                    }
                });
            }
        });
        
        console.log('FAQ accordion functionality initialized');
    }
});

// Sticky CTA Visibility Control
document.addEventListener('DOMContentLoaded', function() {
    const stickyCtaElement = document.getElementById('pf-kasdava-sticky-cta');
    const formSection = document.querySelector('.pf-kasdava-form');
    
    if (stickyCtaElement && formSection) {
        // Create intersection observer to watch the form section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Form is visible - hide sticky CTA
                    stickyCtaElement.classList.remove('visible');
                } else {
                    // Form is not visible - show sticky CTA
                    stickyCtaElement.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        });
        
        observer.observe(formSection);
        
        // Optional: Hide sticky CTA initially if form is already visible
        setTimeout(() => {
            const formRect = formSection.getBoundingClientRect();
            const isFormVisible = formRect.top < window.innerHeight && formRect.bottom > 0;
            
            if (!isFormVisible) {
                stickyCtaElement.classList.add('visible');
            }
        }, 500);
        
        console.log('Sticky CTA visibility control initialized');
    }
});

// Offer Selection Functionality (Informational)
document.addEventListener("DOMContentLoaded", function () {
    const offerItems = document.querySelectorAll('.pf-kasdava-pdp-offer-item');
    const atcButtons = document.querySelectorAll('.pf-kasdava-pdp-atc');
    const priceDisplay = document.querySelector('.pf-kasdava-pdp-atc-price-main');
    const strikethroughPrice = document.querySelector('.pf-kasdava-pdp-atc-price-su');
    
    // Also get sticky CTA price elements
    const stickyPriceDisplay = document.querySelector('.pf-kasdava-pdp-sticky .pf-kasdava-pdp-atc-price-main');
    const stickyStrikethroughPrice = document.querySelector('.pf-kasdava-pdp-sticky .pf-kasdava-pdp-atc-price-su');
    
    // Price mapping for display
    const priceMapping = {
        '1': { price: '$49.95', total: '$49.95', strikethrough: '$99.95' },
        '2': { price: '$44.95', total: '$89.90', strikethrough: '$199.90' },
        '3': { price: '$39.95', total: '$119.85', strikethrough: '$299.85' }
    };
    
    if (offerItems.length > 0) {
        offerItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all items
                offerItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Get quantity from data attribute
                const quantity = this.getAttribute('data-quantity');
                
                // Store selection for bundle page
                sessionStorage.setItem('pfKasdavaSelectedQuantity', quantity);

                // Update prices if elements exist
                if (priceDisplay && strikethroughPrice && priceMapping[quantity]) {
                    priceDisplay.textContent = priceMapping[quantity].total;
                    strikethroughPrice.textContent = priceMapping[quantity].strikethrough;
                }

                // Also update sticky CTA prices
                if (stickyPriceDisplay && stickyStrikethroughPrice && priceMapping[quantity]) {
                    stickyPriceDisplay.textContent = priceMapping[quantity].total;
                    stickyStrikethroughPrice.textContent = priceMapping[quantity].strikethrough;
                }

                console.log(`Selected quantity: ${quantity} - prices updated`);

                // Fire View Content event with new selection
                if (typeof fireViewContentEvent === 'function') {
                    fireViewContentEvent();
                }
            });
        });
        
        console.log('Offer selection functionality initialized');
    }
    
    // CTA buttons store default selection if none made
    atcButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Store default selection (1 pair) if no selection made
            if (!sessionStorage.getItem('pfKasdavaSelectedQuantity')) {
                sessionStorage.setItem('pfKasdavaSelectedQuantity', '1');
            }
            
            console.log('Navigating to bundle page via CTA');
        });
    });
});

// Optional Next SDK Integration for Analytics and Features
window.addEventListener('next:initialized', function() {
    console.log('Next SDK initialized for analytics');

    // Setup FOMO notifications (if desired)
    next.fomo({
        items: [{
          text: "Kasdava Master Barefoot Shoes",
          image: "https://cdn.29next.store/media/peakfootwear/uploads/brown.png"
        }],
        customers: {
          US: ["Sarah from Dallas", "Mike from Boston", "Lisa from Miami"],
          CA: ["Jean from Montreal", "Pierre from Quebec", "Marie from Toronto"]
        },
        maxMobileShows: 3,
        displayDuration: 4000,
        delayBetween: 15000,
        initialDelay: 10000
    });

    // Fire View Content event for the default product configuration
    // Default: 1 pair of Kasdava Master
    fireViewContentEvent();
});

// Function to fire view content event
function fireViewContentEvent() {
    // Get the selected quantity (default to 1 pair)
    const selectedQuantity = sessionStorage.getItem('pfKasdavaSelectedQuantity') || '1';
    const quantity = parseInt(selectedQuantity);

    // Kasdava Master product details
    const productData = {
        id: 'kasdava-master-bundle-' + quantity,
        name: `Kasdava Master Barefoot Shoes (${quantity} Pairs)`,
        category: 'footwear',
        brand: 'Peak Footwear',
        price: quantity === 1 ? 49.95 : (quantity === 2 ? 44.95 : 39.95),
        quantity: quantity,
        sku: 'KASDAVA-PRO-' + quantity,
        image: 'https://cdn.29next.store/media/peakfootwear/uploads/brown.png'
    };

    // Calculate total value
    const totalValue = productData.price * productData.quantity;

    // Fire event through NextDataLayer for unified tracking
    if (window.NextDataLayer) {
        window.NextDataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: totalValue,
                items: [{
                    item_id: productData.id,
                    item_name: productData.name,
                    item_category: productData.category,
                    item_brand: productData.brand,
                    price: productData.price,
                    quantity: productData.quantity,
                    item_sku: productData.sku,
                    item_image: productData.image
                }]
            }
        });

        console.log('View Content event fired for Kasdava Master bundle:', productData);
    }

    // Also send directly to platforms if UnifiedTrackingBridge is available
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        const cartData = {
            cartLines: [{
                packageId: productData.id,
                product: {
                    sku: productData.sku,
                    title: productData.name,
                    image: productData.image
                },
                quantity: productData.quantity,
                price: {
                    incl_tax: { value: productData.price },
                    lineTotal: { value: totalValue }
                }
            }],
            cartTotals: {
                total: { value: totalValue },
                count: productData.quantity
            }
        };

        window.UnifiedTrackingBridge.track.viewItem(cartData);
    }
}

// Accessibility Enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add ARIA labels and roles for carousel
    const galleryNavButtons = document.querySelectorAll('.pf-kasdava-sli-carousel-button');
    galleryNavButtons.forEach(button => {
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        
        if (button.classList.contains('pf-kasdava-sli-prev')) {
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

console.log('Peak Footwear Main Page JavaScript with Next SDK integration loaded successfully');