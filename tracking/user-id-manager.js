/*!
 * User ID Manager for Tracking Pixels
 * Generates and persists a proprietary user identifier for consistent tracking
 * 
 * Per Axon documentation:
 * "The user ID is neither the user's IDFA nor the device ID, but your own proprietary user identifier"
 * 
 * This module provides a consistent user ID across all tracking pixels (Axon, Meta, Triple Whale, etc.)
 */

(function() {
    'use strict';

    const USER_ID_STORAGE_KEY = 'peak_user_id';
    const USER_ID_PREFIX = 'peak_';
    
    /**
     * Generates a new unique user ID
     * Format: peak_TIMESTAMP_RANDOM
     * This ensures the ID is:
     * - Unique across users
     * - At least 6 characters (required by some pixels like Axon)
     * - Proprietary to our system
     */
    function generateUserId() {
        return USER_ID_PREFIX + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * Gets or creates a persistent proprietary user ID
     * Tries localStorage first, falls back to sessionStorage if needed
     */
    function getUserId() {
        // Try to get existing user ID from localStorage
        let userId = null;
        
        try {
            userId = localStorage.getItem(USER_ID_STORAGE_KEY);
        } catch (e) {
            // localStorage might be blocked or unavailable
            console.warn('[UserID Manager] localStorage not available:', e);
        }
        
        // If not in localStorage, try sessionStorage
        if (!userId) {
            try {
                userId = sessionStorage.getItem(USER_ID_STORAGE_KEY);
            } catch (e) {
                console.warn('[UserID Manager] sessionStorage not available:', e);
            }
        }
        
        // Generate new ID if none exists
        if (!userId) {
            userId = generateUserId();
            
            // Try to persist the new ID
            try {
                localStorage.setItem(USER_ID_STORAGE_KEY, userId);
                console.log('[UserID Manager] Generated and stored new user ID in localStorage:', userId);
            } catch (e) {
                // If localStorage fails, try sessionStorage
                try {
                    sessionStorage.setItem(USER_ID_STORAGE_KEY, userId);
                    console.log('[UserID Manager] Generated and stored new user ID in sessionStorage:', userId);
                } catch (e2) {
                    console.warn('[UserID Manager] Could not persist user ID (storage unavailable)');
                }
            }
        }
        
        return userId;
    }
    
    /**
     * Clears the stored user ID (useful for testing or privacy compliance)
     */
    function clearUserId() {
        try {
            localStorage.removeItem(USER_ID_STORAGE_KEY);
            sessionStorage.removeItem(USER_ID_STORAGE_KEY);
            console.log('[UserID Manager] User ID cleared');
        } catch (e) {
            console.warn('[UserID Manager] Error clearing user ID:', e);
        }
    }
    
    /**
     * Gets user information if available from Next Commerce
     * This is separate from the proprietary user ID
     */
    function getUserInfo() {
        if (window.next && typeof window.next.getUser === 'function') {
            return window.next.getUser();
        }
        return null;
    }
    
    // Expose the API globally
    window.UserIDManager = {
        getUserId: getUserId,
        clearUserId: clearUserId,
        getUserInfo: getUserInfo,
        // Expose the storage key for debugging
        STORAGE_KEY: USER_ID_STORAGE_KEY
    };
    
    // Also expose as a CommonJS module if needed
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.UserIDManager;
    }

})();
