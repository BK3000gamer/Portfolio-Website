let phone = document.getElementById("phone");
let container = document.getElementById("drag_container");
let canvas = document.getElementById("board");

let newX = 0, newY = 0, startX = 0, startY = 0;

const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        console.log('resize fired', entry.contentRect.width, entry.contentRect.height);
        phone.style.width = `${entry.contentRect.width}px`;
        phone.style.height = `${entry.contentRect.height}px`;
        container.style.width = `${entry.contentRect.width}px`;
        container.style.height = `${entry.contentRect.height}px`;
    }
})

resizeObserver.observe(canvas);

container.addEventListener("mousedown", mouseDown)

function mouseDown(e) {
    startX = e.clientX;
    startY = e.clientY;

    document.addEventListener("mousemove", mouseMove)
    document.addEventListener("mouseup", mouseUp)
}

function mouseMove(e) {
    newX = startX - e.clientX;
    newY = startY - e.clientY;

    startX = e.clientX;
    startY = e.clientY;

    container.style.top = `${container.offsetTop - newY}px`;
    container.style.left = `${container.offsetLeft - newX}px`;
}

function mouseUp(e) {
    document.removeEventListener("mousemove", mouseMove);
}