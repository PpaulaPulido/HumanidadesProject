// Módulo de navegación independiente y reutilizable
class NavigationManager {
    constructor(options = {}) {
        this.options = {
            navbarSelector: '.navbar',
            navLinkSelector: '.nav-link, .dropdown-item',
            mobileToggleSelector: '.navbar-toggler',
            mobileMenuSelector: '.navbar-collapse',
            scrollOffset: 70,
            enableParticles: true,
            enableTilt: true,
            ...options
        };

        this.navbar = null;
        this.lastScrollTop = 0;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        this.navbar = document.querySelector(this.options.navbarSelector);
        if (!this.navbar) {
            console.warn('❌ No se encontró la navbar con selector:', this.options.navbarSelector);
            return;
        }

        this.initScrollEffects();
        this.initSmoothScroll();
        this.initNavbarEffects();
        this.initMobileMenu();
        this.initResizeHandler();

        this.initialized = true;
        console.log('✅ Navegación inicializada');
    }

    initScrollEffects() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Efecto de navbar al hacer scroll
            if (scrollTop > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }

            // Ocultar/mostrar navbar al hacer scroll
            if (scrollTop > this.lastScrollTop && scrollTop > 200) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }

            this.lastScrollTop = scrollTop;
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                this.handleAnchorClick(e, anchor);
            });
        });
    }

    handleAnchorClick(e, anchor) {
        const href = anchor.getAttribute('href');
        
        if (!href || href === '#' || href === '#!') {
            e.preventDefault();
            return;
        }

        try {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                this.handleSmoothScroll(target);
            }
        } catch (error) {
            console.warn('Error en smooth scroll:', error);
        }
    }

    handleSmoothScroll(target) {
        // Cerrar menú móvil si está abierto
        this.closeMobileMenu();

        const navbarHeight = this.navbar?.offsetHeight || this.options.scrollOffset;
        AppUtils.smoothScrollTo(target, navbarHeight);
    }

    closeMobileMenu() {
        const navbarCollapse = document.querySelector(this.options.mobileMenuSelector);
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            // Bootstrap 5
            if (typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            } else {
                // Fallback si no hay Bootstrap
                navbarCollapse.classList.remove('show');
            }
        }
    }

    initNavbarEffects() {
        // Efectos de partículas en enlaces
        if (this.options.enableParticles && window.CONFIG.isDesktop) {
            document.querySelectorAll(this.options.navLinkSelector).forEach(link => {
                link.addEventListener('mouseenter', (e) => {
                    AppUtils.createParticleAnimation(e, link, 6, ['#FFC107', '#f77953', '#FFFFFF', '#eed0cd']);
                });
            });
        }

        // Efecto tilt en desktop
        if (this.options.enableTilt && window.CONFIG.isDesktop && !window.CONFIG.prefersReducedMotion) {
            document.querySelectorAll(this.options.navLinkSelector).forEach(link => {
                link.addEventListener('mousemove', (e) => {
                    const rect = link.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const angleY = (x - centerX) / 15;
                    const angleX = (centerY - y) / 15;

                    if (link.classList.contains('nav-link')) {
                        link.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-3px)`;
                    } else {
                        link.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateX(8px)`;
                    }
                });

                link.addEventListener('mouseleave', () => {
                    link.style.transform = '';
                });
            });
        }
    }

    initMobileMenu() {
        const navbarToggler = document.querySelector(this.options.mobileToggleSelector);
        const navbarCollapse = document.querySelector(this.options.mobileMenuSelector);

        if (navbarToggler && navbarCollapse) {
            navbarToggler.addEventListener('click', () => {
                const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    navbarCollapse.style.transform = 'translateY(-10px)';
                    navbarCollapse.style.opacity = '0';
                    setTimeout(() => {
                        navbarCollapse.style.transform = 'translateY(0)';
                        navbarCollapse.style.opacity = '1';
                    }, 300);
                }
            });
        }
    }

    initResizeHandler() {
        const updateConfig = AppUtils.debounce(() => {
            window.CONFIG.isDesktop = window.innerWidth > 992;
        }, 250);

        window.addEventListener('resize', updateConfig);
    }

    // Métodos públicos para control externo
    updateConfig() {
        window.CONFIG.isDesktop = window.innerWidth > 992;
        window.CONFIG.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    destroy() {
        // Limpiar event listeners si es necesario
        this.initialized = false;
        console.log('🧹 Navegación limpiada');
    }
}

// Inicialización automática cuando el DOM esté listo
function initNavigation() {
    const navigation = new NavigationManager();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            navigation.init();
        });
    } else {
        navigation.init();
    }
    
    return navigation;
}

// Exportar para uso global
window.NavigationManager = NavigationManager;
window.initNavigation = initNavigation;

initNavigation();