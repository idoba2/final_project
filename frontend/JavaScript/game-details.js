document.addEventListener('DOMContentLoaded', () => {
  const detailsContainer = document.getElementById("gameDetails");

  // Helper function to format dates  
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  fetch('/api/games')
    .then((response) => response.json())
    .then((games) => {
      // Extract game ID from URL (e.g., /games/123)
      const gameId = parseInt(window.location.pathname.split('/').pop(), 10);
      const game = games.find((g) => g.id === gameId);

      if (!game) {
        detailsContainer.innerHTML = '<p>Game not found.</p>';
        return;
      }

      // Format the price as currency
      const formattedPrice = parseFloat(game.price || 0).toFixed(2);

      detailsContainer.innerHTML = `
        <div class="details-layout">
          <section class="details-image-section">
            <img src="../IMG/Games_Images/${game.game_image}" alt="${game.game_name}" class="details-image" onerror="this.style.display='none'">
          </section>
          
          <section class="details-info-section">
            <h2 class="details-title">${game.game_name}</h2>
            
            <div class="details-metadata">
              <div class="meta-row">
                <span class="meta-label">Platform:</span>
                <span class="meta-value">${game.platform || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Genre:</span>
                <span class="meta-value">${game.genre || 'N/A'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Release Date:</span>
                <span class="meta-value">${formatDate(game.release_date)}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Minimum Age:</span>
                <span class="meta-value">${game.minimum_age}+</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Price:</span>
                <span class="meta-value">$${formattedPrice}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Duration:</span>
                <span class="meta-value">${game.duration} hours</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Added By:</span>
                <span class="meta-value">${game.added_by_user}</span>
              </div>
            </div>

            <div class="details-description">
              <h4>Description</h4>
              <p>${game.game_description || 'No description available.'}</p>
            </div>
          </section>
        </div>
      `;
    })
    .catch(() => {
      detailsContainer.innerHTML = '<p>Could not load game details.</p>';
    });
});
