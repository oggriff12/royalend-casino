particlesJS("particles-js", {
  particles: {
    number: { value: 80 },
    size: { value: 3 },
    color: { value: "#ffffff" },
    line_linked: { enable: true, color: "#ffffff" },
    move: { enable: true, speed: 1 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "repulse" }
    }
  }
});

let wallet = parseFloat(localStorage.getItem('wallet')) || 10.00;
document.getElementById("walletAmount").textContent = wallet.toFixed(2);

const chanceSlider = document.getElementById("chanceSlider");
const chanceValue = document.getElementById("chanceValue");
const payoutDisplay = document.getElementById("payout");

chanceSlider.addEventListener("input", () => {
  const chance = parseInt(chanceSlider.value);
  const payout = (99 / chance).toFixed(2);
  chanceValue.textContent = chance;
  payoutDisplay.textContent = `${payout}x`;
});

function updateWalletDisplay() {
  localStorage.setItem("wallet", wallet.toFixed(2));
  document.getElementById("walletAmount").textContent = wallet.toFixed(2);
}

function updateHistory(result) {
  let history = JSON.parse(localStorage.getItem("rollHistory")) || [];
  history.unshift(result);
  if (history.length > 10) history.pop();
  localStorage.setItem("rollHistory", JSON.stringify(history));
  displayHistory();
}

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("rollHistory")) || [];
  const historyList = document.getElementById("rollHistory");
  historyList.innerHTML = "";
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}

function updateLeaderboard(amount) {
  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  board.push(amount);
  board.sort((a, b) => b - a);
  board = board.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(board));
  displayLeaderboard();
}

function displayLeaderboard() {
  const board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const list = document.getElementById("leaderboardList");
  list.innerHTML = "";
  board.forEach((amt, i) => {
    const li = document.createElement("li");
    li.textContent = `$${amt.toFixed(2)}`;
    list.appendChild(li);
  });
}

function rollDice() {
  const betInput = document.getElementById("betAmount");
  const resultMsg = document.getElementById("resultMsg");
  const diceAnim = document.getElementById("diceAnim");

  let bet = parseFloat(betInput.value);
  let chance = parseInt(chanceSlider.value);
  let payout = 99 / chance;

  if (isNaN(bet) || bet <= 0) {
    alert("Enter a valid bet amount.");
    return;
  }

  if (bet > wallet) {
    alert("Insufficient balance.");
    return;
  }

  diceAnim.textContent = "🎲";
  resultMsg.textContent = "Rolling...";

  setTimeout(() => {
    const roll = Math.random() * 100;
    if (roll < chance) {
      let win = bet * payout;
      wallet += (win - bet);
      resultMsg.textContent = `🎉 You rolled ${roll.toFixed(2)} — WIN $${win.toFixed(2)}!`;
      updateHistory(`✅ Win $${win.toFixed(2)} on roll ${roll.toFixed(2)}`);
      updateLeaderboard(win);
    } else {
      wallet -= bet;
      resultMsg.textContent = `😢 You rolled ${roll.toFixed(2)} — Lost $${bet.toFixed(2)}`;
      updateHistory(`❌ Loss $${bet.toFixed(2)} on roll ${roll.toFixed(2)}`);
    }

    updateWalletDisplay();
  }, 800);
}

// Daily reward
const streakKey = "dailyStreak";
const lastClaimKey = "lastClaim";

function claimDaily() {
  const today = new Date().toDateString();
  const lastClaim = localStorage.getItem(lastClaimKey);

  if (lastClaim === today) {
    alert("You already claimed today's reward!");
    return;
  }

  let streak = parseInt(localStorage.getItem(streakKey)) || 0;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  streak = (lastClaim === yesterday) ? streak + 1 : 1;

  wallet += 1;
  localStorage.setItem(streakKey, streak);
  localStorage.setItem(lastClaimKey, today);
  updateWalletDisplay();
  document.getElementById("streakDays").textContent = streak;
  alert("🔥 Daily reward claimed!");
}

function initStreak() {
  const streak = parseInt(localStorage.getItem(streakKey)) || 0;
  document.getElementById("streakDays").textContent = streak;
}

displayHistory();
displayLeaderboard();
initStreak();
