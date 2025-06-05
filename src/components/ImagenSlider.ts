export default class ImageSlider {
    private sliderElement: HTMLElement;
    private slidesContainer: HTMLElement;
    private slides: NodeListOf<HTMLElement>;
    private prevButton: HTMLElement;
    private nextButton: HTMLElement;
    private indicators: NodeListOf<HTMLElement>;
    private currentIndex: number = 0;
    private autoPlayInterval: number | null = null;
    private isDragging: boolean = false;
    private startPosX: number = 0;
    private currentTranslate: number = 0;
    private prevTranslate: number = 0;
    private animationId: number | null = null;

    constructor(options: {
        sliderId: string;
        autoPlay?: boolean;
        interval?: number;
    }) {
        // Inicializar elementos
        this.sliderElement = document.getElementById(options.sliderId)!;
        this.slidesContainer = this.sliderElement.querySelector('#slidesContainer')!;
        this.slides = this.slidesContainer.querySelectorAll('[data-index]');
        this.prevButton = this.sliderElement.querySelector('#prevButton')!;
        this.nextButton = this.sliderElement.querySelector('#nextButton')!;
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
                const target = e.target as HTMLElement;
                const index = parseInt(target.dataset.index!);
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

    private setupSlider(): void {
        const sliderWidth = this.sliderElement.clientWidth;
        this.slides.forEach(slide => {
            (slide as HTMLElement).style.width = `${sliderWidth}px`;
        });
        this.slidesContainer.style.width = `${sliderWidth * this.slides.length}px`;
    }

    private updateSliderPosition(): void {
        const sliderWidth = this.sliderElement.clientWidth;
        this.slidesContainer.style.transform = `translateX(-${this.currentIndex * sliderWidth}px)`;
        this.updateIndicators();
    }

    private updateIndicators(): void {
        this.indicators.forEach((indicator, index) => {
            if (index === this.currentIndex) {
                indicator.classList.add('bg-white', 'scale-125');
                indicator.classList.remove('bg-white/30');
            } else {
                indicator.classList.remove('bg-white', 'scale-125');
                indicator.classList.add('bg-white/30');
            }
        });
    }

    public goToSlide(index: number): void {
        if (index < 0) {
            index = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            index = 0;
        }

        this.currentIndex = index;
        this.updateSliderPosition();
    }

    public goToNext(): void {
        this.goToSlide(this.currentIndex + 1);
    }

    public goToPrev(): void {
        this.goToSlide(this.currentIndex - 1);
    }

    private startAutoPlay(interval: number): void {
        this.autoPlayInterval = window.setInterval(() => {
            this.goToNext();
        }, interval);
    }

    private stopAutoPlay(): void {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    // Touch/Mouse handlers para arrastrar el slider
    private touchStart(e: MouseEvent | TouchEvent): void {
        if (e instanceof MouseEvent) {
            e.preventDefault();
            this.startPosX = e.clientX;
        } else {
            this.startPosX = e.touches[0].clientX;
        }

        this.isDragging = true;
        this.stopAutoPlay();

        this.animationId = requestAnimationFrame(this.animation.bind(this));
        this.slidesContainer.classList.add('cursor-grabbing');
        this.slidesContainer.classList.remove('transition-transform');
    }

    private touchMove(e: MouseEvent | TouchEvent): void {
        if (!this.isDragging) return;

        let currentPosX;
        if (e instanceof MouseEvent) {
            currentPosX = e.clientX;
        } else {
            currentPosX = e.touches[0].clientX;
        }

        const diffX = currentPosX - this.startPosX;
        this.currentTranslate = this.prevTranslate + diffX;
    }

    private touchEnd(): void {
        if (!this.isDragging) return;

        this.isDragging = false;
        cancelAnimationFrame(this.animationId!);

        const sliderWidth = this.sliderElement.clientWidth;
        const movedBy = this.currentTranslate - this.prevTranslate;

        // Determinar si pasamos al siguiente slide
        if (Math.abs(movedBy) > sliderWidth / 4) {
            if (movedBy > 0) {
                this.goToPrev();
            } else {
                this.goToNext();
            }
        } else {
            this.updateSliderPosition();
        }

        this.slidesContainer.classList.add('transition-transform');
        this.slidesContainer.classList.remove('cursor-grabbing');
    }

    private animation(): void {
        this.slidesContainer.style.transform = `translateX(${this.currentTranslate}px)`;
        this.animationId = requestAnimationFrame(this.animation.bind(this));
    }
}