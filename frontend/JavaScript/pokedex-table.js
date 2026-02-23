(() => {
  const tableBody = document.getElementById("pokedexTableBody");
  if (!tableBody) {
    return;
  }

  // Quick helper so empty DB values don't break the table UI.
  const toText = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return String(value);
  };

  // This function injects the Pokemon data into the table.
  const renderRows = (pokemonRows) => {
    if (!Array.isArray(pokemonRows) || pokemonRows.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='9'>No Pokemon added yet.</td></tr>";
      return;
    }

    tableBody.innerHTML = pokemonRows
      .map((pokemon) => {
        const name = toText(pokemon.pokemon_name ?? pokemon.pokemonName ?? pokemon.name);
        const imageName = pokemon.pokemon_image || pokemon.pokemonImage || '';
        const imageHtml = imageName
          ? `<div><img src="/IMG/Pokedex_Images/${imageName}" alt="${name}" style="max-width: 80px; height: auto;"></div>`
          : '';
        const type1 = toText(pokemon.pokemon_type_1 ?? pokemon.type1);
        const type2 = toText(pokemon.pokemon_type_2 ?? pokemon.type2);
        const hp = toText(pokemon.hp);
        const attack = toText(pokemon.attack);
        const defense = toText(pokemon.defense);
        const spAtk = toText(pokemon.sp_atk ?? pokemon.spAtk);
        const spDef = toText(pokemon.sp_def ?? pokemon.spDef);
        const addedBy = toText(pokemon.added_by_user ?? pokemon.addedByUser);

        // Build each row as HTML so rendering stays fast.
        return `
          <tr>
            <td>${name}${imageHtml}</td>
            <td>${type1}</td>
            <td>${type2}</td>
            <td>${hp}</td>
            <td>${attack}</td>
            <td>${defense}</td>
            <td>${spAtk}</td>
            <td>${spDef}</td>
            <td>${addedBy}</td>
          </tr>
        `;
      })
      .join("");
  };

  // Load Pokemon list from the API and render it on the page.
  fetch("/api/pokemon")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch pokemon rows");
      }
      return response.json();
    })
    .then((rows) => renderRows(rows))
    .catch(() => {
      tableBody.innerHTML = "<tr><td colspan='9'>Could not load Pokemon list.</td></tr>";
    });
})();

