//tilemap
const tilemap = [
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "            D       ",
    "           XPX      ",
    "           X X      ",
    "            X       ",
    "                    "
]
const walls = new Set();
const doors = new Set();
const maps = new Set();
const doorUrls = ['index.html']

let canvas = document.getElementById("board");
let back = document.getElementById("back");

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        back.style.fontSize = `${entry.contentRect.height/50}px`;
    }
})

resizeObserver.observe(canvas);

function loadMap() {
    walls.clear();
    doors.clear();
    maps.clear();

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
