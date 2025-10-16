document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const submitBtn = document.getElementById('submitBtn');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const passwordMatch = document.querySelector('.password-match');
    
    // Efecto de animación en los inputs
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Validación en tiempo real
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
    
    // Validación de fortaleza de contraseña
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        checkPasswordMatch();
    });
    
    // Validación de coincidencia de contraseñas
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
    
    // Envío del formulario
    form.addEventListener('submit', function(e) {
        // No prevenir el envío por defecto para que Flask lo maneje
        // Solo agregamos efectos visuales
        
        if (validateForm()) {
            showLoadingState();
        } else {
            e.preventDefault();
            showValidationErrors();
        }
    });
    
    // Función para validar un campo individual
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remover clases previas
        field.classList.remove('valid', 'invalid');
        
        if (field.id === 'email') {
            isValid = validateEmail(value);
        } else if (field.id === 'password') {
            isValid = value.length >= 6;
        } else if (field.id === 'confirm_password') {
            isValid = value === passwordInput.value && value.length > 0;
        } else if (field.type === 'text' && field.required) {
            isValid = value.length > 0;
        }
        
        // Aplicar clases según validación
        if (value.length > 0) {
            field.classList.add(isValid ? 'valid' : 'invalid');
        }
        
        return isValid;
    }
    
    // Función para validar email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Función para verificar fortaleza de contraseña
    function checkPasswordStrength(password) {
        let strength = 0;
        let text = '';
        let width = 0;
        let color = '';
        
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        switch(strength) {
            case 0:
            case 1:
                text = 'Débil';
                width = '25%';
                color = 'strength-weak';
                break;
            case 2:
            case 3:
                text = 'Media';
                width = '50%';
                color = 'strength-medium';
                break;
            case 4:
                text = 'Fuerte';
                width = '75%';
                color = 'strength-strong';
                break;
            case 5:
                text = 'Muy fuerte';
                width = '100%';
                color = 'strength-strong';
                break;
        }
        
        strengthBar.style.width = width;
        strengthBar.className = 'strength-bar ' + color;
        strengthText.textContent = text;
    }
    
    // Función para verificar coincidencia de contraseñas
    function checkPasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length === 0) {
            passwordMatch.textContent = '';
            return;
        }
        
        if (password === confirmPassword) {
            passwordMatch.textContent = 'Las contraseñas coinciden';
            passwordMatch.className = 'password-match match-success';
        } else {
            passwordMatch.textContent = 'Las contraseñas no coinciden';
            passwordMatch.className = 'password-match match-error';
        }
    }
    
    // Función para validar todo el formulario
    function validateForm() {
        let isValid = true;
        
        inputs.forEach(input => {
            if (input.required && !validateField(input)) {
                isValid = false;
            }
        });
        
        // Verificar términos y condiciones
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            isValid = false;
            termsCheckbox.parentElement.classList.add('invalid-checkbox');
        } else {
            termsCheckbox.parentElement.classList.remove('invalid-checkbox');
        }
        
        return isValid;
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
        
        // Agregar confeti para éxito visual
        createConfetti();
    }
    
    // Mostrar errores de validación
    function showValidationErrors() {
        const container = document.querySelector('.container');
        container.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
        
        // Resaltar campos inválidos
        inputs.forEach(input => {
            if (input.required && !validateField(input)) {
                input.classList.add('invalid');
            }
        });
    }
    
    // Función para crear efecto de confeti
    function createConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = '';
        
        const colors = ['#0b3e9c', '#0bc5b3', '#f7a389', '#eed0cd', '#4CAF50'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.opacity = Math.random() * 0.5 + 0.5;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            confettiContainer.appendChild(confetti);
            
            // Animación
            const animation = confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
            });
            
            // Eliminar confeti después de la animación
            animation.onfinish = () => {
                confetti.remove();
            };
        }
    }
    
    // Efecto de hover en el contenedor
    const container = document.querySelector('.container');
    container.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
    });
    
    container.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'var(--shadow-hover)';
    });
    
    // Animación de shake para errores
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .invalid-checkbox {
            color: var(--error-color);
        }
        
        .invalid-checkbox .checkbox-label {
            color: var(--error-color);
        }
    `;
    document.head.appendChild(style);
});