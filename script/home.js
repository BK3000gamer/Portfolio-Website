//board
let board;
const rowCount = 20;
const colCount = 40;
const tileSize = 8;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    context.imageSmoothingEnabled = false;

    resizeBoard();
    window.addEventListener("resize", resizeBoard);
}


function resizeBoard() {
    // figure out the largest integer scale that fits the window
    const scale = Math.floor(
        Math.min(window.innerWidth / boardWidth, window.innerHeight / boardHeight)
    );
    const finalScale = Math.max(scale, 1); // never go below 1x

    board.style.width = boardWidth * finalScale + "px";
    board.style.height = boardHeight * finalScale + "px";
}