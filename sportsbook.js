// --- INITIAL SETUP ---
const INITIAL_BALANCE = 100;
let balance = parseFloat(localStorage.getItem('walletBalance')) || INITIAL_BALANCE;
const slipsList = document.getElementById('slipsList');
const balanceDisplay = document.getElementById('balanceDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const loginLink = document.getElementById('loginLink');
const liveGamesContainer = document.getElementById('live-games');

// --- DISPLAY BALANCE ---
function updateBalanceDisplay() {
  balanceDisplay.innerText = balance.toFixed(2);
  localStorage.setItem('walletBalance', balance);
}

// --- AUTH UI ---
function updateAuthUI() {
  if (localStorage.getItem('loggedIn') === 'true') {
    loginLink.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
  } else {
    loginLink.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
  }
}

// Logout functionality
logoutBtn.onclick = () => {
  localStorage.setItem('loggedIn', 'false');
  window.location.reload();
};

// --- COUNTDOWN ---
(function countdown() {
  const el = document.querySelector('#countdown p');
  const target = new Date("2025-12-31T23:59:59Z").getTime();
  setInterval(() => {
    const now = Date.now();
    const d = target - now;
    const m = Math.floor((d % 3600000) / 60000);
    const s = Math.floor((d % 60000) / 1000);
    el.innerText = `Next Event Starts In: ${m}m ${s}s`;
  }, 1000);
})();

// --- FETCH LIVE GAMES (Placeholder Data) ---
async function fetchLiveGames() {
  const games = [
    { id: 1, sport: 'NBA', match: 'Lakers vs Suns', time: 'Q3 · 05:12', location: 'Crypto.com Arena' },
    { id: 2, sport: 'NFL', match: 'Bears vs Packers', time: 'Half · 10:30', location: 'Lambeau Field' },
    { id: 3, sport: 'MLB', match: 'Dodgers vs Yankees', time: 'Top 6th', location: 'Dodger Stadium' }
  ];

  liveGamesContainer.innerHTML = '';
  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <h3>${game.match}</h3>
      <p>🕒 ${game.time} | 📍 ${game.location}</p>
      <form data-game-id="${game.id}">
        <label>Stake $:
          <input type="number" name="stake" min="1" max="${balance.toFixed(0)}" required>
        </label>
        <button type="submit">Place Bet</button>
      </form>
    `;
    card.querySelector('form').onsubmit = e => handleBet(e, game);
    liveGamesContainer.appendChild(card);
  });
}

// --- BETTING LOGIC ---
function handleBet(event, game) {
  event.preventDefault();
  const stake = parseFloat(event.target.stake.value);
  if (stake > balance) {
    alert("Not enough balance.");
    return;
  }
  balance -= stake;
  updateBalanceDisplay();

  const li = document.createElement('li');
  li.innerText = `${game.match} — $${stake.toFixed(2)}`;
  slipsList.appendChild(li);

  if (slipsList.children[0]?.innerText.includes('No active bets')) {
    slipsList.innerHTML = '';
    slipsList.appendChild(li);
  }
  event.target.reset();
}

// --- INITIALIZE ---
updateBalanceDisplay();
updateAuthUI();
fetchLiveGames();
