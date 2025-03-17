console.log("Welcome!");
let endsound = new Audio("bright-notifications-151766.mp3");
let turnsound = new Audio("button-pressed-38129.mp3");
endsound.volume = 0.1;
turnsound.volume = 0.07;
let end = false;
let gameMode = "normal";

let playerXMoves = [];
let playerOMoves = [];

let humanMark = "X";
let computerMark = "O";

let difficulty = "hard";
let firstMove = "human";

let turn = "X";

let startButtonUsed = false;

function updateStartButtonVisibility() {
  if (gameMode === "computer" && firstMove === "computer" && !startButtonUsed) {
    document.getElementById("start").style.display = "inline-block";
  } else {
    document.getElementById("start").style.display = "none";
  }
}

document.getElementById("game-mode").addEventListener("change", function() {
  gameMode = this.value;
  if (gameMode === "computer") {
    document.getElementById("computer-settings").style.display = "flex";
  } else {
    document.getElementById("computer-settings").style.display = "none";
  }
  resetGame();
  updateStartButtonVisibility();
  console.log(`Game mode changed to: ${gameMode}`);
});

document.getElementById("difficulty").addEventListener("change", function() {
  difficulty = this.value;
});
document.getElementById("first-move").addEventListener("change", function() {
  firstMove = this.value;
  updateStartButtonVisibility();
});

const changeTurn = () => {
  turn = (turn === "X" ? "O" : "X");
  return turn;
};

const checkWin = () => {
  let boxtexts = document.getElementsByClassName("boxtext");
  let winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  winCombos.forEach(combo => {
    if (
      (boxtexts[combo[0]].innerText === boxtexts[combo[1]].innerText) &&
      (boxtexts[combo[0]].innerText === boxtexts[combo[2]].innerText) &&
      (boxtexts[combo[0]].innerText !== '')
    ) {
      document.getElementById("infotext").innerHTML = boxtexts[combo[1]].innerText + " WINS!!!";
      combo.forEach(index => {
        boxtexts[index].style.backgroundColor = 'chartreuse';
      });
      end = true;
      disableGame();
      endsound.play();
      document.getElementsByTagName("img")[0].style.width = "34vh";
    }
  });
  
  if (!end && (gameMode === "normal" || gameMode === "computer")) {
    let board = getBoard();
    if (board.every(cell => cell !== '')) {
      document.getElementById("infotext").innerText = "Draw";
      disableGame();
    }
  }
};

function getBoard() {
  const board = [];
  let boxtexts = document.getElementsByClassName("boxtext");
  for (let i = 0; i < boxtexts.length; i++) {
    board.push(boxtexts[i].innerText);
  }
  return board;
}

function checkWinner(board, player) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let combo of wins) {
    if (board[combo[0]] === player && board[combo[1]] === player && board[combo[2]] === player) {
      return true;
    }
  }
  return false;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinner(board, computerMark)) {
    return 10 - depth;
  }
  if (checkWinner(board, humanMark)) {
    return depth - 10;
  }
  if (board.every(cell => cell !== '')) {
    return 0;
  }
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = computerMark;
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = humanMark;
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function getBestMove() {
  let board = getBoard();
  let bestScore = -Infinity;
  let move = -1;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = computerMark;
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function computerMove() {
  let move;
  if (difficulty === "easy") {
    let board = getBoard();
    let available = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') available.push(i);
    }
    move = available[Math.floor(Math.random() * available.length)];
  } else if (difficulty === "medium") {
    if (Math.random() < 0.5) {
      let board = getBoard();
      let available = [];
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') available.push(i);
      }
      move = available[Math.floor(Math.random() * available.length)];
    } else {
      move = getBestMove();
    }
  } else {
    move = getBestMove();
  }
  if (move !== -1) {
    const boxes = document.getElementsByClassName("box");
    const box = boxes[move];
    const boxtext = box.querySelector(".boxtext");
    if (boxtext.innerText === '' && !end) {
      boxtext.innerText = computerMark;
      if (turnsound.paused) {
        turnsound.play();
      } else {
        turnsound.currentTime = 0;
        turnsound.play();
      }
      changeTurn();
      document.getElementById("infotext").innerText = "Turn for " + turn;
      checkWin();
    }
  }
}

let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach(element => {
  let boxtext = element.querySelector(".boxtext");
  element.addEventListener('click', () => {
    if (boxtext.innerText === '' && !end) {
      if (gameMode === "hard") {
        if (turn === "X") {
          if (playerXMoves.length < 3) {
            playerXMoves.push(element);
            boxtext.innerText = turn;
            if (turnsound.paused) {
              turnsound.play();
            } else {
              turnsound.currentTime = 0;
              turnsound.play();
            }
          } else {
            let oldestMove = playerXMoves.shift();
            let oldestBoxText = oldestMove.querySelector(".boxtext");
            oldestBoxText.innerText = '';
            playerXMoves.push(element);
            boxtext.innerText = turn;
          }
        } else {
          if (playerOMoves.length < 3) {
            playerOMoves.push(element);
            boxtext.innerText = turn;
            if (turnsound.paused) {
              turnsound.play();
            } else {
              turnsound.currentTime = 0;
              turnsound.play();
            }
          } else {
            let oldestMove = playerOMoves.shift();
            let oldestBoxText = oldestMove.querySelector(".boxtext");
            oldestBoxText.innerText = '';
            playerOMoves.push(element);
            boxtext.innerText = turn;
          }
        }
      } else if (gameMode === "computer") {
        if (turn === humanMark) {
          boxtext.innerText = humanMark;
          if (turnsound.paused) {
            turnsound.play();
          } else {
            turnsound.currentTime = 0;
            turnsound.play();
          }
          changeTurn();
          document.getElementById("infotext").innerText = "Turn for " + turn;
          checkWin();
          if (!end && turn === computerMark) {
            setTimeout(computerMove, 500);
          }
          return;
        }
      } else {
        boxtext.innerText = turn;
        if (turnsound.paused) {
          turnsound.play();
        } else {
          turnsound.currentTime = 0;
          turnsound.play();
        }
      }
      changeTurn();
      document.getElementById("infotext").innerText = "Turn for " + turn;
      checkWin();
      if (gameMode === "computer" && !end && turn === computerMark) {
        setTimeout(computerMove, 500);
      }
    }
  });
});

function disableGame() {
  document.querySelector('.g_game').classList.add('disabled');
}

function enableGame() {
  document.querySelector('.g_game').classList.remove('disabled');
}

function resetGame() {
  let boxtexts = document.querySelectorAll('.boxtext');
  Array.from(boxtexts).forEach(element => {
    element.innerText = '';
    element.style.backgroundColor = "rgb(143, 253, 255)";
  });
  end = false;
  playerXMoves = [];
  playerOMoves = [];
  enableGame();
  if (gameMode === "computer") {
    if (firstMove === "human") {
      humanMark = "X";
      computerMark = "O";
      turn = humanMark;
    } else {
      humanMark = "O";
      computerMark = "X";
      turn = computerMark;
    }
    document.getElementById("infotext").innerText = "Turn for " + turn;
    if (turn === computerMark) {
      setTimeout(computerMove, 500);
    }
  } else {
    turn = "X";
    document.getElementById("infotext").innerText = "Turn for " + turn;
  }
  document.getElementsByTagName("img")[0].style.width = "0vh";
}

document.getElementById("start").addEventListener('click', () => {
  startButtonUsed = true;
  updateStartButtonVisibility();
  resetGame();
});

document.getElementById("reset").addEventListener('click', resetGame);

updateStartButtonVisibility();


window.addEventListener('load', function() {
  const footer = document.querySelector('footer');
  footer.style.opacity = 0;
  footer.style.transition = 'opacity 1s linear';
  setTimeout(() => {
    footer.style.opacity = 1;
  }, 400);
});
