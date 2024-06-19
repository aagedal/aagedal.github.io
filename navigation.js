import albumsData from "./albumsData.js";

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
const albumDescription = document.getElementById("albumDescription");

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

  localStorage.setItem("currentSection", section);
}

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
  currentCategory = category;
  currentAlbum = album;

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

showSection(savedSection);

if (savedSection === "pictures") {
  loadCategory(savedCategory);
  loadAlbum(savedCategory, savedAlbum);
}

function toUrlFriendlyName(name) {
  return name.replace(/\s+/g, "-");
}
