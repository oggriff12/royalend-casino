const oddsApiKey = '36bc44e440efd3c20111234dc4ca8980';
const sportsDBApiKey = '273237';

// 🏀 LIVE NBA GAMES
async function fetchLiveGames() {
  const container = document.getElementById('live-games');
  container.innerHTML = 'Loading live NBA games...';
  try {
    const res = await fetch(`https://www.thesportsdb.com/api/v1/json/${sportsDBApiKey}/livescore.php?s=Basketball`);
    const data = await res.json();
    container.innerHTML = '';
    if (!data.events) {
      container.innerHTML = 'No live NBA games now.';
      return;
    }
    data.events.forEach(event => {
      const div = document.createElement('div');
      div.className = 'game-card';
      div.innerHTML = `
        <h3>${event.strEvent}</h3>
        <p>Status: ${event.strStatus}</p>
        <p>Score: ${event.intHomeScore} - ${event.intAwayScore}</p>
        <button onclick="addBetSlip('${event.strEvent}')">Place Bet</button>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    container.innerHTML = 'Error loading live games.';
  }
}

// 📈 LIVE NBA ODDS
async function fetchOdds() {
  const oddsContainer = document.getElementById('odds');
  oddsContainer.innerHTML = 'Loading odds...';
  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=h2h&apiKey=${oddsApiKey}`);
    const odds = await response.json();
    oddsContainer.innerHTML = '';
    odds.forEach(match => {
      const div = document.createElement('div');
      div.className = 'odds-card';
      div.innerHTML = `
        <h4>${match.home_team} vs ${match.away_team}</h4>
        <p>Bookmaker: ${match.bookmakers[0]?.title || 'N/A'}</p>
      `;
      oddsContainer.appendChild(div);
    });
  } catch {
    oddsContainer.innerHTML = 'Error loading odds.';
  }
}

// 📅 UPCOMING NBA SCHEDULE
async function fetchSchedule() {
  const scheduleBox = document.getElementById('schedule');
  scheduleBox.innerHTML = 'Loading schedule...';
  try {
    const response = await fetch(`https://www.thesportsdb.com/api/v1/json/${sportsDBApiKey}/eventsnextleague.php?id=4387`);
    const data = await response.json();
    scheduleBox.innerHTML = '';
    data.events.forEach(event => {
      const div = document.createElement('div');
      div.className = 'game-card';
      div.innerHTML = `<h4>${event.strEvent}</h4><p>${event.dateEvent} | ${event.strTime}</p>`;
      scheduleBox.appendChild(div);
    });
  } catch {
    scheduleBox.innerHTML = 'Error loading schedule.';
  }
}

// 🎫 BET SLIP TRACKER
function addBetSlip(eventName) {
  let bets = JSON.parse(localStorage.getItem('betSlip')) || [];
  bets.push(eventName);
  localStorage.setItem('betSlip', JSON.stringify(bets));
  updateBetSlip();
}

function updateBetSlip() {
  const slipBox = document.getElementById('bet-slip');
  let bets = JSON.parse(localStorage.getItem('betSlip')) || [];
  slipBox.innerHTML = bets.length ? bets.map(b => `<p>${b}</p>`).join('') : 'No bets yet.';
}

// 🎮 FILTER GAMES BY SPORT
function filterSport(sport) {
  document.getElementById('live-games').innerHTML = `Loading ${sport} games...`;
  document.getElementById('schedule').innerHTML = `Loading ${sport} schedule...`;
  // Optional: you can expand later to NFL/MLB APIs
  fetchLiveGames();
  fetchSchedule();
}

// ✅ INITIAL LOAD
fetchLiveGames();
fetchOdds();
fetchSchedule();
updateBetSlip();
