// Utilidades globales - Efectos y animaciones
class AppUtils {
    // Crear elemento con estilos
    static createElement(tag, classes = '', styles = {}) {
        const element = document.createElement(tag);
        if (classes) element.className = classes;
        Object.assign(element.style, styles);
        return element;
    }

    // Remover elemento
    static removeElement(element) {
        if (element?.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    // Animación de partículas reutilizable
    static createParticleAnimation(e, element, count = 8, colors, particleClass = 'particle') {
        if (window.CONFIG.prefersReducedMotion) return;

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createSingleParticle(e, element, colors, i, particleClass);
            }, i * 50);
        }
    }

    static createSingleParticle(e, element, colors, index, particleClass) {
        const particle = this.createElement('div', particleClass, {
            width: `${Math.random() * 6 + 3}px`,
            height: `${Math.random() * 6 + 3}px`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: '50%',
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '10',
            opacity: '0'
        });

        const rect = element.getBoundingClientRect();
        Object.assign(particle.style, {
            left: `${e.clientX - rect.left}px`,
            top: `${e.clientY - rect.top}px`
        });

        element.appendChild(particle);

        const angle = (Math.PI * 2 * index) / 8;
        const distance = 25 + Math.random() * 40;
        const duration = 700 + Math.random() * 500;
        
        const animation = particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`, opacity: 0 }
        ], {
            duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        });

        animation.onfinish = () => this.removeElement(particle);
    }

    // Efecto ripple reutilizable
    static createRipple(e, element, sizeMultiplier = 1.3, color = 'rgba(11, 62, 156, 0.2)') {
        const ripple = this.createElement('div', 'ripple-effect', {
            position: 'absolute',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            transform: 'scale(0)',
            animation: 'rippleExpand 0.6s ease-out',
            pointerEvents: 'none',
            zIndex: '5'
        });

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * sizeMultiplier;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        Object.assign(ripple.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`
        });

        element.appendChild(ripple);
        setTimeout(() => this.removeElement(ripple), 600);
    }

    // Efecto magnético mejorado
    static initMagneticEffect(element, baseTransform = '') {
        const handleMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 25;
            const moveY = (y - centerY) / 25;
            
            element.style.transform = `${baseTransform} translate(${moveX}px, ${moveY}px)`;
        };

        element.addEventListener('mousemove', handleMove);
        
        // Retornar función para limpiar
        return () => element.removeEventListener('mousemove', handleMove);
    }

    // Observer de scroll simplificado
    static initScrollObserver(elements, callback, options = { threshold: 0.1 }) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) callback(entry.target);
            });
        }, options);

        elements.forEach(el => observer.observe(el));
        return observer;
    }

    static animateIcon(element, selector = 'i', scale = 1.2, duration = 300) {
        const icon = element.querySelector(selector);
        if (icon && !window.CONFIG.prefersReducedMotion) {
            icon.style.transform = `scale(${scale})`;
            setTimeout(() => {
                icon.style.transform = 'scale(1)';
            }, duration);
        }
    }

    // Crear decoraciones
    static createDecoration(container, type, position = {}) {
        const decoration = this.createElement('div', `${type}-decoration ${type}-${position.class || 'default'}`, {
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: '1',
            ...position.styles
        });
        
        container.appendChild(decoration);
        return decoration;
    }

    // Smooth scroll seguro
    static smoothScrollTo(target, offset = 0) {
        try {
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        } catch (error) {
            console.warn('Error en smooth scroll:', error);
        }
    }

    // Verificar si un elemento existe en el DOM
    static elementExists(selector) {
        return !!document.querySelector(selector);
    }

    // Debounce function para eventos de resize
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

window.AppUtils = AppUtils;