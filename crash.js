let balance = 10.00;
let multiplier = 1.00;
let crashInterval;
let gameInProgress = false;
let crashed = false;
let car = document.getElementById('car');
let multiplierDisplay = document.getElementById('multiplier');
let startButton = document.getElementById('start');
let cashoutButton = document.getElementById('cashout');
let balanceDisplay = document.getElementById('balance');
let betInput = document.getElementById('betAmount');
let historyList = document.getElementById('historyList');
const crashSound = document.getElementById("crashSound");
const cashoutSound = document.getElementById("cashoutSound");
function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

function addToHistory(value) {
  const li = document.createElement('li');
  li.textContent = `${value.toFixed(2)}x`;
  historyList.prepend(li);
  if (historyList.childNodes.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }<audio id="crashSound" src="sounds/crash.mp3"></audio>
<audio id="cashoutSound" src="sounds/cashout.mp3"></audio>
}

function startGame() {
  const bet = parseFloat(betInput.value);
  if (bet < 0.10 || bet > balance || gameInProgress) return;

  multiplier = 1.00;
  crashed = false;
  gameInProgress = true;
  balance -= bet;
  updateBalanceDisplay();
  multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
  cashoutButton.disabled = false;
  startButton.disabled = true;

  let leftPos = 0;
  crashInterval = setInterval(() => {
    multiplier += 0.01;
    multiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
    leftPos += 2;
    car.style.left = `${leftPos}px`;

    if (Math.random() < 0.01 + (multiplier / 200)) {
      endGame(false);
    }
  }, 50);
}

function endGame(cashedOut) {
  clearInterval(crashInterval);
  gameInProgress = false;
  crashed = !cashedOut;
  if (cashedOut) {
    const winnings = parseFloat(betInput.value) * multiplier;
    balance += winnings;
    updateBalanceDisplay();
  }
  addToHistory(multiplier);
  startButton.disabled = false;
  cashoutButton.disabled = true;
  car.style.left = '0px';
}

startButton.onclick = startGame;
cashoutButton.onclick = () => {
  if (gameInProgress && !crashed) {
    endGame(true);
  }
};

updateBalanceDisplay();
