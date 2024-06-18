const aboutLink = document.getElementById("aboutLink");
const picturesLink = document.getElementById("picturesLink");
const videosLink = document.getElementById("videosLink");
const codeLink = document.getElementById("codeLink");
const contactLink = document.getElementById("contactLink");
const aboutSection = document.getElementById("aboutSection");
const picturesSection = document.getElementById("picturesSection");
const videosSection = document.getElementById("videosSection");
const codeSection = document.getElementById("codeSection");
const contactSection = document.getElementById("contactSection");
const categoriesNav = document.getElementById("categoriesNav");
const albumsNav = document.getElementById("albumsNav");
const imageContainer = document.getElementById("imageContainer");
const albumsList = document.getElementById("albumsList");
const albumTitle = document.getElementById("albumTitle");

const imageModal = document.getElementById("imageModal");
const fullImage = document.getElementById("fullImage");
const closeModal = document.getElementsByClassName("close")[0];

let currentCategory = "";
let currentAlbum = "";
let currentImageIndex = 0;

const albumsData = {
  category1: {
    Oslo: ["TRA02080.jpeg", "TRA00129.jpeg", "TRA02576-2.jpeg"],
    "Lost Wings": ["TRA02080.jpeg", "TRA00129.jpeg", "TRA02576-2.jpeg"],
  },
  category2: {
    album1: ["TRA02080.jpeg", "TRA00129.jpeg", "TRA02576-2.jpeg"],
    album2: ["TRA02080.jpeg", "TRA00129.jpeg", "TRA02576-2.jpeg"],
    album3: ["TRA02080.jpeg", "TRA00129.jpeg", "TRA02576-2.jpeg"],
  },
  category3: {
    album1: ["TRA02080.jpeg", "TRA00129.jpeg", "TRA02576-2.jpeg"],
  },
  category4: {
    album1: ["TRA02080.jpeg", "TRA00129.jpeg", "TRA02576-2.jpeg"],
  },
};

// Helper function to convert album title to URL-friendly name
function toUrlFriendlyName(name) {
  return name.replace(/\s+/g, "-");
}

aboutLink.addEventListener("click", () => {
  showSection("about");
});

picturesLink.addEventListener("click", () => {
  showSection("pictures");
  loadCategory("category1"); // Automatically load Category 1 on Pictures click
});

videosLink.addEventListener("click", () => {
  showSection("videos");
});

codeLink.addEventListener("click", () => {
  showSection("code");
});

contactLink.addEventListener("click", () => {
  showSection("contact");
});

document.querySelectorAll(".categories-nav a").forEach((categoryLink) => {
  categoryLink.addEventListener("click", (event) => {
    const category = event.target.getAttribute("data-category");
    loadCategory(category);
  });
});

function showSection(section) {
  aboutSection.style.display = "none";
  picturesSection.style.display = "none";
  videosSection.style.display = "none";
  codeSection.style.display = "none";
  contactSection.style.display = "none";
  categoriesNav.style.display = "none";
  albumsNav.style.display = "none";

  // Remove active class from all top-level nav links
  document
    .querySelectorAll(".main-nav a")
    .forEach((link) => link.classList.remove("active-top-nav"));

  if (section === "about") {
    aboutSection.style.display = "block";
    aboutLink.classList.add("active-top-nav");
  } else if (section === "pictures") {
    picturesSection.style.display = "block";
    categoriesNav.style.display = "block";
    picturesLink.classList.add("active-top-nav");
  } else if (section === "videos") {
    videosSection.style.display = "block";
    videosLink.classList.add("active-top-nav");
  } else if (section === "code") {
    codeSection.style.display = "block";
    codeLink.classList.add("active-top-nav");
  } else if (section === "contact") {
    contactSection.style.display = "block";
    contactLink.classList.add("active-top-nav");
  }

  // Save the current section to localStorage
  localStorage.setItem("currentSection", section);
}

function loadCategory(category) {
  // Clear existing albums
  albumsList.innerHTML = "";

  // Remove active class from all category links
  document
    .querySelectorAll(".categories-nav a")
    .forEach((link) => link.classList.remove("active-category"));

  // Add active class to the current category link
  document
    .querySelector(`.categories-nav a[data-category="${category}"]`)
    .classList.add("active-category");

  // Populate albums based on the selected category
  for (const album in albumsData[category]) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = album;
    a.setAttribute("data-category", category);
    a.setAttribute("data-album", album);
    li.appendChild(a);
    albumsList.appendChild(li);
  }

  // Show the albums navigation
  albumsNav.style.display = "block";

  // Add event listeners for new album links
  document.querySelectorAll(".albums-nav a").forEach((albumLink) => {
    albumLink.addEventListener("click", (event) => {
      const category = event.target.getAttribute("data-category");
      const album = event.target.getAttribute("data-album");
      loadAlbum(category, album);
    });
  });

  // Automatically load the first album in the category
  const firstAlbum = Object.keys(albumsData[category])[0];
  loadAlbum(category, firstAlbum);

  // Save the current category to localStorage
  localStorage.setItem("currentCategory", category);
}

function loadAlbum(category, album) {
  // Clear existing images
  imageContainer.innerHTML = "";

  // Remove active class from all album links
  document
    .querySelectorAll(".albums-nav a")
    .forEach((link) => link.classList.remove("active-album"));

  // Add active class to the current album link
  document
    .querySelector(
      `.albums-nav a[data-category="${category}"][data-album="${album}"]`
    )
    .classList.add("active-album");

  // Set the album title
  albumTitle.textContent = album;
  currentCategory = category;
  currentAlbum = album;

  // Get the images for the selected album
  const images = albumsData[category][album];

  // Append images with lazy loading
  images.forEach((image, index) => {
    const img = document.createElement("img");
    const albumUrlFriendly = toUrlFriendlyName(album);
    img.setAttribute(
      "data-src",
      `images/${category}/${albumUrlFriendly}/${image}`
    );
    img.alt = image;
    img.dataset.index = index; // Store index for navigation
    imageContainer.appendChild(img);
    observer.observe(img);

    // Add click event to open the modal
    img.addEventListener("click", () => openModal(index));
  });

  // Save the current album to localStorage
  localStorage.setItem("currentAlbum", album);
}

// Set up the Intersection Observer for lazy loading
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        observer.unobserve(img);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }
);

// Load the saved section, category, and album from localStorage or default to 'about'
const savedSection = localStorage.getItem("currentSection") || "about";
const savedCategory = localStorage.getItem("currentCategory") || "category1";
// Get the first album dynamically from the saved category
const savedAlbum =
  localStorage.getItem("currentAlbum") ||
  Object.keys(albumsData[savedCategory])[0];

showSection(savedSection);

// If the saved section is 'pictures', also load the saved category and album
if (savedSection === "pictures") {
  loadCategory(savedCategory);
  loadAlbum(savedCategory, savedAlbum);
}

// Open the modal
function openModal(index) {
  currentImageIndex = index;
  const albumUrlFriendly = toUrlFriendlyName(currentAlbum);
  fullImage.src = `images/${currentCategory}/${albumUrlFriendly}/${albumsData[currentCategory][currentAlbum][index]}`;
  imageModal.style.display = "block";
}

// Close the modal
closeModal.addEventListener("click", () => {
  imageModal.style.display = "none";
});

// Navigate images with arrow keys
document.addEventListener("keydown", (event) => {
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
  const images = albumsData[currentCategory][currentAlbum];
  if (currentImageIndex < 0) {
    currentImageIndex = images.length - 1;
  } else if (currentImageIndex >= images.length) {
    currentImageIndex = 0;
  }
  const albumUrlFriendly = toUrlFriendlyName(currentAlbum);
  fullImage.src = `images/${currentCategory}/${albumUrlFriendly}/${images[currentImageIndex]}`;
}
