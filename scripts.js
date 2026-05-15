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
let detailNavigation = createBrowseNavigationState();
let activeSearchToken = 0;

loadPokemons(1, 16);
fetchAllPokemonList();

// Fetching and Rendering

async function fetchPokemon(id) {
  if (pokemonCache.has(id)) return pokemonCache.get(id);

  const request = createPokemonRequest(id);
  pokemonCache.set(id, request);
  return request;
}

function createPokemonRequest(id) {
  return requestPokemon(id)
    .then((data) => cachePokemonResponse(id, data))
    .catch((error) => handlePokemonRequestError(id, error));
}

function cachePokemonResponse(id, data) {
  pokemonCache.set(id, data);
  trimPokemonCache();
  return data;
}

function handlePokemonRequestError(id, error) {
  pokemonCache.delete(id);
  console.log(error);
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
  getPokemonContainer().innerHTML += pokemonCardTemplate(data);
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
  const pokemonData = await Promise.all(
    getPokemonRangeIds(from, to).map((id) => fetchPokemon(id)),
  );
  renderPokemonCards(pokemonData);
}

function getPokemonRangeIds(from, to) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

// Load More Button Below Pokemon List

function loadMore() {
  if (isLoading) return;

  const from = getPokemonContainer().childElementCount + 1;
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

  if (document.getElementById(LOADER_ID)) return;

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

function getPokemonContainer() {
  return document.getElementById("pokemonContainer");
}

function getLoadMoreButton() {
  return document.getElementById("loadMoreButton");
}

// Details Modal

function showPokemonDetails(id) {
  openPokemonDetailsModal(id);
}

function createBrowseNavigationState() {
  return {
    mode: "browse",
    ids: [],
    currentIndex: null,
  };
}

function setSearchNavigationState(ids) {
  detailNavigation = {
    mode: "search",
    ids: [...ids],
    currentIndex: null,
  };
}

function resetNavigationState() {
  detailNavigation = createBrowseNavigationState();
}

function isSearchNavigationActive() {
  return detailNavigation.mode === "search";
}

function hasSearchNavigationSingleOrNoResult() {
  return isSearchNavigationActive() && detailNavigation.ids.length <= 1;
}

function navigatePokemonDetails(currentId, direction) {
  const targetId = getPokemonDetailNavigationTargetId(currentId, direction);
  if (targetId === null) return;
  setDetailNavigationIndex(targetId);
  openPokemonDetailsModal(targetId);
}

function setDetailNavigationIndex(id) {
  detailNavigation.currentIndex = isSearchNavigationActive()
    ? detailNavigation.ids.indexOf(id)
    : null;
}

function getPokemonDetailNavigationTargetId(currentId, direction) {
  if (hasSearchNavigationSingleOrNoResult()) return null;
  return isSearchNavigationActive()
    ? getSearchNavigationTargetId(currentId, direction)
    : getBrowseNavigationTargetId(currentId, direction);
}

function getSearchNavigationTargetId(currentId, direction) {
  const index = detailNavigation.ids.indexOf(currentId);
  const nextIndex = index + direction;
  if (index === -1) return null;
  if (nextIndex < 0 || nextIndex >= detailNavigation.ids.length) return null;
  return detailNavigation.ids[nextIndex];
}

function getBrowseNavigationTargetId(currentId, direction) {
  const nextId = currentId + direction;
  const maxId = getMaxAvailablePokemonId();
  if (nextId < 1 || nextId > maxId) return null;
  return nextId;
}

function getMaxAvailablePokemonId() {
  return allPokemonList.length > 0
    ? allPokemonList.length
    : Number.POSITIVE_INFINITY;
}

function isPokemonDetailNavigationDisabled(currentId, direction) {
  if (hasSearchNavigationSingleOrNoResult()) return true;
  return getPokemonDetailNavigationTargetId(currentId, direction) === null;
}

async function openPokemonDetailsModal(id) {
  const data = await fetchPokemon(id);
  if (!data) return;
  setDetailNavigationIndex(id);
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
  detailNavigation.currentIndex = null;
  if (modal) bootstrap.Modal.getInstance(modal)?.dispose();
  modal?.remove();
  removeModalBackdrops();
  resetModalBodyStyles();
}

function removeModalBackdrops() {
  document
    .querySelectorAll(".modal-backdrop")
    .forEach((backdrop) => backdrop.remove());
}

function resetModalBodyStyles() {
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
  const searchToken = ++activeSearchToken;
  const trimmedQuery = String(query).trim();
  removePokemonDetailsModal();
  if (shouldResetSearch(trimmedQuery)) return resetSearch(searchToken);
  const shouldRenderEmptyState = await runSearch(trimmedQuery, searchToken);
  finishSearchRender(searchToken, shouldRenderEmptyState);
}

async function runSearch(trimmedQuery, searchToken) {
  const startedAt = startLoading();
  try {
    return await renderSearchResults(
      getSearchMatches(trimmedQuery),
      searchToken,
    );
  } finally {
    await finishLoading(startedAt);
  }
}

function finishSearchRender(searchToken, shouldRenderEmptyState) {
  if (shouldRenderEmptyState && !isStaleSearchToken(searchToken)) {
    renderEmptySearchState();
  }
}

function isStaleSearchToken(searchToken) {
  return searchToken !== activeSearchToken;
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

async function renderSearchResults(matches, searchToken) {
  if (isStaleSearchToken(searchToken)) return false;
  setSearchNavigationState(matches.map((match) => match.id));
  hideLoadMoreButton();
  clearPokemonContainer();
  if (matches.length === 0) return true;
  const pokemonData = await fetchPokemonDataForMatches(matches);
  if (isStaleSearchToken(searchToken)) return false;
  renderPokemonCards(pokemonData);
  return false;
}

function hideLoadMoreButton() {
  getLoadMoreButton().classList.add("d-none");
}

function showLoadMoreButton() {
  getLoadMoreButton().classList.remove("d-none");
}

function clearPokemonContainer() {
  getPokemonContainer().innerHTML = "";
}

async function fetchPokemonDataForMatches(matches) {
  return Promise.all(matches.map((pokemon) => fetchPokemon(pokemon.id)));
}

function renderPokemonCards(pokemonData) {
  getPokemonContainer().insertAdjacentHTML(
    "beforeend",
    pokemonData
      .filter(Boolean)
      .map((data) => pokemonCardTemplate(data))
      .join(""),
  );
}

function renderEmptySearchState() {
  getPokemonContainer().insertAdjacentHTML("beforeend", emptySearchTemplate());
}

async function resetSearch(searchToken = ++activeSearchToken) {
  if (isStaleSearchToken(searchToken)) return;
  resetNavigationState();
  clearPokemonContainer();
  showLoadMoreButton();
  await renderPokemonRange(1, 16);
}
