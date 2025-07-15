const API_KEY = '273237';
const API_BASE = 'https://www.thesportsdb.com/api/v1/json/' + API_KEY;
const gamesList = document.getElementById('games-list');

async function fetchLiveGames() {
  gamesList.innerHTML = '<p>Loading live sports games...</p>';

  const leagues = [
    { league: 'NBA', endpoint: 'livescore.php?s=Basketball' },
    { league: 'NFL', endpoint: 'livescore.php?s=American%20Football' },
    { league: 'MLB', endpoint: 'livescore.php?s=Baseball' }
  ];

  let allGames = [];

  for (const {league, endpoint} of leagues) {
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`);
      const data = await res.json();
      if (data.events) {
        const games = data.events.map(event => ({
          league,
          teams: `${event.strHomeTeam} vs ${event.strAwayTeam}`,
          score: `${event.intHomeScore} - ${event.intAwayScore}`,
          status: event.strStatus
        }));
        allGames = allGames.concat(games);
      }
    } catch (error) {
      console.error(`Error fetching ${league}:`, error);
    }
  }

  renderGames(allGames);
}

function renderGames(games) {
  if (games.length === 0) {
    gamesList.innerHTML = '<p>No live games available.</p>';
    return;
  }

  gamesList.innerHTML = '';
  games.forEach(game => {
    const div = document.createElement('div');
    div.className = 'game-card';
    div.innerHTML = `
      <h3>${game.league}</h3>
      <p>${game.teams}</p>
      <p>Score: ${game.score}</p>
      <p>Status: ${game.status}</p>
    `;
    gamesList.appendChild(div);
  });
}

fetchLiveGames();
setInterval(fetchLiveGames, 60000); // refresh every 60 seconds
