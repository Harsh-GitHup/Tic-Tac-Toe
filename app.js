let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let isPlayerTurn = true; // true = Player (X), false = Computer (O)
let count = 0; // To Track Draw
let gameOver = false;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const resetGame = () => {
  isPlayerTurn = true;
  count = 0;
  gameOver = false;
  enableBoxes();
  msgContainer.classList.add("hide");
};

// Player's move (X)
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (!isPlayerTurn || gameOver || box.innerText !== "") return;
    
    // Player's move
    box.innerText = "X";
    box.disabled = true;
    count++;

    let isWinner = checkWinner();

    if (isWinner) {
      return;
    }

    if (count === 9) {
      gameDraw();
      return;
    }

    // Switch to computer's turn
    isPlayerTurn = false;
    disableBoxes();
    
    // Computer makes a move after a short delay
    setTimeout(computerMove, 500);
  });
});

// Computer's move (O)
const computerMove = () => {
  if (gameOver) return;
  
  let move = getBestMove();
  
  if (move !== -1) {
    boxes[move].innerText = "O";
    boxes[move].disabled = true;
    count++;

    let isWinner = checkWinner();

    if (isWinner) {
      return;
    }

    if (count === 9) {
      gameDraw();
      return;
    }

    // Switch back to player's turn
    isPlayerTurn = true;
    enableEmptyBoxes();
  } else {
    // No valid move available - should not happen in normal gameplay
    // but re-enable player turn as a fallback
    isPlayerTurn = true;
    enableEmptyBoxes();
  }
};

// AI: Get the best move for the computer
const getBestMove = () => {
  // 1. Try to win
  let winMove = findWinningMove("O");
  if (winMove !== -1) return winMove;

  // 2. Block player from winning
  let blockMove = findWinningMove("X");
  if (blockMove !== -1) return blockMove;

  // 3. Take center if available
  if (boxes[4].innerText === "") return 4;

  // 4. Take a corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => boxes[i].innerText === "");
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // 5. Take any available edge
  const edges = [1, 3, 5, 7];
  const availableEdges = edges.filter(i => boxes[i].innerText === "");
  if (availableEdges.length > 0) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }

  return -1;
};

// Find a winning move for the given player
const findWinningMove = (player) => {
  for (let pattern of winPatterns) {
    let values = pattern.map(i => boxes[i].innerText);
    let playerCount = values.filter(v => v === player).length;
    let emptyCount = values.filter(v => v === "").length;

    if (playerCount === 2 && emptyCount === 1) {
      // Find the empty position
      for (let i of pattern) {
        if (boxes[i].innerText === "") return i;
      }
    }
  }
  return -1;
};

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  gameOver = true;
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const enableEmptyBoxes = () => {
  for (let box of boxes) {
    if (box.innerText === "") {
      box.disabled = false;
    }
  }
};

const showWinner = (winner) => {
  if (winner === "X") {
    msg.innerText = `Congratulations! You win!`;
  } else {
    msg.innerText = `Computer wins! Better luck next time.`;
  }
  msgContainer.classList.remove("hide");
  gameOver = true;
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
  return false;
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
