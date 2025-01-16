const grid = document.getElementById("grid");
const flagsLeftDisplay = document.getElementById("flagsLeft");
const resultDisplay = document.getElementById("result");

let bombArray = [];
let isGameOver = false;
let flagCount = 10;
let safeCellsClicked = 0;

// Initialize the grid
function createBoard() {
  bombArray = generateBombPositions(10, 100); // 10 bombs in a 10x10 grid
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.setAttribute("id", i);
    cell.classList.add("valid");
    grid.appendChild(cell);
    cell.addEventListener("click", () => handleClick(cell));
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      toggleFlag(cell);
    });
  }
  setBombCounts();
}

// Generate bomb positions
function generateBombPositions(bombCount, totalCells) {
  const positions = new Set();
  while (positions.size < bombCount) {
    positions.add(Math.floor(Math.random() * totalCells));
  }
  return Array.from(positions);
}

// Set the bomb counts for each cell
function setBombCounts() {
  const cells = document.querySelectorAll("#grid div");
  cells.forEach((cell, index) => {
    if (bombArray.includes(index)) {
      cell.classList.replace("valid", "bomb");
    } else {
      const bombCount = countBombsAround(index);
      cell.setAttribute("data", bombCount);
    }
  });
}

// Count bombs around a cell
function countBombsAround(index) {
  const adjacentCells = getAdjacentCells(index);
  return adjacentCells.filter((i) => bombArray.includes(i)).length;
}

// Get adjacent cells for a given index
function getAdjacentCells(index) {
  const isLeftEdge = index % 10 === 0;
  const isRightEdge = (index + 1) % 10 === 0;
  const adjacentIndices = [
    index - 11, index - 10, index - 9,
    index - 1,             index + 1,
    index + 9, index + 10, index + 11
  ];

  return adjacentIndices.filter((i) => 
    i >= 0 && i < 100 &&
    !(isLeftEdge && [index - 11, index - 1, index + 9].includes(i)) &&
    !(isRightEdge && [index - 9, index + 1, index + 11].includes(i))
  );
}

// Handle left-click on a cell
function handleClick(cell) {
  if (isGameOver || cell.classList.contains("checked") || cell.classList.contains("flag")) return;

  if (cell.classList.contains("bomb")) {
    cell.textContent = "💣";
    revealAllBombs();
    resultDisplay.textContent = "YOU LOSE!";
    isGameOver = true;
    return;
  }

  revealCell(cell);
  checkWin();
}

// Reveal a cell
function revealCell(cell) {
  if (cell.classList.contains("checked") || cell.classList.contains("flag")) return;
  const bombCount = cell.getAttribute("data");
  cell.classList.add("checked");
  cell.textContent = bombCount > 0 ? bombCount : "";
  safeCellsClicked++;

  if (bombCount == 0) {
    const adjacentCells = getAdjacentCells(parseInt(cell.id));
    adjacentCells.forEach((i) => revealCell(document.getElementById(i)));
  }
}

// Handle right-click (toggle flag)
function toggleFlag(cell) {
  if (isGameOver || cell.classList.contains("checked")) return;

  if (cell.classList.contains("flag")) {
    cell.classList.remove("flag");
    cell.textContent = "";
    flagCount++;
  } else if (flagCount > 0) {
    cell.classList.add("flag");
    cell.textContent = "🚩";
    flagCount--;
  }

  flagsLeftDisplay.textContent = flagCount;
  checkWin();
}

// Reveal all bombs on game over
function revealAllBombs() {
  bombArray.forEach((i) => {
    const bombCell = document.getElementById(i);
    bombCell.textContent = "💣";
    bombCell.classList.add("checked");
  });
}

// Check if the player has won
function checkWin() {
  if (safeCellsClicked === 90 || bombArray.every((i) => document.getElementById(i).classList.contains("flag"))) {
    resultDisplay.textContent = "YOU WIN!";
    isGameOver = true;
  }
}

// Start the game
createBoard();

