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
    <div class="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 my-2 clickable">
      <div class="card h-100 pokemon-card" 
            style="
            --type-color: ${getColor(data.types[0].type.name)};
            background: radial-gradient(circle, var(--type-color) 15%, rgba(34, 37, 41, 1) 100%)"
            onclick="showPokemonDetails(${data.id})" >
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

function loadingSpinnerTemplate() {
  return `
    <div class="loader" role="status" aria-label="Loading">
      <img src="./assets/icons/pokemon-icon.svg" alt="" />
    </div>
  `;
}

function showPokemonDetailsTemplate(data) {
  const name = capitalizeFirstLetter(data.name);
  const number = String(data.id).padStart(4, "0");
  const image = data.sprites.other["official-artwork"].front_default;

  return `
    <div class="modal fade" id="pokemonDetailModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">#${number} ${name}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center"><img src="${image}" alt="${name}" class="img-fluid p-3" /></div>
          <div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div>
        </div>
      </div>
    </div>
  `;
}
