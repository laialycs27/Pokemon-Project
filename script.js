// Search logic based on dropdown and input value
function searchPokemon() {
    const category = document.getElementById("searchCategory").value;
    const input = document.getElementById("searchInput").value.toLowerCase().trim();

    if (!input) {
        alert("Please enter a value to search.");
        return;
    }

    if (category === "id") {
        fetch(`https://pokeapi.co/api/v2/pokemon/${input}`)
            .then(res => res.json())
            .then(data => displayPokemons([data]))
            .catch(() => showError());

    } else if (category === "type") {
        fetch(`https://pokeapi.co/api/v2/type/${input}`)
            .then(res => res.json())
            .then(async data => {
                const promises = data.pokemon.map(p =>
                    fetch(p.pokemon.url).then(res => res.json())
                );
                const results = await Promise.all(promises);
                displayPokemons(results);
            })
            .catch(() => showError());

    } else if (category === "ability") {
        fetch(`https://pokeapi.co/api/v2/ability/${input}`)
            .then(res => res.json())
            .then(async data => {
                const promises = data.pokemon.map(p =>
                    fetch(p.pokemon.url).then(res => res.json())
                );
                const results = await Promise.all(promises);
                displayPokemons(results);
            })
            .catch(() => showError());
    }
}

// Render one or many Pokémon as cards
function displayPokemons(pokemonList) {
    const container = document.getElementById("result");
    container.innerHTML = "";

    if (!pokemonList.length) {
        showError();
        return;
    }

    pokemonList.forEach(data => {
        const name = data.name;
        const image = data.sprites.front_default;
        const type = data.types.map(t => t.type.name).join(", ");
        const abilities = data.abilities.map(a => a.ability.name).join(", ");

        const card = document.createElement("div");
        card.className = "pokemon-card";
        card.innerHTML = `
        <h2>${name} (#${data.id})</h2>
        <img src="${image}" alt="${name}" />
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
        <button onclick="addToFavorites(${data.id})">Add to Favorites</button>
      `;
        container.appendChild(card);
    });
    // Save last search to localStorage
    localStorage.setItem("lastSearch", JSON.stringify(pokemonList));

}

// Save selected Pokémon to favorites (localStorage)
function addToFavorites(id) {
    const saved = localStorage.getItem("favorites");
    const favorites = saved ? JSON.parse(saved) : [];

    if (favorites.some(p => p.id === id)) {
        alert("This Pokémon is already in your favorites!");
        return;
    }

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
        .catch(() => alert("Error saving favorite."));
}

// Error message for empty or failed search
function showError(message = "No Pokémon found.") {
    document.getElementById("result").innerHTML = `<p>${message}</p>`;
}

// Load last search on page load
window.onload = function () {
    const last = localStorage.getItem("lastSearch");
    if (last) {
      const data = JSON.parse(last);
      displayPokemons(data);
    }
  };
  
