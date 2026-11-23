let content = document.getElementById("content");
let menu_content = document.getElementById("menu_content");
let window_class = document.querySelectorAll('.window')
let window_header = document.querySelectorAll('.window_header');
let window_buttons = document.querySelectorAll('.window_buttons');
let window_title =  document.querySelectorAll('.window_title');

const resizeObserver2 = new ResizeObserver(entries => {
    for (let entry of entries) {
        content.style.width = `${entry.contentRect.width}px`;
        content.style.height = `${entry.contentRect.height}px`;
        menu_content.style.fontSize = `${entry.contentRect.height/75}px`;
        menu_content.style.width = `${entry.contentRect.width/2.5}px`;
        menu_content.style.height = `${entry.contentRect.width/2.5}px`;
        window_class.forEach(el => el.style.setProperty('--border-size', `${entry.contentRect.width/160}px`));
        window_header.forEach(el => el.style.setProperty('--height', `${entry.contentRect.width/80}px`));
        window_buttons.forEach(el => el.style.setProperty('--width', `${entry.contentRect.width/40}px`));
        window_title.forEach(el => el.style.fontSize = `${entry.contentRect.height/30}px`);
        window_title.forEach(el => el.style.setProperty('--spacing', `${entry.contentRect.width/320}px`));
    }
})

resizeObserver2.observe(canvas);

let z = 100

function bringToFront(win) {
    z += 10
    const target = win.closest('.menu') || win;
    target.style.setProperty('--z-index', z);
}

function openWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.add('open');
    bringToFront(win);
}

function closeWindow(id) {
    document.getElementById(id).classList.remove('open');
}

function toggleWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;
    win.classList.contains('open') ? closeWindow(id) : openWindow(id);
}

function initWindow(window_ele) {
    const header = window_ele.querySelector('.window_header');

    window_ele.addEventListener('mousedown', () => bringToFront(window_ele));

    header.addEventListener('mousedown', (event) => {
        if (event.target.closest('.window_button')) return;

        window_ele.classList.add('dragging');

        const style = getComputedStyle(window_ele);
        let l = parseFloat(style.left) || 0;
        let t = parseFloat(style.top) || 0;

        let startX = event.clientX
        let startY = event.clientY

        const drag = (event) => {
            event.preventDefault();

            window_ele.style.left = l + (event.clientX - startX) + 'px';
            window_ele.style.top = t + (event.clientY - startY) + 'px';
        };

        const mouseup = () => {
            window_ele.classList.remove('dragging');

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', mouseup);
        };

        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', mouseup);
    });
}

document.querySelectorAll('.window').forEach(initWindow);

document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
        e.preventDefault();
        openWindow(opener.dataset.open);
        return;
    }
    const closer = e.target.closest('[data-close]');
    if (closer) {
        e.preventDefault();
        closeWindow(opener.dataset.close);
    }
});