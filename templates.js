function pokemonCardTemplate(data) {
  const pokemonName = data.name.charAt(0).toUpperCase() + data.name.slice(1);
  const pokemonSprite = data.sprites.other["official-artwork"].front_default;
  const pokemonNumber = formatPokemonNumber(data.id);
  const pokemonTypeButtons = data.types
    .map(
      (type) =>
        `<button class="btn-types btn btn-sm me-1" style="background-color: ${getColor(type.type.name)};">${capitalizeFirstLetter(type.type.name)}</button>`,
    )
    .join("");

  return `
    <div class="col-xxl-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 my-2 clickable">
      <div
        class="card h-100 pokemon-card"
        style="--type-color: ${getColor(data.types[0].type.name)}; background: radial-gradient(circle, var(--type-color) 15%, rgba(34, 37, 41, 1) 100%)"
        onclick="showPokemonDetails(${data.id})"
      >
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
  const number = formatPokemonNumber(data.id);
  const image = data.sprites.other["official-artwork"].front_default;

  const types = data.types
    .map(
      (type) =>
        `<span class="badge me-2" style="background-color: ${getColor(type.type.name)};">${capitalizeFirstLetter(type.type.name)}</span>`,
    )
    .join("");

  const abilities = data.abilities
    .map((ability) => capitalizeFirstLetter(ability.ability.name))
    .join(", ");

  const stats = data.stats
    .map((stat) => {
      const percentage = getStatPercentage(stat.base_stat);
      const statLabel = formatStatName(stat.stat.name);
      return `
        <li class="mb-2">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <span>${statLabel}</span>
            <strong>${stat.base_stat}</strong>
          </div>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar" role="progressbar" style="width: ${percentage}%; background-color: var(--type-color);" aria-valuenow="${stat.base_stat}" aria-valuemin="0" aria-valuemax="255"></div>
          </div>
        </li>`;
    })
    .join("");

  return `
    <div
      class="modal fade px-2 px-sm-0"
      id="pokemonDetailModal"
      tabindex="-1"
      aria-hidden="true"
      style="--type-color: ${getColor(data.types[0].type.name)};"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div
          class="modal-content text-white"
          style="background: radial-gradient(circle, var(--type-color) 15%, rgba(34, 37, 41, 1) 100%); position: relative;"
        >
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
            style="position: absolute; top: 1rem; right: 1rem; z-index: 10;"
          ></button>
          <div class="modal-header border-0 d-flex flex-column align-items-start pt-4">
            <p class="text-muted mb-1">Nr. ${number}</p>
            <h1 class="modal-title fs-4 fw-bold">${name}</h1>
            <div>${types}</div>
          </div>
          <div class="modal-body text-center py-2">
            <img src="${image}" alt="${name}" class="img-fluid" style="max-height: 250px;" />
          </div>
          <div class="modal-footer border-0 d-flex flex-column align-items-start pb-4" style="width: 100%; padding-left: 1.5rem; padding-right: 1.5rem;">
          
            <h5 class="mb-2" style="width: 100%;">Base Stats</h5>
            <ul class="list-unstyled mb-3" style="width: 100%;">
              ${stats}
            </ul>

            <h5 class="mb-2" style="width: 100%;">Specifications</h5>
            <ul class="list-unstyled mb-3" style="width: 100%;">
              <li>Height: ${data.height / 10} m</li>
              <li>Weight: ${data.weight / 10} kg</li>
              <li>Abilities: ${abilities}</li>
            </ul>

            <div class="d-flex justify-content-between align-items-center mt-2" style="width: 100%;">
              <button
                type="button"
                class="btn btn-outline-light"
                onclick="navigatePokemonDetails(${data.id}, -1)"
                ${data.id === 1 ? "disabled" : ""}
              >
                &larr; Previous
              </button>
              <button
                type="button"
                class="btn btn-outline-light"
                onclick="navigatePokemonDetails(${data.id}, 1)"
              >
                Next &rarr;
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;
}
