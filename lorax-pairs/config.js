window.dataLayer = window.dataLayer || [];
window.nextReady = window.nextReady || [];

// Auto-generated from src/config.ts
// For production, use your own configuration
window.nextConfig = {
    apiKey: "6AFua4vXCfoDW8QzhquvrDSmdkGcpWyW3E84bVeZ",
    debug: true, // Always true since this file only loads in debug mode
    paymentConfig: {
        expressCheckout: {
            requireValidation: false,
            requiredFields: ['email', 'fname', 'lname']
        }
    },
    addressConfig: {
        defaultCountry: "US",
        showCountries: ["US"],
    },
    googleMaps: {
        apiKey: "AIzaSyBmrv1QRE41P9FhFOTwUhRMGg6LcFH1ehs",
        region: "US",
        enableAutocomplete: true
    },
    tracking: "auto",
    analytics: {
        enabled: false,
        mode: 'auto', // auto | manual | disabled
        providers: {
            nextCampaign: {
                enabled: true
            },
            gtm: {
                enabled: true,
                settings: {
                    containerId: "GTM-KN7HK4XF",
                    dataLayerName: "dataLayer"
                }
            },
            facebook: {
                enabled: true,
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