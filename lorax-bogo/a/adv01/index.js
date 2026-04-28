// ===========================
// Peak Footwear Advertorial Page JavaScript (Simplified)
// a/adv01/index.js
// ===========================

(function() {
  'use strict';

  // ===========================
  // DYNAMIC DATE UPDATE
  // ===========================
  function updatePublishDate() {
    const dateElement = document.getElementById('publish-date');
    const updateDateElement = document.getElementById('update-date');
    
    if (dateElement || updateDateElement) {
      const now = new Date();
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      const formattedDate = now.toLocaleDateString('en-US', options);
      
      if (dateElement) {
        dateElement.textContent = `Published on ${formattedDate}`;
      }
      
      if (updateDateElement) {
        updateDateElement.textContent = formattedDate;
      }
    }
  }

  // ===========================
  // CTA TRACKING HELPER
  // ===========================
  function initCTATracking() {
    const ctaButtons = document.querySelectorAll('[data-cta]');
    
    ctaButtons.forEach(button => {
      button.addEventListener('click', function() {
        const ctaType = this.getAttribute('data-cta');
        const section = this.getAttribute('data-section');
        
        // Log to console in debug mode
        if (window.nextConfig?.debug) {
          console.log('CTA Click:', {
            type: ctaType,
            section: section,
            href: this.href || this.querySelector('a')?.href
          });
        }

        // Fire custom event for additional tracking if needed
        const event = new CustomEvent('peak:cta-click', {
          detail: {
            ctaType: ctaType,
            section: section,
            timestamp: new Date().toISOString()
          }
        });
        window.dispatchEvent(event);
      });
    });
  }

  // ===========================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===========================
  function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's just "#" or empty
        if (!href || href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const navbarHeight = 80; // Account for sticky navbar
          const targetPosition = target.offsetTop - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===========================
  // STICKY CTA VISIBILITY ON SCROLL (ALL DEVICES)
  // ===========================
  function initStickyCTA() {
    const stickyCTA = document.getElementById('stickyCTA');
    if (!stickyCTA) return;
    
    // Find the actual CTA button in the content
    const contentCTA = document.querySelector('.article-cta-button');
    
    const scrollThreshold = 300;
    let ticking = false;
    
  function updateStickyCTA() {
    const scrollY = window.scrollY;
    
    // Show sticky CTA after scroll threshold
    let shouldShow = scrollY > scrollThreshold;
    
    // Hide sticky CTA when user reaches the actual CTA button
    if (contentCTA && shouldShow) {
      const ctaRect = contentCTA.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // If the actual CTA is visible in viewport, hide sticky CTA
      if (ctaRect.top < windowHeight && ctaRect.bottom > 0) {
        shouldShow = false;
      }
    }
    
    // Toggle visible class
    if (shouldShow) {
      stickyCTA.classList.add('visible');
    } else {
      stickyCTA.classList.remove('visible');
    }
    
    ticking = false;
  }
    
    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateStickyCTA);
        ticking = true;
      }
    }
    
    // Initial check
    updateStickyCTA();
    
    // Listen to scroll events
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Listen to resize events
    window.addEventListener('resize', updateStickyCTA);
  }

  // ===========================
  // INITIALIZATION
  // ===========================
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('Peak Footwear Advertorial: Initializing...');

    // Initialize all features
    updatePublishDate();
    initCTATracking();
    initSmoothScroll();
    initStickyCTA();

    // Log success
    console.log('Peak Footwear Advertorial: Initialized successfully');

    // Fire custom ready event
    const readyEvent = new CustomEvent('peak:advertorial-ready', {
      detail: {
        timestamp: new Date().toISOString(),
        page: 'adv01'
      }
    });
    window.dispatchEvent(readyEvent);
  }

  // Start initialization
  init();

  // ===========================
  // EXPOSE PUBLIC API (optional)
  // ===========================
  window.PeakAdvertorial = {
    version: '1.0.0',
    page: 'adv01',
    updateDate: updatePublishDate
  };

})();
