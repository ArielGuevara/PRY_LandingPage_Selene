export default class ImageSlider {
    constructor(options) {
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.isDragging = false;
        this.startPosX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationId = null;
        // Inicializar elementos
        this.sliderElement = document.getElementById(options.sliderId);
        this.slidesContainer = this.sliderElement.querySelector('#slidesContainer');
        this.slides = this.slidesContainer.querySelectorAll('[data-index]');
        this.prevButton = this.sliderElement.querySelector('#prevButton');
        this.nextButton = this.sliderElement.querySelector('#nextButton');
        this.indicators = this.sliderElement.querySelectorAll('#indicators button');
        // Configuración
        const { autoPlay = false, interval = 3000 } = options;
        // Establecer el ancho del contenedor
        this.setupSlider();
        // Event listeners
        this.prevButton.addEventListener('click', () => this.goToPrev());
        this.nextButton.addEventListener('click', () => this.goToNext());
        // Touch events para móviles
        this.slidesContainer.addEventListener('touchstart', this.touchStart.bind(this));
        this.slidesContainer.addEventListener('touchmove', this.touchMove.bind(this));
        this.slidesContainer.addEventListener('touchend', this.touchEnd.bind(this));
        // Mouse events para desktop
        this.slidesContainer.addEventListener('mousedown', this.touchStart.bind(this));
        this.slidesContainer.addEventListener('mousemove', this.touchMove.bind(this));
        this.slidesContainer.addEventListener('mouseup', this.touchEnd.bind(this));
        this.slidesContainer.addEventListener('mouseleave', this.touchEnd.bind(this));
        // Indicadores
        this.indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                const target = e.target;
                const index = parseInt(target.dataset.index);
                this.goToSlide(index);
            });
        });
        // Autoplay
        if (autoPlay) {
            this.startAutoPlay(interval);
            // Pausar autoplay cuando el mouse entra al slider
            this.sliderElement.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });
            // Reanudar autoplay cuando el mouse sale del slider
            this.sliderElement.addEventListener('mouseleave', () => {
                this.startAutoPlay(interval);
            });
        }
        // Actualizar al cambiar el tamaño de la ventana
        window.addEventListener('resize', () => {
            this.setupSlider();
            this.updateSliderPosition();
        });
    }
    setupSlider() {
        const sliderWidth = this.sliderElement.clientWidth;
        this.slides.forEach(slide => {
            slide.style.width = `${sliderWidth}px`;
        });
        this.slidesContainer.style.width = `${sliderWidth * this.slides.length}px`;
    }
    updateSliderPosition() {
        const sliderWidth = this.sliderElement.clientWidth;
        this.slidesContainer.style.transform = `translateX(-${this.currentIndex * sliderWidth}px)`;
        this.updateIndicators();
    }
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('bg-white', 'scale-125');
                indicator.classList.remove('bg-white/30');
            }
            else {
                indicator.classList.remove('bg-white', 'scale-125');
                indicator.classList.add('bg-white/30');
            }
        });
    }
    goToSlide(index) {
        if (index < 0) {
            index = this.slides.length - 1;
        }
        else if (index >= this.slides.length) {
            index = 0;
        }
        this.currentIndex = index;
        this.updateSliderPosition();
    }
    goToNext() {
        this.goToSlide(this.currentIndex + 1);
    }
    goToPrev() {
        this.goToSlide(this.currentIndex - 1);
    }
    startAutoPlay(interval) {
        this.autoPlayInterval = window.setInterval(() => {
            this.goToNext();
        }, interval);
    }
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    // Touch/Mouse handlers para arrastrar el slider
    touchStart(e) {
        if (e instanceof MouseEvent) {
            e.preventDefault();
            this.startPosX = e.clientX;
        }
        else {
            this.startPosX = e.touches[0].clientX;
        }
        this.isDragging = true;
        this.stopAutoPlay();
        this.animationId = requestAnimationFrame(this.animation.bind(this));
        this.slidesContainer.classList.add('cursor-grabbing');
        this.slidesContainer.classList.remove('transition-transform');
    }
    touchMove(e) {
        if (!this.isDragging)
            return;
        let currentPosX;
        if (e instanceof MouseEvent) {
            currentPosX = e.clientX;
        }
        else {
            currentPosX = e.touches[0].clientX;
        }
        const diffX = currentPosX - this.startPosX;
        this.currentTranslate = this.prevTranslate + diffX;
    }
    touchEnd() {
        if (!this.isDragging)
            return;
        this.isDragging = false;
        cancelAnimationFrame(this.animationId);
        const sliderWidth = this.sliderElement.clientWidth;
        const movedBy = this.currentTranslate - this.prevTranslate;
        // Determinar si pasamos al siguiente slide
        if (Math.abs(movedBy) > sliderWidth / 4) {
            if (movedBy > 0) {
                this.goToPrev();
            }
            else {
                this.goToNext();
            }
        }
        else {
            this.updateSliderPosition();
        }
        this.slidesContainer.classList.add('transition-transform');
        this.slidesContainer.classList.remove('cursor-grabbing');
    }
    animation() {
        this.slidesContainer.style.transform = `translateX(${this.currentTranslate}px)`;
        this.animationId = requestAnimationFrame(this.animation.bind(this));
    }
}
