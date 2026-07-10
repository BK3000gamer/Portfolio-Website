//board
let board;
const rowCount = 11;
const colCount = 20;
const tileSize = 16;
const boardWidth = colCount * tileSize;
const boardHeight = rowCount * tileSize;
let context;

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

//tilemap
const tilemap = [
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "           XDX      ",
    "          X P X     ",
    "          X   X     ",
    "           XXX      ",
    "                    "
]
const walls = new Set();
const doors = new Set();
const doorUrls = ['../index.html']

//update frames
let lastTime = 0;
let animAccumulator = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
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

function loadImages() {
    //load run animations
    for (let i = 1; i < 5; i++) {
        let runSouthAnimationFrame = new Image();
        runSouthAnimationFrame.src = `../assets/character/Character${i}.png`;
        runSouthAnimationFrames.push(runSouthAnimationFrame);
    }

    for (let i = 5; i < 9; i++) {
        let runNorthAnimationFrame = new Image();
        runNorthAnimationFrame.src = `../assets/character/Character${i}.png`;
        runNorthAnimationFrames.push(runNorthAnimationFrame);
    }

    for (let i = 9; i < 11; i++) {
        let runWestAnimationFrame = new Image();
        runWestAnimationFrame.src = `../assets/character/Character${i}.png`;
        runWestAnimationFrames.push(runWestAnimationFrame);
    }

    for (let i = 11; i < 13; i++) {
        let runEastAnimationFrame = new Image();
        runEastAnimationFrame.src = `../assets/character/Character${i}.png`;
        runEastAnimationFrames.push(runEastAnimationFrame);
    }

    idleSouthAnimationFrame.src = '../assets/character/Character2.png'
    idleNorthAnimationFrame.src = '../assets/character/Character6.png'
    idleWestAnimationFrame.src = '../assets/character/Character10.png'
    idleEastAnimationFrame.src = '../assets/character/Character12.png'
    idleAnimationFrames.push(idleSouthAnimationFrame);
}

function loadMap() {
    walls.clear();
    doors.clear();

    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            const row = tilemap[r];
            const tilemapChar = row[c];

            const x = c * tileSize;
            const y = r * tileSize;

            if (tilemapChar === 'X') {
                const wall = new Block(x, y, tileSize, tileSize)
                walls.add(wall);
            }
            else if (tilemapChar === 'D') {
                const door = new Door(x, y, tileSize, tileSize)
                doors.add(door);
            }
            else if (tilemapChar === 'P') {
                player = new Character(idleAnimationFrames[0], x, y, tileSize, tileSize, 'S');
            }
        }
    }

    for (const [i, door] of [...doors].entries()) {
        door.url = doorUrls[i]
    }
}

function update(timestamp) {
    if (lastTime === 0) lastTime = timestamp; // skip the bogus first delta
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    animAccumulator += delta;

    move(delta);

    if (isPlayerAligned() && queuedDirection !== null && queuedDirection !== player.direction) {
        applyDirection(queuedDirection);
    }

    if (animAccumulator >= 166.66) {
        animatePlayer();
        animAccumulator -= 166.66;
    }

    draw()
    requestAnimationFrame(update);
}

function move(delta) {
    const distance = 40 * (delta / 1000);

    player.x += player.velocityX !== 0 ? Math.sign(player.velocityX) * distance : 0;
    player.y += player.velocityY !== 0 ? Math.sign(player.velocityY) * distance : 0;

    if (player.velocityX !== 0) {
        const targetX = player.x + Math.sign(player.velocityX) * distance;
        const gridLineX = Math.sign(player.velocityX) > 0
            ? Math.ceil((player.x + 0.001) / tileSize) * tileSize
            : Math.floor((player.x - 0.001) / tileSize) * tileSize;

        // clamp so we never overshoot the next grid line
        player.x = Math.sign(player.velocityX) > 0
            ? Math.min(targetX, gridLineX)
            : Math.max(targetX, gridLineX);
    }

    if (player.velocityY !== 0) {
        const targetY = player.y + Math.sign(player.velocityY) * distance;
        const gridLineY = Math.sign(player.velocityY) > 0
            ? Math.ceil((player.y + 0.001) / tileSize) * tileSize
            : Math.floor((player.y - 0.001) / tileSize) * tileSize;

        player.y = Math.sign(player.velocityY) > 0
            ? Math.min(targetY, gridLineY)
            : Math.max(targetY, gridLineY);
    }

    for (let wall of walls.values()) {
        if (collision(player, wall)) {
            // revert fully to last aligned position on collision
            player.x = Math.round(player.x / tileSize) * tileSize;
            player.y = Math.round(player.y / tileSize) * tileSize;
            break;
        }
    }

    for (let door of doors.values()) {
        if (collision(player, door)) {
            window.location.href = door.url
            player.x = Math.round(player.x / tileSize) * tileSize;
            player.y = Math.round(player.y / tileSize) * tileSize;
            break;
        }
    }
}

function draw() {
    context.clearRect(0, 0, boardWidth, boardHeight);
    context.drawImage(player.image, Math.round(player.x), Math.round(player.y - 4), player.width, player.height);
}

function animatePlayer() {
    player.image = animationFrames[runAnimationIndex];
    if (animationFrames.length > 0) {
        runAnimationIndex++;
        runAnimationIndex %= animationFrames.length;
    }
    else {
        runAnimationIndex = 0;
    }
}

function movePlayer(e) {
    if (e.repeat) return; // ignore OS key-repeat events entirely

    if (!movementKeys.includes(e.code)) return;

    keysPressed.add(e.code)

    if (e.code === "ArrowUp" || e.code === "KeyW") {
        queuedDirection = 'N';
    }
    else if (e.code === "ArrowDown" || e.code === "KeyS") {
        queuedDirection = 'S';
    }
    else if (e.code === "ArrowRight" || e.code === "KeyD") {
        queuedDirection = 'E';
    }
    else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        queuedDirection = 'W';
    }

    if (player.direction === 'O' && isPlayerAligned()) {
        applyDirection(queuedDirection);
    }
}

function stopPlayer(e) {
    keysPressed.delete(e.code)

    if (!movementKeys.includes(e.code)) return;

    const stillHeld = [...keysPressed].filter(k => movementKeys.includes(k));
    if (stillHeld.length === 0) {
        queuedDirection = 'O';
    }
    else {
        const codeToDirection = {
            "ArrowUp": 'N', "KeyW": 'N',
            "ArrowDown": 'S', "KeyS": 'S',
            "ArrowRight": 'E', "KeyD": 'E',
            "ArrowLeft": 'W', "KeyA": 'W',
        };
        queuedDirection = codeToDirection[stillHeld[stillHeld.length - 1]];
    }
}

function collision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function isAligned(pos) {
    const remainder = ((pos % tileSize) + tileSize) % tileSize;
    return remainder < 0.5 || remainder > tileSize - 0.5;
}

function isPlayerAligned() {
    return isAligned(player.x) && isAligned(player.y);
}

function applyDirection(direction) {
    player.updateDirection(direction);

    if (direction === 'O') {
        idleAnimationFrames[0] = directionIdleAnimationFrame[player.lastDirection];
        animationFrames = directionAnimations['O'];
    }
    else {
        animationFrames = directionAnimations[direction];
    }
    runAnimationIndex = 0;
}

class Block {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class Door {
    constructor(x, y, width, height, url) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.url = url;
    }
}

class Character {
    constructor(image, x, y, width, height, direction) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = 'O';
        this.lastDirection = direction;
        this.velocityX = 0;
        this.velocityY = 0;
    }

    updateDirection(direction) {
        if (direction !== 'O') {
            this.lastDirection = direction;
        }
        this.direction = direction;
        this.updateVelocity();
    }

    updateVelocity() {
        if (this.direction === 'S') {
            this.velocityX = 0;
            this.velocityY = tileSize/8;
        }
        else if (this.direction === 'N') {
            this.velocityX = 0;
            this.velocityY = -tileSize/8;
        }
        else if (this.direction === 'E') {
            this.velocityX = tileSize/8;
            this.velocityY = 0;
        }
        else if (this.direction === 'W') {
            this.velocityX = -tileSize/8;
            this.velocityY = 0;
        }
        else if (this.direction === 'O') {
            this.velocityX = 0;
            this.velocityY = 0;
        }
    }
}