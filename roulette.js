// roulette.js let balance = parseFloat(localStorage.getItem("wallet")) || 10; let spinning = false;

const balanceDisplay = document.getElementById("balance"); const betAmountInput = document.getElementById("betAmount"); const betNumberInput = document.getElementById("betNumber"); const spinButton = document.getElementById("spinButton"); const wheel = document.getElementById("wheel"); const ball = document.getElementById("ball"); const statusDisplay = document.getElementById("status");

function updateBalanceDisplay() { balanceDisplay.textContent = $${balance.toFixed(2)}; localStorage.setItem("wallet", balance); }

function spinWheel() { if (spinning) return;

const bet = parseFloat(betAmountInput.value); const betNumber = parseInt(betNumberInput.value);

if (isNaN(bet) || bet <= 0 || bet > balance) { alert("Invalid bet amount"); return; }

if (isNaN(betNumber) || betNumber < 0 || betNumber > 36) { alert("Choose a valid number between 0 and 36"); return; }

spinning = true; balance -= bet; updateBalanceDisplay(); statusDisplay.textContent = "Spinning...";

const winningNumber = Math.floor(Math.random() * 37); const degrees = 360 * 10 + (360 / 37) * winningNumber; const ballOffset = 360 * 4 + (360 / 37) * winningNumber;

wheel.style.transition = 'transform 4s ease-out'; ball.style.transition = 'transform 4s ease-out';

wheel.style.transform = rotate(${degrees}deg); ball.style.transform = rotate(${ballOffset}deg);

setTimeout(() => { spinning = false; if (betNumber === winningNumber) { const payout = bet * 36; balance += payout; statusDisplay.textContent = 🎉 You won! Number: ${winningNumber}. Payout: $${payout.toFixed(2)}; } else { statusDisplay.textContent = ❌ You lost. Number was ${winningNumber}.; } updateBalanceDisplay(); }, 4500); }

spinButton.addEventListener("click", spinWheel); updateBalanceDisplay();

