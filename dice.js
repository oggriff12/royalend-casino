document.addEventListener("DOMContentLoaded", () => {
  const walletEl = document.getElementById("wallet");
  const betInput = document.getElementById("betAmount");
  const slider = document.getElementById("targetSlider");
  const targetValue = document.getElementById("targetValue");
  const multiplierEl = document.getElementById("multiplier");
  const rollButton = document.getElementById("rollButton");
  const rollResult = document.getElementById("rollResult");
  const historyList = document.getElementById("historyList");
  const streakList = document.getElementById("streakList");
  const leaderboardList = document.getElementById("leaderboardList");

  let wallet = parseFloat(localStorage.getItem("wallet")) || 100;
  let currentStreak = 0;
  let topStreaks = JSON.parse(localStorage.getItem("streaks")) || [];

  function updateWalletDisplay() {
    walletEl.textContent = wallet.toFixed(2);
    localStorage.setItem("wallet", wallet);
  }

  function updateMultiplier() {
    const target = parseInt(slider.value);
    const multiplier = (100 / (target - 1)).toFixed(2);
    multiplierEl.textContent = `${multiplier}x`;
    targetValue.textContent = target;
  }

  function addToHistory(roll, win) {
    const li = document.createElement("li");
    li.textContent = `Rolled ${roll} — ${win ? "WIN 🎉" : "LOSE ❌"}`;
    historyList.prepend(li);
  }

  function updateStreaks(newStreak) {
    if (newStreak > 1) topStreaks.push(newStreak);
    topStreaks = topStreaks.sort((a, b) => b - a).slice(0, 5);
    localStorage.setItem("streaks", JSON.stringify(topStreaks));
    streakList.innerHTML = "";
    topStreaks.forEach((s, i) => {
      const li = document.createElement("li");
      li.textContent = `#${i + 1}: ${s} wins`;
      streakList.appendChild(li);
    });
  }

  function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("diceLeaderboard")) || [];
    const player = {
      name: "Player",
      balance: wallet,
      timestamp: Date.now()
    };
    const existing = leaderboard.find(p => p.name === player.name);
    if (existing) existing.balance = player.balance;
    else leaderboard.push(player);
    leaderboard = leaderboard.sort((a, b) => b.balance - a.balance).slice(0, 5);
    localStorage.setItem("diceLeaderboard", JSON.stringify(leaderboard));

    leaderboardList.innerHTML = "";
    leaderboard.forEach((p, i) => {
      const li = document.createElement("li");
      li.textContent = `#${i + 1}: ${p.name} - $${p.balance.toFixed(2)}`;
      leaderboardList.appendChild(li);
    });
  }

  
  rollButton.addEventListener("click", () => {
    const bet = parseFloat(betInput.value);
    const target = parseInt(slider.value);
    if (bet <= 0 || bet > wallet) return alert("Invalid bet.");

    const roll = Math.floor(Math.random() * 100) + 1;
    const win = roll < target;
    const payout = bet * (100 / (target - 1));

    if (win) {
      wallet += payout - bet;
      currentStreak++;
    } else {
      wallet -= bet;
      updateStreaks(currentStreak);
      currentStreak = 0;
    }

    updateWalletDisplay();
    addToHistory(roll, win);
    updateLeaderboard();

    rollResult.innerHTML = `🎲 Rolled: <strong>${roll}</strong> — ${win ? '<span style="color:#0f0;">WIN 🎉</span>' : '<span style="color:#f33;">LOSE ❌</span>'}`;
  });

  slider.addEventListener("input", updateMultiplier);
  updateWalletDisplay();
  updateMultiplier();
  updateStreaks(currentStreak);
  updateLeaderboard();
  checkDailyBonus();

  tsParticles.load("particles-js", {
    particles: {
      number: { value: 80 },
      color: { value: "#00ffff" },
      shape: { type: "circle" },
      opacity: { value: 0.6 },
      size: { value: 3 },
      move: { enable: true, speed: 2 }
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" }
      }
    }
  });
});
