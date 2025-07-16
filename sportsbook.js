// --- CONFIG ---
const INITIAL_BALANCE = 100;
let balance = parseFloat(localStorage.getItem('walletBalance')) || INITIAL_BALANCE;
const slipsList = document.getElementById('slipsList');
const balanceDisplay = document.getElementById('balanceDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const loginLink = document.getElementById('loginLink');
const liveGamesContainer = document.getElementById('live-games');

// --- AUTH UI ---
balanceDisplay.innerText = balance.toFixed(2);
if (localStorage.getItem('loggedIn') === 'true') {
  loginLink.style.display = 'none';
  logoutBtn.style.display = 'inline-block';
} else {
  loginLink.style.display = 'inline-block';
  logoutBtn.style.display = 'none';
}
logoutBtn.onclick = () => {
  localStorage.setItem('loggedIn','false');
  window.location.reload();
};

// --- COUNTDOWN TIMER ---
(function countdown(){
  const el = document.querySelector('#countdown p');
  const target = new Date("2025-07-15T20:00:00Z").getTime();
  setInterval(()=>{
    const now = Date.now();
    const d = target - now;
    const m = Math.floor((d % 3600000)/60000);
    const s = Math.floor((d%60000)/1000);
    el.innerText = `Starts in: ${m}m ${s}s`;
  },1000);
})();

// --- FETCH & RENDER LIVE GAMES & BET FORMS ---
async function fetchLiveGames() {
  // This is placeholder data. Replace with your real API call.
  const games = [
    { id:1, sport:'NBA', match:'Lakers vs Suns', time:'Q3 · 05:12', location:'Staples Center' },
    { id:2, sport:'NFL', match:'Bears vs Packers', time:'HALF · 10:30', location:'Lambeau Field' },
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
    // handle form
    card.querySelector('form').onsubmit = e => {
      e.preventDefault();
      const stake = parseFloat(e.target.stake.value);
      if (stake > balance) {
        return alert("Insufficient balance");
      }
      balance -= stake;
      localStorage.setItem('walletBalance', balance);
      balanceDisplay.innerText = balance.toFixed(2);
      const li = document.createElement('li');
      li.innerText = `${game.match} — $${stake.toFixed(2)}`;
      slipsList.appendChild(li);
      // clear placeholder
      if (slipsList.children[0].innerText.includes('No active bets')) {
        slipsList.innerHTML = '';
      }
      e.target.reset();
    };
    liveGamesContainer.appendChild(card);
  });
}

// --- INIT ---
fetchLiveGames();
