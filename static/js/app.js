// Inicialización principal
function initApp() {
    try {        
        if (AppUtils.elementExists('.hero-section')) HeroSection.init();
        if (AppUtils.elementExists('#instructions')) InstructionsSection.init();
        if (AppUtils.elementExists('#intelligence-types')) IntelligenceTypesSection.init();
        if (AppUtils.elementExists('#motivation')) MotivationSection.init();
        if (AppUtils.elementExists('#calculation')) CalculationSection.init();
        
    } catch (error) {
        console.error('❌ Error inicializando la aplicación:', error);
    }
}

// Manejo de redimensionamiento
const resizeHandler = AppUtils.debounce(() => {
    window.CONFIG.isDesktop = window.innerWidth > 992;
}, 250);

window.addEventListener('resize', resizeHandler);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Manejo de errores global
window.addEventListener('error', (e) => {
    console.warn('Error global capturado:', e.error);
});

// Exportar para uso global
window.App = { 
    HeroSection, 
    InstructionsSection, 
    IntelligenceTypesSection, 
    MotivationSection,
    CalculationSection,
    initApp
};

// Utilidades globales adicionales
window.AppHelpers = {
    reinitModule(moduleName) {
        const modules = {
            hero: HeroSection,
            instructions: InstructionsSection,
            intelligence: IntelligenceTypesSection,
            motivation: MotivationSection,
            calculation: CalculationSection,
            navigation: () => window.initNavigation()
        };
        
        if (modules[moduleName]) {
            modules[moduleName].init();
        } else {
            console.warn(`❌ Módulo ${moduleName} no encontrado`);
        }
    },
    
    // Verificar estado de módulos
    getModuleStatus() {
        const status = {
            hero: AppUtils.elementExists('.hero-section'),
            instructions: AppUtils.elementExists('#instructions'),
            intelligence: AppUtils.elementExists('#intelligence-types'),
            motivation: AppUtils.elementExists('#motivation'),
            calculation: AppUtils.elementExists('#calculation'),
            navigation: AppUtils.elementExists('.navbar')
        };
        
        return status;
    },
    
    // Desactivar todas las animaciones
    disableAnimations() {
        window.CONFIG.prefersReducedMotion = true;
    },
    
    // Activar animaciones
    enableAnimations() {
        window.CONFIG.prefersReducedMotion = false;
    },
    
    // Limpiar todos los efectos y partículas
    cleanupEffects() {
        const elementsToRemove = [
            '.particle', '.step-particle', '.intelligence-particle',
            '.motivation-particle', '.calculation-particle', '.button-particle',
            '.ripple-effect', '.step-ripple', '.motivation-ripple',
            '.calculation-ripple', '.button-ripple', '.background-particle',
            '.intelligence-bg-particle'
        ];
        
        let removedCount = 0;
        elementsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.remove();
                removedCount++;
            });
        });
    }
};
