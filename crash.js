let multiplier = 1.00;
let interval;
let playing = false;

const multiplierDisplay = document.getElementById("multiplier");
const betBtn = document.getElementById("betBtn");
const cashoutBtn = document.getElementById("cashoutBtn");
const status = document.getElementById("status");

betBtn.addEventListener("click", () => {
  if (playing) return;
  multiplier = 1.00;
  playing = true;
  status.textContent = "";
  cashoutBtn.disabled = false;
  betBtn.disabled = true;

  interval = setInterval(() => {
    multiplier += 0.01 + multiplier * 0.01;
    multiplierDisplay.textContent = multiplier.toFixed(2) + "x";

    // Random crash
    if (Math.random() < 0.01 + multiplier / 100) {
      crash();
    }
  }, 100);
});

cashoutBtn.addEventListener("click", () => {
  if (!playing) return;
  clearInterval(interval);
  status.textContent = `✅ Cashed out at ${multiplier.toFixed(2)}x!`;
  reset();
});

function crash() {
  clearInterval(interval);
  multiplierDisplay.textContent = "💥 CRASHED!";
  status.textContent = `❌ You lost. Crashed at ${multiplier.toFixed(2)}x`;
  reset();
}

function reset() {
  playing = false;
  betBtn.disabled = false;
  cashoutBtn.disabled = true;
}
