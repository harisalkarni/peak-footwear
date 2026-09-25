window.dataLayer = window.dataLayer || [];
window.nextReady = window.nextReady || [];

// Auto-generated from src/config.ts
// For production, use your own configuration
window.nextConfig = {
    apiKey: "Y95QvMDGe07BxWiBMNOMcVroKw1Iv0JbsJkB9DN8",
    debug: false,
    paymentConfig: {
        expressCheckout: {
            requireValidation: false,
            requiredFields: ['email', 'fname', 'lname']
        }
    },
    addressConfig: {
        defaultCountry: "US",
        // Add or remove country codes below to control which countries appear in checkout.
        // Leave the array empty [] or remove showCountries entirely to show ALL countries.
        showCountries: ["US", "CA", "GB", "AU", "NZ"],
    },
    googleMaps: {
        apiKey: "AIzaSyBmrv1QRE41P9FhFOTwUhRMGg6LcFH1ehs",
        region: "US",
        enableAutocomplete: true
    },
    tracking: "auto",
    // SDK analytics feeds GTM: it pushes dl_* events (one dl_purchase per order,
    // dl_upsell_purchase per accepted upsell) to window.dataLayer. While this is on,
    // the tracking bridge stops pushing its own GA4-style events so GTM sees each
    // order once. The bridge still sends Axon, Upstack and TripleWhale.
    analytics: {
        enabled: true,
        mode: 'auto', // auto | manual | disabled
        providers: {
            nextCampaign: {
                enabled: true
            },
            gtm: {
                enabled: true,
                settings: {
                    containerId: "GTM-WX977KKW", // the SDK pushes to dataLayer; it does not load the container
                    dataLayerName: "dataLayer"
                }
            },
            // Off: nothing sends Meta purchase events on this funnel today, and this pixel ID
            // is not the one in GTM (216245368224726). Turn on once the right pixel is confirmed.
            facebook: {
                enabled: false,
                settings: {
                    pixelId: "915124626650929"
                }
            },
            custom: {
                enabled: false,
                settings: {
                    endpoint: "https://your-analytics.com/track",
                    apiKey: "your-api-key"
                }
            }
        }
    },
    // Axon Pixel Configuration
    axon: {
        enabled: true,
        eventKey: "988e37c1-6022-4fb3-8dd0-c349a1a1c346", // Replace with your actual Axon event key
        currency: "USD",
        enhancedUserIdentification: true,
        categoryMapping: {
            'footwear': 1,
            'apparel': 2,
            'accessories': 3,
            'default': 1
        }
    },
    // Error monitoring removed - add externally via HTML/scripts if needed,
    utmTransfer: {
        enabled: true,
        applyToExternalLinks: false,
        debug: true,
        // excludedDomains: ['example.com', 'test.org'],
        // paramsToCopy: ['utm_source', 'utm_medium']
    }
};