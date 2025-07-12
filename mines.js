let gridSize = 5;
let mineCount = 5;
let gameInProgress = false;
let minePositions = [];
let revealedCells = 0;
let betAmount = 0;
let walletBalance = parseFloat(localStorage.getItem('walletBalance')) || 100;
updateWalletUI();

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('cashOut').addEventListener('click', cashOut);

function updateWalletUI() {
  document.getElementById('walletDisplay').innerText = `$${walletBalance.toFixed(2)}`;
  localStorage.setItem('walletBalance', walletBalance);
}

function startGame() {
  gridSize = 5;
  mineCount = parseInt(document.getElementById('mineCount').value);
  betAmount = parseFloat(document.getElementById('betAmount').value);

  if (isNaN(betAmount) || betAmount <= 0 || walletBalance < betAmount) {
    alert("Invalid bet or insufficient balance.");
    return;
  }

  walletBalance -= betAmount;
  updateWalletUI();

  gameInProgress = true;
  minePositions = [];
  revealedCells = 0;
  generateMines();
  renderGrid();
  updateMultiplierDisplay();
}

function generateMines() {
  const totalCells = gridSize * gridSize;
  while (minePositions.length < mineCount) {
    const pos = Math.floor(Math.random() * totalCells);
    if (!minePositions.includes(pos)) minePositions.push(pos);
  }
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => revealCell(cell, i));
    grid.appendChild(cell);
  }
}

function revealCell(cell, index) {
  if (!gameInProgress || cell.classList.contains('revealed')) return;

  if (minePositions.includes(index)) {
    cell.classList.add('bomb');
    gameOver();
  } else {
    cell.classList.add('safe', 'revealed');
    revealedCells++;
    updateMultiplierDisplay();

    if (revealedCells === (gridSize * gridSize - mineCount)) {
      winGame(); // user cleared the board
    }
  }
}

function updateMultiplierDisplay() {
  const table = stakeOdds[mineCount];
  const current = table?.[revealedCells] || { multiplier: 1, odds: 100 };

  document.getElementById('multiplier').innerText = `${current.multiplier.toFixed(2)}x`;
  document.getElementById('odds').innerText = `${current.odds.toFixed(2)}%`;
}

function cashOut() {
  if (!gameInProgress || revealedCells === 0) return;
  const payout = stakeOdds[mineCount]?.[revealedCells]?.multiplier || 1;
  const winnings = betAmount * payout;
  walletBalance += winnings;
  updateWalletUI();
  alert(`You cashed out $${winnings.toFixed(2)}!`);
  gameInProgress = false;
}

function gameOver() {
  alert("💥 You hit a bomb! Game over.");
  gameInProgress = false;
}

function winGame() {
  const payout = stakeOdds[mineCount]?.[revealedCells]?.multiplier || 2;
  const winnings = betAmount * payout;
  walletBalance += winnings;
  updateWalletUI();
  alert(`🎉 Perfect game! You win $${winnings.toFixed(2)}!`);
  gameInProgress = false;
}

// Stake.us-style multiplier and odds chart for 1 diamond
const stakeOdds = {
  1: {
    1: { multiplier: 1.03, odds: 96.11 },
    2: { multiplier: 1.08, odds: 91.66 },
    3: { multiplier: 1.12, odds: 88.39 },
    4: { multiplier: 1.18, odds: 83.89 },
    5: { multiplier: 1.24, odds: 79.83 },
    6: { multiplier: 1.30, odds: 76.15 },
    7: { multiplier: 1.37, odds: 72.26 },
    8: { multiplier: 1.46, odds: 67.80 },
    9: { multiplier: 1.55, odds: 63.87 },
    10: { multiplier: 1.65, odds: 60 },
    11: { multiplier: 1.77, odds: 55.93 },
    12: { multiplier: 1.90, odds: 52.10 },
    13: { multiplier: 2.06, odds: 48.05 },
    14: { multiplier: 2.25, odds: 44 },
    15: { multiplier: 2.47, odds: 40.08 },
    16: { multiplier: 2.75, odds: 36 },
    17: { multiplier: 3.09, odds: 32.03 },
    18: { multiplier: 3.54, odds: 27.96 },
    19: { multiplier: 4.12, odds: 24.02 },
    20: { multiplier: 4.95, odds: 20 },
    21: { multiplier: 6.19, odds: 15.99 },
    22: { multiplier: 8.25, odds: 12 },
    23: { multiplier: 12.37, odds: 8 },
    24: { multiplier: 24.75, odds: 4 },
  },
};
