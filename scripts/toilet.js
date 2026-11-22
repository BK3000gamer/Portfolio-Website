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
let bio = document.getElementById("bio");
let who  = document.getElementById("who");
let tab_name = document.querySelectorAll(".tab_name");
let tab_content = document.querySelectorAll(".tab_content");

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        back.style.fontSize = `${entry.contentRect.height/50}px`;
        bio.style.fontSize = `${entry.contentRect.height/75}px`;
        who.style.fontSize = `${entry.contentRect.height/100}px`;
        tab_name.forEach(el => el.style.fontSize = `${entry.contentRect.height/50}px`);
        tab_content.forEach(el => el.style.fontSize = `${entry.contentRect.height/50}px`);
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

const sections = [{
    file: 'datas/educations.json',
    target: '#edu',
    fields: ['degree', 'school', 'time', 'description']
}, {
    file: 'datas/experiences.json',
    target: '#exp',
    fields: ['role', 'company', 'time', 'location', 'description']
},    {
    file: 'datas/endorsements.json',
    target: '#end',
    fields: ['person', 'role', 'time', 'relationship', 'comment']
}];

function buildDl(item, fields) {
    const dl = document.createElement('dl');

    fields.forEach((key, i) => {
        const el = document.createElement(i === 0 ? 'dt' : 'dd');
        if (key === 'time') el.className = 'time';
        el.textContent = item[key] ?? 'N/A';
        dl.appendChild(el);
    });

    return dl;
}

async function loadSections() {
    try {
        const result = await Promise.all(
            sections.map(s =>
                fetch(s.file).then(res => {
                    if (!res.ok) throw new Error(`${s.file}: ${res.status}`);
                    return res.json();
                })
            )
        );

        result.forEach((item, i) => {
            const {target, fields} = sections[i];
            const container = document.querySelector(target);
            container.innerHTML = '';
            item.forEach(item => container.appendChild(buildDl(item, fields)));
        });
    } catch (err) {
        console.error('Failed to load data', err);
    }
}

loadSections();