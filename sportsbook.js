// Balance and Login Handling
let balance = parseFloat(localStorage.getItem('walletBalance')) || 100;
document.getElementById('balanceDisplay').innerText = balance.toFixed(2);

const loginLink = document.getElementById('loginLink');
const logoutBtn = document.getElementById('logoutBtn');

if (localStorage.getItem('loggedIn') === 'true') {
    loginLink.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
} else {
    loginLink.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
}

logoutBtn.onclick = () => {
    localStorage.setItem('loggedIn', 'false');
    window.location.reload();
};

// Countdown Timer
function updateCountdown() {
    const end = new Date("2025-07-15T20:00:00Z").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const distance = end - now;
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById('countdown').innerText = `Starts in: ${mins}m ${secs}s`;
    }, 1000);
}
updateCountdown();

// Bet Slip Tracking
function getBetSlips() {
    return JSON.parse(localStorage.getItem('betSlips') || '[]');
}

function addBetSlip(betDescription, stakeAmount) {
    let betSlips = getBetSlips();
    betSlips.push({ bet: betDescription, stake: stakeAmount, timestamp: Date.now() });
    localStorage.setItem('betSlips', JSON.stringify(betSlips));
    alert(`Bet added: ${betDescription} for $${stakeAmount}`);
}

function showBetSlips() {
    const betSlipSection = document.querySelector('.section h2:contains("🎫 Bet Slips")')?.parentNode;
    if (!betSlipSection) return;
    let betSlips = getBetSlips();
    if (betSlips.length === 0) {
        betSlipSection.innerHTML += '<p>No active bets.</p>';
    } else {
        betSlips.forEach(bet => {
            let p = document.createElement('p');
            p.innerText = `${bet.bet} | Stake: $${bet.stake}`;
            betSlipSection.appendChild(p);
        });
    }
}
showBetSlips();

// Placeholder Live Odds Fetch (optional)
async function fetchLiveOdds() {
    try {
        let res = await fetch('https://api.the-odds-api.com/v4/sports/basketball_nba/odds/?regions=us&markets=h2h&apiKey=YOUR_API_KEY');
        let data = await res.json();
        console.log("Live odds:", data);
    } catch (err) {
        console.error('Failed to fetch odds:', err);
    }
}
// Uncomment below to enable live odds fetching
// fetchLiveOdds();
