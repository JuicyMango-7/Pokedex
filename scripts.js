const URL = "https://pokeapi.co/api/v2/pokemon";
const pokemonCache = {};
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

loadPokemons(1, 16);

// Fetching and Rendering

async function fetchPokemon(id) {
  if (pokemonCache[id]) return pokemonCache[id];

  try {
    const data = await requestPokemon(id);
    pokemonCache[id] = data;
    return data;
  } catch (error) {
    console.log(error);
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
  for (let id = from; id <= to; id++) {
    await renderPokemon(id);
  }
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

async function openPokemonDetailsModal(id) {
  const data = await fetchPokemon(id);
  removePokemonDetailsModal();
  document.body.insertAdjacentHTML(
    "beforeend",
    showPokemonDetailsTemplate(data),
  );
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("pokemonDetailModal"),
  ).show();
}

function removePokemonDetailsModal() {
  const modal = document.getElementById("pokemonDetailModal");
  if (modal) modal.remove();
}
