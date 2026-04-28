// ===========================
// Peak Footwear - 10 Reasons Advertorial Page JavaScript
// a/adv02/index.js
// ===========================

(function() {
  'use strict';

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
          const targetPosition = target.offsetTop;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ===========================
  // STICKY CTA VISIBILITY ON SCROLL
  // ===========================
  function initStickyCTA() {
    const stickyCTA = document.getElementById('stickyCTA');
    if (!stickyCTA) return;
    
    // Find the main CTA section in the content
    const mainCTA = document.querySelector('.main-cta-section');
    
    const scrollThreshold = 500;
    let ticking = false;
    
    function updateStickyCTA() {
      const scrollY = window.scrollY;
      
      // Show sticky CTA after scroll threshold
      let shouldShow = scrollY > scrollThreshold;
      
      // Hide sticky CTA when user reaches the main CTA button
      if (mainCTA && shouldShow) {
        const ctaRect = mainCTA.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // If the main CTA is visible in viewport, hide sticky CTA
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
  // SIDEBAR STICKY BEHAVIOR
  // ===========================
  function initSidebarSticky() {
    const sidebar = document.querySelector('.sidebar-sticky');
    if (!sidebar) return;

    // Calculate if sidebar should stick
    function updateSidebarPosition() {
      const mainContent = document.querySelector('.main-content');
      if (!mainContent) return;

      const mainContentHeight = mainContent.offsetHeight;
      const sidebarHeight = sidebar.offsetHeight;
      
      // Only make it sticky if sidebar is shorter than main content
      if (sidebarHeight < mainContentHeight) {
        sidebar.style.position = 'sticky';
        sidebar.style.top = '0';
      } else {
        sidebar.style.position = 'relative';
      }
    }

    // Initial update
    updateSidebarPosition();
    
    // Update on window resize
    window.addEventListener('resize', updateSidebarPosition);
  }

  // ===========================
  // EXTERNAL LINK HANDLING
  // ===========================
  function initExternalLinks() {
    // Add target="_blank" to external links
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      // Check if it's truly external (not same domain)
      if (href && !href.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  // ===========================
  // LAZY LOAD IMAGES
  // ===========================
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
            }
            
            observer.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
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

    console.log('Peak Footwear 10 Reasons: Initializing...');

    // Initialize all features
    initCTATracking();
    initSmoothScroll();
    initStickyCTA();
    initSidebarSticky();
    initExternalLinks();
    initLazyLoading();

    // Log success
    console.log('Peak Footwear 10 Reasons: Initialized successfully');

    // Fire custom ready event
    const readyEvent = new CustomEvent('peak:advertorial-ready', {
      detail: {
        timestamp: new Date().toISOString(),
        page: 'adv02'
      }
    });
    window.dispatchEvent(readyEvent);
  }

  // Start initialization
  init();

  // ===========================
  // EXPOSE PUBLIC API (optional)
  // ===========================
  window.PeakAdvertorial = window.PeakAdvertorial || {};
  window.PeakAdvertorial.adv02 = {
    version: '1.0.0',
    page: 'adv02'
  };

})();

