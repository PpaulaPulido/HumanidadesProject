// ===== CONFIGURACIÓN DEL FORMULARIO =====
const SimulatorForm = {
    currentSection: 0,
    totalSections: 0,
    answers: {},
    
    init() {
        this.totalSections = QUESTIONNAIRE_DATA.sections.length;
        this.loadSavedAnswers();
        this.renderQuestionnaire();
        this.initEventListeners();
        this.showCurrentSection();
        this.updateProgress();
        this.updateNavigationButtons();
    },
    
    // Cargar respuestas guardadas
    loadSavedAnswers() {
        const savedAnswers = localStorage.getItem('simulatorAnswers');
        if (savedAnswers) {
            this.answers = JSON.parse(savedAnswers);
        }
    },
    
    // Renderizar el cuestionario completo
    renderQuestionnaire() {
        const form = document.getElementById('intelligence-questionnaire');
        form.innerHTML = '';
        
        QUESTIONNAIRE_DATA.sections.forEach((section, index) => {
            const sectionHTML = this.createSectionHTML(section, index);
            form.appendChild(sectionHTML);
        });
        
        // Restaurar respuestas seleccionadas
        this.restoreSelectedAnswers();
    },
    
    // Crear HTML para una sección
    createSectionHTML(section, index) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = `intelligence-section ${index === 0 ? 'active' : ''}`;
        sectionDiv.setAttribute('data-intelligence', section.id);
        sectionDiv.setAttribute('data-section-index', index);
        
        sectionDiv.innerHTML = `
            <div class="section-card">
                <div class="section-header">
                    <div class="section-icon" style="background: linear-gradient(135deg, ${section.color}, ${this.lightenColor(section.color, 20)})">
                        <i class="${section.icon} fa-2x"></i>
                    </div>
                    <div class="section-title">
                        <h3>${section.title}</h3>
                        <p>${section.description}</p>
                    </div>
                </div>
                <div class="section-questions">
                    ${section.questions.map((question, qIndex) => this.createQuestionHTML(question, qIndex)).join('')}
                </div>
            </div>
        `;
        
        return sectionDiv;
    },
    
    // Crear HTML para una pregunta
    createQuestionHTML(question, index) {
        return `
            <div class="question-item" data-question-id="${question.id}">
                <p class="question-text">${index + 1}. ${question.text}</p>
                <div class="options-container">
                    ${QUESTIONNAIRE_DATA.options.map(option => `
                        <label class="option-btn">
                            <input type="radio" name="${question.id}" value="${option.value}">
                            <span>${option.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    // Restaurar respuestas seleccionadas
    restoreSelectedAnswers() {
        Object.keys(this.answers).forEach(questionId => {
            const value = this.answers[questionId];
            const radio = document.querySelector(`input[name="${questionId}"][value="${value}"]`);
            if (radio) {
                radio.checked = true;
                // Aplicar estilo visual
                const optionBtn = radio.closest('.option-btn');
                if (optionBtn) {
                    optionBtn.querySelector('span').style.background = 'var(--primary-color)';
                    optionBtn.querySelector('span').style.color = 'white';
                }
            }
        });
    },
    
    // Event listeners
    initEventListeners() {
        document.getElementById('next-section').addEventListener('click', () => this.nextSection());
        document.getElementById('prev-section').addEventListener('click', () => this.prevSection());
        document.getElementById('finish-simulation').addEventListener('click', () => this.finishSimulation());
        
        // Event listeners para las opciones de respuesta
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.saveAnswer(e.target.name, e.target.value);
                this.updateProgress();
                this.validateCurrentSection();
                
                // Aplicar estilo visual
                const optionBtns = e.target.closest('.options-container').querySelectorAll('.option-btn');
                optionBtns.forEach(btn => {
                    const span = btn.querySelector('span');
                    span.style.background = '';
                    span.style.color = '';
                    span.style.borderColor = '';
                });
                
                const selectedSpan = e.target.closest('.option-btn').querySelector('span');
                selectedSpan.style.background = 'var(--primary-color)';
                selectedSpan.style.color = 'white';
                selectedSpan.style.borderColor = 'var(--primary-color)';
            }
        });
    },
    
    // Navegación entre secciones
    nextSection() {
        if (this.validateCurrentSection()) {
            if (this.currentSection < this.totalSections - 1) {
                this.currentSection++;
                this.showCurrentSection();
                this.updateNavigationButtons();
            }
        } else {
            this.highlightUnansweredQuestions();
        }
    },
    
    prevSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.showCurrentSection();
            this.updateNavigationButtons();
        }
    },
    
    // Mostrar sección actual
    showCurrentSection() {
        document.querySelectorAll('.intelligence-section').forEach((section, index) => {
            section.classList.toggle('active', index === this.currentSection);
        });
        
        // Scroll to top of section
        const activeSection = document.querySelector('.intelligence-section.active');
        if (activeSection) {
            activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },
    
    // Actualizar botones de navegación
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-section');
        const nextBtn = document.getElementById('next-section');
        const finishContainer = document.getElementById('finish-container');
        
        prevBtn.disabled = this.currentSection === 0;
        
        if (this.currentSection === this.totalSections - 1) {
            nextBtn.style.display = 'none';
            finishContainer.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            finishContainer.style.display = 'none';
        }
    },
    
    // Guardar respuesta
    saveAnswer(questionId, value) {
        this.answers[questionId] = parseInt(value);
        localStorage.setItem('simulatorAnswers', JSON.stringify(this.answers));
    },
    
    // Validar sección actual
    validateCurrentSection() {
        const currentSection = QUESTIONNAIRE_DATA.sections[this.currentSection];
        const allAnswered = currentSection.questions.every(question => 
            this.answers[question.id] !== undefined
        );
        
        return allAnswered;
    },
    
    // Resaltar preguntas sin responder
    highlightUnansweredQuestions() {
        const currentSection = QUESTIONNAIRE_DATA.sections[this.currentSection];
        
        currentSection.questions.forEach(question => {
            const questionElement = document.querySelector(`[data-question-id="${question.id}"]`);
            const isAnswered = this.answers[question.id] !== undefined;
            
            questionElement.classList.toggle('unanswered', !isAnswered);
            
            // Resaltar opciones no seleccionadas
            const optionBtns = questionElement.querySelectorAll('.option-btn');
            optionBtns.forEach(btn => {
                btn.classList.toggle('invalid', !isAnswered);
            });
        });
        
        // Mostrar alerta
        this.showAlert('Por favor responde todas las preguntas de esta sección antes de continuar.', 'warning');
    },
    
    // Actualizar progreso
    updateProgress() {
        const totalQuestions = QUESTIONNAIRE_DATA.sections.reduce((total, section) => 
            total + section.questions.length, 0
        );
        
        const answeredQuestions = Object.keys(this.answers).length;
        const progress = (answeredQuestions / totalQuestions) * 100;
        
        const progressBar = document.querySelector('.progress-bar');
        const progressPercentage = document.querySelector('.progress-percentage');
        
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);
        progressPercentage.textContent = `${Math.round(progress)}%`;
    },
    
    // Finalizar simulación
    finishSimulation() {
        if (this.validateCurrentSection()) {
            // Calcular resultados
            const results = this.calculateResults();
            
            // Guardar resultados en localStorage
            localStorage.setItem('simulatorResults', JSON.stringify(results));
            localStorage.setItem('simulatorCompleted', new Date().toISOString());
            
            // Limpiar respuestas del cuestionario actual
            localStorage.removeItem('simulatorAnswers');
            
            // Mostrar modal de confirmación
            const modal = new bootstrap.Modal(document.getElementById('completionModal'));
            modal.show();
        } else {
            this.highlightUnansweredQuestions();
        }
    },
    
    // Calcular resultados
    calculateResults() {
        const results = {};
        
        QUESTIONNAIRE_DATA.sections.forEach(section => {
            const sectionAnswers = section.questions.map(question => 
                this.answers[question.id] || 0
            );
            
            const total = sectionAnswers.reduce((sum, value) => sum + value, 0);
            const maxPossible = section.questions.length * 5; // 5 es el valor máximo por pregunta
            const percentage = (total / maxPossible) * 100;
            
            results[section.id] = {
                title: section.title,
                score: Math.round(percentage),
                description: section.description,
                icon: section.icon,
                color: section.color,
                rawScore: total
            };
        });
        
        return results;
    },
    
    // Mostrar alerta
    showAlert(message, type = 'info') {
        // Crear alerta Bootstrap
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    },
    
    // Helper para aclarar colores
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        
        return "#" + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
};

// ===== INICIALIZACIÓN =====
function initSimulator() {
    if (document.getElementById('intelligence-questionnaire')) {
        SimulatorForm.init();
    }
}

function viewResults() {
    window.location.href = '/templates/result_individual.html';
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
} else {
    initSimulator();
}
