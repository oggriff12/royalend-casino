const oddsApiKey = '36bc44e440efd3c20111234dc4ca8980';
const sportsDBApiKey = '273237';

// Live NBA Games (from TheSportsDB)
async function fetchLiveGames() {
  const container = document.getElementById('live-games');
  container.innerHTML = '<p>Loading live NBA games...</p>';

  try {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/${sportsDBApiKey}/livescore.php?s=Basketball`);
    const data = await response.json();

    if (!data.events || data.events.length === 0) {
      container.innerHTML = '<p>No live NBA games currently.</p>';
      return;
    }

    container.innerHTML = '';
    data.events.forEach(game => {
      const div = document.createElement('div');
      div.className = 'game-card';
      div.innerHTML = `
        <h3>${game.strEvent}</h3>
        <p>Score: ${game.intHomeScore} - ${game.intAwayScore}</p>
        <p>Status: ${game.strStatus}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p style="color:red">Error loading live games.</p>';
  }
}

// NBA Real-Time Odds (The Odds API)
async function fetchOdds() {
  const container = document.getElementById('odds');
  container.innerHTML = '<p>Loading real-time odds...</p>';

  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=h2h,spreads,totals&apiKey=${oddsApiKey}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p>No NBA odds available currently.</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach(match => {
      const div = document.createElement('div');
      div.className = 'odds-card';
      div.innerHTML = `
        <h4>${match.home_team} vs ${match.away_team}</h4>
        <p>Sport: ${match.sport_title}</p>
        <p>Bookmakers: ${match.bookmakers.length}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p style="color:red">Error loading odds.</p>';
  }
}

fetchLiveGames();
fetchOdds();
