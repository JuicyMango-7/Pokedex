function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getColor(type) {
  return TYPE_COLORS[type] || "#68a090";
}
