// ===== EFECTOS Y ANIMACIONES PARA EL SIMULADOR =====
class SimulatorEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initParticleSystem();
        this.initScrollEffects();
        this.initButtonEffects();
        this.initQuestionAnimations();
        this.initProgressAnimations();
        console.log('✅ Efectos del simulador inicializados');
    }

    // ... (todo el código de SimulatorEffects se mantiene igual)
    // ===== SISTEMA DE PARTÍCULAS =====
    initParticleSystem() {
        this.createBackgroundParticles();
        this.initInteractiveParticles();
    }

    createBackgroundParticles() {
        const simulatorSection = document.getElementById('simulator');
        if (!simulatorSection) return;

        // Crear partículas de fondo
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createBackgroundParticle(simulatorSection);
            }, i * 200);
        }
    }

    createBackgroundParticle(container) {
        const particle = window.AppUtils.createElement('div', 'simulator-particle', {
            width: `${Math.random() * 4 + 1}px`,
            height: `${Math.random() * 4 + 1}px`,
            backgroundColor: this.getRandomParticleColor(),
            borderRadius: '50%',
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '1',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: '0.3',
            animation: `floatParticle ${20 + Math.random() * 20}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 10}s`
        });

        container.appendChild(particle);
    }

    getRandomParticleColor() {
        const colors = [
            'rgba(11, 62, 156, 0.3)',
            'rgba(11, 197, 179, 0.3)',
            'rgba(247, 163, 137, 0.3)',
            'rgba(238, 208, 205, 0.3)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    initInteractiveParticles() {
        // Partículas en botones de opción
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.option-btn') && !window.CONFIG.prefersReducedMotion) {
                this.createOptionParticles(e);
            }
        });

        // Partículas en botones de navegación
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.navigation-buttons .btn') && !window.CONFIG.prefersReducedMotion) {
                this.createButtonParticles(e);
            }
        });
    }

    createOptionParticles(e) {
        const optionBtn = e.target.closest('.option-btn');
        if (optionBtn && !optionBtn.querySelector('input:checked')) {
            window.AppUtils.createParticleAnimation(
                e, 
                optionBtn, 
                4, 
                ['#0b3e9c', '#0bc5b3', '#f7a389'], 
                'option-particle'
            );
        }
    }

    createButtonParticles(e) {
        const button = e.target.closest('.btn');
        if (button && !button.disabled) {
            const colors = button.classList.contains('btn-primary') 
                ? ['#ffffff', '#0bc5b3', '#f7a389']
                : ['#0b3e9c', '#6c757d', '#0bc5b3'];
            
            window.AppUtils.createParticleAnimation(
                e, 
                button, 
                6, 
                colors, 
                'button-particle'
            );
        }
    }

    // ===== EFECTOS DE SCROLL =====
    initScrollEffects() {
        // Parallax sutil en el header
        if (!window.CONFIG.prefersReducedMotion) {
            this.initParallaxHeader();
        }

        // Animación de elementos al hacer scroll
        this.initScrollAnimations();
    }

    initParallaxHeader() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const simulatorHeader = document.querySelector('.simulator-header');
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.3;
                    
                    if (simulatorHeader) {
                        simulatorHeader.style.transform = `translateY(${rate}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.section-card, .progress-container');
        
        window.AppUtils.initScrollObserver(
            animatedElements,
            (element) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    element.style.animation = 'fadeInUp 0.8s ease-out forwards';
                } else {
                    element.style.opacity = '1';
                }
            },
            { threshold: 0.1 }
        );
    }

    // ===== EFECTOS EN BOTONES =====
    initButtonEffects() {
        // Efecto ripple en todos los botones
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    const color = this.getButtonRippleColor(button);
                    window.AppUtils.createRipple(e, button, 1.2, color);
                }
            });
        });

        // Efecto magnético en botones grandes (desktop)
        if (window.CONFIG.isDesktop && !window.CONFIG.prefersReducedMotion) {
            document.querySelectorAll('.navigation-buttons .btn, #finish-simulation').forEach(button => {
                window.AppUtils.initMagneticEffect(button);
            });
        }
    }

    getButtonRippleColor(button) {
        if (button.classList.contains('btn-primary')) {
            return 'rgba(11, 62, 156, 0.3)';
        } else if (button.classList.contains('btn-success')) {
            return 'rgba(40, 167, 69, 0.3)';
        } else if (button.classList.contains('btn-outline-primary')) {
            return 'rgba(11, 62, 156, 0.2)';
        } else {
            return 'rgba(108, 117, 125, 0.2)';
        }
    }

    // ===== ANIMACIONES DE PREGUNTAS =====
    initQuestionAnimations() {
        // Animación al cambiar sección
        this.initSectionTransitions();
        
        // Efectos en preguntas no respondidas
        this.initUnansweredEffects();
    }

    initSectionTransitions() {
        const originalShowSection = SimulatorForm.showCurrentSection;
        
        SimulatorForm.showCurrentSection = function() {
            const currentSection = document.querySelector('.intelligence-section.active');
            
            if (currentSection && !window.CONFIG.prefersReducedMotion) {
                currentSection.classList.add('section-transition-exit');
                
                setTimeout(() => {
                    originalShowSection.call(this);
                    
                    const newSection = document.querySelector('.intelligence-section.active');
                    if (newSection) {
                        newSection.classList.add('section-transition-enter');
                        
                        setTimeout(() => {
                            newSection.classList.remove('section-transition-enter');
                        }, 500);
                    }
                }, 250);
            } else {
                originalShowSection.call(this);
            }
        };
    }

    initUnansweredEffects() {
        // Efecto de pulso en preguntas no respondidas
        const originalHighlight = SimulatorForm.highlightUnansweredQuestions;
        
        SimulatorForm.highlightUnansweredQuestions = function() {
            originalHighlight.call(this);
            
            if (!window.CONFIG.prefersReducedMotion) {
                const unansweredQuestions = document.querySelectorAll('.question-item.unanswered');
                
                unansweredQuestions.forEach(question => {
                    question.style.animation = 'pulseWarning 2s infinite';
                    
                    // Agregar partículas de advertencia
                    const rect = question.getBoundingClientRect();
                    this.createWarningParticles(question, rect);
                });
            }
        };
    }

    createWarningParticles(element, rect) {
        if (window.CONFIG.prefersReducedMotion) return;

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const particle = window.AppUtils.createElement('div', 'warning-particle', {
                    width: '4px',
                    height: '4px',
                    backgroundColor: 'var(--error-color)',
                    borderRadius: '50%',
                    position: 'absolute',
                    pointerEvents: 'none',
                    zIndex: '10',
                    left: `${Math.random() * rect.width}px`,
                    top: `${Math.random() * rect.height}px`,
                    opacity: '0'
                });

                element.appendChild(particle);

                const angle = Math.random() * Math.PI * 2;
                const distance = 20 + Math.random() * 30;
                
                const animation = particle.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
                    { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 800 + Math.random() * 400,
                    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                });

                animation.onfinish = () => window.AppUtils.removeElement(particle);
            }, i * 100);
        }
    }

    // ===== ANIMACIONES DE PROGRESO =====
    initProgressAnimations() {
        // Efecto especial cuando se completa una sección
        const originalUpdateProgress = SimulatorForm.updateProgress;
        
        SimulatorForm.updateProgress = function() {
            const previousProgress = parseFloat(document.querySelector('.progress-bar').style.width) || 0;
            
            originalUpdateProgress.call(this);
            
            const newProgress = parseFloat(document.querySelector('.progress-bar').style.width) || 0;
            
            // Efecto especial cuando se alcanzan hitos
            if (!window.CONFIG.prefersReducedMotion) {
                this.checkProgressMilestones(previousProgress, newProgress);
            }
        };
    }

    checkProgressMilestones(previousProgress, newProgress) {
        const milestones = [25, 50, 75, 100];
        const reachedMilestone = milestones.find(milestone => 
            previousProgress < milestone && newProgress >= milestone
        );

        if (reachedMilestone) {
            this.celebrateMilestone(reachedMilestone);
        }
    }

    celebrateMilestone(milestone) {
        const progressContainer = document.querySelector('.progress-container');
        if (!progressContainer) return;

        // Efecto de confeti para hitos
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                this.createConfettiParticle(progressContainer, milestone);
            }, i * 80);
        }

        // Efecto de pulso en la barra de progreso
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.animation = 'progressPulse 1s ease-in-out';
        
        setTimeout(() => {
            progressBar.style.animation = '';
        }, 1000);
    }

    createConfettiParticle(container, milestone) {
        const colors = {
            25: ['#0b3e9c', '#1a56db'],
            50: ['#0bc5b3', '#0dd6c4'],
            75: ['#f7a389', '#ffb6a3'],
            100: ['#28a745', '#34ce57']
        };

        const particleColors = colors[milestone] || ['#0b3e9c', '#0bc5b3'];
        
        const particle = window.AppUtils.createElement('div', 'confetti-particle', {
            width: '8px',
            height: '8px',
            backgroundColor: particleColors[Math.floor(Math.random() * particleColors.length)],
            borderRadius: '2px',
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '1000',
            left: '50%',
            top: '50%',
            opacity: '0'
        });

        container.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        
        const animation = particle.animate([
            { 
                transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', 
                opacity: 1 
            },
            { 
                transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) rotate(720deg) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 1200 + Math.random() * 600,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => window.AppUtils.removeElement(particle);
    }

    // ===== EFECTOS DE FINALIZACIÓN =====
    initCompletionEffects() {
        // Efectos especiales cuando se completa el cuestionario
        const originalFinish = SimulatorForm.finishSimulation;
        
        SimulatorForm.finishSimulation = function() {
            if (this.validateCurrentSection()) {
                // Efecto de celebración antes de mostrar el modal
                if (!window.CONFIG.prefersReducedMotion) {
                    this.triggerCompletionCelebration();
                }
                
                setTimeout(() => {
                    originalFinish.call(this);
                }, 1500);
            } else {
                this.highlightUnansweredQuestions();
            }
        };
    }

    triggerCompletionCelebration() {
        const simulatorSection = document.getElementById('simulator');
        if (!simulatorSection) return;

        // Lluvia de confeti
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createCompletionConfetti(simulatorSection);
            }, i * 50);
        }

        // Efecto de brillo en todo el contenedor
        simulatorSection.style.animation = 'completionGlow 2s ease-in-out';
        
        setTimeout(() => {
            simulatorSection.style.animation = '';
        }, 2000);
    }

    createCompletionConfetti(container) {
        const particle = window.AppUtils.createElement('div', 'completion-confetti', {
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            backgroundColor: this.getRandomConfettiColor(),
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '1000',
            left: `${Math.random() * 100}%`,
            top: '-20px',
            opacity: '0'
        });

        container.appendChild(particle);

        const animation = particle.animate([
            { 
                transform: 'translateY(0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translateY(100vh) rotate(${360 + Math.random() * 360}deg)`, 
                opacity: 0 
            }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => window.AppUtils.removeElement(particle);
    }

    getRandomConfettiColor() {
        const colors = [
            '#0b3e9c', '#1a56db', '#0bc5b3', '#0dd6c4',
            '#f7a389', '#ffb6a3', '#eed0cd', '#FFC107',
            '#28a745', '#dc3545', '#6f42c1', '#e83e8c'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// ===== EFECTOS Y ANIMACIONES PARA RESULTADOS INDIVIDUALES =====
class ResultsEffects {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎨 Inicializando efectos de resultados...');
        
        // Verificar dependencias
        if (typeof window.AppUtils === 'undefined') {
            console.warn('⚠️ AppUtils no disponible. Cargando efectos básicos...');
            this.initBasicEffects();
            return;
        }

        this.initParticleSystem();
        this.initScrollAnimations();
        this.initCardEffects();
        this.initChartInteractions();
        this.initButtonEffects();
        
        console.log('✅ Efectos de resultados inicializados');
    }

    // ===== SISTEMA DE PARTÍCULAS =====
    initParticleSystem() {
        this.createBackgroundParticles();
        this.initScoreParticles();
    }

    createBackgroundParticles() {
        const resultsSection = document.getElementById('individual-results');
        if (!resultsSection) return;

        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                this.createBackgroundParticle(resultsSection);
            }, i * 250);
        }
    }

    createBackgroundParticle(container) {
        const particle = window.AppUtils.createElement('div', 'results-particle', {
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            backgroundColor: this.getRandomParticleColor(),
            borderRadius: '50%',
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '1',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: '0.2',
            animation: `floatParticle ${15 + Math.random() * 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s`
        });

        container.appendChild(particle);
    }

    getRandomParticleColor() {
        const colors = [
            'rgba(11, 62, 156, 0.3)',
            'rgba(11, 197, 179, 0.3)',
            'rgba(247, 163, 137, 0.3)',
            'rgba(238, 208, 205, 0.3)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    initScoreParticles() {
        // Partículas al hacer hover en scores
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.score-item') && !window.CONFIG.prefersReducedMotion) {
                const scoreItem = e.target.closest('.score-item');
                window.AppUtils.createParticleAnimation(
                    e, 
                    scoreItem, 
                    4, 
                    ['#0b3e9c', '#0bc5b3', '#f7a389'], 
                    'score-particle'
                );
            }
        });
    }

    // ===== ANIMACIONES DE SCROLL =====
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.summary-card, .chart-card, .intelligence-detail-card, .recommendations-card'
        );
        
        window.AppUtils.initScrollObserver(
            animatedElements,
            (element) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    element.style.animation = 'fadeInUp 0.8s ease-out forwards';
                } else {
                    element.style.opacity = '1';
                }
            },
            { threshold: 0.1 }
        );
    }

    // ===== EFECTOS EN TARJETAS =====
    initCardEffects() {
        // Efecto de tilt en tarjetas (desktop)
        if (window.CONFIG.isDesktop && !window.CONFIG.prefersReducedMotion) {
            document.querySelectorAll('.intelligence-detail-card, .chart-card').forEach(card => {
                window.AppUtils.initMagneticEffect(card);
            });
        }

        // Efecto de pulso en tarjeta dominante
        const dominantCard = document.querySelector('.dominant-intelligence');
        if (dominantCard) {
            setInterval(() => {
                if (!window.CONFIG.prefersReducedMotion) {
                    dominantCard.style.animation = 'pulse 2s ease-in-out';
                    setTimeout(() => {
                        dominantCard.style.animation = '';
                    }, 2000);
                }
            }, 8000);
        }
    }

    // ===== INTERACCIONES CON GRÁFICOS =====
    initChartInteractions() {
        // Efectos al cambiar entre vistas de gráficos
        const originalToggle = IndividualResults.toggleChartView;
        
        IndividualResults.toggleChartView = function() {
            if (!window.CONFIG.prefersReducedMotion) {
                const chartContainer = document.querySelector('.chart-container');
                chartContainer.style.opacity = '0.5';
                chartContainer.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    originalToggle.call(this);
                    
                    setTimeout(() => {
                        chartContainer.style.opacity = '1';
                        chartContainer.style.transform = 'scale(1)';
                    }, 300);
                }, 200);
            } else {
                originalToggle.call(this);
            }
        };
    }

    // ===== EFECTOS EN BOTONES =====
    initButtonEffects() {
        // Efecto ripple en botones de acción
        document.querySelectorAll('.results-actions .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!window.CONFIG.prefersReducedMotion) {
                    const color = this.getButtonRippleColor(button);
                    window.AppUtils.createRipple(e, button, 1.1, color);
                }
            });
        });

        // Efecto de confeti al descargar PDF
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                if (!window.CONFIG.prefersReducedMotion) {
                    this.createDownloadConfetti();
                }
            });
        }
    }

    getButtonRippleColor(button) {
        if (button.classList.contains('btn-primary')) {
            return 'rgba(11, 62, 156, 0.3)';
        } else if (button.classList.contains('btn-success')) {
            return 'rgba(40, 167, 69, 0.3)';
        } else {
            return 'rgba(108, 117, 125, 0.2)';
        }
    }

    createDownloadConfetti() {
        const resultsSection = document.getElementById('individual-results');
        if (!resultsSection) return;

        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createConfettiParticle(resultsSection);
            }, i * 80);
        }
    }

    createConfettiParticle(container) {
        const particle = window.AppUtils.createElement('div', 'confetti-particle', {
            width: '8px',
            height: '8px',
            backgroundColor: this.getRandomConfettiColor(),
            borderRadius: '2px',
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '1000',
            left: '50%',
            top: '50%',
            opacity: '0'
        });

        container.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const distance = 40 + Math.random() * 80;
        
        const animation = particle.animate([
            { 
                transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', 
                opacity: 1 
            },
            { 
                transform: `translate(${Math.cos(angle) * distance - 50}%, ${Math.sin(angle) * distance - 50}%) rotate(360deg) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => window.AppUtils.removeElement(particle);
    }

    getRandomConfettiColor() {
        const colors = [
            '#0b3e9c', '#1a56db', '#0bc5b3', '#0dd6c4',
            '#f7a389', '#ffb6a3', '#eed0cd', '#FFC107'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // ===== EFECTOS BÁSICOS (fallback) =====
    initBasicEffects() {
        // Animaciones básicas de entrada
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.summary-card, .chart-card, .intelligence-detail-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });

        // Efectos hover básicos
        document.querySelectorAll('.score-item, .recommendation-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
            });
        });
    }
}

// ===== FUNCIONES DE INICIALIZACIÓN =====
function initSimulatorEffects() {
    if (document.getElementById('simulator')) {
        setTimeout(() => {
            window.SimulatorEffects = new SimulatorEffects();
        }, 500);
    }
}

function initResultsEffects() {
    if (document.getElementById('individual-results')) {
        setTimeout(() => {
            window.resultsEffects = new ResultsEffects();
        }, 500);
    }
}

function initAllEffects() {
    initSimulatorEffects();
    initResultsEffects();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllEffects);
} else {
    initAllEffects();
}

window.SimulatorEffects = SimulatorEffects;
window.ResultsEffects = ResultsEffects;
window.initSimulatorEffects = initSimulatorEffects;
window.initResultsEffects = initResultsEffects;
window.initAllEffects = initAllEffects;