let balance = 1.00;
let bet = 0.1;
let bombs = 3;
let gridSize = 25;
let mineIndexes = [];
let gameActive = false;
let safeClicks = 0;

const balanceDisplay = document.getElementById("balance");
const grid = document.getElementById("grid");
const cashoutBtn = document.getElementById("cashoutBtn");
const statsPanel = document.getElementById("statsPanel");

function startGame() {
  bet = parseFloat(document.getElementById("bet").value);
  bombs = parseInt(document.getElementById("bombs").value);
  if (bet > balance || bet <= 0 || bombs >= gridSize) return alert("Invalid bet or bomb count.");
  
  balance -= bet;
  balanceDisplay.textContent = balance.toFixed(2);
  safeClicks = 0;
  gameActive = true;
  cashoutBtn.disabled = false;
  generateGrid();
  updateStats();
}

function generateGrid() {
  grid.innerHTML = "";
  mineIndexes = [];
  while (mineIndexes.length < bombs) {
    let r = Math.floor(Math.random() * gridSize);
    if (!mineIndexes.includes(r)) mineIndexes.push(r);
  }
  for (let i = 0; i < gridSize; i++) {
    let tile = document.createElement("div");
    tile.className = "tile";
    tile.onclick = () => handleClick(tile, i);
    grid.appendChild(tile);
  }
}

function handleClick(tile, index) {
  if (!gameActive || tile.classList.contains("clicked")) return;
  tile.classList.add("clicked");

  if (mineIndexes.includes(index)) {
    tile.classList.add("bomb");
    endGame(false);
  } else {
    tile.classList.add("safe");
    safeClicks++;
    updateStats();
  }
}

function cashOut() {
  if (!gameActive) return;
  let multiplier = 1 + safeClicks * (0.1 + (bombs / 50));
  let payout = bet * multiplier;
  balance += payout;
  balanceDisplay.textContent = balance.toFixed(2);
  endGame(true);
}

function endGame(win) {
  gameActive = false;
  cashoutBtn.disabled = true;
}

function updateStats() {
  let multiplier = 1 + safeClicks * (0.1 + (bombs / 50));
  let potential = (bet * multiplier).toFixed(2);
  statsPanel.innerHTML = `
    <div><strong>Bet:</strong> $${bet.toFixed(2)}</div>
    <div><strong>Mines:</strong> ${bombs}</div>
    <div><strong>Safe Picks:</strong> ${safeClicks}</div>
    <div><strong>Potential Cashout:</strong> $${potential}</div>
    <div><strong>Profit/Loss:</strong> $${(balance - 1.00).toFixed(2)}</div>
  `;
}
