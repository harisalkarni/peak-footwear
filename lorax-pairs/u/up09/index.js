// up09 — Video interstitial page
// No upsell product — navigates to next page after video interaction

// ── VIDEO OVERLAY TOGGLE ──────────────────────────────────────────────────
var muted = true;

function toggleOverlay() {
    var overlay = document.getElementById('videoOverlay');
    var icon    = overlay.querySelector('.mute-icon');
    var txt     = overlay.querySelector('.video-playing-text');

    if (muted) {
        icon.textContent         = '🔊';
        txt.textContent          = 'Your Video Is Playing';
        overlay.style.background = 'rgba(20,160,120,0.15)';
        muted = false;

        // Reveal the continue button after user unmutes (simulates video end)
        showContinueButton();
        console.log('[UP09] Video unmuted — showing continue button');
    } else {
        icon.textContent         = '🔇';
        txt.innerHTML            = 'Your Video Is Playing<br>Click To Unmute';
        overlay.style.background = '';
        muted = true;
        console.log('[UP09] Video muted');
    }
}

function showContinueButton() {
    var wrap = document.getElementById('continueWrap');
    if (wrap) wrap.classList.add('visible');
}

// ── SDK + NAVIGATION ─────────────────────────────────────────────────────
window.addEventListener('next:initialized', function () {
    console.log('[UP09] Next SDK initialized');

    var acceptUrl  = document.querySelector('meta[name="next-upsell-accept-url"]')?.content  || '/lorax-pairs/thank-you';
    var declineUrl = document.querySelector('meta[name="next-upsell-decline-url"]')?.content || '/lorax-pairs/thank-you';

    var continueBtn = document.getElementById('continueBtn');
    var skipLink    = document.getElementById('skipLink');

    // Continue = proceed to next upsell in chain
    if (continueBtn) {
        continueBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('[UP09] Continue clicked — navigating to:', acceptUrl);

            if (window.UnifiedTrackingBridge?.track?.pageView) {
                window.UnifiedTrackingBridge.track.pageView({ page: 'up09-continue' });
            }

            window.location.href = acceptUrl;
        });
    }

    // Skip = go to same next page (no product to decline on this page)
    if (skipLink) {
        skipLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('[UP09] Skip clicked — navigating to:', declineUrl);
            window.location.href = declineUrl;
        });
    }
});
