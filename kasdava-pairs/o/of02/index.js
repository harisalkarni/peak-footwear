// Peak Footwear - Kasdava Master Landing Page JavaScript
// Replicating Peak functionality

console.log('Peak Footwear Kasdava Master page JavaScript loaded');

// Stock Counter Animation
document.addEventListener('DOMContentLoaded', function() {
    const stockElements = document.querySelectorAll('.stockAmount');
    
    if (stockElements.length > 0) {
        // Simulate decreasing stock count
        let stockCount = 243;
        
        const updateStock = () => {
            if (stockCount > 150) {
                stockCount--;
                stockElements.forEach(el => {
                    el.textContent = stockCount;
                });
            }
        };
        
        // Update every 3-7 minutes randomly
        const randomInterval = () => {
            const min = 180000; // 3 minutes
            const max = 420000; // 7 minutes
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        
        const scheduleNextUpdate = () => {
            setTimeout(() => {
                updateStock();
                scheduleNextUpdate();
            }, randomInterval());
        };
        
        scheduleNextUpdate();
    }
});

// Countdown Timer (24 hours from page load)
document.addEventListener('DOMContentLoaded', function() {
    const clockdivs = ['clockdiv', 'clockdiv2'];
    
    clockdivs.forEach(clockId => {
        const clockElement = document.getElementById(clockId);
        if (!clockElement) return;
        
        // Set initial time to 24 hours from now
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 24);
        
        function updateCountdown() {
            const now = new Date();
            const distance = endTime - now;
            
            if (distance < 0) {
                clockElement.innerHTML = '<div><span class="hours">00</span><div class="smalltext">Hours</div></div><p>:</p><div><span class="minutes">00</span><div class="smalltext">Mins</div></div><p>:</p><div><span class="seconds">00</span><div class="smalltext">Secs</div></div>';
                return;
            }
            
            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const hoursEl = clockElement.querySelector('.hours');
            const minutesEl = clockElement.querySelector('.minutes');
            const secondsEl = clockElement.querySelector('.seconds');
            
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
    
    console.log('Countdown timers initialized');
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
            
            // Get the panel
            const panel = this.nextElementSibling;
            
            // Toggle panel
            if (panel.classList.contains('active')) {
                panel.classList.remove('active');
            } else {
                // Close all other panels
                document.querySelectorAll('.panel').forEach(p => {
                    p.classList.remove('active');
                });
                
                // Remove active from all accordions
                document.querySelectorAll('.accordion').forEach(acc => {
                    if (acc !== this) {
                        acc.classList.remove('active');
                    }
                });
                
                // Open this panel
                panel.classList.add('active');
            }
        });
    });
    
    console.log('FAQ accordion initialized');
});

// Swiper/Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all swipers on page
    const swipers = document.querySelectorAll('.swiper');
    
    swipers.forEach(swiperEl => {
        const wrapper = swiperEl.querySelector('.swiper-wrapper');
        const slides = swiperEl.querySelectorAll('.swiper-slide');
        const prevBtn = swiperEl.querySelector('.swiper-button-prev');
        const nextBtn = swiperEl.querySelector('.swiper-button-next');
        
        if (!wrapper || slides.length === 0) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        function updateSlider() {
            const offset = -currentSlide * 100;
            wrapper.style.transform = `translateX(${offset}%)`;
            
            // Update button states
            if (prevBtn) {
                prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
                prevBtn.style.pointerEvents = currentSlide === 0 ? 'none' : 'auto';
            }
            
            if (nextBtn) {
                nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.5' : '1';
                nextBtn.style.pointerEvents = currentSlide === totalSlides - 1 ? 'none' : 'auto';
            }
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateSlider();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentSlide < totalSlides - 1) {
                    currentSlide++;
                    updateSlider();
                }
            });
        }
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50 && currentSlide < totalSlides - 1) {
                currentSlide++;
                updateSlider();
            }
            if (touchEndX > touchStartX + 50 && currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        }
        
        updateSlider();
    });
    
    console.log('Swiper sliders initialized');
});

// Floating CTA Visibility
document.addEventListener('DOMContentLoaded', function() {
    const floatingCta = document.getElementById('floating_cta');
    const banner = document.querySelector('.banner');
    
    if (floatingCta && banner) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingCta.classList.remove('visible');
                } else {
                    floatingCta.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -20% 0px'
        });
        
        observer.observe(banner);
        
        console.log('Floating CTA visibility control initialized');
    }
});

// Smooth Scroll for Navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.topMenu a, .scroller a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Analytics - View Content Event
window.addEventListener('load', function() {
    // Fire view content event
    if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
        const productData = {
            cartLines: [{
                packageId: 'kasdava-master-offer',
                product: {
                    sku: 'KASDAVA-PRO-BUNDLE',
                    title: 'Kasdava Master Barefoot Shoes',
                    image: 'https://cdn.29next.store/media/peakfootwear/uploads/brown.png'
                },
                quantity: 1,
                price: {
                    incl_tax: { value: 49.95 },
                    lineTotal: { value: 49.95 }
                }
            }],
            cartTotals: {
                total: { value: 49.95 },
                count: 1
            }
        };
        
        window.UnifiedTrackingBridge.track.viewItem(productData);
        console.log('View Item event fired');
    }
    
    // Fire to data layer as well
    if (window.dataLayer) {
        window.dataLayer.push({
            event: 'dl_view_item',
            ecommerce: {
                currency: 'USD',
                value: 49.95,
                items: [{
                    item_id: 'kasdava-master-bundle',
                    item_name: 'Kasdava Master Barefoot Shoes',
                    item_category: 'footwear',
                    item_brand: 'Peak Footwear',
                    price: 49.95,
                    quantity: 1
                }]
            }
        });
    }
});

// Fire Add to Cart event when CTA buttons are clicked
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.packageBtn, .mobileCta-btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Fire add to cart event
            if (window.UnifiedTrackingBridge && window.UnifiedTrackingBridge.track) {
                const productData = {
                    cartLines: [{
                        packageId: 'kasdava-master-offer',
                        product: {
                            sku: 'KASDAVA-PRO-BUNDLE',
                            title: 'Kasdava Master Barefoot Shoes',
                            image: 'https://cdn.29next.store/media/peakfootwear/uploads/brown.png'
                        },
                        quantity: 1,
                        price: {
                            incl_tax: { value: 49.95 },
                            lineTotal: { value: 49.95 }
                        }
                    }],
                    cartTotals: {
                        total: { value: 49.95 },
                        count: 1
                    }
                };
                
                window.UnifiedTrackingBridge.track.addToCart(productData);
                console.log('Add to Cart event fired');
            }
            
            // Fire to data layer
            if (window.dataLayer) {
                window.dataLayer.push({
                    event: 'dl_add_to_cart',
                    ecommerce: {
                        currency: 'USD',
                        value: 49.95,
                        items: [{
                            item_id: 'kasdava-master-bundle',
                            item_name: 'Kasdava Master Barefoot Shoes',
                            item_category: 'footwear',
                            item_brand: 'Peak Footwear',
                            price: 49.95,
                            quantity: 1
                        }]
                    }
                });
            }
        });
    });
});

console.log('Peak Footwear Kasdava Master page JavaScript initialization complete');

// Modal functionality for Terms of Service and Privacy Policy
(function() {
    // Terms of Service Modal
    const termsModal = document.getElementById('terms-modal');
    const termsLink = document.getElementById('terms-link');
    const termsCloseBtn = document.getElementById('terms-close');
    
    // Privacy Policy Modal
    const privacyModal = document.getElementById('privacy-modal');
    const privacyLink = document.getElementById('privacy-link');
    const privacyCloseBtn = document.getElementById('privacy-close');
    
    if (!termsModal || !termsLink || !privacyModal || !privacyLink) return;
    
    // Open Terms modal
    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Open Privacy modal
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        privacyModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal function
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Close Terms modal
    termsCloseBtn.addEventListener('click', function() {
        closeModal(termsModal);
    });
    
    // Close Privacy modal
    privacyCloseBtn.addEventListener('click', function() {
        closeModal(privacyModal);
    });
    
    // Close modal when clicking outside
    termsModal.addEventListener('click', function(e) {
        if (e.target === termsModal) {
            closeModal(termsModal);
        }
    });
    
    privacyModal.addEventListener('click', function(e) {
        if (e.target === privacyModal) {
            closeModal(privacyModal);
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (termsModal.style.display === 'flex') {
                closeModal(termsModal);
            }
            if (privacyModal.style.display === 'flex') {
                closeModal(privacyModal);
            }
        }
    });
    
    console.log('Footer modal functionality initialized');
})();

