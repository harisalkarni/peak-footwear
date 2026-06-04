// Olympus MV Selection - Lorax Pro Configuration
// Peak Footwear - Multi-Variant Checkout

// ============================================
// DYNAMIC CAMPAIGN PACKAGE MAP
// Built at runtime from window.next.getCampaignData()
// so it always matches whatever campaign is loaded —
// no manual ref_id updates needed when the campaign changes.
// ============================================

// Maps color slug → { size string → campaign package ref_id }
// Populated by buildPackageMapFromCampaign() once the SDK fires 'next:initialized'
const CAMPAIGN_PACKAGE_MAP = {};

// Color display name (as it appears in 29next campaign package names) → slug used in HTML
const COLOR_DISPLAY_TO_SLUG = {
  'white & pink':  'white-pink',
  'white & black': 'white-black',
  'white & gray':  'white-gray',
  'black':         'black',
  'white & blue':  'white-blue',
  'blue':          'blue',
  'orange':        'orange',
  'pink':          'pink',
};

/**
 * Parses every campaign package name and extracts color + size → ref_id.
 * Package names follow the format: "[Campaign Name] - [Color] / [Size]"
 * e.g. "Lorax Pro - White & Pink / US Women 8/8.5 - US Men 6/6.5"
 */
// Live pricing from campaign — populated by buildPackageMapFromCampaign()
const CO02_CAMPAIGN_PRICING = {
  retailPrice: null, // price_retail from campaign package (full retail per pair)
  offerPrice:  null, // price_total from campaign package (tier-1 offer price per pair)
};

function buildPackageMapFromCampaign() {
  const cd = window.next.getCampaignData();
  if (!cd?.packages?.length) {
    console.error('[PackageMap] No packages found in campaign data. Check 29next campaign setup.');
    return;
  }

  let mapped = 0;
  cd.packages.forEach(pkg => {
    // Skip the Special Offer product (13273) — that's an upsell handled by up01, not the main checkout product
    const isSpecialOffer = pkg.product_id === 13273 || pkg.product_id === '13273'
                        || (pkg.name || '').toLowerCase().includes('special offer');
    if (isSpecialOffer) return;

    const name = pkg.name || '';

    // Strip campaign-name prefix: everything up to and including the last " - " before "/"
    // e.g. "My Campaign - White & Pink / US Women 8" → "White & Pink / US Women 8"
    const slashIdx = name.indexOf(' / ');
    if (slashIdx === -1) return;

    // Find the last " - " that appears before the slash
    const prefix = name.substring(0, slashIdx);
    const dashIdx = prefix.lastIndexOf(' - ');
    const colorDisplay = (dashIdx !== -1 ? prefix.substring(dashIdx + 3) : prefix).trim().toLowerCase();
    const size = name.substring(slashIdx + 3).trim();

    const colorSlug = COLOR_DISPLAY_TO_SLUG[colorDisplay];
    if (!colorSlug) {
      console.warn('[PackageMap] Unknown color in package name:', name);
      return;
    }

    if (!CAMPAIGN_PACKAGE_MAP[colorSlug]) CAMPAIGN_PACKAGE_MAP[colorSlug] = {};
    CAMPAIGN_PACKAGE_MAP[colorSlug][size] = pkg.ref_id;

    // Capture retail + offer price from the first successfully mapped package
    if (CO02_CAMPAIGN_PRICING.retailPrice === null) {
      if (pkg.price_retail != null) CO02_CAMPAIGN_PRICING.retailPrice = parseFloat(pkg.price_retail);
      if (pkg.price_total  != null) CO02_CAMPAIGN_PRICING.offerPrice  = parseFloat(pkg.price_total);
    }

    mapped++;
  });

  console.log(`[PackageMap] Built from campaign "${cd.name}" (ID ${cd.id}): ${mapped} packages across ${Object.keys(CAMPAIGN_PACKAGE_MAP).length} colors`);
  console.log('[PackageMap] Campaign pricing:', CO02_CAMPAIGN_PRICING);
  if (mapped === 0) {
    console.error('[PackageMap] Zero packages mapped — check that package names follow the format "[Campaign] - [Color] / [Size]"');
  }

  // Update tier prices in the DOM with live campaign values
  updateTierPricesFromCampaign();
}

/**
 * Updates the three tier price boxes with live prices from the campaign.
 * Uses retail price from campaign + discount % from CONFIG.discounts.base.
 * Falls back gracefully — if campaign pricing is unavailable, HTML values stay.
 */
function updateTierPricesFromCampaign() {
  const retail = CO02_CAMPAIGN_PRICING.retailPrice;
  if (retail === null) {
    console.warn('[PackageMap] No retail price available from campaign — keeping hardcoded HTML prices');
    return;
  }

  [1, 2, 3].forEach(tier => {
    const group = document.querySelector(`.pf-selector-group[data-next-tier="${tier}"]`);
    if (!group) return;

    const discountPct  = CONFIG.discounts.base[tier] / 100;
    const pricePerPair = retail * (1 - discountPct);
    const totalRetail  = retail * tier;
    const saveLabel    = `Save ${CONFIG.discounts.base[tier]}%`;

    // Price per pair (keep the "/ea" sub-span intact)
    const priceEl = group.querySelector('.pf-tier-price');
    if (priceEl) {
      const subSpan = priceEl.querySelector('.pf-tier-price-sub');
      priceEl.textContent = `$${pricePerPair.toFixed(2)}`;
      if (subSpan) priceEl.appendChild(subSpan); // re-attach "/ea" span
    }

    // Total retail (strikethrough original price)
    const originalEl = group.querySelector('.pf-tier-original');
    if (originalEl) originalEl.textContent = `$${totalRetail.toFixed(2)}`;

    // Savings label (only update if exit discount not active — exit discount is handled separately)
    const savingsEl = group.querySelector('.pf-tier-savings');
    if (savingsEl) savingsEl.textContent = saveLabel;
  });

  console.log(`[PackageMap] Tier prices updated from campaign retail $${retail}`);
}

function calculatePackageId(color, size) {
  const colorMap = CAMPAIGN_PACKAGE_MAP[color];
  if (!colorMap) {
    console.error('[PackageMap] Color not found:', color, '| Available:', Object.keys(CAMPAIGN_PACKAGE_MAP));
    return null;
  }
  const packageId = colorMap[size];
  if (!packageId) {
    console.error('[PackageMap] Size not found for color:', { color, size }, '| Available sizes:', Object.keys(colorMap));
    return null;
  }
  console.log('[PackageMap] Resolved:', { color, size, packageId });
  return packageId;
}

// ============================================
// CONFIGURATION SECTION - LORAX PRO - NEXTCOMMERCE
// ============================================
const CONFIG = {
  // Navigation URLs
  urls: {
    checkoutStep2: '/lorax-pairs/c/co03/', // Billing page after variant selection
  },

  // Product Images by Color (Lorax Pro - Nextcommerce, product ID 12939)
  colors: {
    images: {
      'white-pink': 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/12_dc171eb2-b2a4-4fc2-b83b-5529b65376d6.jpg?v=1778051620',
      'white-black': 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/lorax-white-black-side-profile.jpg?v=1778051658',
      'white-gray': 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/lorax-gray-side-profile.jpg?v=1778051658',
      'black': 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/10_4bb3d955-f613-4682-b11a-685a3488f12a.jpg?v=1778051620',
      'white-blue': 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/lorax-blue-side-profile.jpg?v=1778051658',
      'blue': 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/14_d26db72d-07e3-4fa7-a2a3-58c2f052de3c.jpg?v=1778051621',
      'orange': 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/13_041c4c21-a26b-4f09-af3a-7e671be03ccb.jpg?v=1778051621',
      'pink': 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/11_c45e6bc0-f1fc-4700-a4e3-10b6db4cd68b.jpg?v=1778051620',
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
    image: 'https://cdn.shopify.com/s/files/1/0644/6936/9018/files/12_dc171eb2-b2a4-4fc2-b83b-5529b65376d6.jpg?v=1778051620',
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

    // Use configured default color.
    // getAvailableVariantAttributes returns display names like "White & Pink" (with "&").
    // All internal maps (CAMPAIGN_PACKAGE_MAP, CONFIG.colors.images, etc.) are keyed by slug
    // like "white-pink", so we must convert the display name → slug before storing.
    const normalizeColorName = str => str.toLowerCase().replace(/\s*&\s*/g, '-').replace(/\s+/g, '-');
    const defaultColorDisplay = colors.find(c =>
      normalizeColorName(c) === CONFIG.defaults.color.toLowerCase()
    ) || colors[0];
    // Convert display name → slug (e.g. "White & Pink" → "white-pink")
    const defaultColorSlug = COLOR_DISPLAY_TO_SLUG[defaultColorDisplay?.toLowerCase()]
      || CONFIG.defaults.color;

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

      // Store as slug — all downstream functions (_updateSizeOptionsForColor, _updateImage,
      // _updateColorDropdown) expect the slug key, not the SDK display name.
      v.color = defaultColorSlug;

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

    // Use the first package that belongs to the normal Lorax Pro product —
    // skip product 13273 (Special Offer) which is an upsell, not the main checkout product.
    const mainPkg = campaign?.packages?.find(pkg => {
      const isSpecialOffer = pkg.product_id === 13273 || pkg.product_id === '13273'
                          || (pkg.name || '').toLowerCase().includes('special offer');
      return !isSpecialOffer;
    });

    if (mainPkg?.product_id) {
      this.productId = mainPkg.product_id;
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

        // Re-init listeners and color dropdowns for the new slot
        this._setupColorDropdowns();
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
        this._updateColorDropdown(slot, selectedColor);
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

  _setupColorDropdowns() {
    document.querySelectorAll('.cs2-custom-color-select').forEach(dropdown => {
      // Avoid attaching duplicate listeners
      if (dropdown._colorDropdownInit) return;
      dropdown._colorDropdownInit = true;

      const trigger = dropdown.querySelector('.cs2-color-trigger');
      const optionsPanel = dropdown.querySelector('.cs2-color-options');
      const slot = dropdown.closest('[next-tier-slot]');
      const hiddenSelect = slot?.querySelector('select[next-variant-option="color"]');

      if (!trigger || !optionsPanel) return;

      // Toggle open/close on trigger click
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('is-open');
        // Close all other open dropdowns first
        document.querySelectorAll('.cs2-custom-color-select.is-open').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('is-open');
            d.querySelector('.cs2-color-trigger')?.setAttribute('aria-expanded', 'false');
          }
        });
        dropdown.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });

      // Option selection
      optionsPanel.querySelectorAll('.cs2-color-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const value = option.dataset.value;
          const label = option.dataset.label;
          const img   = option.dataset.img;

          // Update trigger appearance
          const triggerImg  = trigger.querySelector('.cs2-color-trigger-img');
          const triggerName = trigger.querySelector('.cs2-color-trigger-name');
          if (triggerImg)  { triggerImg.src = img; triggerImg.alt = label; }
          if (triggerName) triggerName.textContent = label;

          // Mark selected option
          optionsPanel.querySelectorAll('.cs2-color-option').forEach(o => o.classList.remove('is-selected'));
          option.classList.add('is-selected');

          // Sync hidden select and fire change event so existing JS picks it up
          if (hiddenSelect) {
            hiddenSelect.value = value;
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
          }

          // Close dropdown
          dropdown.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // Close any open dropdown when clicking outside
    if (!document._colorDropdownOutsideInit) {
      document._colorDropdownOutsideInit = true;
      document.addEventListener('click', () => {
        document.querySelectorAll('.cs2-custom-color-select.is-open').forEach(d => {
          d.classList.remove('is-open');
          d.querySelector('.cs2-color-trigger')?.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  _updateColorDropdown(slot, colorValue) {
    const dropdown = slot.querySelector('.cs2-custom-color-select');
    if (!dropdown) return;

    const option = dropdown.querySelector(`.cs2-color-option[data-value="${colorValue}"]`);
    if (!option) return;

    const label = option.dataset.label;
    const img   = option.dataset.img;
    const trigger = dropdown.querySelector('.cs2-color-trigger');
    const triggerImg  = trigger?.querySelector('.cs2-color-trigger-img');
    const triggerName = trigger?.querySelector('.cs2-color-trigger-name');

    if (triggerImg)  { triggerImg.src = img; triggerImg.alt = label; }
    if (triggerName) triggerName.textContent = label;

    // Mark correct option as selected
    dropdown.querySelectorAll('.cs2-color-option').forEach(o => {
      o.classList.toggle('is-selected', o.dataset.value === colorValue);
    });
  }

  _setupVariantListeners() {
    // Setup custom image color dropdowns
    this._setupColorDropdowns();

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

    // Available sizes come directly from the campaign package map — single source of truth
    const availableSizes = CAMPAIGN_PACKAGE_MAP[color] ? Object.keys(CAMPAIGN_PACKAGE_MAP[color]) : [];
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

      // Calculate tier-based price per pair
      // Tier 1 = base discount, Tier 2/3 = deeper discount shown in UI
      const retail = CO02_CAMPAIGN_PRICING.retailPrice;
      let tierPrice = null;
      if (retail !== null) {
        const totalDiscountPct = this.exitDiscountActive
          ? (CONFIG.discounts.base[this.currentTier] + CONFIG.discounts.exit) / 100
          : CONFIG.discounts.base[this.currentTier] / 100;
        tierPrice = parseFloat((retail * (1 - totalDiscountPct)).toFixed(2));
      }
      console.log(`[Pricing] Tier ${this.currentTier} price per pair: $${tierPrice} (retail: $${retail}, exit: ${this.exitDiscountActive})`);

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
            // Pass tier-based price so bundle pricing applies regardless of Site Offers
            const addItemParams = { packageId: packageId, quantity: 1 };
            if (tierPrice !== null) addItemParams.price = tierPrice;
            console.log(`Adding item ${i}:`, addItemParams);
            await window.next.addItem(addItemParams);
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
    if (this.exitDiscountActive) {
      // Exit discount active: update savings label + recalculate price using exit discount %
      const retail = CO02_CAMPAIGN_PRICING.retailPrice;
      [1, 2, 3].forEach(tier => {
        const group = document.querySelector(`.pf-selector-group[data-next-tier="${tier}"]`);
        if (!group) return;
        const discounts = CONFIG.discounts.display[tier];
        if (!discounts) return;

        const savingsEl = group.querySelector('.pf-tier-savings');
        if (savingsEl) savingsEl.textContent = `Save ${discounts.withExit}`;

        // Also update price per pair with exit discount applied (if we have live retail)
        if (retail !== null) {
          const exitDiscountPct = (CONFIG.discounts.base[tier] + CONFIG.discounts.exit) / 100;
          const exitPricePerPair = retail * (1 - exitDiscountPct);
          const priceEl = group.querySelector('.pf-tier-price');
          if (priceEl) {
            const subSpan = priceEl.querySelector('.pf-tier-price-sub');
            priceEl.textContent = `$${exitPricePerPair.toFixed(2)}`;
            if (subSpan) priceEl.appendChild(subSpan);
          }
        }
      });
    } else {
      // No exit discount — refresh from campaign pricing (handles profile changes)
      updateTierPricesFromCampaign();
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
  // Build the color+size → ref_id map from live campaign data (must run before TierController)
  buildPackageMapFromCampaign();
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

