// Peak Footwear Landing Page - Lorax Pro

// Countdown Timer for Announcement Bar
document.addEventListener("DOMContentLoaded", function () {
    const totalSeconds = 3 * 3600 + 57 * 60 + 35; // 3h 57m 35s
    let remaining = totalSeconds;
    
    const daysElement = document.querySelector('.pf-lorax-sale-timer-item-time[data-time="days"]');
    const hoursElement = document.querySelector('.pf-lorax-sale-timer-item-time[data-time="hours"]');
    const minutesElement = document.querySelector('.pf-lorax-sale-timer-item-time[data-time="minutes"]');
    const secondsElement = document.querySelector('.pf-lorax-sale-timer-item-time[data-time="seconds"]');
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) return;
    
    function animateElement(element) {
        element.classList.add('updating');
        setTimeout(() => element.classList.remove('updating'), 300);
    }
    
    function updateMainTimer() {
        const days = Math.floor(remaining / (24 * 3600));
        const hours = Math.floor((remaining % (24 * 3600)) / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = remaining % 60;
        
        const newDays = String(days).padStart(2, '0');
        const newHours = String(hours).padStart(2, '0');
        const newMinutes = String(minutes).padStart(2, '0');
        const newSeconds = String(seconds).padStart(2, '0');
        
        if (daysElement.textContent !== newDays) {
            daysElement.textContent = newDays;
            animateElement(daysElement);
        }
        if (hoursElement.textContent !== newHours) {
            hoursElement.textContent = newHours;
            animateElement(hoursElement);
        }
        if (minutesElement.textContent !== newMinutes) {
            minutesElement.textContent = newMinutes;
            animateElement(minutesElement);
        }
        if (secondsElement.textContent !== newSeconds) {
            secondsElement.textContent = newSeconds;
            animateElement(secondsElement);
        }
        
        // Update all other timers on page
        const allTimers = document.querySelectorAll('.btn-timer, #ctaTimer, #heroTimer');
        allTimers.forEach(timer => {
            timer.textContent = `${newHours}:${newMinutes}:${newSeconds}`;
        });
        
        if (remaining > 0) {
            remaining--;
        }
    }
    
    updateMainTimer();
    setInterval(updateMainTimer, 1000);
});

// Hero Carousel
document.addEventListener("DOMContentLoaded", function () {
    const images = [
        'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp',
        'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_2.webp',
        'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_3.webp',
        'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_4.webp',
        'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_5.webp',
    ];

    let currentIndex = 0;
    const carouselTrack = document.getElementById('carouselTrack');
    const thumbnailsContainer = document.getElementById('carouselThumbs');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!carouselTrack || !thumbnailsContainer) return;

    // Initialize carousel
    function initCarousel() {
        // Create slides
        images.forEach((imgSrc, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            const loading = index === 0 ? 'eager' : (index < 3 ? '' : 'loading="lazy"');
            slide.innerHTML = `<img src="${imgSrc}" alt="Lorax Pro ${index + 1}" ${loading}>`;
            carouselTrack.appendChild(slide);
        });

        // Create thumbnails
        images.forEach((imgSrc, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'carousel-thumb';
            if (index === 0) thumbnail.classList.add('active');
            const loading = index < 3 ? '' : 'loading="lazy"';
            thumbnail.innerHTML = `<img src="${imgSrc}" alt="Thumb ${index + 1}" ${loading}>`;
            thumbnail.addEventListener('click', () => goToSlide(index));
            thumbnailsContainer.appendChild(thumbnail);
        });
    }

    function updateCarousel() {
        carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        document.querySelectorAll('.carousel-thumb').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentIndex);
        });

        const activeThumb = document.querySelector('.carousel-thumb.active');
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % images.length;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateCarousel();
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carouselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    });

    initCarousel();
});

// Sticky CTA Visibility
document.addEventListener('DOMContentLoaded', function() {
    const stickyCTA = document.getElementById('sticky-cta');
    const ctaSections = document.querySelectorAll('.cta-section, .hero');
    
    if (!stickyCTA || ctaSections.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        let anyVisible = false;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anyVisible = true;
            }
        });
        
        if (anyVisible) {
            stickyCTA.classList.remove('visible');
        } else {
            stickyCTA.classList.add('visible');
        }
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    ctaSections.forEach(section => observer.observe(section));
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Accordion Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const accordions = document.querySelectorAll('.accordion-item');
    
    accordions.forEach(accordion => {
        const summary = accordion.querySelector('summary');
        if (summary) {
            summary.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    accordion.hasAttribute('open') 
                        ? accordion.removeAttribute('open') 
                        : accordion.setAttribute('open', '');
                }
            });
        }
    });
});

console.log('Peak Footwear Landing Page initialized successfully');


