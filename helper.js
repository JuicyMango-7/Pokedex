function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getColor(type) {
  return TYPE_COLORS[type] || "#68a090";
}

function formatPokemonNumber(id) {
  return String(id).padStart(4, "0");
}

function getStatPercentage(baseStat, maxStat = 255) {
  const percentage = (baseStat / maxStat) * 100;
  return Math.min(100, Math.max(0, percentage));
}

function formatStatName(statName) {
  const statNameMap = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Special Attack",
    "special-defense": "Special Defense",
    speed: "Speed",
  };

  return statNameMap[statName] || capitalizeFirstLetter(statName);
}
