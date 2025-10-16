// ===== CONFIGURACIÓN DE RESULTADOS INDIVIDUALES =====
const IndividualResults = {
    currentResults: null,
    previousResults: null,
    chartViews: {
        current: 'bar',
        barChart: null,
        radarChart: null,
        pieChart: null
    },
    
    init() {
        this.loadResults();
        this.renderResults();
        this.initCharts();
        this.initEventListeners();
        
        if (this.previousResults) {
            this.showComparison();
        }
    },
    
    loadResults() {
        const currentResults = localStorage.getItem('simulatorResults');
        if (currentResults) {
            this.currentResults = JSON.parse(currentResults);
        } else {
            this.showNoResultsMessage();
            return;
        }
        
        const history = JSON.parse(localStorage.getItem('simulatorHistory')) || [];
        if (history.length > 0) {
            const currentTimestamp = this.currentResults.timestamp || Date.now();
            const previousResults = history
                .filter(item => Math.abs(item.timestamp - currentTimestamp) > 60000)
                .slice(-1)[0];
            
            if (previousResults) {
                this.previousResults = previousResults;
            }
        }
        
        this.saveToHistory();
    },
    
    saveToHistory() {
        if (!this.currentResults) return;
        
        let history = JSON.parse(localStorage.getItem('simulatorHistory')) || [];
        const resultWithDate = {
            ...this.currentResults,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        const recentDuplicate = history.find(item => 
            Math.abs(item.timestamp - resultWithDate.timestamp) < 60000
        );
        
        if (!recentDuplicate) {
            history.push(resultWithDate);
            if (history.length > 10) {
                history = history.slice(-10);
            }
            localStorage.setItem('simulatorHistory', JSON.stringify(history));
        }
    },
    
    showNoResultsMessage() {
        const resultsContent = document.getElementById('results-content');
        resultsContent.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-clipboard-list fa-4x text-muted mb-3"></i>
                <h3 class="text-muted">No hay resultados disponibles</h3>
                <p class="text-muted mb-4">Completa el simulador para ver tus resultados personalizados.</p>
                <a href="simulator.html" class="btn btn-primary btn-lg">
                    <i class="fas fa-play-circle me-2"></i>Ir al Simulador
                </a>
            </div>
        `;
        
        document.querySelector('.results-actions').style.display = 'none';
    },
    
    renderResults() {
        if (!this.currentResults) return;
        
        this.renderSummary();
        this.renderScoresGrid();
        this.renderIntelligenceDetails();
        this.renderRecommendations();
        this.updateDate();
    },
    
    renderSummary() {
        const results = this.currentResults;
        const intelligences = Object.keys(results);
        
        let dominantIntel = intelligences[0];
        let lowestIntel = intelligences[0];
        
        intelligences.forEach(intel => {
            if (results[intel].score > results[dominantIntel].score) {
                dominantIntel = intel;
            }
            if (results[intel].score < results[lowestIntel].score) {
                lowestIntel = intel;
            }
        });
        
        document.getElementById('summary-text').textContent = 
            `Tu perfil muestra un equilibrio único de habilidades. Destacas especialmente en áreas que requieren ${this.getIntelligenceDescription(dominantIntel)}, mientras que tienes oportunidades de crecimiento en aspectos relacionados con ${this.getIntelligenceDescription(lowestIntel)}.`;
        
        document.getElementById('top-strength-text').textContent = 
            `${results[dominantIntel].title} (${results[dominantIntel].score}%)`;
        
        document.getElementById('growth-area-text').textContent = 
            `${results[lowestIntel].title} (${results[lowestIntel].score}%)`;
        
        document.getElementById('dominant-title').textContent = 
            results[dominantIntel].title;
        
        document.getElementById('dominant-score').textContent = 
            `${results[dominantIntel].score}%`;
        
        const dominantIcon = document.querySelector('.dominant-icon i');
        dominantIcon.className = `${results[dominantIntel].icon} fa-3x`;
        dominantIcon.style.color = results[dominantIntel].color;
    },
    
    renderScoresGrid() {
        const scoresGrid = document.getElementById('scores-grid');
        const results = this.currentResults;
        
        scoresGrid.innerHTML = Object.keys(results).map(intel => {
            const intelData = results[intel];
            const scoreClass = this.getScoreClass(intelData.score);
            
            return `
                <div class="score-item ${scoreClass}" style="border-color: ${intelData.color}">
                    <div class="score-icon">
                        <i class="${intelData.icon}" style="color: ${intelData.color}"></i>
                    </div>
                    <div class="score-value">${intelData.score}%</div>
                    <div class="score-label">${this.getShortTitle(intelData.title)}</div>
                </div>
            `;
        }).join('');
    },
    
    renderIntelligenceDetails() {
        const detailsContainer = document.getElementById('intelligence-details');
        const results = this.currentResults;
        
        detailsContainer.innerHTML = Object.keys(results).map(intel => {
            const intelData = results[intel];
            const level = this.getLevel(intelData.score);
            const levelClass = this.getLevelClass(intelData.score);
            
            return `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="intelligence-detail-card" style="border-top-color: ${intelData.color}">
                        <div class="detail-header">
                            <div class="detail-icon" style="background: linear-gradient(135deg, ${intelData.color}, ${this.lightenColor(intelData.color, 20)})">
                                <i class="${intelData.icon}"></i>
                            </div>
                            <div class="detail-title">
                                <h5>${this.getShortTitle(intelData.title)}</h5>
                                <div class="detail-score">${intelData.score}%</div>
                            </div>
                        </div>
                        <div class="detail-level ${levelClass}">${level}</div>
                        <p class="detail-description">${intelData.description}</p>
                        <div class="detail-analysis">
                            <small class="text-muted">${this.getAnalysisText(intelData.score)}</small>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    renderRecommendations() {
        const recommendationsContainer = document.getElementById('recommendations-content');
        const results = this.currentResults;
        const recommendations = this.generateRecommendations(results);
        
        recommendationsContainer.innerHTML = recommendations.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-icon">
                    <i class="${rec.icon}"></i>
                </div>
                <div class="recommendation-content">
                    <h6>${rec.title}</h6>
                    <p>${rec.description}</p>
                </div>
            </div>
        `).join('');
    },
    
    generateRecommendations(results) {
        const recommendations = [];
        const intelligences = Object.keys(results);
        
        const highestIntel = intelligences.reduce((a, b) => 
            results[a].score > results[b].score ? a : b
        );
        
        recommendations.push({
            icon: 'fas fa-rocket',
            title: `Potencia tu ${results[highestIntel].title}`,
            description: `Dedica tiempo a actividades que desarrollen tu ${results[highestIntel].title.toLowerCase()}. Esta es tu área natural de excelencia.`
        });
        
        const lowestIntel = intelligences.reduce((a, b) => 
            results[a].score < results[b].score ? a : b
        );
        
        recommendations.push({
            icon: 'fas fa-seedling',
            title: `Desarrolla tu ${results[lowestIntel].title}`,
            description: `Incorpora pequeñas prácticas diarias para fortalecer tu ${results[lowestIntel].title.toLowerCase()}. El crecimiento constante es clave.`
        });
        
        recommendations.push({
            icon: 'fas fa-balance-scale',
            title: 'Busca el equilibrio',
            description: 'Combina actividades que involucren diferentes tipos de inteligencia para un desarrollo integral.'
        });
        
        const avgScore = Object.values(results).reduce((sum, intel) => sum + intel.score, 0) / intelligences.length;
        if (avgScore > 70) {
            recommendations.push({
                icon: 'fas fa-star',
                title: 'Perfil equilibrado',
                description: 'Tienes un perfil muy equilibrado. Explora cómo combinar tus múltiples talentos en proyectos complejos.'
            });
        }
        
        return recommendations;
    },
    
    showComparison() {
        const comparisonSection = document.getElementById('comparison-section');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        const improvementList = document.getElementById('improvement-list');
        
        comparisonSection.style.display = 'block';
        
        const currentAvg = this.calculateAverageScore(this.currentResults);
        const previousAvg = this.calculateAverageScore(this.previousResults);
        
        let progress = 0;
        let progressTextMessage = '';
        
        if (previousAvg > 0) {
            progress = ((currentAvg - previousAvg) / previousAvg) * 100;
            progressTextMessage = progress >= 0 ? 
                `¡Excelente! Has mejorado un ${progress.toFixed(1)}% desde tu última evaluación.` :
                `Tu puntuación general ha disminuido un ${Math.abs(progress).toFixed(1)}%. Considera practicar más.`;
        } else {
            progress = 0;
            progressTextMessage = 'Esta es tu primera evaluación. ¡Completa más simulaciones para ver tu progreso!';
        }
        
        const progressWidth = Math.min(Math.max(progress + 50, 0), 100);
        progressBar.style.width = `${progressWidth}%`;
        
        if (previousAvg > 0) {
            progressBar.textContent = `${progress > 0 ? '+' : ''}${progress.toFixed(1)}%`;
            progressBar.className = `progress-bar ${progress >= 0 ? 'bg-success' : 'bg-warning'}`;
        } else {
            progressBar.textContent = 'Nuevo';
            progressBar.className = 'progress-bar bg-info';
        }
        
        progressText.textContent = progressTextMessage;
        
        if (previousAvg > 0) {
            improvementList.innerHTML = Object.keys(this.currentResults).map(intel => {
                const currentScore = this.currentResults[intel].score;
                const previousScore = this.previousResults[intel]?.score || 0;
                const difference = currentScore - previousScore;
                
                if (Math.abs(difference) < 2) return '';
                
                const trend = difference > 0 ? 'positive' : difference < 0 ? 'negative' : 'neutral';
                const icon = difference > 0 ? 'fa-arrow-up' : difference < 0 ? 'fa-arrow-down' : 'fa-minus';
                const text = difference > 0 ? 'Mejoró' : difference < 0 ? 'Disminuyó' : 'Sin cambio';
                
                return `
                    <div class="improvement-item ${trend}">
                        <div class="improvement-icon">
                            <i class="fas ${icon}"></i>
                        </div>
                        <span>${this.getShortTitle(this.currentResults[intel].title)}: ${text} ${Math.abs(difference).toFixed(1)}%</span>
                    </div>
                `;
            }).filter(item => item !== '').join('');
            
            if (improvementList.innerHTML === '') {
                improvementList.innerHTML = `
                    <div class="improvement-item neutral">
                        <div class="improvement-icon">
                            <i class="fas fa-minus"></i>
                        </div>
                        <span>Sin cambios significativos en ninguna inteligencia</span>
                    </div>
                `;
            }
        } else {
            improvementList.innerHTML = `
                <div class="improvement-item neutral">
                    <div class="improvement-icon">
                        <i class="fas fa-info-circle"></i>
                    </div>
                    <span>Completa más evaluaciones para ver tu progreso</span>
                </div>
            `;
        }
    },
    
    initCharts() {
        this.initBarChart();
        this.initRadarChart();
        this.initPieChart();
    },
    
    initBarChart() {
        const ctx = document.getElementById('barChart').getContext('2d');
        const results = this.currentResults;
        
        const labels = Object.keys(results).map(intel => this.getShortTitle(results[intel].title));
        const data = Object.keys(results).map(intel => results[intel].score);
        const colors = Object.keys(results).map(intel => results[intel].color);
        const hoverColors = Object.keys(results).map(intel => this.lightenColor(results[intel].color, 20));
        
        this.chartViews.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Puntuación (%)',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(color => this.darkenColor(color, 20)),
                    borderWidth: 2,
                    hoverBackgroundColor: hoverColors,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Puntuación: ${context.parsed.y}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    },
    
    initRadarChart() {
        const ctx = document.getElementById('radarChart').getContext('2d');
        const results = this.currentResults;
        
        const labels = Object.keys(results).map(intel => this.getShortTitle(results[intel].title));
        const data = Object.keys(results).map(intel => results[intel].score);
        const colors = Object.keys(results).map(intel => results[intel].color);
        
        this.chartViews.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Tu Perfil',
                    data: data,
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    borderColor: '#667eea',
                    borderWidth: 3,
                    pointBackgroundColor: colors,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        angleLines: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        pointLabels: {
                            font: {
                                size: 11,
                                weight: '600'
                            },
                            color: '#333'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.r}%`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    },
    
    initPieChart() {
        const ctx = document.getElementById('pieChart').getContext('2d');
        const results = this.currentResults;
        
        const labels = Object.keys(results).map(intel => this.getShortTitle(results[intel].title));
        const data = Object.keys(results).map(intel => results[intel].score);
        const colors = Object.keys(results).map(intel => results[intel].color);
        const hoverColors = Object.keys(results).map(intel => this.lightenColor(results[intel].color, 20));
        
        this.chartViews.pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(color => this.darkenColor(color, 20)),
                    borderWidth: 2,
                    hoverBackgroundColor: hoverColors,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 11,
                                weight: '600'
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value}% (${percentage}% del total)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeOutQuart'
                }
            }
        });
    },
    
    initEventListeners() {
        document.getElementById('toggle-view').addEventListener('click', () => {
            this.toggleChartView();
        });
        
        document.getElementById('new-simulation').addEventListener('click', () => {
            window.location.href = 'simulator.html';
        });
        
        document.getElementById('download-pdf').addEventListener('click', () => {
            PDFGenerator.generatePDF(this.currentResults);
        });
        
        document.getElementById('share-results').addEventListener('click', () => {
            this.showShareModal();
        });
        
        document.getElementById('copy-link').addEventListener('click', () => {
            this.copyResultsLink();
        });
        
        document.querySelector('.btn-facebook').addEventListener('click', () => {
            this.shareOnFacebook();
        });
        
        document.querySelector('.btn-twitter').addEventListener('click', () => {
            this.shareOnTwitter();
        });
        
        document.querySelector('.btn-linkedin').addEventListener('click', () => {
            this.shareOnLinkedIn();
        });
        
        document.querySelector('.btn-whatsapp').addEventListener('click', () => {
            this.shareOnWhatsApp();
        });
    },
    
    toggleChartView() {
        const barChart = document.getElementById('barChart');
        const radarChart = document.getElementById('radarChart');
        const pieChart = document.getElementById('pieChart');
        const toggleBtn = document.getElementById('toggle-view');
        
        if (this.chartViews.current === 'bar') {
            barChart.style.display = 'none';
            radarChart.style.display = 'block';
            pieChart.style.display = 'none';
            this.chartViews.current = 'radar';
            toggleBtn.innerHTML = '<i class="fas fa-chart-pie me-1"></i>Vista Torta';
        } else if (this.chartViews.current === 'radar') {
            barChart.style.display = 'none';
            radarChart.style.display = 'none';
            pieChart.style.display = 'block';
            this.chartViews.current = 'pie';
            toggleBtn.innerHTML = '<i class="fas fa-chart-bar me-1"></i>Vista Barras';
        } else {
            barChart.style.display = 'block';
            radarChart.style.display = 'none';
            pieChart.style.display = 'none';
            this.chartViews.current = 'bar';
            toggleBtn.innerHTML = '<i class="fas fa-bullseye me-1"></i>Vista Radar';
        }
    },
    
    showShareModal() {
        const modal = new bootstrap.Modal(document.getElementById('shareModal'));
        modal.show();
    },
    
    copyResultsLink() {
        const tempInput = document.createElement('input');
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        
        const copyBtn = document.getElementById('copy-link');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Enlace Copiado';
        copyBtn.classList.remove('btn-outline-primary');
        copyBtn.classList.add('btn-success');
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.classList.remove('btn-success');
            copyBtn.classList.add('btn-outline-primary');
        }, 2000);
    },
    
    shareOnFacebook() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('¡Mira mis resultados de Inteligencias Múltiples!');
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
    },
    
    shareOnTwitter() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('¡Descubrí mi perfil de Inteligencias Múltiples! 🧠');
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    },
    
    shareOnLinkedIn() {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent('Resultados de Inteligencias Múltiples');
        const summary = encodeURIComponent('Descubrí mi perfil único de inteligencias múltiples');
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    },
    
    shareOnWhatsApp() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent('¡Mira mis resultados de Inteligencias Múltiples! 🧠');
        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    },
    
    updateDate() {
        const dateElement = document.getElementById('results-date');
        dateElement.textContent = `Evaluación completada el ${new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })}`;
    },
    
    calculateAverageScore(results) {
        if (!results || Object.keys(results).length === 0) return 0;
        
        const scores = Object.values(results)
            .filter(intel => typeof intel.score === 'number')
            .map(intel => intel.score);
            
        if (scores.length === 0) return 0;
        
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    },
    
    getIntelligenceDescription(intelligence) {
        const descriptions = {
            linguistic: 'habilidades verbales y de comunicación',
            logical: 'pensamiento lógico y analítico',
            spatial: 'percepción visual y espacial',
            musical: 'sensibilidad auditiva y rítmica',
            kinesthetic: 'coordinación física y motora',
            interpersonal: 'comprensión de relaciones sociales',
            intrapersonal: 'autoconocimiento y reflexión',
            naturalist: 'observación y conexión con la naturaleza'
        };
        return descriptions[intelligence] || 'diversas habilidades';
    },
    
    getShortTitle(title) {
        const shortTitles = {
            'Inteligencia Lingüística': 'Lingüística',
            'Inteligencia Lógico-Matemática': 'Lógico-Matemática',
            'Inteligencia Espacial': 'Espacial',
            'Inteligencia Musical': 'Musical',
            'Inteligencia Kinestésica': 'Kinestésica',
            'Inteligencia Interpersonal': 'Interpersonal',
            'Inteligencia Intrapersonal': 'Intrapersonal',
            'Inteligencia Naturalista': 'Naturalista'
        };
        return shortTitles[title] || title;
    },
    
    getScoreClass(score) {
        if (score >= 80) return 'highlight';
        if (score >= 60) return '';
        return '';
    },
    
    getLevel(score) {
        if (score >= 80) return 'Muy Desarrollada';
        if (score >= 60) return 'Desarrollada';
        if (score >= 40) return 'Moderada';
        return 'En Desarrollo';
    },
    
    getLevelClass(score) {
        if (score >= 80) return 'level-high';
        if (score >= 60) return 'level-medium';
        if (score >= 40) return 'level-medium';
        return 'level-low';
    },
    
    getAnalysisText(score) {
        if (score >= 80) return 'Excelente desarrollo. Esta es una de tus áreas naturales de talento.';
        if (score >= 60) return 'Buen desarrollo. Tienes habilidades sólidas en esta área.';
        if (score >= 40) return 'Desarrollo moderado. Hay oportunidades para seguir creciendo.';
        return 'Área de crecimiento. Considera practicar actividades relacionadas.';
    },
    
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
    },
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        
        return "#" + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }
};

// ===== INICIALIZACIÓN =====
function initIndividualResults() {
    if (document.getElementById('individual-results')) {
        IndividualResults.init();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIndividualResults);
} else {
    initIndividualResults();
}