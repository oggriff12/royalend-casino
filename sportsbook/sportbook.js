// API keys (replace with actual keys if needed)
const ODDS_API_KEY = 'YOUR_ODDS_API_KEY';
const SPORTSDB_API_KEY = '123';

// League and sport configuration
const sports = [
  { name: 'NBA', leagueId: 4387, oddsKey: 'basketball_nba' },
  { name: 'NFL', leagueId: 4391, oddsKey: 'americanfootball_nfl' },
  { name: 'MLB', leagueId: 4424, oddsKey: 'baseball_mlb' }
];

let allGames = {};  // store events by sport
let allOdds = {};   // store odds by sport
let bets = [];      // user bets array

// Fetch upcoming games from TheSportsDB for each sport
async function fetchGames() {
  for (let sport of sports) {
    const url = `https://www.thesportsdb.com/api/v1/json/${SPORTSDB_API_KEY}/eventsnextleague.php?id=${sport.leagueId}`;
    try {
      let resp = await fetch(url);
      let data = await resp.json();
      allGames[sport.name] = data.events || [];
    } catch(err) {
      console.error(`Error fetching games for ${sport.name}:`, err);
      allGames[sport.name] = [];
    }
  }
}

// Fetch odds from TheOdds API for each sport
async function fetchOdds() {
  for (let sport of sports) {
    const url = `https://api.the-odds-api.com/v4/sports/${sport.oddsKey}/odds?regions=us&markets=h2h,spreads,totals&oddsFormat=american&apiKey=${ODDS_API_KEY}`;
    try {
      let resp = await fetch(url);
      let data = await resp.json();
      allOdds[sport.name] = data;
    } catch(err) {
      console.error(`Error fetching odds for ${sport.name}:`, err);
      allOdds[sport.name] = [];
    }
  }
}

// Render game cards for a given sport
function renderGamesForSport(sportName) {
  const list = document.getElementById('gamesList');
  list.innerHTML = '';
  const games = allGames[sportName] || [];
  const oddsList = allOdds[sportName] || [];
  games.forEach(event => {
    // Basic event info
    let home = event.strHomeTeam || event.strEvent.split(' vs ')[0];
    let away = event.strAwayTeam || event.strEvent.split(' vs ')[1];
    let date = event.dateEvent || '';
    let time = event.strTime || '';
    let venue = event.strVenue || '';
    // Find matching odds entry
    let matchOdds = oddsList.find(o => 
      (o.home_team === home && o.away_team === away) ||
      (o.home_team === away && o.away_team === home)
    );
    // Default odds
    let homeOdds = 'N/A', awayOdds = 'N/A';
    if (matchOdds) {
      // Assuming first bookmaker and moneyline market
      try {
        const market = matchOdds.bookmakers[0].markets.find(m => m.key === 'h2h');
        const outcomes = market.outcomes;
        const outcomeHome = outcomes.find(o => o.name === matchOdds.home_team);
        const outcomeAway = outcomes.find(o => o.name === matchOdds.away_team);
        homeOdds = outcomeHome ? outcomeHome.price : 'N/A';
        awayOdds = outcomeAway ? outcomeAway.price : 'N/A';
      } catch(e) {
        console.warn('Odds data missing for event', event, e);
      }
    }
    // Create card
    const card = document.createElement('div');
    card.className = 'game-card ' + sportName.toLowerCase();
    card.innerHTML = `
      <strong>${home}</strong> (${homeOdds}) vs <strong>${away}</strong> (${awayOdds}) 
      <br>📅 ${date} 🕒 ${time} 📍 ${venue}
    `;
    // Bet buttons
    const btnHome = document.createElement('button');
    btnHome.textContent = `Bet ${home}`;
    btnHome.onclick = () => addBet(sportName, home, away, homeOdds);
    const btnAway = document.createElement('button');
    btnAway.textContent = `Bet ${away}`;
    btnAway.onclick = () => addBet(sportName, home, away, awayOdds);
    card.appendChild(document.createElement('br'));
    card.appendChild(btnHome);
    card.appendChild(btnAway);
    list.appendChild(card);
  });
}

// Render all games (or filtered)
function renderAllGames(filter = 'All') {
  const container = document.getElementById('gamesList');
  container.innerHTML = ''; // Clear, but renderGamesForSport appends
  if (filter === 'All') {
    sports.forEach(s => renderGamesForSport(s.name));
  } else {
    renderGamesForSport(filter);
  }
}

// Load bets from localStorage and display
function loadBets() {
  const saved = JSON.parse(localStorage.getItem('betSlip'));
  bets = saved || [];
  displayBets();
}
function saveBets() {
  localStorage.setItem('betSlip', JSON.stringify(bets));
  displayBets();
}
function addBet(sport, home, away, odds) {
  if (odds === 'N/A') {
    alert('Odds not available for this game.');
    return;
  }
  const bet = { sport, game: `${home} vs ${away}`, odds };
  bets.push(bet);
  saveBets();
  alert(`Added bet: ${bet.game} at odds ${odds}`);
}
function displayBets() {
  const list = document.getElementById('betsList');
  list.innerHTML = '';
  bets.forEach((bet, idx) => {
    const li = document.createElement('li');
    li.textContent = `${bet.sport}: ${bet.game} @ Odds ${bet.odds}`;
    // Optional remove button
    const rm = document.createElement('button');
    rm.textContent = '✕';
    rm.onclick = () => {
      bets.splice(idx, 1);
      saveBets();
    };
    rm.style.marginLeft = '10px';
    li.appendChild(rm);
    list.appendChild(li);
  });
}

// Scroll reveal animations
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  window.addEventListener('scroll', () => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        el.classList.add('visible');
      }
    });
  });
  // Initial check
  window.dispatchEvent(new Event('scroll'));
}

// Filter button handlers
document.getElementById('filterAll').onclick = () => renderAllGames('All');
document.getElementById('filterNBA').onclick = () => renderAllGames('NBA');
document.getElementById('filterNFL').onclick = () => renderAllGames('NFL');
document.getElementById('filterMLB').onclick = () => renderAllGames('MLB');

// Initial load
(async function init() {
  await fetchGames();
  await fetchOdds();
  renderAllGames('All');
  loadBets();
  initReveal();
})();
