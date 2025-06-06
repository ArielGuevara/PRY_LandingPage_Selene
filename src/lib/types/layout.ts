document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');
    const header = document.getElementById('main-header');

    if (!nav || !header) {
        console.error('El elemento #main-nav o #main-header no está presente en el DOM.');
        return;
    }

    // Verificar el estado inicial al cargar la página
    if (window.scrollY > header.offsetHeight) {
        nav.classList.add('fixed', 'inset-0', 'w-[94%]');
        nav.classList.remove('relative');
    } else {
        nav.classList.remove('fixed', 'w-full');
        nav.classList.add('relative', 'z-20');
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > header.offsetHeight) {
            nav.classList.add('fixed', 'inset-0', 'w-[94%]');
            nav.classList.remove('relative');
        } else {
            nav.classList.remove('fixed', 'w-full');
            nav.classList.add('relative', 'z-20');
        }
    });

});


export function setupMenuToggle() {
    const menu = document.getElementById('main-menu');
    const container_nav = document.getElementById('main-menu-nav');
    const overlay = document.createElement('div');

    if (!menu || !container_nav) return;
    container_nav.classList.add('hidden', 'translate-x-full');

    overlay.id = 'overlay';
    overlay.classList.add('fixed', 'inset-0','backdrop-blur-sm', 'z-10', 'hidden');
    document.body.appendChild(overlay);

    menu.addEventListener('click', () => {
        container_nav.classList.remove('hidden');
        void container_nav.offsetWidth;
        overlay.classList.remove('hidden');
        container_nav.classList.remove('translate-x-full');
        container_nav.classList.add('translate-x-0');
    })
}

export function closeMenu() {
    const nav_x = document.getElementById('menu-nav-x');
    const container_nav = document.getElementById('main-menu-nav');
    const overlay = document.getElementById('overlay');

    if (!nav_x || !container_nav || !overlay)  return;
    nav_x.addEventListener('click', () => {
        container_nav.classList.remove('translate-x-0');
        container_nav.classList.add('translate-x-full');
        overlay.classList.add('hidden');

        container_nav.addEventListener('transitionend', () => {
            if (container_nav.classList.contains('translate-x-full')) {
                container_nav.classList.add('hidden');
            }
        }, { once: true });
    })
}


// const slider = document.querySelector<HTMLElement>("#slider");
// if (!slider) {
//     console.error("El elemento #slider no está presente en el DOM.");
//     throw new Error("El elemento #slider no está presente en el DOM.");
// }
// const childsSlider = [...slider.querySelectorAll<HTMLElement>("figure")];
// const nextButton = document.querySelector<HTMLElement>("[data-button='next']");
// const prevButton = document.querySelector<HTMLElement>("[data-button='prev']");
// const lengthImages = childsSlider.length;
//
// // Asignar índices a los elementos
// childsSlider.forEach((child, index) => {
//     child.dataset.idSlider = index.toString();
// });
//
// // Función para obtener la imagen actual con tipado correcto
// function getCurrentImage(){
//     return slider?.querySelector("[data-active]");
// }
//
// nextButton?.addEventListener("click", () => {
//     const currentImage = getCurrentImage();
//     if (!currentImage){
//         console.log("No hay imagen activa");
//         return;
//     }
//
//     // Convertir a número (parseInt o el operador +)
//     let currentActiveIndex = parseInt(currentImage.dataset.idSlider || "0");
//     currentActiveIndex++;
//
//     if (currentActiveIndex >= lengthImages) {
//         currentActiveIndex = 0;
//     }
//
//     const newActiveElement = childsSlider[currentActiveIndex];
//     removeActiveElement();
//     addNewActiveElement(newActiveElement);
// });
//
// // Funciones auxiliares (ya estaban correctas)
// function removeActiveElement(): void {
//     const currentImage = getCurrentImage();
//     currentImage?.removeAttribute("data-active");
// }
//
// function addNewActiveElement(element: HTMLElement): void {
//     element.setAttribute("data-active", "");
// }