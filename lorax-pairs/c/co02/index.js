// Olympus MV Selection - Lorax Pro Configuration
// Peak Footwear - Multi-Variant Checkout

// Direct lookup table sourced from peakfootwear.29next.store (product ID 3424)
// Maps color slug + size string → 29next variant ID
const LORAX_VARIANT_IDS = {
    'white-pink': {
        'US Women 6 - US Men 4':              3432,
        'US Women 7 - US Men 5':              3434,
        'US Women 7.5 - US Men 5.5':          3435,
        'US Women 8/8.5 - US Men 6/6.5':      3437,
        'US Women 9/9.5 - US Men 7/7.5':      3439,
        'US Women 10/10.5 - US Men 8/8.5':    3440,
        'US Women 11/11.5 - US Men 9/9.5':    3442,
        'US Women 12/12.5 - US Men 10/10.5':  3444,
        'US Women 13/13.5 - US Men 11/11.5':  3445,
    },
    'white-black': {
        'US Women 6 - US Men 4':              3447,
        'US Women 7 - US Men 5':              3449,
        'US Women 7.5 - US Men 5.5':          3451,
        'US Women 8/8.5 - US Men 6/6.5':      3452,
        'US Women 9/9.5 - US Men 7/7.5':      3454,
        'US Women 10/10.5 - US Men 8/8.5':    3456,
        'US Women 11/11.5 - US Men 9/9.5':    3458,
        'US Women 12/12.5 - US Men 10/10.5':  3460,
        'US Women 13/13.5 - US Men 11/11.5':  3461,
    },
    'white-gray': {
        'US Women 6 - US Men 4':              3463,
        'US Women 7 - US Men 5':              3465,
        'US Women 7.5 - US Men 5.5':          3467,
        'US Women 8/8.5 - US Men 6/6.5':      3469,
        'US Women 9/9.5 - US Men 7/7.5':      3471,
        'US Women 10/10.5 - US Men 8/8.5':    3472,
        'US Women 11/11.5 - US Men 9/9.5':    3474,
        'US Women 12/12.5 - US Men 10/10.5':  3475,
        'US Women 13/13.5 - US Men 11/11.5':  3477,
    },
    'black': {
        'US Women 6 - US Men 4':              3479,
        'US Women 7 - US Men 5':              3481,
        'US Women 7.5 - US Men 5.5':          3483,
        'US Women 8/8.5 - US Men 6/6.5':      3485,
        'US Women 9/9.5 - US Men 7/7.5':      3487,
        'US Women 10/10.5 - US Men 8/8.5':    3489,
        'US Women 11/11.5 - US Men 9/9.5':    3491,
        'US Women 12/12.5 - US Men 10/10.5':  3493,
        'US Women 13/13.5 - US Men 11/11.5':  3495,
        'US Women 14 - US Men 12':            3496,
        'US Women 15 - US Men 13':            3499,
        'US Women 16 - US Men 14':            3501,
    },
    'white-blue': {
        'US Women 6 - US Men 4':              3503,
        'US Women 7 - US Men 5':              3504,
        'US Women 7.5 - US Men 5.5':          3506,
        'US Women 8/8.5 - US Men 6/6.5':      3509,
        'US Women 9/9.5 - US Men 7/7.5':      3511,
        'US Women 10/10.5 - US Men 8/8.5':    3513,
        'US Women 11/11.5 - US Men 9/9.5':    3515,
        'US Women 12/12.5 - US Men 10/10.5':  3517,
        'US Women 13/13.5 - US Men 11/11.5':  3518,
        'US Women 14 - US Men 12':            3520,
        'US Women 15 - US Men 13':            3522,
        'US Women 16 - US Men 14':            3524,
    },
    'blue': {
        'US Women 9/9.5 - US Men 7/7.5':      3525,
        'US Women 10/10.5 - US Men 8/8.5':    3529,
        'US Women 11/11.5 - US Men 9/9.5':    3535,
        'US Women 12/12.5 - US Men 10/10.5':  3539,
        'US Women 13/13.5 - US Men 11/11.5':  3543,
        'US Women 14 - US Men 12':            3547,
        'US Women 15 - US Men 13':            3551,
        'US Women 16 - US Men 14':            3554,
    },
    'orange': {
        'US Women 9/9.5 - US Men 7/7.5':      3557,
        'US Women 10/10.5 - US Men 8/8.5':    3559,
        'US Women 11/11.5 - US Men 9/9.5':    3561,
        'US Women 12/12.5 - US Men 10/10.5':  3564,
        'US Women 13/13.5 - US Men 11/11.5':  3567,
        'US Women 14 - US Men 12':            3571,
        'US Women 15 - US Men 13':            3573,
        'US Women 16 - US Men 14':            3576,
    },
    'pink': {
        'US Women 6 - US Men 4':              3578,
        'US Women 7 - US Men 5':              3581,
        'US Women 7.5 - US Men 5.5':          3583,
        'US Women 8/8.5 - US Men 6/6.5':      3586,
        'US Women 9/9.5 - US Men 7/7.5':      3588,
        'US Women 10/10.5 - US Men 8/8.5':    3591,
        'US Women 11/11.5 - US Men 9/9.5':    3594,
    },
};

function calculatePackageId(color, size, quantity) {
    const colorMap = LORAX_VARIANT_IDS[color];
    if (!colorMap) {
        console.error('Color not found in variant table:', color);
        return null;
    }
    const packageId = colorMap[size];
    if (!packageId) {
        console.error('Size not available for this color:', { color, size });
        return null;
    }
    console.log('Package ID lookup:', { color, size, packageId });
    return packageId;
}

// ============================================
// CONFIGURATION SECTION - LORAX PRO
// ============================================
const CONFIG = {
  // Navigation URLs
  urls: {
    checkoutStep2: '/lorax-pairs/c/co03/', // Billing page after variant selection
  },

  // Product Images by Color (Lorax Pro)
  colors: {
    images: {
      'white-pink': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp',
      'black': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Black.webp',
      'pink': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Pink.webp',
      'white-black': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BW.webp',
      'white-gray': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Gray.webp',
      'blue': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Blue.webp',
      'orange': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Orange.webp',
      'white-blue': 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_BlueW.webp',
    },
    styles: {
      'white-pink': 'linear-gradient(135deg, #FFFFFF 50%, #FFB6C1 50%)',
      'black': '#000000',
      'pink': '#FFB6C1',
      'white-black': 'linear-gradient(135deg, #FFFFFF 50%, #000000 50%)',
      'white-gray': 'linear-gradient(135deg, #FFFFFF 50%, #808080 50%)',
      'blue': '#4A90E2',
      'orange': '#FF8C42',
      'white-blue': 'linear-gradient(135deg, #FFFFFF 50%, #4A90E2 50%)',
    }
  },

  // Discount Configuration
  discounts: {
    base: { 1: 50, 2: 55, 3: 60 }, // Base discount percentages per tier
    exit: 10, // Additional exit discount percentage
    display: {
      1: { base: '50%', withExit: '55%' },
      2: { base: '55%', withExit: '60%' },
      3: { base: '60%', withExit: '65%' }
    }
  },

  // Display Order for Dropdowns (matches backend format)
  displayOrder: {
    sizes: [
      'US Women 6 - US Men 4',
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
    ],
    colors: [
      'White and Pink',
      'Black',
      'Pink',
      'White and Black',
      'White and Gray',
      'Blue',
      'Orange',
      'White and Blue'
    ]
  },

  // Default Selections
  defaults: {
    color: 'white-pink', // Default color
    size: 'US Women 8/8.5 - US Men 6/6.5', // Default size (auto-selected)
  },

  // Exit Intent Configuration
  exitIntent: {
    enabled: false,
    image: 'https://cdn.29next.store/media/peakfootwear/uploads/Lorax_-_Main.webp',
    discountText: '🎉 Extra 10% OFF Applied!',
  },

  // Button Text Configuration
  buttonText: {
    selectVariants: 'Select Color & Size',
    checkout: {
      complete: 'Next',
      incomplete: 'Complete All Selections'
    },
    loading: 'Loading...'
  },

  // Animation Timings (in milliseconds)
  timings: {
    stepTransition: 1000, // Time to show spinner before revealing step 2
    notificationDuration: 5000, // How long notifications stay visible
    errorNotificationDuration: 3000,
    scrollOffset: 100, // Pixels from top when scrolling to elements
  },

  // Notification Styles
  notifications: {
    success: 'background:#28a745;',
    error: 'background:#ff4444;',
    info: 'background:#016a4c;'
  }
};

// ============================================
// END CONFIGURATION SECTION
// ============================================

// Using standard HTML selects - no custom dropdown elements needed

// Main Controller
class TierController {
  constructor() {
    this.currentTier = 1;
    this.selectedVariants = new Map();
    this.productId = null;
    this.baseProductId = null;
    this.exitDiscountActive = false;
    this._cartTimer = null;
    this.init();
  }

  async init() {
    await this._waitForSDK();
    this._setupListeners();
    this._setupBFCacheHandler();

    // Get initial data
    this._getProductId();
    this._bindEvents();

    // Check for forceTier parameter
    this._checkForceTierParam();

    // Always initialize with default state
    this._initState();

    // No session storage - always start fresh
    this.exitDiscountActive = false;

    // Defer heavy operations
    requestAnimationFrame(() => {
      // Always set defaults since we're not checking cart
      this._setDefaultsWithoutCart();

      this._updateSavings();
    });
  }

  _waitForSDK() {
    return new Promise(r => {
      const check = () => window.next?.getCampaignData ? r() : setTimeout(check, 50);
      check();
    });
  }

  _updateTierUI(tier) {
    // Update radio buttons
    const radioButton = document.querySelector(`input[name="quantity"][value="${tier}"]`);
    if (radioButton) {
      radioButton.checked = true;
    }
    
    // Update active class on selector groups
    document.querySelectorAll('.pf-selector-group').forEach(group => {
      const groupTier = +group.getAttribute('data-next-tier');
      group.classList.toggle('active', groupTier === tier);
    });
  }

  _setDefaultsWithoutCart() {
    // Only called when no cart items exist - always start fresh
    const colors = window.next.getAvailableVariantAttributes(this.productId, 'color');
    const sizes = window.next.getAvailableVariantAttributes(this.productId, 'size');

    // Use configured default color
    const defaultColor = colors.find(c =>
      c.toLowerCase().includes(CONFIG.defaults.color.toLowerCase())
    ) || colors[0];

    // Use configured default size if set
    let defaultSize = null;
    if (CONFIG.defaults.size) {
      defaultSize = sizes.find(s =>
        s.toLowerCase().includes(CONFIG.defaults.size.toLowerCase()) ||
        s === CONFIG.defaults.size
      );
    }

    for (let i = 1; i <= this.currentTier; i++) {
      if (!this.selectedVariants.has(i)) {
        this.selectedVariants.set(i, {});
      }

      const v = this.selectedVariants.get(i);

      // Set color to configured default
      v.color = defaultColor;

      // Set size if configured
      if (defaultSize) {
        v.size = defaultSize;
      }

      // Defer UI updates
      requestAnimationFrame(() => {
        this._setSlotDefaults(i);
      });
    }
  }

  _getProductId() {
    const campaign = window.next.getCampaignData();
    
    // For Lorax Pro: All packages share the same product_id
    // Different tiers/quantities have different ref_ids (package IDs) but same product_id
    // We can use any package's product_id for variant attribute lookups
    if (campaign?.packages?.[0]?.product_id) {
      this.productId = campaign.packages[0].product_id;
      this.baseProductId = this.productId;
    }
  }

  _bindEvents() {
    // Handle radio button changes for tier selection
    document.querySelectorAll('input[name="quantity"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const tier = parseInt(e.target.value);
        const selectorGroup = e.target.closest('.pf-selector-group');
        
        // Update active class
        document.querySelectorAll('.pf-selector-group').forEach(group => {
          group.classList.remove('active');
        });
        if (selectorGroup) {
          selectorGroup.classList.add('active');
        }
        
        this.selectTier(tier);
      });
    });
    
    // Also handle clicking on the selector group itself
    document.querySelectorAll('.pf-selector-group').forEach(group => {
      group.addEventListener('click', (e) => {
        const radio = group.querySelector('input[type="radio"]');
        if (radio && !radio.checked) {
          radio.checked = true;
          radio.dispatchEvent(new Event('change'));
        }
      });
    });
    
    // Handle variant select changes (standard HTML selects)
    this._setupVariantListeners();

    // Handle step navigation buttons
    const selectVariantsBtn = document.querySelector('[data-next-action="select-variants"]');
    if (selectVariantsBtn) {
      selectVariantsBtn.onclick = e => {
        e.preventDefault();
        this._handleStepTransition();
      };
    }

    // Handle checkout button
    const checkoutBtn = document.querySelector('[data-next-action="checkout"]');
    if (checkoutBtn) {
      // Set initial state
      this._updateCheckoutButton();

      checkoutBtn.onclick = async e => {
        e.preventDefault();
        if (!this._isComplete()) {
          e.stopPropagation();
          // Optionally highlight incomplete slots
          this._highlightIncompleteSlots();
        } else {
          // Add to cart and redirect
          await this._addToCartAndCheckout();
        }
      };
    }
  }

  _initState() {
    const checkedRadio = document.querySelector('input[name="quantity"]:checked');
    const tier = checkedRadio ? parseInt(checkedRadio.value) : 1;
    this.currentTier = tier;
    
    // Set active class on initial tier
    const activeGroup = document.querySelector(`.pf-selector-group[data-next-tier="${tier}"]`);
    if (activeGroup) {
      activeGroup.classList.add('active');
    }
    
    this._updateSlots(tier);
  }

  _checkForceTierParam() {
    // Check URL for forceTier parameter
    const urlParams = new URLSearchParams(window.location.search);
    const forceTier = urlParams.get('forceTier');

    if (forceTier) {
      const tierNum = parseInt(forceTier, 10);

      // Validate tier is 1, 2, or 3
      if (tierNum >= 1 && tierNum <= 3) {
        // Auto-select the tier
        this.currentTier = tierNum;

        // Update UI to show selected tier
        this._updateTierUI(tierNum);

        // Update slots
        this._updateSlots(tierNum);
      }
    }
  }

  async selectTier(tier, skipCartUpdate = false) {
    if (tier === this.currentTier) return;

    const prev = this.currentTier;
    this.currentTier = tier;

    // Update UI
    this._updateTierUI(tier);
    this._updateSlots(tier);

    // Copy selections from slot 1 to new slots
    if (tier > prev) {
      this._copySelectionsToNewSlots(prev, tier);
    }

    this._updateCTA();
    this._updateCheckoutButton(); // Update checkout button state
  }

  _copySelectionsToNewSlots(fromTier, toTier) {
    const slot1 = this.selectedVariants.get(1);
    if (!slot1?.color) return; // Only need color to be selected

    for (let i = fromTier + 1; i <= toTier; i++) {
      const newSelection = { color: slot1.color };

      // Copy size if slot1 has it (either from config or user selection)
      if (slot1.size) {
        newSelection.size = slot1.size;
      }

      this.selectedVariants.set(i, newSelection);
      this._setSlotDefaults(i);
    }
  }

  _updateSlots(tier) {
    const container = document.querySelector('.pf-lorax-buy-shop-list');
    if (!container) return;

    const template = container.querySelector('[next-tier-slot="1"]');
    
    // Hide slots beyond tier — use setProperty('important') to beat !important CSS rules
    container.querySelectorAll('[next-tier-slot]').forEach(slot => {
      const num = +slot.getAttribute('next-tier-slot');
      if (num > tier) {
        slot.style.setProperty('display', 'none', 'important');
      } else {
        slot.style.removeProperty('display'); // Let CSS (display: flex) take over
        slot.classList.add('active');
      }
    });

    // Create missing slots
    for (let i = 2; i <= tier; i++) {
      if (!container.querySelector(`[next-tier-slot="${i}"]`) && template) {
        const slot = template.cloneNode(true);
        slot.setAttribute('next-tier-slot', i);
        slot.setAttribute('data-item', i);

        // Fix slot number label (cloned from slot 1 which always says "1.")
        const numEl = slot.querySelector('.cs2-slot-number');
        if (numEl) numEl.textContent = i + '.';

        container.appendChild(slot);

        // Setup listeners for the new selects
        this._setupVariantListeners();
      }
    }

    // Set default values for all visible slots
    for (let i = 1; i <= tier; i++) {
      this._setSlotDefaults(i);
    }
  }

  _setSlotDefaults(slotNum) {
    const slot = document.querySelector(`[next-tier-slot="${slotNum}"]`);
    if (!slot) return;

    // Get or create variant entry
    if (!this.selectedVariants.has(slotNum)) {
      this.selectedVariants.set(slotNum, {});
    }

    const v = this.selectedVariants.get(slotNum);
    
    // Get select elements
    const colorSelect = slot.querySelector('select[next-variant-option="color"]');
    const sizeSelect = slot.querySelector('select[next-variant-option="size"]');
    
    // READ the default selected values from HTML and store them
    if (colorSelect) {
      // Priority: stored value → CONFIG default → HTML [selected] attr → first option
      const selectedColor = v.color
        || CONFIG.defaults.color
        || colorSelect.querySelector('option[selected]')?.value
        || colorSelect.options[0]?.value;
      if (selectedColor) {
        v.color = selectedColor;
        colorSelect.value = selectedColor;
        console.log(`Slot ${slotNum} default color set to:`, selectedColor);
        this._updateImage(slot, selectedColor);
        this._updateSizeOptionsForColor(slot, selectedColor);
      }
    }
    
    if (sizeSelect) {
      const selectedSize = sizeSelect.value || sizeSelect.querySelector('option[selected]')?.value;
      if (selectedSize && !v.size) {
        v.size = selectedSize;
        console.log(`Slot ${slotNum} default size set to:`, selectedSize);
      }
      if (v.size) {
        sizeSelect.value = v.size;
      }
    }

    console.log(`Slot ${slotNum} defaults initialized:`, v);
  }

  async activateExitDiscount() {
    if (!CONFIG.exitIntent.enabled) return;
    
    this.exitDiscountActive = true;
    // No session storage - exit discount only active for current session

    this._updateAllPrices();

    // Show success notification
    this._showNotification(CONFIG.exitIntent.discountText, 'success');
  }

  _showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position:fixed;top:20px;left:50%;transform:translateX(-50%);
      ${CONFIG.notifications[type]}color:white;padding:12px 24px;border-radius:8px;
      z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.15);
      font-size:14px;font-weight:500;animation:slideDown 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    const duration = type === 'error' ? 
      CONFIG.timings.errorNotificationDuration : 
      CONFIG.timings.notificationDuration;
    
    setTimeout(() => notification.remove(), duration);
  }

  _setupVariantListeners() {
    // Setup listeners for all variant selects
    document.querySelectorAll('select[next-variant-option]').forEach(select => {
      select.addEventListener('change', (e) => {
        const slot = e.target.closest('[next-tier-slot]');
        if (!slot) return;

        const slotNum = +slot.getAttribute('next-tier-slot');
        const type = e.target.getAttribute('next-variant-option');
        const value = e.target.value;

        console.log(`Variant selected - Slot: ${slotNum}, Type: ${type}, Value: ${value}`);

        if (!this.selectedVariants.has(slotNum)) {
          this.selectedVariants.set(slotNum, {});
        }

        const variants = this.selectedVariants.get(slotNum);
        variants[type] = value;

        console.log(`Updated variants for slot ${slotNum}:`, variants);

        if (type === 'color') {
          this._updateImage(slot, value);
          this._updateSizeOptionsForColor(slot, value);
        }

        this._updateCTA();
        this._updateCheckoutButton();
      });
    });
  }

  // Update size options based on selected color (Orange doesn't have size 6)
  _updateSizeOptionsForColor(slot, color) {
    const sizeSelect = slot.querySelector('select[next-variant-option="size"]');
    if (!sizeSelect) return;

    // Available sizes come directly from the lookup table — single source of truth
    const availableSizes = LORAX_VARIANT_IDS[color] ? Object.keys(LORAX_VARIANT_IDS[color]) : [];
    const slotNum = +slot.getAttribute('next-tier-slot');

    Array.from(sizeSelect.options).forEach(option => {
      const available = availableSizes.includes(option.value);
      option.disabled = !available;
      option.style.display = available ? '' : 'none';
    });

    // If the currently selected size is no longer available, pick the first valid one
    if (!availableSizes.includes(sizeSelect.value)) {
      sizeSelect.value = availableSizes[0] || '';
      if (this.selectedVariants.has(slotNum)) {
        this.selectedVariants.get(slotNum).size = sizeSelect.value;
      }
    }

    console.log('Size options updated for color:', color, '| available:', availableSizes.length);
  }

  // Swatch removed - using standard selects

  _updateImage(slot, color) {
    const img = slot.querySelector('[next-tier-slot-element="image"]');
    if (!img || !color) return;

    const key = color.toLowerCase().replace(/\s+/g, '-');
    const url = CONFIG.colors.images[key];
    if (!url) return;

    if (img.src === url || img.src.endsWith(url)) {
      // Already showing the right image — just make sure it's visible
      img.style.opacity = '1';
      return;
    }

    img.style.opacity = '0.5';
    img.src = url;
    img.onload = () => { img.style.opacity = '1'; };
    // Guard against cached images where onload never fires
    if (img.complete) img.style.opacity = '1';
  }

  async _addToCartAndCheckout() {
    const checkoutBtn = document.querySelector('[data-next-action="checkout"]');
    const loader = checkoutBtn?.querySelector('[data-pb-element="checkout-button-spinner"]');
    const buttonContent = checkoutBtn?.querySelector('[data-pb-element="checkout-button-info"]');

    // Show spinner
    if (loader && buttonContent) {
      loader.style.display = 'flex';
      loader.style.alignItems = 'center';
      loader.style.justifyContent = 'center';
      buttonContent.style.display = 'none';
    }

    try {
      console.log('=== CHECKOUT DEBUG ===');
      console.log('Current tier:', this.currentTier);
      console.log('Selected variants:', this.selectedVariants);

      // Clear existing cart first
      await window.next.clearCart();
      console.log('Cart cleared');

      // Build and add cart items using calculatePackageId
      let itemsAdded = 0;
      for (let i = 1; i <= this.currentTier; i++) {
        const v = this.selectedVariants.get(i);
        console.log(`Slot ${i} variants:`, v);
        
        if (v?.color && v?.size) {
          // Use calculatePackageId function (same as bb01)
          const packageId = calculatePackageId(v.color, v.size, 1);
          console.log(`Slot ${i} calculated package ID:`, packageId);
          
          if (packageId) {
            console.log(`Adding item ${i}:`, { packageId, color: v.color, size: v.size });
            await window.next.addItem({ packageId: packageId, quantity: 1 });
            itemsAdded++;
          } else {
            console.error(`Package ID calculation failed for slot ${i}:`, { color: v.color, size: v.size });
          }
        } else {
          console.error(`Incomplete selection for slot ${i}:`, v);
        }
      }

      console.log(`Total items added: ${itemsAdded}`);

      // Wait for cart to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify cart has items
      const cartData = window.next.getCartData();
      console.log('Cart after adding items:', cartData);
      console.log('Cart count:', window.next.getCartCount());

      if (itemsAdded === 0) {
        throw new Error('No items were added to cart');
      }

      // Redirect to configured checkout URL
      window.location.href = CONFIG.urls.checkoutStep2;
    } catch (error) {
      console.error('Error adding to cart:', error);

      // Hide spinner on error
      if (loader && buttonContent) {
        loader.style.display = 'none';
        buttonContent.style.display = 'block';
      }

      // Show error message
      this._showNotification('Error adding items to cart. Please try again.', 'error');
    }
  }

  // No dropdowns to setup - using standard HTML selects

  // No need for populate dropdowns - using standard HTML selects with hardcoded options

  // OOS availability check removed - not needed

  // Pricing removed - not needed in slots

  // OOS checking removed - not needed

  _updateSavings() {
    // Savings are now hard-coded in the HTML for the tier selection
    // Only update if exit discount is active
    if (this.exitDiscountActive) {
      [1, 2, 3].forEach(tier => {
        const group = document.querySelector(`.pf-selector-group[data-next-tier="${tier}"]`);
        if (group) {
          const savingsEl = group.querySelector('.pf-tier-savings');
          const discounts = CONFIG.discounts.display[tier];
          if (savingsEl && discounts) {
            savingsEl.textContent = `Save ${discounts.withExit}`;
          }
        }
      });
    }
  }

  _updateCTA() {
    const complete = this._isComplete();
    document.querySelector('[data-cta="selection-pending"]')?.classList.toggle('active', !complete);
    document.querySelector('[data-cta="selection-complete"]')?.classList.toggle('active', complete);
  }

  _isComplete() {
    for (let i = 1; i <= this.currentTier; i++) {
      const v = this.selectedVariants.get(i);
      if (!v?.color || !v?.size) return false;
    }
    return true;
  }

  _setupListeners() {
    // Listen for cart changes that might be profile-related
    window.next.on('cart:updated', () => {
      if (this.profileUpdatePending) {
        this.profileUpdatePending = false;
        this._updateAllPrices();
      }
    });
  }

  _setupBFCacheHandler() {
    // Reset spinner state when page is restored from bfcache (back/forward navigation)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        // Page was restored from bfcache
        this._resetCheckoutButtonSpinner();
        this._resetSelectVariantsButtonSpinner();
      }
    });
  }

  _resetCheckoutButtonSpinner() {
    const checkoutBtn = document.querySelector('[data-next-action="checkout"]');
    const loader = checkoutBtn?.querySelector('[data-pb-element="checkout-button-spinner"]');
    const buttonContent = checkoutBtn?.querySelector('[data-pb-element="checkout-button-info"]');

    if (loader && buttonContent) {
      loader.style.display = 'none';
      buttonContent.style.display = 'block';
    }
  }

  _resetSelectVariantsButtonSpinner() {
    const selectVariantsBtn = document.querySelector('[data-next-action="select-variants"]');
    const loader = selectVariantsBtn?.querySelector('[data-next-component="loader"]');
    const buttonContent = selectVariantsBtn?.querySelector('[data-next-component="button-info"]');

    if (loader && buttonContent) {
      loader.style.display = 'none';
      buttonContent.style.display = 'block';
    }
  }

  _onProfileChanged(eventData) {
    // Mark pending update and refresh data
    this.profileUpdatePending = true;
    this._getProductId();

    // Force price updates after a delay
    setTimeout(() => {
      this._updateAllPrices();
      this.profileUpdatePending = false;
    }, 200);
  }

  _updateAllPrices() {
    // Just update savings display
    this._updateSavings();
  }

  _handleStepTransition() {
    const button = document.querySelector('[data-next-action="select-variants"]');
    const loader = button?.querySelector('[data-next-component="loader"]');
    const buttonContent = button?.querySelector('[data-next-component="button-info"]');

    // Show spinner, hide content
    if (loader && buttonContent) {
      loader.style.display = 'flex';
      loader.style.alignItems = 'center';
      loader.style.justifyContent = 'center';
      buttonContent.style.display = 'none';
    }

    // Wait configured time then show step two
    setTimeout(() => {
      // Hide spinner, show content again
      if (loader && buttonContent) {
        loader.style.display = 'none';
        buttonContent.style.display = 'block';
      }

      const stepTwo = document.querySelector('[data-next-component="step-two"]');
      if (stepTwo) {
        // Remove inactive class and add animation class to show step two
        stepTwo.classList.remove('is-inactive');
        stepTwo.classList.add('step-revealed');

        // Re-apply slot defaults NOW that elements are visible — browsers don't
        // reliably commit select.value assignments on display:none containers.
        for (let i = 1; i <= this.currentTier; i++) {
          this._setSlotDefaults(i);
        }

        // Hide the first step's CTA wrapper
        const quantityCTA = document.querySelector('[data-next-component="quantity-cta"]');
        if (quantityCTA) {
          quantityCTA.style.display = 'none';
        }

        // Smooth scroll to step two with configured offset
        setTimeout(() => {
          const elementPosition = stepTwo.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - CONFIG.timings.scrollOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }, CONFIG.timings.stepTransition);
  }

  _updateCheckoutButton() {
    const checkoutBtn = document.querySelector('[data-next-action="checkout"]');
    const buttonText = checkoutBtn?.querySelector('.form-step__button--text');

    if (!checkoutBtn) return;

    if (this._isComplete()) {
      checkoutBtn.classList.remove('next-disabled');
      if (buttonText) {
        buttonText.textContent = CONFIG.buttonText.checkout.complete;
      }
    } else {
      checkoutBtn.classList.add('next-disabled');
      if (buttonText) {
        buttonText.textContent = CONFIG.buttonText.checkout.incomplete;
      }
    }
  }

  _highlightIncompleteSlots() {
    let firstIncomplete = null;

    for (let i = 1; i <= this.currentTier; i++) {
      const v = this.selectedVariants.get(i);
      const slot = document.querySelector(`[next-tier-slot="${i}"]`);

      if (!v?.color || !v?.size) {
        if (!firstIncomplete) firstIncomplete = slot;

        if (slot) {
          // Add visual feedback
          slot.classList.add('error-highlight');
          setTimeout(() => {
            slot.classList.remove('error-highlight');
          }, 2000);
        }
      }
    }

    // Scroll to first incomplete slot
    if (firstIncomplete) {
      firstIncomplete.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  handleVerifyClick() {
    if (!this._isComplete()) {
      for (let i = 1; i <= this.currentTier; i++) {
        const v = this.selectedVariants.get(i);
        if (!v?.color || !v?.size) {
          document.querySelector(`[next-tier-slot="${i}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
          break;
        }
      }
    }
    this._updateCTA();
    return this._isComplete();
  }
  
  // OOS checking completely removed - not needed for this implementation
}

// Progress Bar
class ProgressBar {
  constructor() {
    this.items = document.querySelectorAll('[data-progress]');
    this.sections = document.querySelectorAll('[data-progress-trigger]');
    this.completed = new Set();
    this._init();
  }

  _init() {
    const check = () => {
      const center = window.pageYOffset + window.innerHeight / 2;
      
      this.sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        const bottom = window.pageYOffset + rect.top + rect.height;
        if (center > bottom) {
          this.completed.add(s.getAttribute('data-progress-trigger'));
        }
      });
      
      let active = null;
      for (const s of this.sections) {
        const rect = s.getBoundingClientRect();
        const top = window.pageYOffset + rect.top;
        if (center >= top && center <= top + rect.height) {
          active = s.getAttribute('data-progress-trigger');
          break;
        }
      }
      
      this.items.forEach(item => {
        const name = item.getAttribute('data-progress');
        item.classList.remove('active', 'completed');
        if (this.completed.has(name)) {
          item.classList.add('completed');
        } else if (name === active) {
          item.classList.add('active');
        }
      });
    };
    
    const handleScroll = () => requestAnimationFrame(check);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    check();
  }
}

// No custom elements to register - using standard HTML selects

// Initialize when Next SDK is ready
window.addEventListener('next:initialized', () => {
  window.tierController = new TierController();
  
  const btn = document.querySelector('[os-checkout="verify-step"]');
  if (btn) {
    btn.onclick = e => {
      if (window.tierController && !window.tierController.handleVerifyClick()) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  }
  
  // Exit intent
  if (CONFIG.exitIntent.enabled) {
    window.next.exitIntent({
      image: CONFIG.exitIntent.image,
      action: async () => {
        if (window.tierController) {
          await window.tierController.activateExitDiscount();
        }
      }
    });
  }
});

// Countdown Timer
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-next-element="timer"]').forEach(timer => {
    let [minutes, seconds] = timer.textContent.split(':').map(Number);
    let total = minutes * 60 + seconds;
    setInterval(() => {
      if (total <= 0) return;
      total--;
      const m = Math.floor(total / 60);
      const s = total % 60;
      timer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      if (total === 0) timer.style.color = '#ff4444';
      else if (total <= 60) timer.style.color = '#ff9800';
    }, 1000);
  });
});

// Progress bar initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.progressBar = new ProgressBar();
  });
} else {
  window.progressBar = new ProgressBar();
}

