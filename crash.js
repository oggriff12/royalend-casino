let multiplier = 1.00;
let isRunning = false;
let crashPoint;
let interval;
let balance = 10.00; // Starting fake balance
let betAmount = 0.10;
let history = [];

const multiplierDisplay = document.getElementById('multiplier');
const car = document.getElementById('car');
const startBtn = document.getElementById('start');
const cashoutBtn = document.getElementById('cashout');
const betInput = document.getElementById('betAmount');
const balanceDisplay = document.getElementById('balance');
const historyList = document.getElementById('historyList');
const crashSound = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_d44b5c2284.mp3");
const winSound = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_7ad78fe6b2.mp3");

updateBalance();

function getRandomCrashPoint() {
  const r = Math.random();
  return Math.max(1.01, parseFloat((1 / (1 - r)).toFixed(2)));
}

function updateBalance() {
  balanceDisplay.textContent = balance.toFixed(2);
}

function updateMultiplier() {
  multiplier += 0.01;
  multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';
  car.style.left = `${(multiplier * 15)}px`;

  if (multiplier >= crashPoint) {
    crash();
  }
}

function crash() {
  clearInterval(interval);
  isRunning = false;
  multiplierDisplay.textContent = "💥 CRASHED at " + multiplier.toFixed(2) + "x!";
  crashSound.play();
  addToHistory(multiplier.toFixed(2), false);
  cashoutBtn.disabled = true;
  startBtn.disabled = false;
}

function addToHistory(multiplier, won) {
  const li = document.createElement("li");
  li.textContent = `${multiplier}x - ${won ? "WIN" : "LOSS"}`;
  li.style.color = won ? "lime" : "red";
  history.unshift(li);
  if (history.length > 10) history.pop();
  historyList.innerHTML = '';
  history.forEach(item => historyList.appendChild(item));
}

startBtn.addEventListener('click', () => {
  if (isRunning) return;

  betAmount = parseFloat(betInput.value);
  if (isNaN(betAmount) || betAmount < 0.1 || betAmount > balance) {
    alert("Invalid bet amount.");
    return;
  }

  balance -= betAmount;
  updateBalance();

  multiplier = 1.00;
  crashPoint = getRandomCrashPoint();
  isRunning = true;
  startBtn.disabled = true;
  cashoutBtn.disabled = false;
  multiplierDisplay.textContent = multiplier.toFixed(2) + 'x';

  interval = setInterval(updateMultiplier, 100);
});

cashoutBtn.addEventListener('click', () => {
  if (!isRunning) return;
  clearInterval(interval);
  isRunning = false;
  let profit = betAmount * multiplier;
  balance += profit;
  updateBalance();
  winSound.play();
  multiplierDisplay.textContent = "✅ Cashed out at " + multiplier.toFixed(2) + "x!";
  addToHistory(multiplier.toFixed(2), true);
  cashoutBtn.disabled = true;
  startBtn.disabled = false;
});
