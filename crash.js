let multiplier = 1.00;
let interval;
let playing = false;
let balance = 10.00;

const multiplierDisplay = document.getElementById("multiplier");
const betBtn = document.getElementById("betBtn");
const cashoutBtn = document.getElementById("cashoutBtn");
const status = document.getElementById("status");
const wagerInput = document.getElementById("wager");
const balanceDisplay = document.getElementById("balance");

function updateBalanceDisplay() {
  balanceDisplay.textContent = balance.toFixed(2);
}

updateBalanceDisplay();

betBtn.addEventListener("click", () => {
  const wager = parseFloat(wagerInput.value);

  if (playing || wager > balance || wager < 0.1) {
    alert("Invalid bet");
    return;
  }

  balance -= wager;
  updateBalanceDisplay();

  multiplier = 1.00;
  playing = true;
  status.textContent = "";
  cashoutBtn.disabled = false;
  betBtn.disabled = true;

  interval = setInterval(() => {
    multiplier += 0.02 + multiplier * 0.02;
    multiplierDisplay.textContent = multiplier.toFixed(2) + "x";

    if (Math.random() < 0.01 + multiplier / 75) {
      crash();
    }
  }, 100);
});

cashoutBtn.addEventListener("click", () => {
  if (!playing) return;
  clearInterval(interval);
  const wager = parseFloat(wagerInput.value);
  const payout = wager * multiplier;
  balance += payout;
  status.textContent = `✅ Cashed out at ${multiplier.toFixed(2)}x! Won $${payout.toFixed(2)}`;
  reset();
});

function crash() {
  clearInterval(interval);
  multiplierDisplay.textContent = "💥 CRASHED!";
  status.textContent = `❌ Crashed at ${multiplier.toFixed(2)}x. You lost.`;
  reset();
}

function reset() {
  playing = false;
  betBtn.disabled = false;
  cashoutBtn.disabled = true;
  updateBalanceDisplay();
}
