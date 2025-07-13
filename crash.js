let multiplier = 1;
let interval;
let graphInterval;
let gameInProgress = false;
let balance = 1000;
let crashPoint;
let graphPoints = [];
let startTime;

const graphCanvas = document.getElementById("graphCanvas");
const ctx = graphCanvas.getContext("2d");

const startButton = document.getElementById("startButton");
const cashOutButton = document.getElementById("cashOutButton");
const betAmountInput = document.getElementById("betAmount");
const multiplierDisplay = document.getElementById("multiplier");
const balanceDisplay = document.getElementById("balance");
const historyList = document.getElementById("historyList");

function updateBalanceDisplay() {
  balanceDisplay.textContent = `Balance: $${balance.toFixed(2)}`;
}

function addToHistory(value) {
  const li = document.createElement("li");
  li.textContent = `${value}×`;
  historyList.prepend(li);
  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

function drawGraph() {
  ctx.clearRect(0,0, graphCanvas.width, graphCanvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 2;
  const scaleX = 80;
  const scaleY = 50;
  const offsetY = graphCanvas.height;

  graphPoints.forEach((pt, i) => {
    const px = pt.x * scaleX;
    const py = offsetY - pt.y * scaleY;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });

  ctx.stroke();
}

function startCrashGame() {
  if (gameInProgress) return;

  const bet = parseFloat(betAmountInput.value);
  if (isNaN(bet) || bet <= 0 || bet > balance) {
    alert("Invalid bet amount!");
    return;
  }

  crashPoint = Math.random() * 5 + 1;
  multiplier = 1;
  graphPoints = [];
  startTime = Date.now();
  gameInProgress = true;
  balance -= bet;
  updateBalanceDisplay();

  startButton.disabled = true;
  cashOutButton.disabled = false;

  graphInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    const currentMultiplier = 1 + elapsed * 0.2;

    if (currentMultiplier >= crashPoint) {
      clearInterval(graphInterval);
      endGame(false);
      return;
    }

    graphPoints.push({ x: elapsed, y: currentMultiplier });
    drawGraph();
    multiplier = currentMultiplier;
    multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}×`;
  }, 100);
}

function endGame(cashedOut) {
  clearInterval(graphInterval);

  cashOutButton.disabled = true;
  startButton.disabled = false;
  gameInProgress = false;

  if (cashedOut) {
    const bet = parseFloat(betAmountInput.value);
    const winnings = bet * multiplier;
    balance += winnings;
    updateBalanceDisplay();
  }

  multiplierDisplay.textContent = `Multiplier: ${multiplier.toFixed(2)}×`;
  addToHistory(multiplier.toFixed(2));
}

function cashOut() {
  if (!gameInProgress) return;
  endGame(true);
}

startButton.addEventListener("click", startCrashGame);
cashOutButton.addEventListener("click", cashOut);
updateBalanceDisplay();
