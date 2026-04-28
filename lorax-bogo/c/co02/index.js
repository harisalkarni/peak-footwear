// Olympus MV Selection - Lorax Pro BOGO Configuration
// Peak Footwear - Multi-Variant Checkout - BOGO VERSION
//
// BOGO LOGIC:
// - Package IDs 1-91: Lorax Pro products at PAID price ($69.95, retail $139.90)
// - Package IDs 92-182: Lorax Pro products at FREE price ($0, retail $139.90)
// 
// B1G1 (Buy 1 Get 1 Free): 2 products total - 1 paid (1-91) + 1 free (92-182)
// B2G2 (Buy 2 Get 2 Free): 4 products total - 2 paid (1-91) + 2 free (92-182)
// B3G3 (Buy 3 Get 3 Free): 6 products total - 3 paid (1-91) + 3 free (92-182) [SOLD OUT]

// Package ID Calculator for Lorax Pro Products (BOGO VERSION)
// ACCURATE COLOR BREAKDOWN (verified against campaign data):
// - white-pink:  10 sizes (ref 1-10 paid,  92-101 free) - US Women 6-14
// - black:       12 sizes (ref 11-22 paid, 102-113 free) - US Women 6-16
// - pink:        10 sizes (ref 23-32 paid, 114-123 free) - US Women 6-14
// - white-black: 12 sizes (ref 33-44 paid, 124-135 free) - US Women 6-16
// - white-gray:  12 sizes (ref 45-56 paid, 136-147 free) - US Women 6-16
// - blue:        12 sizes (ref 57-68 paid, 148-159 free) - US Women 6-16
// - orange:      11 sizes (ref 69-79 paid, 160-170 free) - US Women 7-16 (NO US Women 6!)
// - white-blue:  12 sizes (ref 80-91 paid, 171-182 free) - US Women 6-16
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

// ============================================
// CONFIGURATION SECTION - LORAX PRO
// ============================================
const CONFIG = {
  // Navigation URLs
  urls: {
    checkoutStep2: '/lorax-bogo/c/co03/', // Billing page after variant selection
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

  // Display Order for Dropdowns
  displayOrder: {
    sizes: [
      'US6 Women / US4 Men',
      'US7 Women / US5 Men',
      'US8 Women / US6 Men',
      'US9 Women / US7 Men',
      'US10 Women / US8 Men',
      'US11 Women / US9 Men',
      'US12 Women / US10 Men',
      'US13 Women / US11 Men',
      'US14 Women / US12 Men',
      'US15 Women / US13 Men',
      'US16 Women / US14 Men'
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
    size: 'US8 Women / US6 Men', // Default size (auto-selected)
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

// Main Controller (BOGO Version)
class TierController {
  constructor() {
    this.bogoType = 'b1g1'; // 'b1g1' or 'b3g1'
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

  _updateBogoUI(bogoType) {
    // Update radio buttons
    const radioButton = document.querySelector(`input[name="bogo"][value="${bogoType}"]`);
    if (radioButton) {
      radioButton.checked = true;
    }
    
    // Update active class on selector groups
    document.querySelectorAll('.pf-selector-group').forEach(group => {
      const groupType = group.getAttribute('data-bogo-type');
      group.classList.toggle('active', groupType === bogoType);
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

    // Get total slots based on BOGO type
    const totalSlots = this._getTotalSlots();
    
    for (let i = 1; i <= totalSlots; i++) {
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
  
  _getTotalSlots() {
    // B1G1 = 2 products, B2G2 = 4 products, B3G3 = 6 products
    const slotMap = {
      'b1g1': 2,
      'b2g2': 4,
      'b3g3': 6
    };
    return slotMap[this.bogoType] || 2;
  }
  
  _getPaidSlots() {
    // Half of total slots are paid, half are free
    return this._getTotalSlots() / 2;
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
    // Handle radio button changes for BOGO selection
    document.querySelectorAll('input[name="bogo"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const bogoType = e.target.value;  // 'b1g1', 'b2g2', or 'b3g3'
        const selectorGroup = e.target.closest('.pf-selector-group');
        
        // Prevent selection of disabled options
        if (radio.disabled) {
          e.preventDefault();
          return;
        }
        
        // Update active class
        document.querySelectorAll('.pf-selector-group').forEach(group => {
          group.classList.remove('active');
        });
        if (selectorGroup) {
          selectorGroup.classList.add('active');
        }
        
        this.selectBogoType(bogoType);
      });
    });
    
    // Also handle clicking on the selector group itself (except sold out)
    document.querySelectorAll('.pf-selector-group').forEach(group => {
      group.addEventListener('click', (e) => {
        // Don't allow clicking sold out options
        if (group.classList.contains('pf-sold-out')) {
          return;
        }
        
        const radio = group.querySelector('input[type="radio"]');
        if (radio && !radio.checked && !radio.disabled) {
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
    const checkedRadio = document.querySelector('input[name="bogo"]:checked');
    const bogoType = checkedRadio ? checkedRadio.value : 'b1g1';
    this.bogoType = bogoType;
    
    // Set active class on initial BOGO type
    const activeGroup = document.querySelector(`.pf-selector-group[data-bogo-type="${bogoType}"]`);
    if (activeGroup) {
      activeGroup.classList.add('active');
    }
    
    this._updateSlots(bogoType);
  }

  _checkForceTierParam() {
    // Check URL for forceBogo parameter
    const urlParams = new URLSearchParams(window.location.search);
    const forceBogo = urlParams.get('forceBogo');

    if (forceBogo && ['b1g1', 'b2g2', 'b3g3'].includes(forceBogo)) {
      // Auto-select the BOGO type
      this.bogoType = forceBogo;

      // Update UI to show selected BOGO type
      this._updateBogoUI(forceBogo);

      // Update slots
      this._updateSlots(forceBogo);
    }
  }

  async selectBogoType(bogoType, skipCartUpdate = false) {
    if (bogoType === this.bogoType) return;

    const prev = this.bogoType;
    this.bogoType = bogoType;

    // Update UI
    this._updateBogoUI(bogoType);
    this._updateSlots(bogoType);

    // Copy selections from slot 1 to new slots if switching to larger size
    const slotMap = { 'b1g1': 2, 'b2g2': 4, 'b3g3': 6 };
    const prevSlots = slotMap[prev] || 2;
    const newSlots = slotMap[bogoType] || 2;
    
    if (newSlots > prevSlots) {
      this._copySelectionsToNewSlots(prevSlots, newSlots);
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

  _updateSlots(bogoType) {
    const container = document.querySelector('.pf-lorax-buy-shop-list');
    if (!container) return;

    const template = container.querySelector('[next-tier-slot="1"]');
    const totalSlots = this._getTotalSlots();
    
    // Hide slots beyond what we need
    container.querySelectorAll('[next-tier-slot]').forEach(slot => {
      const num = +slot.getAttribute('next-tier-slot');
      slot.style.display = num > totalSlots ? 'none' : 'block';
      // All slots are always active in bb01 style
      slot.classList.add('active');
    });

    // Create missing slots
    for (let i = 2; i <= totalSlots; i++) {
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
    for (let i = 1; i <= totalSlots; i++) {
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
        }

        this._updateCTA();
        this._updateCheckoutButton();
      });
    });
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
      console.log('=== BOGO CHECKOUT DEBUG ===');
      console.log('BOGO Type:', this.bogoType);
      console.log('Selected variants:', this.selectedVariants);

      // Clear existing cart first
      await window.next.clearCart();
      console.log('Cart cleared');

      const totalSlots = this._getTotalSlots();
      const paidSlots = this._getPaidSlots();  // Half are paid
      const freeSlots = paidSlots;  // Half are free
      
      console.log(`BOGO Type: ${this.bogoType} - Total slots: ${totalSlots}, Paid: ${paidSlots}, Free: ${freeSlots}`);

      // Build and add cart items
      let itemsAdded = 0;
      
      // Add PAID products first (first half of slots)
      for (let i = 1; i <= paidSlots; i++) {
        const v = this.selectedVariants.get(i);
        console.log(`Slot ${i} (PAID) variants:`, v);
        
        if (v?.color && v?.size) {
          // Calculate PAID package ID (isFree = false)
          const packageId = calculatePackageId(v.color, v.size, false);
          console.log(`Slot ${i} (PAID) calculated package ID:`, packageId);
          
          if (packageId) {
            console.log(`Adding PAID item ${i}:`, { packageId, color: v.color, size: v.size });
            await window.next.addItem({ packageId: packageId, quantity: 1 });
            itemsAdded++;
          } else {
            console.error(`Package ID calculation failed for PAID slot ${i}:`, { color: v.color, size: v.size });
          }
        } else {
          console.error(`Incomplete selection for PAID slot ${i}:`, v);
        }
      }
      
      // Add FREE products (second half of slots)
      for (let i = paidSlots + 1; i <= totalSlots; i++) {
        const freeV = this.selectedVariants.get(i);
        console.log(`Slot ${i} (FREE) variants:`, freeV);
        
        if (freeV?.color && freeV?.size) {
          // Calculate FREE package ID (isFree = true) - adds +91 offset
          const freePackageId = calculatePackageId(freeV.color, freeV.size, true);
          console.log(`Slot ${i} (FREE) calculated package ID:`, freePackageId);
          
          if (freePackageId) {
            console.log(`Adding FREE item ${i}:`, { packageId: freePackageId, color: freeV.color, size: freeV.size });
            await window.next.addItem({ packageId: freePackageId, quantity: 1 });
            itemsAdded++;
          } else {
            console.error(`Package ID calculation failed for FREE slot ${i}:`, { color: freeV.color, size: freeV.size });
          }
        } else {
          console.error(`Incomplete selection for FREE slot ${i}:`, freeV);
        }
      }

      console.log(`Total items added: ${itemsAdded} (Expected: ${totalSlots})`);

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
    // BOGO savings are hard-coded in the HTML
    // No dynamic savings update needed for BOGO offers
    // Exit discount not applicable to BOGO
  }

  _updateCTA() {
    const complete = this._isComplete();
    document.querySelector('[data-cta="selection-pending"]')?.classList.toggle('active', !complete);
    document.querySelector('[data-cta="selection-complete"]')?.classList.toggle('active', complete);
  }

  _isComplete() {
    const totalSlots = this._getTotalSlots();
    for (let i = 1; i <= totalSlots; i++) {
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
    const totalSlots = this._getTotalSlots();

    for (let i = 1; i <= totalSlots; i++) {
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
      const totalSlots = this._getTotalSlots();
      for (let i = 1; i <= totalSlots; i++) {
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

