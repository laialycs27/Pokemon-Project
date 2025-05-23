// Retrieves the list of favorite Pokémon from local storage
function getFavorites() {
  const saved = localStorage.getItem("favorites");
  return saved ? JSON.parse(saved) : [];
}

// Saves the given list of favorite Pokémon to local storage
function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Removes a Pokémon from favorites based on its ID
function removeFromFavorites(id) {
  let favorites = getFavorites();
  favorites = favorites.filter(p => p.id !== id); // Keep all except the one with matching ID
  saveFavorites(favorites); // Save updated list
  renderFavorites(); // Refresh the display
}

// Displays the list of favorite Pokémon on the page
function renderFavorites() {
  const sortBy = document.getElementById("sortBy").value; // Either 'name' or 'id'
  const container = document.getElementById("favoritesList");
  let favorites = getFavorites();

  // Sort the list by name or ID
  favorites.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else {
      return a.id - b.id;
    }
  });

  container.innerHTML = ""; // Clear previous list

  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  // Create and display a card for each favorite Pokémon
  favorites.forEach(pokemon => {
    const types = pokemon.types.join(", ");
    const abilities = pokemon.abilities.join(", ");

    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
      <h2>${pokemon.name} (#${pokemon.id})</h2>
      <img src="${pokemon.image}" alt="${pokemon.name}" />
      <p><strong>Type:</strong> ${types}</p>
      <p><strong>Abilities:</strong> ${abilities}</p>
      <button onclick="removeFromFavorites(${pokemon.id})">Remove</button>
    `;

    container.appendChild(card);
  });
}

// Downloads the list of favorites as a JSON file
function downloadFavorites() {
  const favorites = getFavorites();
  const json = JSON.stringify(favorites, null, 2); // Pretty print with 2 spaces
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "favorites.json"; // Suggested filename
  a.click();

  URL.revokeObjectURL(url); // Free memory
}

// Navigates back to the main search page
function goBack() {
  window.location.href = "index.html";
}

// Automatically render the favorites list when the page loads
window.onload = renderFavorites;
