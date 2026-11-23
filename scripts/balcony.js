//tilemap
const tilemap = [
    "                    ",
    "                    ",
    "                    ",
    "    XX              ",
    "   X  X             ",
    "   X  X             ",
    "   X  PD            ",
    "    XXX             ",
    "                    ",
    "                    ",
    "                    "
]
const walls = new Set();
const doors = new Set();
const maps = new Set();
const doorUrls = ['index.html']

let canvas = document.getElementById("board");
let back = document.getElementById("back");
let contact_me = document.getElementById("contact_me");
let form_group = document.querySelectorAll('.form_group');
let success = document.getElementById("success");
let error = document.getElementById("error");

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        back.style.fontSize = `${entry.contentRect.height/50}px`;
        contact_me.style.fontSize = `${entry.contentRect.height/25}px`;
        form_group.forEach(el => el.style.fontSize = `${entry.contentRect.height/50}px`);
        success.style.width = `${entry.contentRect.width/5}px`;
        success.style.height = `${(entry.contentRect.width/20)*3}px`;
        error.style.width = `${entry.contentRect.width/5}px`;
        error.style.height = `${(entry.contentRect.width/20)*3}px`;
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
                idleAnimationFrames[0] = idleWestAnimationFrame
                player = new Character(idleAnimationFrames[0], x, y, tileSize, tileSize, 'W');
            }
        }
    }

    for (const [i, door] of [...doors].entries()) {
        door.url = doorUrls[i]
    }
}

const form = document.getElementById("contact_form");

window.addEventListener("pageshow", form.reset());

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
        });

        if (response.ok) {
            form.reset()
            openWindow('success');
        } else {
            openWindow('error');
        }
    } catch (err) {
        openWindow('error');
    }
});