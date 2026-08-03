//board
let board;
const rowCount = 11;
const colCount = 20;
const tileSize = 16;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;
let finalScale

//map
let mapContainer;
let mapMenu;
const mapWidth = 4 * tileSize;
const mapHeight = 8 * tileSize;
let mapOpened = false;

//animations
let runSouthAnimationFrames = []
let runNorthAnimationFrames = []
let runWestAnimationFrames = []
let runEastAnimationFrames = []
let idleSouthAnimationFrame = new Image();
let idleNorthAnimationFrame = new Image();
let idleWestAnimationFrame = new Image();
let idleEastAnimationFrame = new Image();
const directionIdleAnimationFrame = {
    'N': idleNorthAnimationFrame,
    'S': idleSouthAnimationFrame,
    'E': idleEastAnimationFrame,
    'W': idleWestAnimationFrame,
}
let idleAnimationFrames = []
let animationFrames = idleAnimationFrames
const directionAnimations = {
    'O': idleAnimationFrames,
    'N': runNorthAnimationFrames,
    'S': runSouthAnimationFrames,
    'E': runEastAnimationFrames,
    'W': runWestAnimationFrames,
};
let runAnimationIndex = 0;

//character
let player;
let queuedDirection = null;

//inputs
const keysPressed = new Set();
const movementKeys = ["ArrowUp", "KeyW", "ArrowDown", "KeyS", "ArrowLeft", "KeyA", "ArrowRight", "KeyD"];
//update frames
let lastTime = 0;
let animAccumulator = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    mapMenu = document.getElementById("map_inner");
    mapContainer = document.getElementById("map")
    mapMenu.height = mapHeight;
    mapMenu.width = mapWidth;

    context = board.getContext("2d");

    context.imageSmoothingEnabled = false;

    resizeBoard();
    window.addEventListener("resize", resizeBoard);

    loadImages()
    loadMap()
    applyDirection('O')
    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);
    document.addEventListener("keydown", openMap);
}

function resizeBoard() {
    // figure out the largest integer scale that fits the window
    const scale = Math.floor(
        Math.min(window.innerWidth / boardWidth, window.innerHeight / boardHeight)
    );
    finalScale = Math.max(scale, 1); // never go below 1x

    board.style.width = boardWidth * finalScale + "px";
    board.style.height = boardHeight * finalScale + "px";

    mapMenu.style.width = mapWidth * finalScale + "px";
    mapMenu.style.height = mapHeight * finalScale + "px";
}

function loadImages() {
    //load run animations
    for (let i = 1; i < 5; i++) {
        let runSouthAnimationFrame = new Image();
        runSouthAnimationFrame.src = `assets/character/Character${i}.png`;
        runSouthAnimationFrames.push(runSouthAnimationFrame);
    }

    for (let i = 5; i < 9; i++) {
        let runNorthAnimationFrame = new Image();
        runNorthAnimationFrame.src = `assets/character/Character${i}.png`;
        runNorthAnimationFrames.push(runNorthAnimationFrame);
    }

    for (let i = 9; i < 11; i++) {
        let runWestAnimationFrame = new Image();
        runWestAnimationFrame.src = `assets/character/Character${i}.png`;
        runWestAnimationFrames.push(runWestAnimationFrame);
    }

    for (let i = 11; i < 13; i++) {
        let runEastAnimationFrame = new Image();
        runEastAnimationFrame.src = `assets/character/Character${i}.png`;
        runEastAnimationFrames.push(runEastAnimationFrame);
    }

    idleSouthAnimationFrame.src = `assets/character/Character2.png`
    idleNorthAnimationFrame.src = `assets/character/Character6.png`
    idleWestAnimationFrame.src = `assets/character/Character10.png`
    idleEastAnimationFrame.src = `assets/character/Character12.png`
    idleAnimationFrames.push(idleSouthAnimationFrame);
}