let content = document.getElementById("content");
let menu_content_2 = document.getElementById("menu_content");

const resizeObserver2 = new ResizeObserver(entries => {
    for (let entry of entries) {
        content.style.width = `${entry.contentRect.width}px`;
        content.style.height = `${entry.contentRect.height}px`;
        menu_content_2.style.fontSize = `${entry.contentRect.height/95}px`;
    }
})

resizeObserver2.observe(canvas);