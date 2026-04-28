# Footer Modals Component

This directory contains a reusable footer modals component for Terms of Service and Privacy Policy across all pages.

## Files

- `footer-modals.js` - The main component file that handles modal HTML injection and functionality

## How It Works

The component automatically:
1. Injects Terms of Service and Privacy Policy modals into any page
2. Sets up click handlers for links with IDs `terms-link` and `privacy-link`
3. Handles opening/closing modals via click, escape key, and outside clicks
4. Prevents body scroll when modal is open

## Usage

Simply include the script in your HTML:

```html
<!-- Footer Modals Component -->
<script src="/components/footer-modals.js"></script>
```

Make sure your footer has the proper link IDs:

```html
<a href="#" id="terms-link">Terms of Service</a>
<a href="#" id="privacy-link">Privacy Policy</a>
```

The CSS for modals should be in your page's CSS file (already added to lorax/index.css, lorax/bundle/index.css, and thank-you/index.css).

## Updating Content

To update the Terms of Service or Privacy Policy text:

1. Open `/components/footer-modals.js`
2. Find the `getModalHTML()` function
3. Edit the content inside the modal divs with IDs:
   - `#terms-content` for Terms of Service
   - `#privacy-content` for Privacy Policy
4. You can copy the full content from `/thank-you/index.html` lines 427-578 which has the complete text

## Pages Using This Component

- `/lorax/index.html`
- `/lorax/bundle/index.html`
- `/thank-you/index.html`
- _(Add more as you implement)_

