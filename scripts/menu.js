let phone = document.getElementById("phone");
let canvas = document.getElementById("board");
let content = document.getElementById("content");
let projects = document.getElementById("projects");
let contacts = document.getElementById("contacts");
let about = document.getElementById("about");

let newX = 0, newY = 0, startX = 0, startY = 0;

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        console.log('resize fired', entry.contentRect.width, entry.contentRect.height);
        phone.style.width = `${entry.contentRect.width}px`;
        phone.style.height = `${entry.contentRect.height}px`;
        content.style.width = `${entry.contentRect.width}px`;
        content.style.height = `${entry.contentRect.height}px`;
        projects.style.fontSize = `${entry.contentRect.height/50}px`;
        contacts.style.fontSize = `${entry.contentRect.height/50}px`;
        about.style.fontSize = `${entry.contentRect.height/50}px`;
    }
})

resizeObserver.observe(canvas);