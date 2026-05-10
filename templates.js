function pokemonCardTemplate(data) {
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const pokemonSprite = data.sprites.other["official-artwork"].front_default;
  const pokemonNumber = String(data.id).padStart(4, "0");
  const pokemonTypeButtons = data.types
    .map(
      (type) =>
        `<button class="btn btn-sm me-1" id="btn-types" style="background-color: ${getColor(type.type.name)};">${type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</button>`,
    )
    .join("");

  return `
    <div class="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-3">
      <div class="card h-100 pokemon-card" style="--type-color: ${getColor(data.types[0].type.name)}; background: radial-gradient(circle, var(--type-color) 15%, rgba(34, 37, 41, 1) 100%)">
        <img src="${pokemonSprite}" class="card-img-top p-3" alt="${pokemonName}" />
        <div class="card-body">
          <p class="card-text text-muted mb-0">Nr. ${pokemonNumber}</p>
          <h5 class="card-title mb-3">${pokemonName}</h5>
          <div>${pokemonTypeButtons}</div>
        </div>
      </div>
    </div>
  `;
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
