// ===== MÓDULO HERO SECTION =====
const HeroSection = {
    init() {
        if (!window.AppUtils?.elementExists('.hero-section')) return;
        
        this.initImageEffects();
        this.initButtonEffects();
        if (!window.CONFIG.prefersReducedMotion) {
            this.initParticles();
            this.initParallaxEffect();
        }
        console.log('✅ HeroSection inicializado');
    },

    initImageEffects() {
        const heroImage = document.querySelector('.hero-section img');
        if (!heroImage) return;

        let imgContainer = document.querySelector('.hero-section .img-container');
        if (!imgContainer) {
            imgContainer = window.AppUtils.createElement('div', 'img-container');
            heroImage.parentNode.insertBefore(imgContainer, heroImage);
            imgContainer.appendChild(heroImage);
        }

        // Efectos de hover
        imgContainer.addEventListener('mouseenter', (e) => {
            this.handleImageHover(e, imgContainer, heroImage);
        });

        imgContainer.addEventListener('mouseleave', () => {
            this.handleImageLeave(imgContainer, heroImage);
        });

        if (!window.CONFIG.prefersReducedMotion) {
            imgContainer.addEventListener('mousemove', (e) => {
                this.handleImageTilt(e, imgContainer);
            });
        }
    },

    handleImageHover(e, container, img) {
        container.style.transform = 'perspective(1500px) rotateY(0deg) rotateX(0deg) scale(1.02)';
        container.style.boxShadow = '0 30px 80px rgba(0, 0, 0, 0.25), 0 15px 40px rgba(11, 62, 156, 0.15), 0 0 0 3px rgba(247, 163, 137, 0.3)';
        img.style.transform = 'scale(1.1)';

        if (!window.CONFIG.prefersReducedMotion) {
            window.AppUtils.createParticleAnimation(e, container, 12, ['#f7a389', '#0b3e9c', '#0bc5b3', '#eed0cd']);
        }
    },

    handleImageLeave(container, img) {
        container.style.transform = 'perspective(1500px) rotateY(-8deg) rotateX(5deg) scale(1)';
        container.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15), 0 10px 30px rgba(11, 62, 156, 0.1)';
        img.style.transform = 'scale(1)';
    },

    handleImageTilt(e, container) {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;

        container.style.transform = `perspective(1500px) rotateY(${-8 + rotateY}deg) rotateX(${5 + rotateX}deg) scale(1.02)`;
    },

    initParticles() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createFloatingParticle(heroSection);
            }, i * 300);
        }
    },

    createFloatingParticle(container) {
        const particle = window.AppUtils.createElement('div', 'particle', {
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            backgroundColor: ['#f7a389', '#0b3e9c', '#0bc5b3', '#eed0cd'][Math.floor(Math.random() * 4)],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
        });

        container.appendChild(particle);

        setTimeout(() => window.AppUtils.removeElement(particle), 7000);
        setTimeout(() => this.createFloatingParticle(container), 5000 + Math.random() * 5000);
    },

    initButtonEffects() {
        document.querySelectorAll('.hero-section .btn').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    window.AppUtils.createParticleAnimation(e, button, 8, ['#ffffff', '#f7a389', '#eed0cd']);
                }
            });

            button.addEventListener('click', (e) => {
                window.AppUtils.createRipple(e, button, 1.3, 'rgba(255, 255, 255, 0.6)');
            });
        });
    },

    initParallaxEffect() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const heroSection = document.querySelector('.hero-section');
                    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                    const rate = scrolled * -0.5;
                    if (heroSection) heroSection.style.transform = `translateY(${rate}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
};

// ===== MÓDULO INSTRUCTIONS SECTION =====
const InstructionsSection = {
    init() {
        if (!window.AppUtils?.elementExists('#instructions')) return;
        
        this.initStepCards();
        this.initScrollAnimations();
        if (!window.CONFIG.prefersReducedMotion) {
            this.initParticleSystem();
        }
        console.log('✅ InstructionsSection inicializado');
    },

    initStepCards() {
        document.querySelectorAll('.step-card').forEach((card, index) => {
            // Efectos de hover
            card.addEventListener('mouseenter', (e) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    card.style.transform = 'translateY(-15px) scale(1.03)';
                    window.AppUtils.createParticleAnimation(e, card, 10, ['#f7a389', '#0b3e9c', '#0bc5b3', '#eed0cd', '#FFC107'], 'step-particle');
                    this.animateStepContent(card);
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });

            // Efecto de clic
            card.addEventListener('click', (e) => {
                window.AppUtils.createRipple(e, card, 1.5, 'rgba(11, 62, 156, 0.2)');
            });

            // Accesibilidad
            card.setAttribute('tabindex', '0');
            card.addEventListener('focus', () => card.classList.add('step-card-focused'));
            card.addEventListener('blur', () => card.classList.remove('step-card-focused'));

            // Precargar imágenes
            this.preloadStepImage(card);
        });
    },

    animateStepContent(card) {
        const stepNumber = card.querySelector('.step-number');
        const title = card.querySelector('h4');
        const text = card.querySelector('p');
        
        if (stepNumber) {
            stepNumber.style.transform = 'scale(1.1)';
            setTimeout(() => {
                if (stepNumber.parentNode) stepNumber.style.transform = 'scale(1)';
            }, 300);
        }
        if (title) {
            title.style.transform = 'translateY(-3px)';
            setTimeout(() => {
                if (title.parentNode) title.style.transform = 'translateY(0)';
            }, 300);
        }
        if (text) {
            text.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                if (text.parentNode) text.style.transform = 'translateY(0)';
            }, 300);
        }
    },

    preloadStepImage(card) {
        const img = card.querySelector('.step-img');
        if (img && img.src) {
            const preloadImage = new Image();
            preloadImage.src = img.src;
        }
    },

    initParticleSystem() {
        const section = document.getElementById('instructions');
        if (!section) return;

        for (let i = 0; i < 12; i++) {
            const particle = window.AppUtils.createElement('div', 'background-particle', {
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                backgroundColor: 'rgba(11, 62, 156, 0.03)',
                borderRadius: '50%',
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: '1',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${18 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 8}s`
            });
            section.appendChild(particle);
        }
    },

    initScrollAnimations() {
        const elements = document.querySelectorAll('#instructions .step-card, #instructions .section-title, #instructions .lead');
        if (elements.length === 0) return;

        window.AppUtils.initScrollObserver(
            elements,
            (element) => {
                if (window.CONFIG.prefersReducedMotion) {
                    element.style.opacity = '1';
                } else if (element.classList.contains('step-card')) {
                    element.style.animationPlayState = 'running';
                }
            },
            { threshold: 0.1 }
        );
    }
};

// ===== MÓDULO INTELLIGENCE TYPES =====
const IntelligenceTypesSection = {
    init() {
        if (!window.AppUtils?.elementExists('#intelligence-types')) return;
        
        this.initIntelligenceCards();
        this.initScrollAnimations();
        if (!window.CONFIG.prefersReducedMotion) {
            this.initParticleSystem();
        }
        console.log('✅ IntelligenceTypesSection inicializado');
    },

    initIntelligenceCards() {
        document.querySelectorAll('.intelligence-card').forEach((card, index) => {
            const types = ['linguistic', 'logical', 'spatial', 'musical', 'kinesthetic', 'interpersonal', 'intrapersonal', 'naturalist'];
            const type = types[index] || 'linguistic';
            card.setAttribute('data-intelligence', type);

            card.addEventListener('mouseenter', (e) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    const colors = window.INTELLIGENCE_COLORS[type] || ['#0b3e9c', '#0bc5b3'];
                    window.AppUtils.createParticleAnimation(e, card, 8, colors, 'intelligence-particle');
                }
            });

            card.addEventListener('click', (e) => {
                const colors = window.INTELLIGENCE_COLORS[type] || ['#0b3e9c', '#0bc5b3'];
                window.AppUtils.createRipple(e, card, 1.2, `${colors[0]}15`);
            });

            card.setAttribute('tabindex', '0');
            card.addEventListener('focus', () => card.classList.add('intelligence-card-focused'));
            card.addEventListener('blur', () => card.classList.remove('intelligence-card-focused'));
        });
    },

    initParticleSystem() {
        const section = document.getElementById('intelligence-types');
        if (!section) return;

        for (let i = 0; i < 15; i++) {
            const particle = window.AppUtils.createElement('div', 'intelligence-bg-particle', {
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%',
                position: 'absolute',
                pointerEvents: 'none',
                zIndex: '1',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatParticle ${25 + Math.random() * 20}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 15}s`
            });
            section.appendChild(particle);
        }
    },

    initScrollAnimations() {
        const elements = document.querySelectorAll('#intelligence-types .intelligence-card, #intelligence-types .section-title');
        if (elements.length === 0) return;

        window.AppUtils.initScrollObserver(
            elements,
            (element) => {
                if (window.CONFIG.prefersReducedMotion) {
                    element.style.opacity = '1';
                } else if (element.classList.contains('intelligence-card')) {
                    element.style.animationPlayState = 'running';
                }
            },
            { threshold: 0.1 }
        );
    }
};

// ===== MÓDULO MOTIVATION SECTION =====
const MotivationSection = {
    init() {
        if (!window.AppUtils?.elementExists('#motivation')) return;
        
        this.initMotivationCards();
        this.initButtonEffects();
        this.initDecorations();
        this.initScrollAnimations();
        console.log('✅ MotivationSection inicializado');
    },

    initMotivationCards() {
        document.querySelectorAll('.motivation-card').forEach((card, index) => {
            // Efectos de hover suaves
            card.addEventListener('mouseenter', (e) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    window.AppUtils.createParticleAnimation(e, card, 6, window.MOTIVATION_COLORS.primary, 'motivation-particle');
                    window.AppUtils.animateIcon(card);
                }
            });

            // Efecto de clic
            card.addEventListener('click', (e) => {
                window.AppUtils.createRipple(e, card, 1.2, 'rgba(255, 255, 255, 0.2)');
            });

            // Accesibilidad
            card.setAttribute('tabindex', '0');
            card.addEventListener('focus', () => card.classList.add('motivation-card-focused'));
            card.addEventListener('blur', () => card.classList.remove('motivation-card-focused'));
        });
    },

    initButtonEffects() {
        document.querySelectorAll('#motivation .btn-light').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    window.AppUtils.createParticleAnimation(e, button, 4, ['#ffffff', '#f7a389', '#eed0cd'], 'button-particle');
                }
            });

            button.addEventListener('click', (e) => {
                window.AppUtils.createRipple(e, button, 1.0, 'rgba(255, 255, 255, 0.4)');
            });
        });
    },

    initDecorations() {
        const motivationSection = document.getElementById('motivation');
        const calculationSection = document.getElementById('calculation');
        
        if (motivationSection) {
            this.createMotivationDecorations(motivationSection);
        }
        
        if (calculationSection) {
            this.createCalculationDecorations(calculationSection);
        }
    },

    createMotivationDecorations(section) {
        // Puntos decorativos
        window.AppUtils.createDecoration(section, 'motivation', {
            class: 'dots',
            styles: {
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(247, 163, 137, 0.1) 1px, transparent 1px)',
                backgroundSize: '10px 10px',
                top: '10%',
                right: '5%',
                opacity: '0.5'
            }
        });

        // Círculo decorativo
        window.AppUtils.createDecoration(section, 'motivation', {
            class: 'circle',
            styles: {
                width: '60px',
                height: '60px',
                border: '2px solid rgba(11, 197, 179, 0.1)',
                borderRadius: '50%',
                bottom: '15%',
                left: '5%'
            }
        });
    },

    createCalculationDecorations(section) {
        // Onda decorativa
        window.AppUtils.createDecoration(section, 'calculation', {
            class: 'wave',
            styles: {
                width: '120px',
                height: '40px',
                background: 'linear-gradient(90deg, transparent, rgba(11, 62, 156, 0.05), transparent)',
                top: '20%',
                right: '10%',
                borderRadius: '50%'
            }
        });
    },

    initScrollAnimations() {
        const elements = document.querySelectorAll('#motivation .motivation-card, #calculation .calculation-step, #motivation .section-title, #calculation .section-title');
        if (elements.length === 0) return;

        window.AppUtils.initScrollObserver(
            elements,
            (element) => {
                if (window.CONFIG.prefersReducedMotion) {
                    element.style.opacity = '1';
                } else if (element.classList.contains('motivation-card') || element.classList.contains('calculation-step')) {
                    element.style.animationPlayState = 'running';
                }
            },
            { threshold: 0.1 }
        );
    }
};

// ===== MÓDULO CALCULATION SECTION =====
const CalculationSection = {
    init() {
        if (!window.AppUtils?.elementExists('#calculation')) return;
        
        this.initCalculationSteps();
        this.initScrollAnimations();
        console.log('✅ CalculationSection inicializado');
    },

    initCalculationSteps() {
        document.querySelectorAll('.calculation-step').forEach((step, index) => {
            step.addEventListener('mouseenter', (e) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    window.AppUtils.animateIcon(step, '.step-icon', 1.1, 400);
                    window.AppUtils.createParticleAnimation(e, step, 5, window.MOTIVATION_COLORS.calculation, 'calculation-particle');
                }
            });

            step.addEventListener('click', (e) => {
                window.AppUtils.createRipple(e, step, 1.2, 'rgba(11, 62, 156, 0.1)');
            });

            step.setAttribute('tabindex', '0');
            step.addEventListener('focus', () => step.classList.add('calculation-step-focused'));
            step.addEventListener('blur', () => step.classList.remove('calculation-step-focused'));
        });
    },

    initScrollAnimations() {
        const elements = document.querySelectorAll('#calculation .calculation-step, #calculation .section-title');
        if (elements.length === 0) return;

        window.AppUtils.initScrollObserver(
            elements,
            (element) => {
                if (window.CONFIG.prefersReducedMotion) {
                    element.style.opacity = '1';
                } else if (element.classList.contains('calculation-step')) {
                    element.style.animationPlayState = 'running';
                }
            },
            { threshold: 0.1 }
        );
    }
};

// ===== INICIALIZACIÓN SEGURA DE MÓDULOS =====
const ModuleManager = {
    initAll() {
        const modules = [
            { name: 'HeroSection', instance: HeroSection },
            { name: 'InstructionsSection', instance: InstructionsSection },
            { name: 'IntelligenceTypesSection', instance: IntelligenceTypesSection },
            { name: 'MotivationSection', instance: MotivationSection },
            { name: 'CalculationSection', instance: CalculationSection }
        ];

        modules.forEach(module => {
            try {
                if (module.instance && typeof module.instance.init === 'function') {
                    module.instance.init();
                }
            } catch (error) {
                console.error(`❌ Error inicializando ${module.name}:`, error);
            }
        });
    },

    initModule(moduleName) {
        const modules = {
            'hero': HeroSection,
            'instructions': InstructionsSection,
            'intelligence': IntelligenceTypesSection,
            'motivation': MotivationSection,
            'calculation': CalculationSection
        };

        if (modules[moduleName] && typeof modules[moduleName].init === 'function') {
            try {
                modules[moduleName].init();
                return true;
            } catch (error) {
                console.error(`❌ Error inicializando módulo ${moduleName}:`, error);
                return false;
            }
        } else {
            console.warn(`❌ Módulo ${moduleName} no encontrado`);
            return false;
        }
    }
};

// ===== EXPORTAR PARA USO GLOBAL =====
window.HeroSection = HeroSection;
window.InstructionsSection = InstructionsSection;
window.IntelligenceTypesSection = IntelligenceTypesSection;
window.MotivationSection = MotivationSection;
window.CalculationSection = CalculationSection;
window.ModuleManager = ModuleManager;

if (!window.App) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (window.AppUtils && window.CONFIG) {
                ModuleManager.initAll();
            } else {
                console.warn('AppUtils o CONFIG no están disponibles. Asegúrate de cargar config.js y utils.js primero.');
            }
        }, 100);
    });
}

console.log('🚀 Módulos cargados correctamente');