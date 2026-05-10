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

function getColor(type) {
  if (type == "normal") {
    return "#a4acaf";
  } else if (type == "fighting") {
    return "#d66724";
  } else if (type == "flying") {
    return "#3cc7ef";
  } else if (type == "poison") {
    return "#b97fca";
  } else if (type == "ground") {
    return "#ab9841";
  } else if (type == "rock") {
    return "#888267";
  } else if (type == "bug") {
    return "#729f3f";
  } else if (type == "ghost") {
    return "#7c62a3";
  } else if (type == "steel") {
    return "#9eb7b8";
  } else if (type == "fire") {
    return "#fd7d26";
  } else if (type == "water") {
    return "#4492c4";
  } else if (type == "grass") {
    return "#78c850";
  } else if (type == "electric") {
    return "#edd536";
  } else if (type == "psychic") {
    return "#f267b8";
  } else if (type == "ice") {
    return "#98d8d8";
  } else if (type == "dragon") {
    return "#7038f8";
  } else if (type == "dark") {
    return "#705848";
  } else if (type == "fairy") {
    return "#ee99ac";
  } else if (type == "stellar") {
    return "#5a14fe";
  } else {
    return "#68a090";
  }
}
