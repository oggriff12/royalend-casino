const thesportsdbKey = '273237';
const oddsApiKey = '36bc44e440efd3c20111234dc4ca8980';

// Live Games (NBA, NFL, MLB)
async function loadLiveGames() {
  const liveGamesDiv = document.getElementById('live-games');
  liveGamesDiv.innerHTML = '<p>Loading...</p>';

  try {
    const sports = ['nba', 'nfl', 'mlb'];
    let html = '';

    for (const sport of sports) {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${thesportsdbKey}/livescore.php?s=${sport}`);
      const data = await res.json();

      if (data.events) {
        data.events.forEach(event => {
          html += `<div class="game">${event.strEvent} | Time: ${event.strTime}</div>`;
        });
      }
    }

    liveGamesDiv.innerHTML = html || 'No live games available.';
  } catch {
    liveGamesDiv.innerHTML = 'Error loading live games.';
  }
}

// Live Odds (NBA example)
async function loadOdds() {
  const oddsDiv = document.getElementById('live-odds');
  oddsDiv.innerHTML = '<p>Loading odds...</p>';

  try {
    const res = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=h2h&apiKey=${oddsApiKey}`);
    const odds = await res.json();

    if (Array.isArray(odds)) {
      let html = '';
      odds.forEach(game => {
        html += `<div class="odd">${game.home_team} vs ${game.away_team}<br><small>Bookmakers: ${game.bookmakers?.length || 0}</small></div>`;
      });
      oddsDiv.innerHTML = html || 'No odds available.';
    } else {
      oddsDiv.innerHTML = 'No odds found.';
    }
  } catch {
    oddsDiv.innerHTML = 'Error loading odds.';
  }
}

loadLiveGames();
loadOdds();
