// Determines which search category the user selected (ID, type, or ability),
// performs the correct API request, and displays a Pokémon result
function searchPokemon() {
    const category = document.getElementById("searchCategory").value;
    const input = document.getElementById("searchInput").value.toLowerCase();
  
    if (!input) {
      alert("Please enter a value to search.");
      return;
    }
  
    if (category === "id") {
      // Directly fetch Pokémon by ID
      fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
        .then(res => res.json())
        .then(data => displayPokemon(data))
        .catch(() => showError());
  
    } else if (category === "type") {
      // Fetch the first Pokémon that matches the given type
      fetch(`https://pokeapi.co/api/v2/type/${input}`)
        .then(res => res.json())
        .then(data => {
          const firstPokemon = data.pokemon[0].pokemon.name;
          return fetch(`https://pokeapi.co/api/v2/pokemon/${firstPokemon}`);
        })
        .then(res => res.json())
        .then(data => displayPokemon(data))
        .catch(() => showError());
  
    } else if (category === "ability") {
      // Fetch the first Pokémon that has the given ability
      fetch(`https://pokeapi.co/api/v2/ability/${input}`)
        .then(res => res.json())
        .then(data => {
          const firstPokemon = data.pokemon[0].pokemon.name;
          return fetch(`https://pokeapi.co/api/v2/pokemon/${firstPokemon}`);
        })
        .then(res => res.json())
        .then(data => displayPokemon(data))
        .catch(() => showError());
    }
  }
  
  // Renders the Pokémon's data (name, image, type, abilities) to the HTML result container
  function displayPokemon(data) {
    const name = data.name;
    const image = data.sprites.front_default;
    const type = data.types[0].type.name;
    const abilities = data.abilities.map(a => a.ability.name).join(", ");
  
    const html = `
      <h2>${name} (#${data.id})</h2>
      <img src="${image}" alt="${name}">
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Abilities:</strong> ${abilities}</p>
      <button onclick="addToFavorites(${data.id})">Add to Favorites</button>
    `;
  
    document.getElementById("result").innerHTML = html;
  
    // Save last search result to localStorage
    localStorage.setItem("lastSearch", JSON.stringify(data));
  }
  
  // Displays a default or custom error message
  function showError(message = "No Pokémon found.") {
    document.getElementById("result").innerHTML = `<p>${message}</p>`;
  }
  
  // Adds a Pokémon to the user's favorites list using localStorage
  function addToFavorites(id) {
    const saved = localStorage.getItem("favorites");
    const favorites = saved ? JSON.parse(saved) : [];
  
    // Prevent duplicates
    if (favorites.some(p => p.id === id)) {
      alert("This Pokémon is already in your favorites!");
      return;
    }
  
    // Fetch Pokémon data and store in favorites
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => {
        const pokemon = {
          id: data.id,
          name: data.name,
          image: data.sprites.front_default,
          types: data.types.map(t => t.type.name),
          abilities: data.abilities.map(a => a.ability.name)
        };
  
        favorites.push(pokemon);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${pokemon.name} added to favorites!`);
      })
      .catch(err => {
        console.error("Failed to fetch Pokémon for favorites", err);
      });
  }
  
  // When the page loads, redisplay the last searched Pokémon (if available)
  window.onload = function () {
    const last = localStorage.getItem("lastSearch");
    if (last) {
      const data = JSON.parse(last);
      displayPokemon(data);
    }
  };
  