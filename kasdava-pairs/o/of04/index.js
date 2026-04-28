// Next Commerce Campaign Integration
const successURL = "/kasdava-pairs/c/co02";

function updateCheckoutLinks() {
  if (typeof campaign !== 'undefined' && campaign.getSuccessUrl) {
    // Campaign SDK is available, use it
    sessionStorage.clear();
    campaign.captureURLParams();
    
    document.querySelectorAll(".go-to-checkout").forEach((a) => {
      a.href = campaign.getSuccessUrl(successURL);
    });
  } else {
    // Fallback: Set links directly (for local testing or if SDK fails)
    const currentParams = window.location.search;
    const checkoutUrl = successURL + currentParams;
    
    document.querySelectorAll(".go-to-checkout").forEach((a) => {
      a.href = checkoutUrl;
    });
  }
}

// Try to update links immediately
updateCheckoutLinks();

// Also update when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateCheckoutLinks);
} else {
  updateCheckoutLinks();
}

// Update again after a short delay to catch late SDK initialization
setTimeout(updateCheckoutLinks, 100);

// Hero slider functionality
const heroSliderDisplay = document.querySelector(".hero-slider--display");
const heroSliderThumbs = document.querySelectorAll(
  ".hero-slider--buttons-thumbs div"
);
const heroSliderImages = document.querySelectorAll(
  ".hero-slider--current-image img"
);

let currentSlideIndex = 0;

const changeHeroSlider = (direction, index) => {
  if (heroSliderDisplay.classList.contains("changing")) return;
  heroSliderDisplay.classList.add("changing");
  setTimeout(() => {
    heroSliderDisplay.classList.remove("changing");
  }, 320);

  let heroImage;

  if (direction) {
    heroSliderImages[currentSlideIndex].classList.remove("active");
    if (direction === "left") {
      currentSlideIndex =
        currentSlideIndex === 0
          ? heroSliderImages.length - 1
          : currentSlideIndex - 1;
    } else if (direction === "right") {
      currentSlideIndex =
        currentSlideIndex === heroSliderImages.length - 1
          ? 0
          : currentSlideIndex + 1;
    }
  } else if (typeof index === "number" && !isNaN(index)) {
    if (currentSlideIndex === index) return;
    heroSliderImages[currentSlideIndex].classList.remove("active");
    currentSlideIndex = index;
  }
  heroImage = heroSliderImages[currentSlideIndex];
  heroSliderDisplay.style.overflow = heroImage.classList.contains("fill")
    ? "hidden"
    : null;
  heroImage.classList.add("active");
};

// Desktop arrow controls
document.querySelector(".hero-slider--arrow-left").onclick = () =>
  changeHeroSlider("left");
document.querySelector(".hero-slider--arrow-right").onclick = () =>
  changeHeroSlider("right");

// Mobile arrow controls
document.querySelector(".hero-slider--arrow-mobile-left").onclick = () =>
  changeHeroSlider("left");
document.querySelector(".hero-slider--arrow-mobile-right").onclick = () =>
  changeHeroSlider("right");

// Thumbnail controls
heroSliderThumbs.forEach((button, i) => {
  button.onclick = () => changeHeroSlider(null, i);
});

// Mobile menu functionality
const mobileMenuOpen = document.querySelector(".mobile-menu-open");
const mobileMenuClose = document.querySelector(".mobile-menu-close");
const mobileMenuCloseTop = document.querySelector(".mobile-menu-close-top");
const navMobile = document.querySelector(".nav-mobile");
const navMobileOverlay = document.querySelector(".nav-mobile-overlay");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

function openMobileMenu() {
  if (navMobile) {
    navMobile.classList.add("open");
    if (navMobileOverlay) navMobileOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeMobileMenu() {
  if (navMobile) {
    navMobile.classList.remove("open");
    if (navMobileOverlay) navMobileOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// Open mobile menu
if (mobileMenuOpen) {
  mobileMenuOpen.addEventListener("click", openMobileMenu);
}

// Close mobile menu - close button in header
if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", closeMobileMenu);
}

// Close mobile menu - top close button (over announcement)
if (mobileMenuCloseTop) {
  mobileMenuCloseTop.addEventListener("click", closeMobileMenu);
}

// Close menu when clicking on overlay
if (navMobileOverlay) {
  navMobileOverlay.addEventListener("click", closeMobileMenu);
}

// Close menu when clicking on links
mobileMenuLinks.forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

const headerEl = document.querySelector("header");

// Handle anchor scroll with offset
function anchorScroll(event) {
  event.preventDefault();
  const targetId = event.target.getAttribute("href").substring(1);
  const targetElement = document.getElementById(targetId);
  const headerOffset = headerEl.offsetHeight;
  const targetPosition =
    targetElement.getBoundingClientRect().top +
    window.scrollY -
    headerOffset;
  window.scrollTo({ top: targetPosition, behavior: "smooth" });
}

// Attach event listeners to anchor links
document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", anchorScroll);
});

// Fixed CTA show/hide on scroll
const ctaButtonsView = document.querySelectorAll(".cta-view");
const fixedCTA = document.querySelector(".fixed-cta");

window.addEventListener("scroll", () => {
  function areButtonsInView() {
    // Check if any button is within the viewport height
    for (var i = 0; i < ctaButtonsView.length; i++) {
      const buttonRect = ctaButtonsView[i].getBoundingClientRect();
      if (
        buttonRect.top >= 0 &&
        buttonRect.left >= 0 &&
        buttonRect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        buttonRect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      ) {
        return true; // At least one button is in view
      }
    }
    return false; // No button is in view
  }
  fixedCTA.classList.toggle("hidden", areButtonsInView());
});

// FAQ accordion functionality
const faqTextElements = document.querySelectorAll(".faq .faq-text div");
let lastFAQTextSelected = { el: faqTextElements[0].parentNode, index: 0 };

// Function to toggle the FAQ items
function toggleFAQItem(input, index) {
  const parentTextElement = faqTextElements[index].parentNode;

  if (
    parentTextElement.style.maxHeight &&
    parentTextElement.style.maxHeight !== "0px"
  ) {
    // Close the item if it's already open
    parentTextElement.style.maxHeight = "0px";
    input.classList.remove("checked");
    lastFAQTextSelected = { el: null, index: -1 }; // Reset last selected item
  } else {
    // Close the previously opened item, if there is one
    if (lastFAQTextSelected.el) {
      lastFAQTextSelected.el.style.maxHeight = "0px";
      document
        .querySelectorAll('.faq input[type="radio"]')
        [lastFAQTextSelected.index].classList.remove("checked");
    }

    // Open the clicked item
    parentTextElement.style.maxHeight =
      faqTextElements[index].clientHeight + 40 + "px";
    input.classList.add("checked");
    lastFAQTextSelected = { el: parentTextElement, index };
  }
}

// Add click event listeners to FAQ inputs
document
  .querySelectorAll('.faq input[type="radio"]')
  .forEach((input, i) => {
    input.addEventListener("click", () => {
      toggleFAQItem(input, i);
    });
  });

const setMaxHeight = () => {
  if (lastFAQTextSelected.el) {
    const maxHeight =
      faqTextElements[lastFAQTextSelected.index].clientHeight + 40 + "px";
    lastFAQTextSelected.el.style.maxHeight = maxHeight;
  }
};

// Adjust FAQ item height on window resize
window.addEventListener("resize", () => {
  setMaxHeight();
});

// Set correct height on page load
window.addEventListener("load", () => {
  setMaxHeight();
});

// Campaign retrieval (if getCampaign function exists)
if (typeof campaign !== 'undefined' && typeof getCampaign !== 'undefined') {
  const retrieveCampaign = campaign.once(getCampaign);
  retrieveCampaign();
}

// Countdown timer functionality (if needed - currently hidden with d-none)
function startCountdown() {
  const endTime = new Date();
  endTime.setHours(23, 59, 59, 999); // Set to midnight

  function updateTimer() {
    const now = new Date();
    const timeLeft = endTime - now;

    if (timeLeft <= 0) {
      // Timer expired
      document.querySelectorAll('.timer').forEach(timer => {
        timer.querySelector('#days').textContent = '00';
        timer.querySelector('#hours').textContent = '00';
        timer.querySelector('#minutes').textContent = '00';
        timer.querySelector('#seconds').textContent = '00';
      });
      return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.querySelectorAll('.timer').forEach(timer => {
      timer.querySelector('#days').textContent = String(days).padStart(2, '0');
      timer.querySelector('#hours').textContent = String(hours).padStart(2, '0');
      timer.querySelector('#minutes').textContent = String(minutes).padStart(2, '0');
      timer.querySelector('#seconds').textContent = String(seconds).padStart(2, '0');
    });

    setTimeout(updateTimer, 1000);
  }

  updateTimer();
}

// Uncomment to activate countdown timer
// startCountdown();

// Doctors slider functionality
const doctorSlides = document.querySelectorAll(".doctor-slide");
const doctorDots = document.querySelectorAll(".doctor-dot");
const doctorPrevBtn = document.querySelector(".doctors-slider-arrow-prev");
const doctorNextBtn = document.querySelector(".doctors-slider-arrow-next");

let currentDoctorSlide = 0;

function changeDoctorSlide(newIndex) {
  // Remove active class from current slide and dot
  doctorSlides[currentDoctorSlide].classList.remove("active");
  doctorDots[currentDoctorSlide].classList.remove("active");
  
  // Update current slide index
  currentDoctorSlide = newIndex;
  
  // Add active class to new slide and dot
  doctorSlides[currentDoctorSlide].classList.add("active");
  doctorDots[currentDoctorSlide].classList.add("active");
}

// Previous button
if (doctorPrevBtn) {
  doctorPrevBtn.addEventListener("click", () => {
    const newIndex = currentDoctorSlide === 0 
      ? doctorSlides.length - 1 
      : currentDoctorSlide - 1;
    changeDoctorSlide(newIndex);
  });
}

// Next button
if (doctorNextBtn) {
  doctorNextBtn.addEventListener("click", () => {
    const newIndex = currentDoctorSlide === doctorSlides.length - 1 
      ? 0 
      : currentDoctorSlide + 1;
    changeDoctorSlide(newIndex);
  });
}

// Dot navigation
doctorDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    changeDoctorSlide(index);
  });
});

