let gridSize = 5;
let mineCount = 5;
let gameInProgress = false;
let minePositions = [];

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('cashOut').addEventListener('click', cashOut);

function startGame() {
  gridSize = parseInt(document.getElementById('gridSize').value);
  mineCount = parseInt(document.getElementById('mineCount').value);
  minePositions = [];
  gameInProgress = true;

  generateMines();
  renderGrid();
}

function generateMines() {
  const totalCells = gridSize * gridSize;
  while (minePositions.length < mineCount) {
    const randomPos = Math.floor(Math.random() * totalCells);
    if (!minePositions.includes(randomPos)) {
      minePositions.push(randomPos);
    }
  }
}

function renderGrid() {
  const gridContainer = document.getElementById('gridContainer');
  gridContainer.innerHTML = '';
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;

  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    gridContainer.appendChild(cell);
  }
}

function handleCellClick(e) {
  if (!gameInProgress) return;

  const index = parseInt(e.target.dataset.index);
  if (minePositions.includes(index)) {
    e.target.innerHTML = '💣';
    e.target.style.background = 'red';
    alert('You hit a mine!');
    gameInProgress = false;
  } else {
    e.target.innerHTML = '💎';
    e.target.style.background = 'green';
    e.target.classList.add('revealed');
  }
}

function cashOut() {
  if (!gameInProgress) return;
  alert('You cashed out!');
  gameInProgress = false;
}
