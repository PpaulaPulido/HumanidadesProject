document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('password-toggle');
    const submitBtn = document.getElementById('submitBtn');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    
    // Inicializar partículas
    initParticles();
    
    // Efecto de animación en los inputs
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        // Efecto focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            hideError(this);
        });
        
        // Efecto blur
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
            validateField(this);
        });
        
        // Validación en tiempo real
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                validateField(this);
            } else {
                hideError(this);
            }
        });
        
        // Efecto al presionar Enter
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (validateForm()) {
                    showLoadingState();
                    setTimeout(() => {
                        form.submit();
                    }, 1500);
                } else {
                    showValidationErrors();
                }
            }
        });
    });
    
    // Toggle de visibilidad de contraseña
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
            showValidationErrors();
        } else {
            showLoadingState();
            setTimeout(() => {
                // form.submit(); // Descomentar en producción
            }, 2000);
        }
    });
    
    // Botones de login social (demo)
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'Microsoft';
            showSocialLoginDemo(provider);
        });
    });
    
    // Funciones de validación
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remover clases previas
        field.classList.remove('valid', 'invalid');
        
        if (field.id === 'email') {
            if (value === '') {
                errorMessage = 'El correo electrónico es requerido';
                isValid = false;
            } else if (!validateEmail(value)) {
                errorMessage = 'Por favor ingresa un correo electrónico válido';
                isValid = false;
            } else {
                isValid = true;
            }
        } else if (field.id === 'password') {
            if (value === '') {
                errorMessage = 'La contraseña es requerida';
                isValid = false;
            } else if (value.length < 6) {
                errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                isValid = false;
            } else {
                isValid = true;
            }
        }
        
        // Aplicar clases y mensajes
        if (value.length > 0) {
            field.classList.add(isValid ? 'valid' : 'invalid');
            if (!isValid) {
                showError(field, errorMessage);
            } else {
                hideError(field);
            }
        } else {
            hideError(field);
        }
        
        return isValid;
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showError(field, message) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function hideError(field) {
        const errorElement = document.getElementById(field.id + '-error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    // Mostrar estado de carga
    function showLoadingState() {
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const btnArrow = submitBtn.querySelector('.btn-arrow');
        
        // Cambiar estado del botón
        btnText.style.opacity = '0';
        btnLoader.style.display = 'flex';
        btnArrow.style.opacity = '0';
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        // Agregar efecto de pulso al contenedor
        const container = document.querySelector('.container');
        container.style.transform = 'scale(0.99)';
        container.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 300);
        
        // Simular envío exitoso después de 2 segundos (demo)
        setTimeout(() => {
            showSuccessAnimation();
        }, 2000);
    }
    
    // Mostrar errores de validación
    function showValidationErrors() {
        const container = document.querySelector('.container');
        container.classList.add('shake');
        
        setTimeout(() => {
            container.classList.remove('shake');
        }, 500);
        
        // Resaltar campos inválidos
        inputs.forEach(input => {
            if (!validateField(input)) {
                input.classList.add('invalid');
                
                // Efecto de parpadeo en el campo inválido
                input.style.animation = 'pulseError 0.5s ease-in-out';
                setTimeout(() => {
                    input.style.animation = '';
                }, 500);
            }
        });
    }
    
    // Animación de éxito
    function showSuccessAnimation() {
        const container = document.querySelector('.container');
        container.style.transform = 'scale(1.02)';
        container.style.transition = 'transform 0.5s ease';
        
        // Crear efecto de confeti
        createConfetti();
        
        setTimeout(() => {
            container.style.transform = 'scale(1)';
            // Aquí normalmente redirigiríamos al dashboard
            // window.location.href = '/dashboard';
        }, 1000);
    }
    
    // Demo de login social
    function showSocialLoginDemo(provider) {
        const btn = event.target.closest('.social-btn');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i><span>Conectando con ${provider}...</span>`;
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
            alert(`En una implementación real, esto redirigiría a la autenticación de ${provider}`);
        }, 2000);
    }
    
    // Efecto de hover en el contenedor
    const container = document.querySelector('.container');
    container.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.01)';
        this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
    });
    
    container.addEventListener('mouseleave', function() {
        if (!submitBtn.classList.contains('loading')) {
            this.style.transform = 'translateY(0) scale(1)';
        }
        this.style.boxShadow = 'var(--shadow-hover)';
    });
    
    // Inicializar partículas
    function initParticles() {
        const container = document.getElementById('particles-container');
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Tamaño y posición aleatorios
            const size = Math.random() * 6 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = Math.random() * 10 + 15;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}vw`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            container.appendChild(particle);
        }
    }
    
    // Crear efecto de confeti
    function createConfetti() {
        const colors = ['#0b3e9c', '#0bc5b3', '#f7a389', '#eed0cd', '#4CAF50', '#FFC107'];
        const confettiContainer = document.getElementById('particles-container');
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.opacity = Math.random() * 0.7 + 0.3;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.zIndex = '1000';
            
            confettiContainer.appendChild(confetti);
            
            // Animación
            const animation = confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 1000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            // Eliminar confeti después de la animación
            animation.onfinish = () => {
                confetti.remove();
            };
        }
    }
    
    // Demo: Simular autocompletado para demostración
    if (window.location.search.includes('demo=true')) {
        setTimeout(() => {
            emailInput.value = 'usuario@ejemplo.com';
            passwordInput.value = 'password123';
            
            // Disparar eventos de input para activar validaciones
            emailInput.dispatchEvent(new Event('input'));
            passwordInput.dispatchEvent(new Event('input'));
        }, 1000);
    }
    
    // Agregar estilos para animaciones
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseError {
            0%, 100% { background-color: transparent; }
            50% { background-color: rgba(244, 67, 54, 0.1); }
        }
        
        .form-group {
            transition: transform 0.3s ease;
        }
        
        .form-group.focused {
            transform: translateX(5px);
        }
    `;
    document.head.appendChild(style);
});