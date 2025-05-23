// Performs search based on which field the user filled: ID, Type, or Ability
function searchPokemon() {
  const id = document.getElementById("pokemonIDInput").value;
  const type = document.getElementById("pokemonTypeInput").value.toLowerCase();
  const ability = document.getElementById("pokemonAbilityInput").value.toLowerCase();

  if (id) {
    // Search by ID
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => displayPokemon(data))
      .catch(() => showError());
  } else if (type) {
    // Search by Type – displays first matching Pokémon
    fetch(`https://pokeapi.co/api/v2/type/${type}`)
      .then(res => res.json())
      .then(data => {
        const firstPokemon = data.pokemon[0].pokemon.name;
        return fetch(`https://pokeapi.co/api/v2/pokemon/${firstPokemon}`);
      })
      .then(res => res.json())
      .then(data => displayPokemon(data))
      .catch(() => showError());
  } else if (ability) {
    // Search by Ability – displays first matching Pokémon
    fetch(`https://pokeapi.co/api/v2/ability/${ability}`)
      .then(res => res.json())
      .then(data => {
        const firstPokemon = data.pokemon[0].pokemon.name;
        return fetch(`https://pokeapi.co/api/v2/pokemon/${firstPokemon}`);
      })
      .then(res => res.json())
      .then(data => displayPokemon(data))
      .catch(() => showError());
  } else {
    alert("Please fill in at least one field.");
  }
}

// Displays the Pokémon data on the page
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
}

// Shows an error message if no Pokémon was found
function showError(message = "No Pokémon found.") {
  document.getElementById("result").innerHTML = `<p>${message}</p>`;
}
