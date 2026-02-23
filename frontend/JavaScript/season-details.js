(() => {
  const detailsContainer = document.getElementById("seasonDetails");
  if (!detailsContainer) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const seasonNum = Number(params.get("num"));

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

  fetch('/api/anime')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load anime data');
      }
      return response.json();
    })
    .then((rows) => {
      const selected = rows.find((item) => Number(item.seasons) === seasonNum);

      if (!selected) {
        detailsContainer.innerHTML = '<p>Season not found.</p>';
        return;
      }

      const imagePath = selected.anime_image
        ? `../IMG/Anime_Images/${selected.anime_image}`
        : '../IMG/HomePage_Images/mega-chimecho-mega-baxcalibur.jpg';

      const addedBy = selected.added_by_user || selected.addedByUser || '-';

      detailsContainer.innerHTML = `
        <div class="details-layout">
          <section class="details-image-section">
            <img src="${imagePath}" alt="Pokemon Season ${selected.seasons}" class="details-image">
          </section>
          
          <section class="details-info-section">
            <h2 class="details-title">${selected.season_name || `Season ${selected.seasons}`}</h2>
            <h3 class="details-subtitle">${selected.anime_title || ''}</h3>
            
            <div class="details-metadata">
              <div class="meta-row">
                <span class="meta-label">Season Number:</span>
                <span class="meta-value">${selected.seasons}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Episodes:</span>
                <span class="meta-value">${selected.episodes || '-'}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Start Date:</span>
                <span class="meta-value">${formatDate(selected.start_date)}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">End Date:</span>
                <span class="meta-value">${formatDate(selected.end_date)}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Added By:</span>
                <span class="meta-value">${addedBy}</span>
              </div>
            </div>
            
            <div class="details-description">
              <h4>Description</h4>
              <p>${selected.anime_description || 'No description available.'}</p>
            </div>
          </section>
        </div>
      `;
    })
    .catch(() => {
      detailsContainer.innerHTML = '<p>Could not load season details.</p>';
    });
})();

