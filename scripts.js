const URL = "https://pokeapi.co/api/v2/pokemon"; //     ?limit=20&offset=0      THIS CAN BE EDITED FOR LOADING NEXT PAGE

loadPokemons(1, 16);

async function fetchPokemon(id) {
  try {
    const response = await fetch(URL + "/" + id);
    if (!response.ok) {
      throw new Error("Could not fetch Pokemon");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function renderPokemon(id) {
  const data = await fetchPokemon(id);
  const container = document.getElementById("pokemonContainer");
  container.innerHTML += pokemonCardTemplate(data);
}

async function loadPokemons(from, to) {
  for (let id = from; id <= to; id++) {
    await renderPokemon(id);
  }
}
