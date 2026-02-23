(() => {
  const grid = document.getElementById("gamesGrid");

  if (!grid) {
    return;
  }

  const fallbackImage = "../IMG/Games_Images/pokemon-sleep-box-art.jpg";
  let games = [];

  const toText = (value, fallback = "-") => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    return String(value);
  };

  const slugify = (text) =>
    String(text || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  const guessImagePath = (gameName) => {
    const slug = slugify(gameName);
    if (!slug) {
      return fallbackImage;
    }
    return `../IMG/Games_Images/${slug}.jpg`;
  };

  const getImagePath = (game) => {
    // Use the actual game_image filename from database if available
    if (game.game_image) {
      return `../IMG/Games_Images/${game.game_image}`;
    }
    // Fallback to guessing if no filename in database
    return guessImagePath(game.game_name || game.name);
  };

  const renderAllGames = () => {
    if (games.length === 0) {
      grid.innerHTML = "<p>No games added yet.</p>";
      return;
    }

    grid.innerHTML = games
      .map((game) => {
        const name = toText(game.game_name || game.name);
        const duration = toText(game.duration, '-');
        const price = toText(game.price);
        const formattedPrice = parseFloat(price) > 0 ? `$${parseFloat(price).toFixed(2)}` : 'Free';
        const imagePath = getImagePath(game);
        const addedBy = toText(game.added_by_user || game.addedByUser, 'Unknown');
        const gameId = game.id || '';

        return `
          <article class="game-card" onclick="window.location.href='/games/${gameId}'" style="cursor: pointer;">
            <img src="${imagePath}" alt="${name}" onerror="this.src='${fallbackImage}'">
            <p class="game-name">${name}</p>
            <p class="game-info">Price: ${formattedPrice}</p>
            <p class="game-info">Duration: ${duration}h</p>
            <p class="game-info" style="color: #666;">Added by: ${addedBy}</p>
          </article>
        `;
      })
      .join("");
  };

  const setGames = (rows) => {
    games = Array.isArray(rows) ? rows : [];
    renderAllGames();
  };

  fetch("/api/games")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load games");
      }
      return response.json();
    })
    .then((rows) => setGames(rows))
    .catch(() => {
      grid.innerHTML = "<p>Could not load games.</p>";
    });
})();
