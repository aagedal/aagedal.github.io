import albumsData from "./albumsData.js";

const imageModal = document.getElementById("imageModal");
const fullImage = document.getElementById("fullImage");
const closeModal = document.getElementsByClassName("close")[0];

let currentImageIndex = 0;
let currentCategory = "";
let currentAlbum = "";

function openModal(index) {
  currentImageIndex = index;
  const albumUrlFriendly = toUrlFriendlyName(currentAlbum);
  fullImage.src = `images/${currentCategory}/${albumUrlFriendly}/${albumsData[currentCategory][currentAlbum].images[index]}`;
  imageModal.style.display = "block";
}

closeModal.addEventListener("click", () => {
  imageModal.style.display = "none";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageModal.style.display === "block") {
    imageModal.style.display = "none";
  }
  if (imageModal.style.display === "block") {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      navigateImages(1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      navigateImages(-1);
    }
  }
});

function navigateImages(direction) {
  currentImageIndex += direction;
  const images = albumsData[currentCategory][currentAlbum].images;
  if (currentImageIndex < 0) {
    currentImageIndex = images.length - 1;
  } else if (currentImageIndex >= images.length) {
    currentImageIndex = 0;
  }
  const albumUrlFriendly = toUrlFriendlyName(currentAlbum);
  fullImage.src = `images/${currentCategory}/${albumUrlFriendly}/${images[currentImageIndex]}`;
}

imageModal.addEventListener("touchstart", handleTouchStart, false);
imageModal.addEventListener("touchmove", handleTouchMove, false);

let xDown = null;
let yDown = null;

function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches;
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  let xUp = evt.touches[0].clientX;
  let yUp = evt.touches[0].clientY;

  let xDiff = xDown - xUp;
  let yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      navigateImages(1); // Swipe left
    } else {
      navigateImages(-1); // Swipe right
    }
  }
  xDown = null;
  yDown = null;
}

function toUrlFriendlyName(name) {
  return name.replace(/\s+/g, "-");
}

export {openModal, setCurrentCategoryAndAlbum};

function setCurrentCategoryAndAlbum(category, album) {
  currentCategory = category;
  currentAlbum = album;
}
