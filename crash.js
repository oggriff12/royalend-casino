let balance = parseFloat(localStorage.getItem("walletBalance")) || 1000;
let multiplier = 1.0;
let crashPoint;
let interval;
let gameInProgress = false;

const balanceDisplay = document.getElementById("balance");
const betAmountInput = document.getElementById("betAmount");
const startButton = document.getElementById("startButton");
const cashOutButton = document.getElementById("cashOutButton");
const multiplierDisplay = document.getElementById("multiplier");
const historyDisplay = document.getElementById("history");
function triggerExplosion(x, y) {
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = `${x}px`;
  explosion.style.top = `${y}px`;
  document.body.appendChild(explosion);

  setTimeout(() => {
    explosion.remove();
  }, 500);
}

function updateBalanceDisplay() {
  balanceDisplay.textContent = `$${balance.toFixed(2)}`;
  localStorage.setItem("walletBalance", balance);
}

function generateCrashPoint() {
  let r = Math.random();
  return Math.max(1.0, (1 / (1 - r)).toFixed(2));
}

function addToHistory(value) {
  const entry = document.createElement("span");
  entry.className = "history-entry";
  entry.textContent = `${value.toFixed(2)}x`;
  historyDisplay.prepend(entry);
  if (historyDisplay.children.length > 10) {
    historyDisplay.removeChild(historyDisplay.lastChild);
  }
}

function startCrashGame() {
  const bet = parseFloat(betAmountInput.value);
  if (isNaN(bet) || bet <= 0 || bet > balance) {
    alert("Invalid bet amount");
    return;
  }

  multiplier = 1.0;
  crashPoint = generateCrashPoint();
  gameInProgress = true;
  balance -= bet;
  updateBalanceDisplay();
  startButton.disabled = true;
  cashOutButton.disabled = false;
  multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;
ctx.clearRect(0, 0, 800, 300);
  const ctx = document.getElementById("graphCanvas").getContext("2d");
let graphX = 0;

interval = setInterval(() => {
  multiplier += 0.01;
  multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(graphX, 300 - (multiplier - 1) * 50); // Y decreases as multiplier increases
  graphX += 5;
  ctx.lineTo(graphX, 300 - (multiplier - 1) * 50);
  ctx.strokeStyle = "lime";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (multiplier >= crashPoint) {
    endGame(false);
    const x = graphX;
    const y = 300 - (multiplier - 1) * 50;
    triggerExplosion(x, y);
  }
}, 100);
}

function endGame(cashedOut) {
  clearInterval(interval);
  startButton.disabled = false;
  cashOutButton.disabled = true;
  if (cashedOut) {
    const bet = parseFloat(betAmountInput.value);
    const winnings = bet * multiplier;
    balance += winnings;
    updateBalanceDisplay();
  }
  addToHistory(multiplier);
  gameInProgress = false;
}

function cashOut() {
  if (!gameInProgress) return;
  endGame(true);
}

startButton.addEventListener("click", startCrashGame);
cashOutButton.addEventListener("click", cashOut);
updateBalanceDisplay();
