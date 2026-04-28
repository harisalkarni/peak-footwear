// Olympus MV Selection - Kasdava Master Configuration
// Peak Footwear - Multi-Variant Checkout

// Package ID Calculator for Kasdava Master Products
// Based on actual JSON package structure from campaign-packages-kasdava-master---1_2_3-pairs.json
function calculatePackageId(color, size, quantity) {
    // Color configuration with actual starting ref_ids and size counts
    // Kasdava Master has 7 colors with 14 sizes each (except Pink with 9 sizes)
    // Package IDs: 1 Pair (1-93), 2 Pairs (94-186), 3 Pairs (187-279)
    const colorConfig = {
        'brown':      { start: 1,  sizes: 14, hasExtended: true },  // 1-14: 5-17 (14 sizes)
        'blue':       { start: 15, sizes: 14, hasExtended: true },  // 15-28: 5-17 (14 sizes)
        'green':      { start: 29, sizes: 14, hasExtended: true },  // 29-42: 5-17 (14 sizes)
        'black':      { start: 43, sizes: 14, hasExtended: true },  // 43-56: 5-17 (14 sizes)
        'dark-blue':  { start: 57, sizes: 14, hasExtended: true },  // 57-70: 5-17 (14 sizes)
        'gray':       { start: 71, sizes: 14, hasExtended: true },  // 71-84: 5-17 (14 sizes)
        'pink':       { start: 85, sizes: 9,  hasExtended: false }  // 85-93: 5-12.5 (9 sizes, no extended)
    };
    
    // Size order - ALL sizes for Kasdava Master (14 sizes total)
    const allSizes = [
        'US Women 5 - US Men 3',           // Index 0
        'US Women 6 - US Men 4',           // Index 1
        'US Women 7 - US Men 5',           // Index 2
        'US Women 7.5 - US Men 5.5',       // Index 3
        'US Women 8/8.5 - US Men 6/6.5',   // Index 4
        'US Women 9/9.5 - US Men 7/7.5',   // Index 5
        'US Women 10/10.5 - US Men 8/8.5', // Index 6
        'US Women 11/11.5 - US Men 9/9.5', // Index 7
        'US Women 12/12.5 - US Men 10/10.5', // Index 8 - Last size for Pink
        'US Women 13/13.5 - US Men 11/11.5', // Index 9 - Extended (not for Pink)
        'US Women 14 - US Men 12',         // Index 10 - Extended (not for Pink)
        'US Women 15 - US Men 13',         // Index 11 - Extended (not for Pink)
        'US Women 16 - US Men 14',         // Index 12 - Extended (not for Pink)
        'US Women 17 - US Men 15'          // Index 13 - Extended (not for Pink)
    ];
    
    const config = colorConfig[color];
    if (!config) {
        console.error('Color not found:', color);
        return null;
    }
    
    const sizeIndex = allSizes.indexOf(size);
    if (sizeIndex === -1) {
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
    
    // Calculate quantity tier offset (93 packages per tier for Kasdava)
    const quantityOffset = (quantity - 1) * 93;
    
    // Final package ID
    const packageId = quantityOffset + config.start + sizeOffset;
    
    console.log('Package ID calculation result:', {
        quantityOffset: quantityOffset,
        colorStart: config.start,
        sizeOffset: sizeOffset,
        finalPackageId: packageId
    });
    
    return packageId;
}

// ============================================
// CONFIGURATION SECTION - KASDAVA MASTER
// ============================================
const CONFIG = {
  // Navigation URLs
  urls: {
    checkoutStep2: '/kasdava-pairs/c/co03/', // Billing page after variant selection
  },

  // Product Images by Color (Kasdava Master)
  colors: {
    images: {
      'brown': 'https://cdn.29next.store/media/peakfootwear/uploads/brown.png',
      'blue': 'https://cdn.29next.store/media/peakfootwear/uploads/blue.jpg',
      'green': 'https://cdn.29next.store/media/peakfootwear/uploads/green.jpg',
      'black': 'https://cdn.29next.store/media/peakfootwear/uploads/black.jpg',
      'dark-blue': 'https://cdn.29next.store/media/peakfootwear/uploads/dark-blue.jpg',
      'gray': 'https://cdn.29next.store/media/peakfootwear/uploads/gray.jpg',
      'pink': 'https://cdn.29next.store/media/peakfootwear/uploads/pink.jpg',
    },
    styles: {
      'brown': '#8B4513',
      'blue': '#4A90E2',
      'green': '#228B22',
      'black': '#000000',
      'dark-blue': '#00008B',
      'gray': '#808080',
      'pink': '#FFB6C1',
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
      'US Women 5 - US Men 3',
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
      'US Women 16 - US Men 14',
      'US Women 17 - US Men 15'
    ],
    colors: [
      'Brown (Almost sold out!)',
      'Blue',
      'Green',
      'Black',
      'Dark Blue',
      'Gray',
      'Pink'
    ]
  },

  // Default Selections
  defaults: {
    color: 'brown', // Default color
    size: 'US Women 8/8.5 - US Men 6/6.5', // Default size (auto-selected)
  },

  // Exit Intent Configuration
  exitIntent: {
    enabled: false,
    image: 'https://cdn.29next.store/media/peakfootwear/uploads/brown.png',
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
    
    // For Kasdava Master: All packages share the same product_id
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
    const container = document.querySelector('.pf-kasdava-buy-shop-list');
    if (!container) return;

    const template = container.querySelector('[next-tier-slot="1"]');
    
    // Hide slots beyond tier
    container.querySelectorAll('[next-tier-slot]').forEach(slot => {
      const num = +slot.getAttribute('next-tier-slot');
      slot.style.display = num > tier ? 'none' : 'block';
      // All slots are always active in bb01 style
      slot.classList.add('active');
    });

    // Create missing slots
    for (let i = 2; i <= tier; i++) {
      if (!container.querySelector(`[next-tier-slot="${i}"]`) && template) {
        const slot = template.cloneNode(true);
        slot.setAttribute('next-tier-slot', i);
        slot.setAttribute('data-item', i);
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
      const selectedColor = colorSelect.value || colorSelect.querySelector('option[selected]')?.value;
      if (selectedColor && !v.color) {
        v.color = selectedColor;
        console.log(`Slot ${slotNum} default color set to:`, selectedColor);
      }
      if (v.color) {
        colorSelect.value = v.color;
        this._updateImage(slot, v.color);
        // Update size options based on color (handles Orange not having size 6, extended sizes, etc.)
        this._updateSizeOptionsForColor(slot, v.color);
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

    // Colors that DON'T have size 6 (US Women 6 - US Men 4)
    const noSize6Colors = ['orange'];
    
    // Kasdava: Colors that have extended sizes (US13/13.5 and above) - Pink does NOT
    const extendedSizeColors = ['brown', 'blue', 'green', 'black', 'dark-blue', 'gray'];

    // Handle size 6
    const size6Option = sizeSelect.querySelector('option[value="US Women 6 - US Men 4"]');
    if (size6Option) {
      if (noSize6Colors.includes(color)) {
        size6Option.style.display = 'none';
        size6Option.disabled = true;
        // If currently selected, reset to a valid option
        if (sizeSelect.value === 'US Women 6 - US Men 4') {
          sizeSelect.value = 'US Women 8/8.5 - US Men 6/6.5';
          // Update stored value
          const slotNum = +slot.getAttribute('next-tier-slot');
          if (this.selectedVariants.has(slotNum)) {
            this.selectedVariants.get(slotNum).size = 'US Women 8/8.5 - US Men 6/6.5';
          }
        }
      } else {
        size6Option.style.display = '';
        size6Option.disabled = false;
      }
    }

    // Handle extended sizes (US15-16)
    const extendedSizeOptions = sizeSelect.querySelectorAll('.extended-size');
    extendedSizeOptions.forEach(option => {
      if (extendedSizeColors.includes(color)) {
        option.style.display = '';
        option.disabled = false;
      } else {
        option.style.display = 'none';
        option.disabled = true;
        // If currently selected, reset to a valid option
        if (option.selected) {
          sizeSelect.value = 'US Women 8/8.5 - US Men 6/6.5';
          const slotNum = +slot.getAttribute('next-tier-slot');
          if (this.selectedVariants.has(slotNum)) {
            this.selectedVariants.get(slotNum).size = 'US Women 8/8.5 - US Men 6/6.5';
          }
        }
      }
    });

    console.log('Size options updated for color:', color);
  }

  // Swatch removed - using standard selects

  _updateImage(slot, color) {
    const img = slot.querySelector('[next-tier-slot-element="image"]');
    if (!img || !color) return;

    // Use configured color images
    const key = color.toLowerCase().replace(/\s+/g, '-');
    if (CONFIG.colors.images[key]) {
      img.style.opacity = '0.5';
      img.src = CONFIG.colors.images[key];
      img.onload = () => img.style.opacity = '1';
    }
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

