import albumsData from "./albumsData.js";
import {openModal, setCurrentCategoryAndAlbum} from "./modal.js";

const aboutLink = document.getElementById("aboutLink");
const picturesLink = document.getElementById("picturesLink");
const videosLink = document.getElementById("videosLink");
const codeLink = document.getElementById("codeLink");
const contactLink = document.getElementById("contactLink");
const contentDiv = document.getElementById("content");
const categoriesNav = document.getElementById("categoriesNav");
const albumsNav = document.getElementById("albumsNav");
const albumsList = document.getElementById("albumsList");

aboutLink.addEventListener("click", () => loadSection("about.html", "about"));
picturesLink.addEventListener("click", () =>
  loadSection("pictures.html", "pictures", "category1")
);
videosLink.addEventListener("click", () =>
  loadSection("videos.html", "videos")
);
codeLink.addEventListener("click", () => loadSection("code.html", "code"));
contactLink.addEventListener("click", () =>
  loadSection("contact.html", "contact")
);

function loadSection(url, section, category) {
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      contentDiv.innerHTML = data;
      if (section === "pictures") {
        categoriesNav.style.display = "block";
        loadCategory(category);
      } else {
        categoriesNav.style.display = "none";
        albumsNav.style.display = "none";
      }
      localStorage.setItem("currentSection", section);
    });
}

document.querySelectorAll(".categories-nav a").forEach((categoryLink) => {
  categoryLink.addEventListener("click", (event) => {
    const category = event.target.getAttribute("data-category");
    loadCategory(category);
  });
});

function loadCategory(category) {
  albumsList.innerHTML = "";
  document
    .querySelectorAll(".categories-nav a")
    .forEach((link) => link.classList.remove("active-category"));
  document
    .querySelector(`.categories-nav a[data-category="${category}"]`)
    .classList.add("active-category");

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

  albumsNav.style.display = "block";
  document.querySelectorAll(".albums-nav a").forEach((albumLink) => {
    albumLink.addEventListener("click", (event) => {
      const category = event.target.getAttribute("data-category");
      const album = event.target.getAttribute("data-album");
      loadAlbum(category, album);
    });
  });

  const firstAlbum = Object.keys(albumsData[category])[0];
  loadAlbum(category, firstAlbum);
  localStorage.setItem("currentCategory", category);
}

function loadAlbum(category, album) {
  const imageContainer = document.getElementById("imageContainer");
  const albumTitle = document.getElementById("albumTitle");
  const albumDescription = document.getElementById("albumDescription");

  if (!imageContainer || !albumTitle || !albumDescription) return;

  imageContainer.innerHTML = "";

  document
    .querySelectorAll(".albums-nav a")
    .forEach((link) => link.classList.remove("active-album"));
  document
    .querySelector(
      `.albums-nav a[data-category="${category}"][data-album="${album}"]`
    )
    .classList.add("active-album");

  albumTitle.textContent = album;
  albumDescription.textContent = albumsData[category][album].description;
  setCurrentCategoryAndAlbum(category, album);

  const images = albumsData[category][album].images;

  images.forEach((image, index) => {
    const img = document.createElement("img");
    const albumUrlFriendly = toUrlFriendlyName(album);
    img.setAttribute(
      "data-src",
      `images/${category}/${albumUrlFriendly}/${image}`
    );
    img.alt = image;
    img.dataset.index = index;
    imageContainer.appendChild(img);
    observer.observe(img);

    img.addEventListener("click", () => openModal(index));
  });

  localStorage.setItem("currentAlbum", album);
}

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

const savedSection = localStorage.getItem("currentSection") || "about";
const savedCategory = localStorage.getItem("currentCategory") || "category1";
const savedAlbum =
  localStorage.getItem("currentAlbum") ||
  Object.keys(albumsData[savedCategory])[0];

loadSection(`${savedSection}.html`, savedSection, savedCategory);

if (savedSection === "pictures") {
  loadCategory(savedCategory);
  loadAlbum(savedCategory, savedAlbum);
}

function toUrlFriendlyName(name) {
  return name.replace(/\s+/g, "-");
}
