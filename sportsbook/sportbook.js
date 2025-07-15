const oddsApiKey = '36bc44e440efd3c20111234dc4ca8980';
const sportsDBApiKey = '273237';

// Live Games from TheSportsDB
async function fetchLiveGames(sport = 'Basketball') {
  const container = document.getElementById('live-games');
  container.innerHTML = `<p>Loading live ${sport} games...</p>`;
  try {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/${sportsDBApiKey}/latestsports.php?s=${sport}`);
    const data = await response.json();
    if (!data.sports) return container.innerHTML = '<p>No live games found.</p>';

    container.innerHTML = '';
    data.sports.forEach(game => {
      const div = document.createElement('div');
      div.className = 'game-card';
      div.innerHTML = `<h3>${game.strSport}</h3><p>League: ${game.strFormat}</p>`;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = '<p>Error loading games.</p>';
  }
}

// Live Odds from Odds API
async function fetchOdds() {
  const oddsContainer = document.getElementById('odds');
  oddsContainer.innerHTML = 'Loading odds...';
  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=h2h&apiKey=${oddsApiKey}`);
    const odds = await response.json();
    if (!odds.length) return oddsContainer.innerHTML = 'No odds available.';
    oddsContainer.innerHTML = '';
    odds.forEach(match => {
      const div = document.createElement('div');
      div.className = 'game-card';
      div.innerHTML = `<h3>${match.home_team} vs ${match.away_team}</h3><p>Bookmaker: ${match.bookmakers[0]?.title}</p>`;
      oddsContainer.appendChild(div);
    });
  } catch (e) {
    oddsContainer.innerHTML = 'Error loading odds.';
  }
}

// Initial load
fetchLiveGames();
fetchOdds();
