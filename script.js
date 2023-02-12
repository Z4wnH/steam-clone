const BASE_URL = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com`;
const getGames = async () => {
  try {
    const res = await fetch(`${BASE_URL}/games`);
    const data = await res.json();
    const games = data.data;
    return games;
  } catch (err) {
    console.log(err.message);
  }
};

function renderGames(games) {
  const gamesList = document.querySelector(".games");
  gamesList.innerHTML = "";
  games.forEach((game) => {
    const x = document.createElement("div");
    x.innerHTML = `
    <div class="game" id=${game.appid}>
      <img
        class="game-img"
        src="${game.header_image}"
      />
      <div class="game-content">
        <div class="game-name">${game.name}</div>
        <div class="game-price">$${game.price}</div>
        </div>
      </div>`;
    gamesList.appendChild(x);
    x.addEventListener("click", () => renderSingleGame(game.appid));
  });
}

const search = document.getElementById("search-query");

const gameSearch = async () => {
  try {
    let query = "";
    if (search.value) {
      query += `q=${search.value}`;
    }
    const url = `${BASE_URL}/games?${query}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.log("error", error.message);
  }
};

const renderGamesByQuery = async (genre) => {
  try {
    const games = await gameSearch();
    renderGames(games);
  } catch (error) {
    console.log("error", error.message);
  }
};

document
  .getElementById("search-icon")
  .addEventListener("click", () => renderGamesByQuery());

const getGenres = async () => {
  try {
    const res = await fetch(`${BASE_URL}/genres`);
    const data = await res.json();
    const genres = data.data;
    return genres;
  } catch (err) {
    console.log(err.message);
  }
};
const getGamesFilterByGenres = async (genre) => {
  try {
    const url = `${BASE_URL}/games?genres=${genre}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.log("getGamesFilterByGenres error", error.message);
  }
};
const renderGamesByGenre = async (genre) => {
  try {
    const games = await getGamesFilterByGenres(genre);
    renderGames(games);
  } catch (error) {
    console.log("renderGamesByGenre error", error.message);
  }
};

const render = async () => {
  try {
    const games = await getGames();
    renderGames(games);
    const genres = await getGenres();
    const gameGenres = document.querySelector(".genres");
    gameGenres.innerHTML = "";
    genres.forEach((genre) => {
      const x = document.createElement("div");
      x.innerHTML = `
        <button class="genre">${genre.name}
        </button>`;
      gameGenres.appendChild(x);
    });

    const genreButtons = document.querySelectorAll(".genre");
    genreButtons.forEach((genreButton) => {
      genreButton.addEventListener("click", () =>
        renderGamesByGenre(genreButton.innerHTML)
      );
    });
  } catch (err) {
    console.log(err.message);
  }
};

const getSingleGame = async (appid) => {
  try {
    const url = `${BASE_URL}/single-game/${appid}`;
    const res = await fetch(url);
    const data = await res.json();

    return data.data;
  } catch (error) {
    console.log("error", error.message);
  }
};
const renderSingleGame = async (appid) => {
  try {
    const game = await getSingleGame(appid);
    console.log("Single game", appid, game);

    renderModal(`
    <div class="game-detail-header">
      <h2 class="game-title">${game.name}</h2>
      <p class="game-platform">${game.platforms.join(", ")}</p>
    </div>
    <br>
    <div class="game-detail-image">
      <img src=${game.header_image} alt=${game.name} />
    </div>
    <br>
    <div class="game-detail-description">
      <h3>Description</h3>
      <p>${game.description}</p>
    </div>
    <br>
    <div class="game-detail-info">
      <h3>Details</h3>
      <p>
        <strong>Release Date:</strong> ${game.release_date.substring(0, 10)}
        <br>
        <strong>Categories:</strong> ${game.categories.join(", ")}
      </p>
    </div>
  `);
  } catch (error) {
    console.log("error", error.message);
  }
};

const renderModal = (content) => {
  const background = document.createElement("div");
  background.style.position = "fixed";
  background.style.inset = "0";
  background.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  background.addEventListener(
    "click",
    () => (background.style.display = "none")
  );

  const container = document.createElement("div");
  container.className = "game-detail-grid";
  container.innerHTML = content;
  container.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.body.appendChild(background);
  background.appendChild(container);
};

render();
