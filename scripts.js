const URL = "https://pokeapi.co/api/v2/pokemon";
const pokemonCache = new Map();
const MAX_POKEMON_CACHE_SIZE = 120;
const LOADER_MIN_TIME = 1000;
const LOADER_ID = "globalLoader";

let scrollY = 0;
let isLoading = false;

const TYPE_COLORS = {
  normal: "#a4acaf",
  fighting: "#d66724",
  flying: "#3cc7ef",
  poison: "#b97fca",
  ground: "#ab9841",
  rock: "#888267",
  bug: "#729f3f",
  ghost: "#7c62a3",
  steel: "#9eb7b8",
  fire: "#fd7d26",
  water: "#4492c4",
  grass: "#78c850",
  electric: "#edd536",
  psychic: "#f267b8",
  ice: "#98d8d8",
  dragon: "#7038f8",
  dark: "#705848",
  fairy: "#ee99ac",
  stellar: "#5a14fe",
};

let allPokemonList = [];

loadPokemons(1, 16);
fetchAllPokemonList();

// Fetching and Rendering

async function fetchPokemon(id) {
  if (pokemonCache.has(id)) return pokemonCache.get(id);

  try {
    const request = requestPokemon(id)
      .then((data) => {
        pokemonCache.set(id, data);
        trimPokemonCache();
        return data;
      })
      .catch((error) => {
        pokemonCache.delete(id);
        console.log(error);
      });

    pokemonCache.set(id, request);
    return request;
  } catch (error) {
    console.log(error);
  }
}

function trimPokemonCache() {
  while (pokemonCache.size > MAX_POKEMON_CACHE_SIZE) {
    const oldestKey = pokemonCache.keys().next().value;
    pokemonCache.delete(oldestKey);
  }
}

async function requestPokemon(id) {
  const response = await fetch(URL + "/" + id);
  if (!response.ok) {
    throw new Error("Could not fetch Pokemon");
  }
  return response.json();
}

async function renderPokemon(id) {
  const data = await fetchPokemon(id);
  if (!data) return;

  const container = document.getElementById("pokemonContainer");
  container.innerHTML += pokemonCardTemplate(data);
}

async function loadPokemons(from, to) {
  if (isLoading) return;
  isLoading = true;
  const startedAt = startLoading();

  try {
    await renderPokemonRange(from, to);
  } finally {
    await finishLoading(startedAt);
  }
}

async function renderPokemonRange(from, to) {
  const ids = [];

  for (let id = from; id <= to; id++) {
    ids.push(id);
  }

  const pokemonData = await Promise.all(ids.map((id) => fetchPokemon(id)));
  const container = document.getElementById("pokemonContainer");
  container.insertAdjacentHTML(
    "beforeend",
    pokemonData
      .filter(Boolean)
      .map((data) => pokemonCardTemplate(data))
      .join(""),
  );
}

// Load More Button Below Pokemon List

function loadMore() {
  if (isLoading) return;

  const from =
    document.getElementById("pokemonContainer").childElementCount + 1;
  const to = from + 15;
  loadPokemons(from, to);
}

// Loading Spinner

function startLoading() {
  showLoader();
  return Date.now();
}

async function finishLoading(startedAt) {
  const elapsed = Date.now() - startedAt;
  const remaining = LOADER_MIN_TIME - elapsed;
  if (remaining > 0) await delay(remaining);
  hideLoader();
  isLoading = false;
}

function showLoader() {
  lockScroll();

  if (document.getElementById(LOADER_ID)) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `<div id="${LOADER_ID}" class="loader-overlay">${loadingSpinnerTemplate()}</div>`,
  );
}

function hideLoader() {
  const loader = document.getElementById(LOADER_ID);
  if (loader) {
    loader.remove();
  }
  unlockScroll();
}

// Details Scroll Lock

function lockScroll() {
  scrollY = window.scrollY;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = scrollbarWidth + "px";
}

function unlockScroll() {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  window.scrollTo(0, scrollY);
}

// Details Modal

function showPokemonDetails(id) {
  openPokemonDetailsModal(id);
}

function navigatePokemonDetails(currentId, direction) {
  const targetId = currentId + direction;
  if (targetId < 1) return;
  openPokemonDetailsModal(targetId);
}

async function openPokemonDetailsModal(id) {
  const data = await fetchPokemon(id);
  if (!data) return;

  removePokemonDetailsModal();
  document.body.insertAdjacentHTML(
    "beforeend",
    showPokemonDetailsTemplate(data),
  );
  showModal();
}

function showModal() {
  const modalElement = document.getElementById("pokemonDetailModal");
  modalElement.addEventListener("hidden.bs.modal", removePokemonDetailsModal, {
    once: true,
  });
  bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

function removePokemonDetailsModal() {
  const modal = document.getElementById("pokemonDetailModal");
  if (modal) bootstrap.Modal.getInstance(modal)?.dispose();
  modal?.remove();

  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.remove();
  });

  document.body.classList.remove("modal-open");
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
}

// Search Functionality

async function fetchAllPokemonList() {
  const response = await fetch(`${URL}?limit=100000`);
  const data = await response.json();
  allPokemonList = data.results.map((p, i) => ({ name: p.name, id: i + 1 }));
}

async function searchPokemon(query) {
  const trimmedQuery = String(query).trim();

  if (shouldResetSearch(trimmedQuery)) {
    await resetSearch();
    return;
  }

  const startedAt = startLoading();

  try {
    const matches = getSearchMatches(trimmedQuery);
    await renderSearchResults(matches);
  } finally {
    await finishLoading(startedAt);
  }
}

function shouldResetSearch(query) {
  if (!query) return true;

  return !isNumericSearch(query) && query.length < 3;
}

function isNumericSearch(query) {
  return /^\d+$/.test(query);
}

function getSearchMatches(query) {
  const normalizedQuery = query.toLowerCase();

  return allPokemonList
    .filter(
      (pokemon) =>
        pokemon.name.includes(normalizedQuery) ||
        String(pokemon.id).includes(normalizedQuery),
    )
    .slice(0, 20);
}

async function renderSearchResults(matches) {
  hideLoadMoreButton();
  clearPokemonContainer();

  const pokemonData = await fetchPokemonDataForMatches(matches);
  renderPokemonCards(pokemonData);
}

function hideLoadMoreButton() {
  document.getElementById("loadMoreButton").classList.add("d-none");
}

function clearPokemonContainer() {
  document.getElementById("pokemonContainer").innerHTML = "";
}

async function fetchPokemonDataForMatches(matches) {
  return Promise.all(matches.map((pokemon) => fetchPokemon(pokemon.id)));
}

function renderPokemonCards(pokemonData) {
  document.getElementById("pokemonContainer").insertAdjacentHTML(
    "beforeend",
    pokemonData
      .filter(Boolean)
      .map((data) => pokemonCardTemplate(data))
      .join(""),
  );
}

async function resetSearch() {
  const container = document.getElementById("pokemonContainer");
  const loadMoreButton = document.getElementById("loadMoreButton");

  container.innerHTML = "";
  loadMoreButton.classList.remove("d-none");
  await renderPokemonRange(1, 16);
}
