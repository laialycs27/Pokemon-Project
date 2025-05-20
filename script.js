//Determines which field the user filled and sends an API request.
function searchPokemon() {
    //Gets the value the user entered
    const id = document.getElementById("pokemonIDInput").value;
    const type = document.getElementById("pokemonTypeInput").value.toLowerCase();
    const ability = document.getElementById("pokemonAbilityInput").value.toLowerCase();
  
    if (id) {
      //Makes an API call to PokeAPI to fetch Pokemon by ID
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())

        //If the API succeeds, call displayPokemon() to show the result
        .then(data => displayPokemon(data)
    )
        //If there's an error, show a message
        .catch(() => showError());
    } else if (type) {
      fetch(`https://pokeapi.co/api/v2/type/${type}`)
        .then(res => res.json())
        .then(data => {
          const results = data.pokemon.slice(0, 10);
          document.getElementById("result").innerHTML = "";
          results.forEach(p => {
            fetch(p.pokemon.url)
              .then(res => res.json())
              .then(data => displayPokemon(data));
          });
        })
        .catch(() => showError());
    } else if (ability) {
      fetch(`https://pokeapi.co/api/v2/ability/${ability}`)
        .then(res => res.json())
        .then(data => {
          const results = data.pokemon.slice(0, 10);
          document.getElementById("result").innerHTML = "";
          results.forEach(p => {
            fetch(p.pokemon.url)
              .then(res => res.json())
              .then(data => displayPokemon(data));
          });
        })
        .catch(() => showError());
    } else {
      showError("Please enter at least one search field.");
    }
  }
  
  function displayPokemon(data) {
    localStorage.setItem("lastSearch", JSON.stringify(data));
    //Extracts name, types, image, abilities.
    const name = data.name;
    const id = data.id;
    const image = data.sprites.front_default;
    const types = data.types.map(t => t.type.name).join(", ");
    const abilities = data.abilities.map(a => a.ability.name).join(", ");
  
    //Builds a card and adds a button to add to favorites
    const html = `
      <div class="pokemon-card">
        <h2>${name} (#${id})</h2>
        <img src="${image}" alt="${name}" />
        <p><strong>Type:</strong> ${types}</p>
        <p><strong>Abilities:</strong> ${abilities}</p>
        <button onclick="addToFavorites(${id})">Add to Favorites</button>
      </div>
    `;
  
    document.getElementById("result").innerHTML += html;
  }
  //Loads the current favorites from localStorage
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
  
        //Adds the new one and saves back to localStorage
        favorites.push(pokemon);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert(`${pokemon.name} added to favorites!`);
      })
      .catch(err => {
        console.error("Failed to fetch Pokemon for favorites", err);
      });
  }
  
  //Shows a error message inside the page.
  function showError(message = "No Pokemon found ") {
    document.getElementById("result").innerHTML = `<p>${message}</p>`;
  }
  
  // When the page loads, it checks if there’s a previously searched Pokemon and redisplays it.
  window.onload = function () {
    const last = localStorage.getItem("lastSearch");
    if (last) {
      const data = JSON.parse(last);
      displayPokemon(data);
    }
  };
  