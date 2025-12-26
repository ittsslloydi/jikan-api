/* ================= DOM ================= */
const animeResults = document.getElementById("animeResults");
const themeToggle = document.getElementById("themeToggle");
const logo = document.getElementById("logo");
const sectionLabel = document.getElementById("sectionLabel");
const pageIndicator = document.getElementById("pageIndicator");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const genreSelect = document.getElementById("genreSelect");
const favToggle = document.getElementById("favToggle");
const pagination = document.getElementById("pagination");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("animeModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalGenres = document.getElementById("modalGenres");
const modalSynopsis = document.getElementById("modalSynopsis");

/* ================= STATE ================= */
let currentPage = 1;
let currentQuery = "";
let currentGenre = "";
let isSearchMode = false;
let isFavoritesMode = false;
let isLoading = false;
let requestTimeout = null;

const cache = new Map();
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let lastResults = [];

/* ================= THEME LOAD ================= */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  logo.textContent = "☀ Anime Finder";
  themeToggle.textContent = "🌙 Dark Mode";
}

/* ================= INIT ================= */
window.onload = () => {
  loadGenres();
  loadAiring();
};

/* ================= GENRES ================= */
function loadGenres() {
  fetch("https://api.jikan.moe/v4/genres/anime")
    .then(res => res.json())
    .then(data => {
      genreSelect.innerHTML = `<option value="">All Genres</option>`;
      data.data.forEach(g => {
        const opt = document.createElement("option");
        opt.value = g.mal_id;
        opt.textContent = g.name;
        genreSelect.appendChild(opt);
      });
    });
}

genreSelect.onchange = () => {
  currentGenre = genreSelect.value;
  currentPage = 1;
  fetchCurrent();
};

/* ================= LOAD AIRING ================= */
function loadAiring() {
  isSearchMode = false;
  isFavoritesMode = false;
  currentQuery = "";
  currentGenre = "";
  currentPage = 1;

  pagination.style.display = "flex";
  sectionLabel.textContent = "🔥 Currently Airing";
  fetchCurrent();
}

/* ================= SEARCH ================= */
function searchAnime() {
  currentQuery = document.getElementById("searchInput").value.trim();
  isSearchMode = !!currentQuery;
  isFavoritesMode = false;
  currentPage = 1;

  pagination.style.display = "flex";
  sectionLabel.textContent = currentQuery
    ? `🔍 Results for "${currentQuery}"`
    : "🔥 Currently Airing";

  fetchCurrent();
}
/* ================= SEARCH EVENTS ================= */
searchBtn.addEventListener("click", () => {
  searchAnime();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchAnime();
  }
});


/* ================= FAVORITES ================= */
favToggle.onclick = () => {
  isFavoritesMode = !isFavoritesMode;

  favToggle.textContent = isFavoritesMode ? "⬅ Back" : "❤️ Favorites";
  pagination.style.display = isFavoritesMode ? "none" : "flex";
  sectionLabel.textContent = isFavoritesMode
    ? "❤️ Your Favorites"
    : "🔥 Currently Airing";

  if (isFavoritesMode) {
    displayAnime(favorites);
  } else {
    loadAiring();
  }
};

/* ================= FETCH BUILDER (IMPORTANT FIX) ================= */
/* Uses /anime for genre filtering, /top/anime only for default */
function fetchCurrent() {
  if (requestTimeout) clearTimeout(requestTimeout);

  requestTimeout = setTimeout(() => {
    let url = "https://api.jikan.moe/v4/anime?";

    if (currentQuery) {
      url += `q=${encodeURIComponent(currentQuery)}&`;
    }

    if (currentGenre) {
      url += `genres=${currentGenre}&`;
    }

    url += `page=${currentPage}`;

    // Only use top/airing if NO filters are active
    if (!currentQuery && !currentGenre) {
      url = `https://api.jikan.moe/v4/top/anime?filter=airing&page=${currentPage}`;
    }

    fetchAnime(url);
  }, 400); // debounce
}

/* ================= FETCH (CACHE + RATE SAFE) ================= */
function fetchAnime(url) {
  if (isLoading) return;

  // Cache hit
  if (cache.has(url)) {
    const cached = cache.get(url);
    lastResults = cached.data;
    displayAnime(lastResults);
    updatePagination(cached.pagination);
    return;
  }

  isLoading = true;
  prevBtn.disabled = true;
  nextBtn.disabled = true;

  showSkeletons();

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (!data || !Array.isArray(data.data)) {
        throw new Error("Invalid API response");
      }

      cache.set(url, {
        data: data.data,
        pagination: data.pagination
      });

      lastResults = data.data;
      displayAnime(lastResults);
      updatePagination(data.pagination);
    })
    .catch(err => {
      console.error("API Error:", err);
      animeResults.innerHTML = `
        <p style="text-align:center; opacity:0.7; padding:20px;">
          ⚠️ Please wait a moment…
        </p>
      `;
    })
    .finally(() => {
      isLoading = false;
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    });
}

/* ================= DISPLAY ================= */
function displayAnime(animes) {
  animeResults.innerHTML = "";

  if (!animes || animes.length === 0) {
    animeResults.innerHTML = "<p>No anime found.</p>";
    return;
  }

  animes.forEach(anime => {
    const card = document.createElement("div");
    card.className = "anime-card";

    const favBtn = document.createElement("button");
    favBtn.className = "fav-btn";
    favBtn.textContent = "❤️";

    if (favorites.some(f => f.mal_id === anime.mal_id)) {
      favBtn.classList.add("active");
    }

    favBtn.onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(anime);
      favBtn.classList.toggle("active");
    };

    card.innerHTML = `
      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">
      <div class="content">
        <h3>${anime.title}</h3>
        <div class="meta">
          ⭐ ${anime.score ?? "N/A"} • ${anime.episodes ?? "?"} eps
        </div>
        <p class="synopsis">
          ${anime.synopsis ? anime.synopsis.substring(0, 90) + "..." : "No description."}
        </p>
      </div>
    `;

    card.prepend(favBtn);
    card.onclick = () => openModal(anime);
    animeResults.appendChild(card);
  });
}

/* ================= FAVORITE LOGIC ================= */
function toggleFavorite(anime) {
  const index = favorites.findIndex(f => f.mal_id === anime.mal_id);
  index > -1 ? favorites.splice(index, 1) : favorites.push(anime);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  if (isFavoritesMode) displayAnime(favorites);
}

/* ================= MODAL ================= */
function openModal(anime) {
  modalImage.src = anime.images.jpg.large_image_url;
  modalTitle.textContent = anime.title;
  modalMeta.textContent =
    `⭐ ${anime.score ?? "N/A"} | ${anime.episodes ?? "?"} eps | ${anime.status ?? "Unknown"}`;
  modalGenres.textContent =
    "Genres: " + (anime.genres?.map(g => g.name).join(", ") || "N/A");
  modalSynopsis.textContent =
    anime.synopsis || "No synopsis available.";

  modal.classList.remove("hidden");
}

modal.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

/* ================= PAGINATION ================= */
function changePage(dir) {
  currentPage += dir;
  fetchCurrent();
}

prevBtn.onclick = () => {
  if (!prevBtn.disabled) changePage(-1);
};

nextBtn.onclick = () => {
  if (!nextBtn.disabled) changePage(1);
};

function updatePagination(paginationData) {
  if (!paginationData) return;
  pageIndicator.textContent = `Page ${currentPage}`;
  prevBtn.disabled = !paginationData.has_previous_page;
  nextBtn.disabled = !paginationData.has_next_page;
}

/* ================= SKELETON ================= */
function showSkeletons() {
  animeResults.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const skel = document.createElement("div");
    skel.className = "skeleton";
    animeResults.appendChild(skel);
  }
}

/* ================= THEME TOGGLE ================= */
themeToggle.onclick = () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  logo.textContent = isLight ? "☀ Anime Finder" : "🌙 Anime Finder";
  themeToggle.textContent = isLight ? "🌙 Dark Mode" : "☀ Light Mode";
};
