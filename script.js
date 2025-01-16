const board = document.getElementById('game-board');
const flagsLeft = document.getElementById('flagsLeft');
const result = document.getElementById('result');

let bombLocations = [];
let flagCount = 10;

// Initialize the board
function createBoard() {
  bombLocations = generateBombLocations(10, 100); // Place 10 bombs in the grid
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.setAttribute('id', i);
    cell.classList.add('valid');
    board.appendChild(cell);
    cell.addEventListener('click', () => handleClick(cell));
    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      toggleFlag(cell);
    });
  }

  setBombCounts();
}

// Random bomb placement
function generateBombLocations(bombCount, totalCells) {
  const locations = new Set();
  while (locations.size < bombCount) {
    locations.add(Math.floor(Math.random() * totalCells));
  }
  return Array.from(locations);
}

// Set data attribute for each cell
function setBombCounts() {
  const cells = document.querySelectorAll('#game-board div');
  cells.forEach((cell, i) => {
    if (bombLocations.includes(i)) {
      cell.classList.add('bomb');
    } else {
      const bombCount = countAdjacentBombs(i);
      cell.setAttribute('data', bombCount);
    }
  });
}

// Count bombs around a cell
function countAdjacentBombs(index) {
  const adjacentIndices = getAdjacentIndices(index);
  return adjacentIndices.filter((i) => bombLocations.includes(i)).length;
}

// Get adjacent cell indices
function getAdjacentIndices(index) {
  const isLeftEdge = index % 10 === 0;
  const isRightEdge = (index + 1) % 10 === 0;
  const indices = [
    index - 11, index - 10, index - 9,
    index - 1,              index + 1,
    index + 9,  index + 10, index + 11
  ];

  return indices.filter((i) => i >= 0 && i < 100 && 
    !(isLeftEdge && [index - 11, index - 1, index + 9].includes(i)) &&
    !(isRightEdge && [index - 9, index + 1, index + 11].includes(i)));
}

// Handle left-click
function handleClick(cell) {
  if (cell.classList.contains('checked') || cell.classList.contains('flag')) return;
  if (cell.classList.contains('bomb')) {
    revealBombs();
    result.textContent = 'YOU LOSE!';
    return;
  }
  revealCell(cell);
  checkWin();
}

// Reveal a cell
function revealCell(cell) {
  if (cell.classList.contains('checked') || cell.classList.contains('flag')) return;
  const bombCount = cell.getAttribute('data');
  cell.classList.add('checked');
  cell.textContent = bombCount;
  if (bombCount == 0) {
    const adjacentCells = getAdjacentIndices(parseInt(cell.id));
    adjacentCells.forEach((i) => revealCell(document.getElementById(i)));
  }
}

// Toggle flag
function toggleFlag(cell) {
  if (cell.classList.contains('checked')) return;
  if (cell.classList.contains('flag')) {
    cell.classList.remove('flag');
    cell.textContent = '';
    flagCount++;
  } else if (flagCount > 0) {
    cell.classList.add('flag');
    cell.textContent = '🚩';
    flagCount--;
  }
  flagsLeft.textContent = flagCount;
  checkWin();
}

// Reveal all bombs
function revealBombs() {
  bombLocations.forEach((i) => {
    const bombCell = document.getElementById(i);
    bombCell.textContent = '💣';
    bombCell.classList.add('checked');
  });
}

// Check if user has won
function checkWin() {
  const cells = document.querySelectorAll('#game-board div');
  const checkedCount = [...cells].filter((cell) => cell.classList.contains('checked')).length;
  const correctFlags = bombLocations.filter((i) => document.getElementById(i).classList.contains('flag')).length;

  if (checkedCount + bombLocations.length === 100 || correctFlags === 10) {
    result.textContent = 'YOU WIN!';
  }
}

// Start the game
createBoard();
