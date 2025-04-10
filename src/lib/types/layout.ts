document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');
    const header = document.getElementById('main-header');

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


export function setupMenuToggle() {
    const menu = document.getElementById('main-menu');
    const container_nav = document.getElementById('main-menu-nav');

    if (!menu || !container_nav) return;
    container_nav.classList.add('hidden', 'translate-x-full');

    menu.addEventListener('click', () => {
        container_nav.classList.remove('hidden');
        void container_nav.offsetWidth;
        container_nav.classList.remove('translate-x-full');
        container_nav.classList.add('translate-x-0');
    })
}

export function closeMenu() {
    const nav_x = document.getElementById('menu-nav-x');
    const container_nav = document.getElementById('main-menu-nav');
    if (!nav_x || !container_nav)  return;
    nav_x.addEventListener('click', () => {
        container_nav.classList.remove('translate-x-0');
        container_nav.classList.add('translate-x-full');

        container_nav.addEventListener('transitionend', () => {
            if (container_nav.classList.contains('translate-x-full')) {
                container_nav.classList.add('hidden');
            }
        }, { once: true });
    })

}

