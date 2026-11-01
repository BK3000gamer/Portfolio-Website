let phone = document.getElementById("phone");
let content = document.getElementById("content");
let menu_content = document.getElementById("menu_content");
let name = document.getElementById("name");

const resizeObserver2 = new ResizeObserver(entries => {
    for (let entry of entries) {
        phone.style.width = `${entry.contentRect.width}px`;
        phone.style.height = `${entry.contentRect.height}px`;
        content.style.width = `${entry.contentRect.width}px`;
        content.style.height = `${entry.contentRect.height}px`;
        menu_content.style.fontSize = `${entry.contentRect.height/95}px`;
        name.style.fontSize = `${entry.contentRect.height/50}px`;
    }
})

resizeObserver2.observe(canvas);