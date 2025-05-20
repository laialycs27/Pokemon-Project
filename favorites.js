function getFavorites() {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  }
  
  function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
  
  function removeFromFavorites(id) {
    let favorites = getFavorites();
    favorites = favorites.filter(p => p.id !== id);
    saveFavorites(favorites);
    renderFavorites();
  }
  
  function renderFavorites() {
    const sortBy = document.getElementById("sortBy").value;
    const container = document.getElementById("favoritesList");
    let favorites = getFavorites();
  
    // Sort favorites by selected option
    favorites.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else {
        return a.id - b.id;
      }
    });
  
    container.innerHTML = "";
  
    if (favorites.length === 0) {
      container.innerHTML = "<p>No favorites yet.</p>";
      return;
    }
  
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
  
  function downloadFavorites() {
    const favorites = getFavorites();
    const json = JSON.stringify(favorites, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "favorites.json";
    a.click();
  
    URL.revokeObjectURL(url);
  }
  
  function goBack() {
    window.location.href = "index.html";
  }
  
  // Load favorites on page load
  window.onload = renderFavorites;
  