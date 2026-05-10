function pokemonCardTemplate(data) {
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const pokemonSprite = data.sprites.other["official-artwork"].front_default;
  const pokemonNumber = String(data.id).padStart(4, "0");
  const pokemonTypeButtons = data.types
    .map(
      (type) =>
        `<button class=" btn-types btn btn-sm me-1 " style="background-color: ${getColor(type.type.name)};">${capitalizeFirstLetter(type.type.name)}</button>`,
    )
    .join("");

  return `
    <div class="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 my-2">
      <div class="card h-100 pokemon-card" 
            style="
            --type-color: ${getColor(data.types[0].type.name)};
            background: radial-gradient(circle, var(--type-color) 15%, rgba(34, 37, 41, 1) 100%)">
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
