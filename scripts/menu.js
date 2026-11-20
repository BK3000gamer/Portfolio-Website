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

let z = 1

window_class.forEach((window_ele) => {
    const header = window_ele.querySelector('.window_header');

    window_ele.addEventListener('click', () => {
        z += 10
        window_ele.style.setProperty('--z-index', `${z}`)
    });

    header.addEventListener('mousedown', (event) => {
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
        }

        const mouseup = () => {
            window_ele.classList.remove('dragging');

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', mouseup);
        }

        document.addEventListener('mousemove', drag)
        document.addEventListener('mouseup', mouseup);
    })
})