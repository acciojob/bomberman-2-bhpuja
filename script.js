const gridSize = 10;
let bombCount = 0;
let flagsLeft = 10;
let gameOver = false;

// Initialize the game grid and the bombs
function initializeGame() {
  const grid = document.getElementById("gameGrid");
  grid.innerHTML = ''; // Clear any existing grid

  // Create grid cells
  const cells = [];
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.id = i;
    cell.classList.add('valid');
    cell.dataset.bombs = '0'; // Default value for number of bombs in neighbors
    cells.push(cell);
    grid.appendChild(cell);
  }

  // Add bombs to random positions
  while (bombCount < 10) {
    const randIdx = Math.floor(Math.random() * cells.length);
    if (!cells[randIdx].classList.contains('bomb')) {
      cells[randIdx].classList.add('bomb');
      bombCount++;
    }
  }

  // Update the number of bombs around each cell
  cells.forEach(cell => {
    if (!cell.classList.contains('bomb')) {
      const adjacentCells = getAdjacentCells(cell.id);
      const bombCount = adjacentCells.filter(id => cells[id].classList.contains('bomb')).length;
      cell.dataset.bombs = bombCount;
    }
  });

  // Set up cell click events
  cells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (gameOver || cell.classList.contains('flag')) return;
      handleCellClick(cell);
    });
    cell.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (gameOver) return;
      handleRightClick(cell);
    });
  });
}

// Get the adjacent cells of a given cell ID
function getAdjacentCells(id) {
  const row = Math.floor(id / gridSize);
  const col = id % gridSize;
  const adjacentCells = [];

  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], // Top, Bottom, Left, Right
    [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonals
  ];

  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
      adjacentCells.push(newRow * gridSize + newCol);
    }
  });

  return adjacentCells;
}

// Handle cell left click
function handleCellClick(cell) {
  if (cell.classList.contains('bomb')) {
    gameOver = true;
    cell.classList.add('checked');
    document.getElementById('result').textContent = 'YOU LOSE!';
  } else {
    cell.classList.add('checked');
    const bombCount = parseInt(cell.dataset.bombs, 10);
    if (bombCount === 0) {
      getAdjacentCells(cell.id).forEach(id => {
        const adjacentCell = document.getElementById(id);
        if (!adjacentCell.classList.contains('checked')) {
          handleCellClick(adjacentCell); // Recursively reveal adjacent cells
        }
      });
    } else {
      cell.textContent = bombCount;
    }
  }

  checkWin();
}

// Handle cell right click (flagging)
function handleRightClick(cell) {
  if (cell.classList.contains('checked')) return; // Don't flag revealed cells
  if (cell.classList.contains('flag')) {
    cell.classList.remove('flag');
    flagsLeft++;
  } else {
    if (flagsLeft > 0) {
      cell.classList.add('flag');
      flagsLeft--;
    }
  }

  document.getElementById('flagsLeft').textContent = flagsLeft;
  checkWin();
}

// Check if the player has won
function checkWin() {
  const revealedCells = document.querySelectorAll('.checked').length;
  if (revealedCells === gridSize * gridSize - 10) {
    document.getElementById('result').textContent = 'YOU WIN!';
    gameOver = true;
  }
}

// Start the game
initializeGame();
