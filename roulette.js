// roulette.js let balance = parseFloat(localStorage.getItem("wallet")) || 10; let betAmount = 0; let betNumber = null; let spinning = false;

const balanceDisplay = document.getElementById("balance"); const betInput = document.getElementById("betAmount"); const numberInput = document.getElementById("betNumber"); const spinButton = document.getElementById("spinButton"); const wheel = document.getElementById("wheel"); const ball = document.getElementById("ball"); const statusDisplay = document.getElementById("status");

const numbers = Array.from({ length: 37 }, (_, i) => i); // 0 - 36

function updateBalanceDisplay() { balanceDisplay.textContent = $${balance.toFixed(2)}; localStorage.setItem("wallet", balance); }

function spinWheel() { if (spinning) return;

betAmount = parseFloat(betInput.value); betNumber = parseInt(numberInput.value);

if (isNaN(betAmount) || isNaN(betNumber) || betAmount <= 0 || betAmount > balance || betNumber < 0 || betNumber > 36) { alert("Enter a valid bet and number (0-36)"); return; }

spinning = true; balance -= betAmount; updateBalanceDisplay(); statusDisplay.textContent = "Spinning...";

const landedNumber = numbers[Math.floor(Math.random() * numbers.length)]; const angle = 360 * 10 + (360 / 37) * landedNumber;

wheel.style.transition = "transform 4s cubic-bezier(.17,.67,.83,.67)"; ball.style.transition = "transform 4s ease-in-out";

wheel.style.transform = rotate(${angle}deg); ball.style.transform = rotate(-${angle + 720}deg);

setTimeout(() => { spinning = false; if (landedNumber === betNumber) { const winnings = betAmount * 35; balance += winnings; statusDisplay.textContent = 🎉 You won! Number ${landedNumber}. Winnings: $${winnings}; } else { statusDisplay.textContent = 💸 Lost. Number was ${landedNumber}; } updateBalanceDisplay(); }, 4100); }

spinButton.addEventListener("click", spinWheel); updateBalanceDisplay();

