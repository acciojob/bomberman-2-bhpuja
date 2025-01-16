
const gridSize = 10; // 10x10 grid
const totalBombs = 10; // Total bombs
let flagsLeft = totalBombs;
let cellsRevealed = 0;

// References
const gameContainer = document.getElementById("game-container");
const result = document.getElementById("result");
const flagsLeftSpan = document.getElementById("flagsLeft");

const cells = [];
const bombs = new Set();

// Initialize the game
function initGame() {
  generateGrid();
  placeBombs();
  updateFlagCount();
}

// Generate the grid
function generateGrid() {
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement("div");
    cell.id = i;
    cell.className = "cell";
    cell.dataset.value = 0; // Default bomb count
    cell.addEventListener("click", handleLeftClick);
    cell.addEventListener("contextmenu", handleRightClick);
    gameContainer.appendChild(cell);
    cells.push(cell);
  }
}

// Place bombs randomly
function placeBombs() {
  while (bombs.size < totalBombs) {
    const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
    bombs.add(randomIndex);
  }

  // Update neighboring cells' bomb counts
  bombs.forEach((bombIndex) => {
    cells[bombIndex].classList.add("bomb");
    const neighbors = getNeighbors(bombIndex);
    neighbors.forEach((neighbor) => {
      if (!bombs.has(neighbor)) {
        cells[neighbor].dataset.value = parseInt(cells[neighbor].dataset.value) + 1;
      }
    });
  });
}

// Get neighboring cells
function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < gridSize &&
        newCol >= 0 &&
        newCol < gridSize &&
        !(i === 0 && j === 0)
      ) {
        neighbors.push(newRow * gridSize + newCol);
      }
    }
  }

  return neighbors;
}

// Handle left click (reveal cell)
function handleLeftClick(e) {
  const cell = e.target;

  if (cell.classList.contains("checked") || cell.classList.contains("flag")) return;

  if (cell.classList.contains("bomb")) {
    revealAllBombs();
    result.textContent = "YOU LOSE!";
    return;
  }

  revealCell(cell);
  checkWinCondition();
}

// Reveal a cell
function revealCell(cell) {
  if (cell.classList.contains("checked")) return;

  cell.classList.add("checked");
  cell.textContent = cell.dataset.value;
  cellsRevealed++;

  if (cell.dataset.value === "0") {
    const neighbors = getNeighbors(parseInt(cell.id));
    neighbors.forEach((neighbor) => revealCell(cells[neighbor]));
  }
}

// Handle right click (flag cell)
function handleRightClick(e) {
  e.preventDefault();
  const cell = e.target;

  if (cell.classList.contains("checked")) return;

  if (cell.classList.contains("flag")) {
    cell.classList.remove("flag");
    cell.textContent = "";
    flagsLeft++;
  } else if (flagsLeft > 0) {
    cell.classList.add("flag");
    cell.textContent = "🚩";
    flagsLeft--;
  }

  updateFlagCount();
  checkWinCondition();
}

// Update flag count
function updateFlagCount() {
  flagsLeftSpan.textContent = flagsLeft;
}

// Reveal all bombs
function revealAllBombs() {
  bombs.forEach((bombIndex) => {
    const bombCell = cells[bombIndex];
    bombCell.classList.add("checked");
    bombCell.textContent = "💣";
  });
}

// Check win condition
function checkWinCondition() {
  if (cellsRevealed === gridSize * gridSize - totalBombs || flagsLeft === 0) {
    let allFlagsCorrect = true;

    bombs.forEach((bombIndex) => {
      if (!cells[bombIndex].classList.contains("flag")) {
        allFlagsCorrect = false;
      }
    });

    if (allFlagsCorrect) {
      result.textContent = "YOU WIN!";
    }
  }
}

// Start the game
initGame();
