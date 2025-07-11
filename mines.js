let balance = parseFloat(localStorage.getItem("walletBalance")) || 1.0;
let gameStarted = false;
let winCount = 0;
let lossCount = 0;
let profit = 0.0;

document.getElementById('balance').textContent = balance.toFixed(2);
document.getElementById('claimBonus').addEventListener('click', () => {
  balance += 1;
  updateWallet();
});

function updateWallet() {
  document.getElementById('balance').textContent = balance.toFixed(2);
  document.getElementById('profit').textContent = profit.toFixed(2);
}

document.getElementById('startGame').addEventListener('click', () => {
  let bet = parseFloat(document.getElementById('betAmount').value);
  if (balance < bet) return alert("Not enough balance.");
  balance -= bet;
  updateWallet();
  gameStarted = true;
  document.getElementById('cashOut').disabled = false;
  createGrid();
});

document.getElementById('cashOut').addEventListener('click', () => {
  if (!gameStarted) return;
  let reward = 0.2;
  balance += reward;
  profit += reward;
  updateWallet();
  gameStarted = false;
  document.getElementById('cashOut').disabled = true;
});

function createGrid() {
  const gridSize = parseInt(document.getElementById('gridSize').value);
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  for (let i = 0; i < gridSize * gridSize; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.addEventListener('click', () => {
      if (!gameStarted) return;
      tile.classList.add('safe');
    });
    board.appendChild(tile);
  }
}
