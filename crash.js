let multiplier = 1;
let interval;
let gameInProgress = false;
let balance = 1000;
let crashPoint;
let graphX = 0;
const graphCanvas = document.getElementById("graphCanvas");
const ctx = graphCanvas.getContext("2d");

let graphPoints = [];
let graphInterval;
let startTime;

const startButton = document.getElementById("startButton");
const cashOutButton = document.getElementById("cashOutButton");
const betAmountInput = document.getElementById("betAmount");
const multiplierDisplay = document.getElementById("multiplier");
const balanceDisplay = document.getElementById("balance");

function updateBalanceDisplay() {
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
}

function startCrashGame() {
  if (gameInProgress) return;

  const bet = parseFloat(betAmountInput.value);
  if (isNaN(bet) || bet <= 0 || bet > balance) {
    alert("Invalid bet amount!");
    return;
  }

  crashPoint = Math.random() * 5 + 1; // Random crash point between 1 and 6
 multiplier = 1;
graphPoints = [];
startTime = Date.now();

graphInterval = setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000;
  const currentMultiplier = 1 + elapsed * 0.2;
  graphPoints.push({ x: elapsed, y: currentMultiplier });
  drawGraph();
}, 100);

  startButton.disabled = true;
  cashOutButton.disabled = false;
  multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;

  const ctx = document.getElementById("graphCanvas").getContext("2d");
  ctx.clearRect(0, 0, 800, 300);

  interval = setInterval(() => {
    multiplier += 0.01;
    multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(graphX, 300 - (multiplier - 1) * 50);
    graphX += 5;
    ctx.lineTo(graphX, 300 - (multiplier - 1) * 50);
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Auto-crash when multiplier hits or exceeds crashPoint
    if (multiplier >= crashPoint) {
      endGame(false);
      const x = graphX;
      const y = 300 - (multiplier - 1) * 50;
      triggerExplosion(x, y);
    }
  }, 100);

  gameInProgress = true;
}

function triggerExplosion(x, y) {
  // Basic explosion effect (optional)
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.left = `${x}px`;
  explosion.style.top = `${y}px`;
  document.body.appendChild(explosion);
  setTimeout(() => {
    explosion.remove();
  }, 1000);
}

function endGame(cashedOut) {
  clearInterval(interval);
  startButton.disabled = false;
  cashOutButton.disabled = true;

  if (cashedOut) {
    const bet = parseFloat(betAmountInput.value);
    const winnings = bet * multiplier;
    balance += winnings;
    multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}x`;
    updateBalanceDisplay();
  }

  addToHistory(multiplier);
  gameInProgress = false;
}

function cashOut() {
  if (!gameInProgress) return;
  endGame(true);
}

let crashHistory = [];

function addToHistory(multiplier) {
  crashHistory.unshift(multiplier.toFixed(2));
  if (crashHistory.length > 10) {
    crashHistory.pop(); // Keep max 10 entries
  }
  renderCrashHistory();
}
}

startButton.addEventListener("click", startCrashGame);
cashOutButton.addEventListener("click", cashOut);
updateBalanceDisplay();
function drawGraph() {
  ctx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 2;

  const scaleX = 80; // pixels per second
  const scaleY = 50; // pixels per multiplier unit
  const offsetY = graphCanvas.height;

  for (let i = 0; i < graphPoints.length; i++) {
    const px = graphPoints[i].x * scaleX;
    const py = offsetY - graphPoints[i].y * scaleY;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.stroke();
}
