
/* MELLY ENGINEERING — Interactive features */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// Footer year
$("#currentYear").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Search and category filtering
const searchInput = $("#searchInput");
const searchButton = $("#searchButton");
const cards = $$(".engineering-card");
const filterButtons = $$(".filter-btn");
const emptyState = $("#emptyState");

let activeFilter = "all";

function filterCards() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const category = card.dataset.category;
    const searchableText = (
      card.dataset.search + " " + card.textContent
    ).toLowerCase();

    const matchesCategory =
      activeFilter === "all" || category === activeFilter;

    const matchesSearch = searchableText.includes(query);
    const visible = matchesCategory && matchesSearch;

    card.hidden = !visible;

    if (visible) visibleCount++;
  });

  emptyState.hidden = visibleCount !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    filterCards();
  });
});

searchInput.addEventListener("input", filterCards);
searchButton.addEventListener("click", filterCards);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") filterCards();
});

// Cinematic hero slideshow
const hero = $(".hero");
const slideDots = $$(".slide-dot");

const heroImages = [
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=2200&q=90",
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=2200&q=90"
];

let currentSlide = 0;
let slideshowTimer;

function showSlide(index) {
  currentSlide = (index + heroImages.length) % heroImages.length;

  hero.style.backgroundImage =
    `url("${heroImages[currentSlide]}")`;

  slideDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
    dot.setAttribute("aria-current",
      i === currentSlide ? "true" : "false");
  });
}

function startHeroSlideshow() {
  clearInterval(slideshowTimer);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  slideshowTimer = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 6000);
}

slideDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.slide));
    startHeroSlideshow();
  });
});

startHeroSlideshow();

// Engineering challenge
const challengeButton = $("#challengeButton");
const challengeBox = $("#challengeBox");
const challengeFeedback = $("#challengeFeedback");

challengeButton.addEventListener("click", () => {
  challengeBox.hidden = !challengeBox.hidden;
  challengeButton.textContent = challengeBox.hidden
    ? "Try a challenge ↗"
    : "Hide challenge ↑";
});

$$(".answer-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.answer === "2") {
      challengeFeedback.textContent =
        "Correct! Ohm's law: I = V / R = 12 / 6 = 2 A.";
    } else {
      challengeFeedback.textContent =
        "Not quite. Use Ohm's law: I = V / R. Try again!";
    }
  });
});

// Gallery image viewer
const galleryItems = $$(".gallery-item");
const imageViewer = $("#imageViewer");
const viewerImage = $("#viewerImage");
const downloadImage = $("#downloadImage");
const galleryStatus = $("#galleryStatus");

let currentImageIndex = 0;
let gallerySlideshowTimer = null;
const favourites = new Set();

function getImageUrl(index) {
  return galleryItems[index].dataset.image;
}

function showGalleryImage(index, openViewer = false) {
  currentImageIndex =
    (index + galleryItems.length) % galleryItems.length;

  const imageUrl = getImageUrl(currentImageIndex);

  viewerImage.src = imageUrl;
  viewerImage.alt =
    galleryItems[currentImageIndex].querySelector("img").alt;

  // Opens the full image in a new tab; does not promise a direct download.
  downloadImage.href = imageUrl;

  galleryStatus.textContent =
    `Image ${currentImageIndex + 1} of ${galleryItems.length}`;

  updateFavouriteButton();

  if (openViewer && !imageViewer.open) {
    imageViewer.showModal();
  }
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    showGalleryImage(index, true);
  });
});

$("#viewerClose").addEventListener("click", () => {
  imageViewer.close();
});

imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer) imageViewer.close();
});

$("#previousImage").addEventListener("click", () => {
  showGalleryImage(currentImageIndex - 1);
});

$("#nextImage").addEventListener("click", () => {
  showGalleryImage(currentImageIndex + 1);
});

// Gallery slideshow
const slideshowButton = $("#slideshowButton");

slideshowButton.addEventListener("click", () => {
  if (gallerySlideshowTimer) {
    clearInterval(gallerySlideshowTimer);
    gallerySlideshowTimer = null;
    slideshowButton.textContent = "Start slideshow";
    galleryStatus.textContent = "Slideshow paused.";
    return;
  }

  showGalleryImage(currentImageIndex);

  gallerySlideshowTimer = setInterval(() => {
    showGalleryImage(currentImageIndex + 1);
  }, 3500);

  slideshowButton.textContent = "Stop slideshow";
  galleryStatus.textContent = "Slideshow playing.";
});

// Save favourites for this page session
function updateFavouriteButton() {
  const saved = favourites.has(currentImageIndex);

  $("#favouriteButton").textContent =
    saved ? "♥ Saved favourite" : "♡ Save favourite";
}

$("#favouriteButton").addEventListener("click", () => {
  if (favourites.has(currentImageIndex)) {
    favourites.delete(currentImageIndex);
    galleryStatus.textContent = "Removed from favourites.";
  } else {
    favourites.add(currentImageIndex);
    galleryStatus.textContent = "Added to favourites.";
  }

  updateFavouriteButton();
});

showGalleryImage(0);
