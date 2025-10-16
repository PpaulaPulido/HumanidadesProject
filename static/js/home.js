// Configuración global
const CONFIG = {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isDesktop: window.innerWidth > 992
};

// Módulo de Steps
const Steps = {
    init() {
        this.initStepsObserver();
    },

    initStepsObserver() {
        const stepsSection = document.getElementById('steps');
        if (!stepsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSteps();
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(stepsSection);
    },

    animateSteps() {
        this.createBackgroundDecorations();
        this.animateStepCards();
        this.initStepCardHoverEffects();
    },

    createBackgroundDecorations() {
        const stepsSection = document.getElementById('steps');
        if (!stepsSection) return;
        
        const background = document.createElement('div');
        background.className = 'steps-background';
        
        ['circle-1', 'circle-2', 'line-1', 'line-2'].forEach(className => {
            const element = document.createElement('div');
            element.className = `${className.includes('circle') ? 'circle-decoration' : 'line-decoration'} ${className}`;
            background.appendChild(element);
        });
        
        stepsSection.appendChild(background);
    },

    animateStepCards() {
        const stepCards = document.querySelectorAll('.step-card');
        
        stepCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated');
                this.createRippleEffect(card.querySelector('.step-number'));
            }, index * 150);
        });
    },

    createRippleEffect(element) {
        if (!element) return;
        
        const ripple = document.createElement('div');
        Object.assign(ripple.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            border: '2px solid rgba(11, 62, 156, 0.3)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: '0',
            pointerEvents: 'none'
        });
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.6 },
            { transform: 'translate(-50%, -50%) scale(1.3)', opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    },

    initStepCardHoverEffects() {
        const stepCards = document.querySelectorAll('.step-card');
        
        stepCards.forEach(card => {
            let hoverTimeout;
            
            card.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                this.createStepParticles(card);
                card.classList.add('card-hover');
            });
            
            card.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    card.classList.remove('card-hover');
                }, 100);
            });
            
            card.addEventListener('click', () => {
                this.createClickEffect(card);
            });
        });
    },

    createStepParticles(card) {
        const particles = 6;
        const colors = ['#0b3e9c', '#017267', '#2c5282', '#4a90a4'];
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            Object.assign(particle.style, {
                position: 'absolute',
                width: '4px',
                height: '4px',
                background: colors[Math.floor(Math.random() * colors.length)],
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: '10',
                top: '50%',
                left: '50%',
                opacity: '0.7'
            });
            
            card.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 40;
            const duration = 500 + Math.random() * 300;
            
            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 0.7
                },
                {
                    transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) scale(0)`,
                    opacity: 0
                }
            ], {
                duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            }).onfinish = () => particle.remove();
        }
    },

    createClickEffect(card) {
        const clickEffect = document.createElement('div');
        Object.assign(clickEffect.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(11, 62, 156, 0.1) 0%, transparent 70%)',
            borderRadius: 'var(--border-radius)',
            transform: 'translate(-50%, -50%) scale(0)',
            pointerEvents: 'none',
            zIndex: '1'
        });
        
        card.appendChild(clickEffect);
        
        clickEffect.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => clickEffect.remove();
    }
};

// Módulo de Hero
const Hero = {
    init() {
        this.initHeroAnimations();
        this.initTypewriterEffect();
        this.initHeroObserver();
    },

    initHeroAnimations() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        this.createFloatingElements();
        this.initButtonParticles();
        this.initParallaxEffect();
    },

    createFloatingElements() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        for (let i = 1; i <= 3; i++) {
            const element = document.createElement('div');
            element.className = `floating-element floating-${i}`;
            heroSection.appendChild(element);
        }
    },

    initButtonParticles() {
        const button = document.querySelector('.hero-section .btn-success');
        if (!button) return;
        
        button.addEventListener('mouseenter', (e) => {
            this.createButtonParticles(button, e);
        });
        
        button.addEventListener('click', (e) => {
            this.createButtonClickEffect(button, e);
        });
    },

    createButtonParticles(button, e) {
        const particles = 8;
        const colors = ['#ffffff', '#e6f7f5', '#cceeea'];
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'btn-particle';
            
            const rect = button.getBoundingClientRect();
            Object.assign(particle.style, {
                left: `${e.clientX - rect.left}px`,
                top: `${e.clientY - rect.top}px`
            });
            
            button.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 30;
            const duration = 400 + Math.random() * 300;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 0.8
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            }).onfinish = () => particle.remove();
        }
    },

    createButtonClickEffect(button, e) {
        const ripple = document.createElement('div');
        Object.assign(ripple.style, {
            position: 'absolute',
            width: '20px',
            height: '20px',
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            pointerEvents: 'none',
            top: `${e.offsetY}px`,
            left: `${e.offsetX}px`,
            transform: 'translate(-50%, -50%) scale(0)'
        });
        
        button.appendChild(ripple);
        
        ripple.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 0.8
            },
            {
                transform: 'translate(-50%, -50%) scale(10)',
                opacity: 0
            }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    },

    initParallaxEffect() {
        const heroSection = document.querySelector('.hero-section');
        const content = heroSection?.querySelector('.row');
        const image = heroSection?.querySelector('.img-fluid');
        
        if (!content || !image) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < heroSection.offsetHeight) {
                content.style.transform = `translateY(${rate * 0.3}px)`;
                image.style.transform = `translateY(${rate * 0.5}px) scale(1.05)`;
            }
        });
    },

    initTypewriterEffect() {
        const title = document.querySelector('.hero-section h1');
        if (!title) return;
        
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '2px solid rgba(255, 255, 255, 0.7)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                title.style.borderRight = 'none';
            }
        };
        
        setTimeout(typeWriter, 1000);
    },

    initHeroObserver() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('hero-visible');
                }
            });
        }, { threshold: 0.3 });

        observer.observe(heroSection);
    }
};

// Módulo de What Is
const WhatIs = {
    init() {
        this.initWhatIsObserver();
    },

    initWhatIsObserver() {
        const whatIsSection = document.getElementById('what-is');
        if (!whatIsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateWhatIsSection();
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(whatIsSection);
    },

    animateWhatIsSection() {
        this.createBackgroundDecorations();
        this.animateBenefitCards();
        this.initCardHoverEffects();
        this.addBenefitBadges();
    },

    createBackgroundDecorations() {
        const whatIsSection = document.getElementById('what-is');
        if (!whatIsSection) return;
        
        const background = document.createElement('div');
        background.className = 'what-is-background';
        
        const circle1 = document.createElement('div');
        circle1.className = 'what-is-circle what-is-circle-1';
        
        const circle2 = document.createElement('div');
        circle2.className = 'what-is-circle what-is-circle-2';
        
        background.appendChild(circle1);
        background.appendChild(circle2);
        whatIsSection.appendChild(background);
    },

    animateBenefitCards() {
        const benefitCards = document.querySelectorAll('.benefit-card');
        
        benefitCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated');
                this.createCardEntranceEffect(card);
            }, index * 200);
        });
    },

    createCardEntranceEffect(card) {
        const cardImg = card.querySelector('.card-img-top');
        if (cardImg) {
            cardImg.animate([
                {
                    transform: 'scale(0.8)',
                    opacity: 0
                },
                {
                    transform: 'scale(1)',
                    opacity: 1
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
        }
    },

    initCardHoverEffects() {
        const benefitCards = document.querySelectorAll('.benefit-card');
        
        benefitCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createCardParticles(card, e);
                this.enhanceCardHover(card);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.createTiltEffect(card, e);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCardHover(card);
            });
            
            card.addEventListener('click', () => {
                this.createCardClickEffect(card);
            });
        });
    },

    createCardParticles(card, e) {
        const particles = 6;
        const colors = ['#0b3e9c', '#017267', '#2c5282', '#4a90a4'];
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'benefit-particle';
            
            const rect = card.getBoundingClientRect();
            Object.assign(particle.style, {
                left: `${e.clientX - rect.left}px`,
                top: `${e.clientY - rect.top}px`
            });
            
            card.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 20 + Math.random() * 40;
            const duration = 500 + Math.random() * 400;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 0.8
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            }).onfinish = () => particle.remove();
        }
    },

    createTiltEffect(card, e) {
        if (window.innerWidth <= 768) return; // Solo en desktop
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleY = (x - centerX) / 25;
        const angleX = (centerY - y) / 25;
        
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-10px)`;
        
        // Efecto parallax en la imagen
        const cardImg = card.querySelector('.card-img-top');
        if (cardImg) {
            const moveX = (x - centerX) / 20;
            const moveY = (y - centerY) / 20;
            cardImg.style.transform = `scale(1.1) translate(${moveX}px, ${moveY}px)`;
        }
    },

    enhanceCardHover(card) {
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            cardBody.animate([
                { backgroundColor: 'transparent' },
                { backgroundColor: 'rgba(11, 62, 156, 0.02)' }
            ], {
                duration: 300,
                fill: 'forwards'
            });
        }
    },

    resetCardHover(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        
        const cardImg = card.querySelector('.card-img-top');
        if (cardImg) {
            cardImg.style.transform = 'scale(1.1)';
        }
        
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            cardBody.animate([
                { backgroundColor: 'rgba(11, 62, 156, 0.02)' },
                { backgroundColor: 'transparent' }
            ], {
                duration: 300,
                fill: 'forwards'
            });
        }
    },

    createCardClickEffect(card) {
        const ripple = document.createElement('div');
        Object.assign(ripple.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(11, 62, 156, 0.1) 0%, transparent 70%)',
            borderRadius: 'var(--border-radius)',
            transform: 'translate(-50%, -50%) scale(0)',
            pointerEvents: 'none',
            zIndex: '1'
        });
        
        card.appendChild(ripple);
        
        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    },

    addBenefitBadges() {
        const benefitCards = document.querySelectorAll('.benefit-card');
        const badges = ['✨ Destacado', '🚀 Innovador', '💫 Exclusivo'];
        
        benefitCards.forEach((card, index) => {
            const badge = document.createElement('div');
            badge.className = 'benefit-badge';
            badge.textContent = badges[index];
            card.appendChild(badge);
        });
    }
};

// Módulo de Benefits (CORREGIDO)
const Benefits = {
    init() {
        this.initBenefitsObserver();
    },

    initBenefitsObserver() {
        const benefitsSection = document.getElementById('benefits');
        if (!benefitsSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateBenefitsSection();
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(benefitsSection);
    },

    animateBenefitsSection() {
        this.createBackgroundDecorations();
        this.animateBenefitItems();
        this.initBenefitHoverEffects();
        this.addBenefitNumbers();
        this.addIconWaves();
    },

    createBackgroundDecorations() {
        const benefitsSection = document.getElementById('benefits');
        if (!benefitsSection) return;
        
        const background = document.createElement('div');
        background.className = 'benefits-background';
        
        for (let i = 1; i <= 3; i++) {
            const shape = document.createElement('div');
            shape.className = `benefits-shape benefits-shape-${i}`;
            background.appendChild(shape);
        }
        
        benefitsSection.appendChild(background);
    },

    animateBenefitItems() {
        const benefitItems = document.querySelectorAll('#benefits .col-md-4');
        
        benefitItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animated');
                this.createItemEntranceEffect(item);
            }, index * 200);
        });
    },

    createItemEntranceEffect(item) {
        const icon = item.querySelector('.bi');
        if (icon) {
            icon.animate([
                {
                    transform: 'scale(0) rotate(-180deg)',
                    opacity: 0
                },
                {
                    transform: 'scale(1) rotate(0deg)',
                    opacity: 1
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
        }
    },

    initBenefitHoverEffects() {
        const benefitItems = document.querySelectorAll('#benefits .text-center');
        
        benefitItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.createBenefitParticles(item, e);
                this.activateIconWave(item);
                this.enhanceBenefitHover(item);
            });
            
            item.addEventListener('mousemove', (e) => {
                this.createTiltEffect(item, e);
            });
            
            item.addEventListener('mouseleave', () => {
                this.resetBenefitHover(item);
            });
            
            item.addEventListener('click', () => {
                this.createBenefitClickEffect(item);
            });
        });
    },

    createBenefitParticles(item, e) {
        const particles = 8;
        const colors = ['#0b3e9c', '#017267', '#2c5282', '#4a90a4'];
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'benefit-particle';
            
            const rect = item.getBoundingClientRect();
            Object.assign(particle.style, {
                left: `${e.clientX - rect.left}px`,
                top: `${e.clientY - rect.top}px`
            });
            
            item.appendChild(particle);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 25 + Math.random() * 35;
            const duration = 600 + Math.random() * 400;
            
            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 0.7
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            }).onfinish = () => particle.remove();
        }
    },

    createTiltEffect(item, e) {
        if (window.innerWidth <= 768) return;
        
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleY = (x - centerX) / 20;
        const angleX = (centerY - y) / 20;
        
        item.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-12px) scale(1.02)`;
    },

    activateIconWave(item) {
        const iconContainer = item.querySelector('.icon-container');
        if (iconContainer && !iconContainer.querySelector('.icon-wave')) {
            const wave = document.createElement('div');
            wave.className = 'icon-wave';
            iconContainer.appendChild(wave);
        }
    },

    enhanceBenefitHover(item) {
        const icon = item.querySelector('.bi');
        if (icon) {
            icon.animate([
                { transform: 'scale(1.2) rotate(5deg)' }
            ], {
                duration: 300,
                fill: 'forwards'
            });
        }
    },

    resetBenefitHover(item) {
        item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        
        const icon = item.querySelector('.bi');
        if (icon) {
            icon.animate([
                { transform: 'scale(1) rotate(0deg)' }
            ], {
                duration: 300,
                fill: 'forwards'
            });
        }
    },

    createBenefitClickEffect(item) {
        const ripple = document.createElement('div');
        Object.assign(ripple.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(11, 62, 156, 0.1) 0%, transparent 70%)',
            borderRadius: 'var(--border-radius)',
            transform: 'translate(-50%, -50%) scale(0)',
            pointerEvents: 'none',
            zIndex: '1'
        });
        
        item.appendChild(ripple);
        
        ripple.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0.8 },
            { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    },

    addBenefitNumbers() {
        const benefitItems = document.querySelectorAll('#benefits .text-center');
        const numbers = ['01', '02', '03'];
        
        benefitItems.forEach((item, index) => {
            const number = document.createElement('div');
            number.className = 'benefit-number';
            number.textContent = numbers[index];
            item.appendChild(number);
        });
    },

    addIconWaves() {
        const iconContainers = document.querySelectorAll('#benefits .mb-3');
        
        iconContainers.forEach(container => {
            // Verificar si ya tiene un wrapper
            if (!container.querySelector('.icon-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'icon-container';
                
                // Mover el SVG dentro del wrapper
                const svg = container.querySelector('svg');
                if (svg && svg.parentNode === container) {
                    container.removeChild(svg);
                    wrapper.appendChild(svg);
                    container.appendChild(wrapper);
                } else if (svg) {
                    wrapper.appendChild(svg.cloneNode(true));
                    container.appendChild(wrapper);
                }
            }
        });
    }
};

// Inicialización de la aplicación
class App {
    static init() {
        // Inicializar módulos
        Steps.init();
        Hero.init();
        WhatIs.init();
        Benefits.init(); 
        this.handleResize();
    }

    static handleResize() {
        window.addEventListener('resize', () => {
            CONFIG.isDesktop = window.innerWidth > 992;
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}