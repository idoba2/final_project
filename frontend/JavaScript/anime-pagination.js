(() => {
  const grid = document.getElementById("animeGrid");

  if (!grid) {
    return;
  }

  const seasonImages = {
    25: "season25_ep01_ss01.jpg",
    24: "season24_ep04_ss03.png",
    23: "season23_ep01_ss01.jpg",
    22: "season22_ep01_ss01.jpg",
    21: "season21_ep01_ss03.jpg",
    20: "season20_ep01_ss01.jpg",
    19: "season19_main.jpg",
    18: "season18_main.jpg",
    17: "season17_ep01_ss03.jpg",
    16: "season16_main.jpg",
    15: "season15_main.jpg",
    14: "season14_main.jpg",
    13: "season13_main.jpg",
    12: "season12_main.jpg",
    11: "season11_main.jpg",
    10: "season10_main.jpg",
    9: "season09_main.jpg",
    8: "season08_main.jpg",
    7: "season07_main.jpg",
    6: "season06_main.jpg",
    5: "season05_main.jpg",
    4: "season04_main.jpg",
    3: "season03_main.jpg",
    2: "season02_main.jpg",
    1: "season01_main.jpg",
  };

  let seasons = [];

  const renderAllSeasons = () => {
    if (seasons.length === 0) {
      grid.innerHTML = "<p>No anime seasons added yet.</p>";
      return;
    }

    grid.innerHTML = seasons
      .map(
        (item) => `
          <a class="anime-card-link" href="/Season?num=${item.season}">
            <article class="anime-card">
              <img src="${item.image}" alt="Pokemon Season ${item.season}">
              <p class="anime-season">Season ${item.season}</p>
              <h3 class="anime-title">${item.title}</h3>
              <p style="font-size: 0.85em; color: #666; margin-top: 5px;">Added by: ${item.addedBy || '-'}</p>
            </article>
          </a>
        `
      )
      .join("");
  };

  const buildSeasonList = (rows) => {
    const normalizedSeasons = (Array.isArray(rows) ? rows : [])
      .map((row, index) => {
        const seasonNumber = Number(row.seasons);
        const normalizedSeason = Number.isFinite(seasonNumber)
          ? seasonNumber
          : index + 1;
        const imageName = seasonImages[normalizedSeason];
        const imagePath = imageName
          ? `../IMG/Anime_Images/${imageName}`
          : "../IMG/HomePage_Images/mega-chimecho-mega-baxcalibur.jpg";

        return {
          season: normalizedSeason,
          title: row.season_name || `Season ${normalizedSeason}`,
          image: imagePath,
          addedBy: row.added_by_user || row.addedByUser || '-'
        };
      });

    const uniqueBySeason = new Map();
    normalizedSeasons.forEach((item) => {
      if (!uniqueBySeason.has(item.season)) {
        uniqueBySeason.set(item.season, item);
      }
    });

    seasons = Array.from(uniqueBySeason.values())
      .sort((a, b) => b.season - a.season);

    renderAllSeasons();
  };

  fetch("/api/anime")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load anime list");
      }
      return response.json();
    })
    .then((rows) => buildSeasonList(rows))
    .catch(() => {
      grid.innerHTML = "<p>Could not load anime list.</p>";
    });
})();

