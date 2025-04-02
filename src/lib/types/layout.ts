document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');
    const header = document.getElementById('main-header');
    const menu = document.getElementById('main-menu');

    if (!nav || !header) {
        console.error('El elemento #main-nav o #main-header no está presente en el DOM.');
        return;
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > header.offsetHeight) {
            nav.classList.add('fixed', 'inset-0', 'w-[94%]', 'z-10');
            nav.classList.remove('relative');
        } else {
            nav.classList.remove('fixed', 'inset-0', 'w-full', 'z-10');
            nav.classList.add('relative');
        }
    });

});

