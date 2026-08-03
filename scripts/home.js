//tilemap
const tilemap = [
    "                    ",
    "                    ",
    "                    ",
    "                    ",
    "      XXXXXXXX      ",
    "     X    P   M     ",
    "      DB XXXA X     ",
    "      X X   DX      ",
    "       X            ",
    "                    ",
    "                    "
]
const walls = new Set();
const doors = new Set();
const maps = new Set();
const doorUrls = ['balcony.html', 'toilet.html']

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
            else if (tilemapChar === 'A') {
                if (document.referrer === 'http://localhost:63342/index.html/pages/toilet.html' || document.referrer === 'https://bk3000gamer.github.io/Portfolio-Website/toilet.html') {
                    idleAnimationFrames[0] = idleNorthAnimationFrame;
                    player = new Character(idleAnimationFrames[0], x, y, tileSize, tileSize, 'N');
                    console.log(player.lastDirection)
                }
            }
            else if (tilemapChar === 'B') {
                if (document.referrer === 'http://localhost:63342/index.html/pages/balcony.html' || document.referrer === 'https://bk3000gamer.github.io/Portfolio-Website/balcony.html') {
                    idleAnimationFrames[0] = idleEastAnimationFrame;
                    player = new Character(idleAnimationFrames[0], x, y, tileSize, tileSize, 'E');
                    console.log(player.lastDirection)
                }
            }
            else if (tilemapChar === 'M') {
                const map = new Map(x, y, tileSize, tileSize)
                maps.add(map)
            }
            else if (tilemapChar === 'P') {
                if (player == null) {
                    player = new Character(idleAnimationFrames[0], x, y, tileSize, tileSize, 'S');
                }
            }
        }
    }

    for (const [i, door] of [...doors].entries()) {
        door.url = doorUrls[i]
    }
}
