'use strict';

/* =============== 
   Gameplay
   =============== */
const EMPTY = 0;
const LEFT = 1;
const RIGHT = 2;
const NO_FIELDS = 9;

let initBoard = [RIGHT, RIGHT, RIGHT, RIGHT, EMPTY, LEFT, LEFT, LEFT, LEFT];
let finalBoard = [LEFT, LEFT, LEFT, LEFT, EMPTY, RIGHT, RIGHT, RIGHT, RIGHT];
let board;
let moves;

function clearBoard() {
  board = initBoard.slice();
  moves = [];
}

function hasWon() {
  return board.every(function(value, index) { return value == finalBoard[index]});
}

function doMove(field) {
  // Move arrow <field> (0-8). Do the move and return true if the move is allowed, return false and don't change anything if not
  if (board[field] == LEFT)  {
    if (field >= 1 && board[field-1] == EMPTY) {
      board[field-1] = LEFT;
      board[field] = EMPTY;
      moves.push(field);
      return true;
    } else if (field >= 2 && board[field-1] == RIGHT && board[field-2] == EMPTY) {
      board[field-2] = LEFT;
      board[field] = EMPTY;
      moves.push(field);
      return true;
    }
  } else if (board[field] == RIGHT) {
    if (field <= 7 && board[field+1] == EMPTY) {
      board[field+1] = RIGHT;
      board[field] = EMPTY;
      moves.push(field);
      return true;
    } else if (field <= 6 && board[field+1] == LEFT && board[field+2] == EMPTY) {
      board[field+2] = RIGHT;
      board[field] = EMPTY;
      moves.push(field);
      return true;
    }
  }
  return false;
}

function undoLastMove() {
  if (moves.length == 0) {
    return false;
  }
  let movesToKeep = moves.slice(0, -1);
  clearBoard();
  for (let move of movesToKeep) {
    doMove(move);
  }
  return true;
}

function checkIfBoardCanWin() {
  // Return true if the current board state can still lead to a win.
  if (hasWon()) {
    return true;
  }
  for (let i=0; i < NO_FIELDS; i++) {
    if (doMove(i)) {
      let hasSuccess = checkIfBoardCanWin();
      undoLastMove();
      if (hasSuccess) {
        return true;
      }
    }
  }
  return false;
}

function getWinningFields() {
  let winningFields = [];
  for (let i = 0; i < NO_FIELDS; i++) {
    if (doMove(i)) {
      if (checkIfBoardCanWin()) {
        winningFields.push(i);
      }
      undoLastMove();
    }
  }
  return winningFields;
}

/* =============== 
   UI updates 
   =============== */
const IMAGE_URLS = ["images/empty.png", "images/left.png", "images/right.png"];
let uiBlocks;

function uiInit() {
  uiBlocks = [];
  for (let i=0; i < NO_FIELDS; i++) {
    uiBlocks[i] = document.getElementById(String(i));
  }
}

function uiRedraw() {
  for (let i=0; i < NO_FIELDS; i++) {
    uiBlocks[i].src = IMAGE_URLS[board[i]];
  }
}

function uiError() {
  // flash an error on all blocks for 500 ms
  for(let block of uiBlocks) {
    block.classList.add("blocked");
  }
  setTimeout(() => {
    for(let block of uiBlocks ) {
      block.classList.remove("blocked");
    }
  }, 500);
}

function uiShowWinningFields(fields) {
  for(let index of fields) {
    uiBlocks[index].classList.add("hint");
  }
  setTimeout(() => {
    for(let index of fields ) {
      uiBlocks[index].classList.remove("hint");
    }
  }, 500);
}

/* =============== 
   Event handlers
   =============== */
function eventButtonClick(field) {
  if (doMove(field)) {
    uiRedraw();
    if (hasWon()) {
      alert("Congratulations !");
    }
  } else {
    uiError();
  }
}

function eventClearBoard() {
  clearBoard();
  uiRedraw();
}

function eventUndo() {
  if (undoLastMove()) {
    uiRedraw();
  } else {
    uiError();
  }
}

function eventHint() {
  let winningFields = getWinningFields();
  if (winningFields.length > 0) {
    uiShowWinningFields(winningFields);
  } else {
    uiError();
  }
}

/* =============== 
   Initialization
   =============== */
function addBlockEventHandlers() {
  for (let i = 0; i < NO_FIELDS; i++) {
    uiBlocks[i].addEventListener("click", () => eventButtonClick(i));
  }
}

function addButtonEventHandlers() {
  document.getElementById("newgame").addEventListener("click", eventClearBoard);
  document.getElementById("undo").addEventListener("click", eventUndo);
  document.getElementById("hint").addEventListener("click", eventHint);
}

window.onload = function() {
  uiInit();

  addBlockEventHandlers();
  addButtonEventHandlers();

  clearBoard();
  uiRedraw();
}
