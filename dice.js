// dice.js

let wallet = localStorage.getItem('wallet') ? parseFloat(localStorage.getItem('wallet')) : 100;
let streak = 0;
let topStreak = localStorage.getItem('topStreak') || 0;

document.getElementById('walletBalance').innerText = `$${wallet.toFixed(2)}`;

const betInput = document.getElementById('betAmount');
const targetInput = document.getElementById('target');
const multiplierDisplay = document.getElementById('multiplier');
const resultDisplay = document.getElementById('result');
const rollHistory = document.getElementById('historyList');
const streaksDisplay = document.getElementById('streaksList');

function calculateMultiplier(target) {
  return (100 / target).toFixed(2);
}

function updateMultiplierDisplay() {
  const target = parseFloat(targetInput.value);
  multiplierDisplay.innerText = `🎯 Multiplier: ${calculateMultiplier(target)}x`;
}

targetInput.addEventListener('input', updateMultiplierDisplay);
updateMultiplierDisplay();

document.getElementById('rollButton').addEventListener('click', () => {
  const bet = parseFloat(betInput.value);
  const target = parseFloat(targetInput.value);
  const multiplier = parseFloat(calculateMultiplier(target));

  if (isNaN(bet) || bet <= 0) {
    alert('Please enter a valid bet amount.');
    return;
  }

  if (wallet < bet) {
    alert('Insufficient balance!');
    return;
  }

  // Disable button during animation
  const button = document.getElementById('rollButton');
  button.disabled = true;

  const roll = Math.floor(Math.random() * 100) + 1;
  animateDiceRoll(roll, () => {
    if (roll < target) {
      const winnings = bet * multiplier;
      wallet += winnings;
      resultDisplay.innerHTML = `🎉 You rolled ${roll} and won $${winnings.toFixed(2)}!`;
      streak++;
    } else {
      wallet -= bet;
      resultDisplay.innerHTML = `❌ You rolled ${roll} and lost $${bet.toFixed(2)}.`;
      streak = 0;
    }

    if (streak > topStreak) {
      topStreak = streak;
      localStorage.setItem('topStreak', topStreak);
    }

    updateWallet();
    addToHistory(roll, bet, target);
    updateStreaks();
    button.disabled = false;
  });
});

function updateWallet() {
  localStorage.setItem('wallet', wallet.toFixed(2));
  document.getElementById('walletBalance').innerText = `$${wallet.toFixed(2)}`;
}

function addToHistory(roll, bet, target) {
  const li = document.createElement('li');
  li.textContent = `🎲 Rolled ${roll} (Target: < ${target}) | Bet: $${bet}`;
  rollHistory.prepend(li);
}

function updateStreaks() {
  streaksDisplay.innerHTML = `
    🔥 Current Streak: ${streak}<br>
    🏆 Top Streak: ${topStreak}
  `;
}

function animateDiceRoll(roll, callback) {
  resultDisplay.innerHTML = '🎲 Rolling...';
  const animation = document.createElement('div');
  animation.className = 'dice-animation';
  animation.textContent = '🎲';
  resultDisplay.innerHTML = '';
  resultDisplay.appendChild(animation);

  let frame = 0;
  const interval = setInterval(() => {
    animation.textContent = `🎲 ${Math.floor(Math.random() * 100) + 1}`;
    frame++;
    if (frame >= 10) {
      clearInterval(interval);
      animation.textContent = `🎲 ${roll}`;
      setTimeout(callback, 500);
    }
  }, 100);
}

// Initialize on load
updateStreaks();
