const oddsApiKey = '36bc44e440efd3c20111234dc4ca8980'; // your Odds API key
const sportsDBApiKey = '273237'; // your TheSportsDB Premium key

// Live Basketball Games (NBA)
async function fetchLiveGames() {
  const container = document.getElementById('live-games');
  container.innerHTML = '<p>Loading live NBA games...</p>';

  try {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/${sportsDBApiKey}/latestsports.php?s=Basketball`);
    const data = await response.json();

    if (!data || !data.sports) {
      container.innerHTML = '<p>No live NBA games found.</p>';
      return;
    }

    container.innerHTML = '';
    data.sports.forEach(game => {
      const div = document.createElement('div');
      div.className = 'game-card';
      div.innerHTML = `
        <h3>${game.strSport}</h3>
        <p>League: ${game.strFormat}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = '<p>Error loading NBA games.</p>';
    console.error(err);
  }
}

// Real-Time Odds (NBA)
async function fetchOdds() {
  const container = document.getElementById('odds');
  container.innerHTML = '<p>Loading NBA odds...</p>';

  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=spreads&apiKey=${oddsApiKey}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p>No odds available.</p>';
      return;
    }

    container.innerHTML = '';
    data.forEach(match => {
      const div = document.createElement('div');
      div.className = 'odds-card';
      div.innerHTML = `
        <h3>${match.home_team} vs ${match.away_team}</h3>
        <p>Commence: ${new Date(match.commence_time).toLocaleString()}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = '<p>Error loading odds.</p>';
    console.error(err);
  }
}

// Load everything
fetchLiveGames();
fetchOdds();
