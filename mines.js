const gridElement = document.getElementById("grid");
const balanceValue = document.getElementById("balanceValue");
const betAmountInput = document.getElementById("betAmount");
const bombCountInput = document.getElementById("bombCount");
const startGameButton = document.getElementById("startGame");
const cashOutButton = document.getElementById("cashOut");
const messageElement = document.getElementById("gameMessage");
const oddsList = document.getElementById("oddsList");
const multiplierDisplay = document.getElementById("multiplierDisplay");

const totalCells = 25;
let bombs = [];
let revealedSafeCells = 0;
let currentMultiplier = 1;
let betAmount = 0;
let gameActive = false;

// Load balance from local storage
let balance = parseFloat(localStorage.getItem("balance")) || 10;
updateBalanceDisplay();

// Start game
startGameButton.addEventListener("click", startGame);
cashOutButton.addEventListener("click", cashOut);

function startGame() {
  if (gameActive) return;

  const bet = parseFloat(betAmountInput.value);
  const bombCount = parseInt(bombCountInput.value);

  if (isNaN(bet) || bet <= 0 || bet > balance) {
    showMessage("Invalid bet amount.");
    return;
  }
  if (isNaN(bombCount) || bombCount < 1 || bombCount >= totalCells) {
    showMessage("Invalid bomb count.");
    return;
  }

  // Deduct balance
  balance -= bet;
  updateBalanceDisplay();
  localStorage.setItem("balance", balance.toFixed(2));

  betAmount = bet;
  revealedSafeCells = 0;
  currentMultiplier = 1;
  gameActive = true;

  bombs = generateBombs(bombCount);
  renderGrid();
  displayOdds(bombCount);

  cashOutButton.disabled = false;
  showMessage("Game started. Click a tile!");
}

function generateBombs(bombCount) {
  const positions = [];
  while (positions.length < bombCount) {
    const index = Math.floor(Math.random() * totalCells);
    if (!positions.includes(index)) {
      positions.push(index);
    }
  }
  return positions;
}

function renderGrid() {
  gridElement.innerHTML = "";

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", () => revealCell(cell));
    gridElement.appendChild(cell);
  }
}

function revealCell(cell) {
  if (!gameActive || cell.classList.contains("revealed")) return;

  const index = parseInt(cell.dataset.index);
  if (bombs.includes(index)) {
    cell.classList.add("revealed", "bomb");
    showMessage("💣 You hit a bomb! You lost.");
    gameOver(false);
  } else {
    cell.classList.add("revealed", "safe");
    revealedSafeCells++;
    // Show floating multiplier effect
const multiplierDisplay = document.createElement("div");
multiplierDisplay.className = "floating-multiplier";
multiplierDisplay.textContent = `${currentMultiplier.toFixed(2)}x`;
multiplierDisplay.style.left = `${cell.offsetLeft + cell.offsetWidth / 2}px`;
multiplierDisplay.style.top = `${cell.offsetTop}px`;
document.querySelector(".mines-wrapper").appendChild(multiplierDisplay);

setTimeout(() => {
  multiplierDisplay.remove();
}, 1000);
    

    // Update multiplier using Stake-style logic
    const multiplier = getMultiplier(bombs.length, revealedSafeCells);
    currentMultiplier = multiplier;
    showMessage(`✅ Safe! Multiplier: x${currentMultiplier.toFixed(2)}`);
  }
}

function getMultiplier(bombCount, safeRevealed) {
  // Stake-style multiplier odds reference approximation
  const oddsTable = {
    1: [1.03, 1.06, 1.09, 1.13, 1.17, 1.21, 1.26, 1.31, 1.36, 1.42, 1.48, 1.54, 1.61, 1.68, 1.75, 1.83, 1.91, 2.00, 2.09, 2.18, 2.28, 2.39, 2.50, 2.61],
    2: [1.06, 1.12, 1.19, 1.26, 1.34, 1.42, 1.50, 1.59, 1.68, 1.77, 1.87, 1.97, 2.07, 2.18, 2.29, 2.40, 2.52, 2.64, 2.77, 2.90, 3.03, 3.17, 3.31, 3.46],
    3: [1.10, 1.18, 1.27, 1.36, 1.45, 1.55, 1.65, 1.75, 1.86, 1.97, 2.08, 2.20, 2.32, 2.44, 2.57, 2.70, 2.84, 2.98, 3.12, 3.27, 3.42, 3.57, 3.73, 3.89],
    // Add more as needed
  };

  const odds = oddsTable[bombCount];
  if (odds && safeRevealed > 0 && safeRevealed <= odds.length) {
    return odds[safeRevealed - 1];
  }
  return 1;
}

function cashOut() {
  if (!gameActive || revealedSafeCells === 0) return;

  const winnings = betAmount * currentMultiplier;
  balance += winnings;
  updateBalanceDisplay();
  localStorage.setItem("balance", balance.toFixed(2));

  showMessage(`💰 You cashed out: $${winnings.toFixed(2)}`);
  gameOver(true);
}

function updateBalanceDisplay() {
  balanceValue.textContent = `$${balance.toFixed(2)}`;
}

function showMessage(msg) {
  messageElement.textContent = msg;
}

function gameOver(success) {
  gameActive = false;
  cashOutButton.disabled = true;

  if (!success) {
    // reveal bombs
    document.querySelectorAll(".cell").forEach((cell) => {
      const index = parseInt(cell.dataset.index);
      if (bombs.includes(index)) {
        cell.classList.add("revealed", "bomb");
      }
    });
  }
}

// === Multiplier Odds Side Panel ===
function displayOdds(bombCount) {
  oddsList.innerHTML = "";

  let multiplier = 1;
  let remainingTiles = totalCells;

  for (let i = 1; i <= totalCells - bombCount; i++) {
    const safeTiles = remainingTiles - bombCount;
    const chance = safeTiles / remainingTiles;
    multiplier *= 1 / chance;

    const li = document.createElement("li");
    li.textContent = `${i} safe ➜ x${(multiplier * 0.97).toFixed(2)}`; // 3% house edge
    oddsList.appendChild(li);

    remainingTiles--;
  }
}
