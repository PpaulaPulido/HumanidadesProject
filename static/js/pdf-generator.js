class PDFGenerator {
    static generatePDF(results) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        this.addHeader(doc);
        let yPosition = this.addSummary(doc, results);
        yPosition = this.addScoresTable(doc, results, yPosition);
        this.addIntelligenceAnalysis(doc, results);
        this.addRecommendations(doc, results);
        this.addFooter(doc);

        doc.save(`resultados-inteligencias-${new Date().toISOString().split('T')[0]}.pdf`);
    }

    static addHeader(doc) {
        // Color primario en RGB
        doc.setFillColor(11, 62, 156);
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('RESULTADOS DE INTELIGENCIAS MÚLTIPLES', 105, 25, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`, 105, 35, { align: 'center' });

        doc.setTextColor(0, 0, 0);
    }

    static addSummary(doc, results) {
        let yPosition = 60;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(11, 62, 156);
        doc.text('RESUMEN DE TU PERFIL', 20, yPosition);

        yPosition += 15;

        const intelligences = Object.keys(results);
        const dominantIntel = intelligences.reduce((a, b) => results[a].score > results[b].score ? a : b);
        const lowestIntel = intelligences.reduce((a, b) => results[a].score < results[b].score ? a : b);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const summaryText = `Tu perfil muestra fortalezas destacadas en ${results[dominantIntel].title} (${results[dominantIntel].score}%) y áreas de crecimiento en ${results[lowestIntel].title} (${results[lowestIntel].score}%). Este análisis te ayudará a comprender mejor tus habilidades naturales y oportunidades de desarrollo.`;

        const splitSummary = doc.splitTextToSize(summaryText, 170);
        doc.text(splitSummary, 20, yPosition);

        yPosition += splitSummary.length * 6 + 20;

        // Estadísticas rápidas
        const scores = Object.values(results).map(intel => intel.score);
        const averageScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
        const maxScore = Math.max(...scores);
        const minScore = Math.min(...scores);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(11, 62, 156);
        doc.text('ESTADÍSTICAS RÁPIDAS', 20, yPosition);

        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        doc.text(`Puntuación promedio: ${averageScore}%`, 25, yPosition);
        yPosition += 6;
        doc.text(`Inteligencia más desarrollada: ${this.getShortTitle(results[dominantIntel].title)} (${maxScore}%)`, 25, yPosition);
        yPosition += 6;
        doc.text(`Área de mayor crecimiento: ${this.getShortTitle(results[lowestIntel].title)} (${minScore}%)`, 25, yPosition);

        return yPosition + 20;
    }

    static addScoresTable(doc, results, startY) {
        let yPosition = startY;

        // Verificar si necesitamos nueva página
        if (yPosition > 200) {
            doc.addPage();
            yPosition = 30;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(11, 62, 156);
        doc.text('PUNTUACIONES DETALLADAS', 20, yPosition);

        yPosition += 12;

        // Encabezado de la tabla
        doc.setFillColor(11, 62, 156);
        doc.rect(20, yPosition, 170, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('INTELIGENCIA', 25, yPosition + 6);
        doc.text('PUNTUACIÓN', 160, yPosition + 6, { align: 'right' });
        doc.text('NIVEL', 185, yPosition + 6, { align: 'right' });

        yPosition += 8;

        // Filas de la tabla
        Object.keys(results).forEach((intel, index) => {
            const intelData = results[intel];
            const level = this.getLevel(intelData.score);

            // Color de fondo alternado
            if (index % 2 === 0) {
                doc.setFillColor(245, 245, 245);
                doc.rect(20, yPosition, 170, 8, 'F');
            }

            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.text(this.getShortTitle(intelData.title), 25, yPosition + 6);

            doc.setFont('helvetica', 'bold');
            doc.text(`${intelData.score}%`, 160, yPosition + 6, { align: 'right' });

            doc.setFontSize(8);
            doc.text(level, 185, yPosition + 6, { align: 'right' });
            doc.setFontSize(9);

            yPosition += 8;
        });

        return yPosition + 15;
    }

    static addIntelligenceAnalysis(doc, results) {
        doc.addPage();
        let yPosition = 30;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(11, 62, 156);
        doc.text('ANÁLISIS DETALLADO POR INTELIGENCIA', 20, yPosition);

        yPosition += 20;

        Object.keys(results).forEach((intel, index) => {
            // Verificar si necesitamos nueva página
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 30;
            }

            const intelData = results[intel];
            const level = this.getLevel(intelData.score);

            // Encabezado de la inteligencia
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');

            // Usar color seguro en RGB
            const color = this.getSafeColor(intelData.color);
            doc.setTextColor(color.r, color.g, color.b);

            doc.text(`${this.getShortTitle(intelData.title)} - ${intelData.score}%`, 20, yPosition);

            yPosition += 7;

            // Nivel
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(`Nivel: ${level}`, 20, yPosition);

            yPosition += 6;

            // Descripción
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            const description = doc.splitTextToSize(intelData.description, 170);
            doc.text(description, 20, yPosition);

            yPosition += description.length * 4 + 8;

            // Análisis
            const analysis = this.getAnalysisText(intelData.score);
            const splitAnalysis = doc.splitTextToSize(analysis, 170);
            doc.text(splitAnalysis, 20, yPosition);

            yPosition += splitAnalysis.length * 4 + 15;

            // Línea separadora (excepto para el último elemento)
            if (index < Object.keys(results).length - 1) {
                doc.setDrawColor(200, 200, 200);
                doc.line(20, yPosition, 190, yPosition);
                yPosition += 10;
            }
        });
    }

    static addRecommendations(doc, results) {
        doc.addPage();
        let yPosition = 30;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(11, 62, 156);
        doc.text('RECOMENDACIONES PERSONALIZADAS', 20, yPosition);

        yPosition += 20;

        const recommendations = this.generateRecommendations(results);

        recommendations.forEach((rec, index) => {
            // Verificar si necesitamos nueva página
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 30;
            }

            // Número de recomendación
            doc.setFillColor(11, 62, 156);
            doc.circle(25, yPosition - 3, 4, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text((index + 1).toString(), 25, yPosition - 1, { align: 'center' });

            // Título de la recomendación
            doc.setTextColor(11, 62, 156);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(rec.title, 35, yPosition);

            yPosition += 7;

            // Descripción
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            const description = doc.splitTextToSize(rec.description, 160);
            doc.text(description, 35, yPosition);

            yPosition += description.length * 4 + 15;
        });
    }

    static addFooter(doc) {
        const pageCount = doc.internal.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
            doc.text('Sistema de Inteligencias Múltiples - © 2025', 105, 295, { align: 'center' });
        }
    }

    static generateRecommendations(results) {
        const recommendations = [];
        const intelligences = Object.keys(results);

        // Encontrar inteligencias más alta y más baja
        const highestIntel = intelligences.reduce((a, b) =>
            results[a].score > results[b].score ? a : b
        );
        const lowestIntel = intelligences.reduce((a, b) =>
            results[a].score < results[b].score ? a : b
        );

        // Recomendación 1: Fortalecer la inteligencia más alta
        recommendations.push({
            title: `Potencia tu ${results[highestIntel].title}`,
            description: `Dedica tiempo a actividades que desarrollen tu ${results[highestIntel].title.toLowerCase()}. Esta es tu área natural de excelencia donde puedes alcanzar tu máximo potencial. Ejercita esta inteligencia regularmente para mantener y mejorar tu desempeño.`
        });

        // Recomendación 2: Desarrollar la inteligencia más baja
        recommendations.push({
            title: `Desarrolla tu ${results[lowestIntel].title}`,
            description: `Incorpora pequeñas prácticas diarias para fortalecer tu ${results[lowestIntel].title.toLowerCase()}. Comienza con actividades sencillas y ve incrementando la dificultad gradualmente. El crecimiento constante en esta área te permitirá un desarrollo más equilibrado.`
        });

        // Recomendación 3: Equilibrio general
        recommendations.push({
            title: 'Busca el equilibrio integral',
            description: 'Combina actividades que involucren diferentes tipos de inteligencia para un desarrollo integral. La diversidad de experiencias enriquecerá tu perfil cognitivo y te preparará para enfrentar diversos desafíos.'
        });

        // Calcular promedio
        const scores = Object.values(results).map(intel => intel.score);
        const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

        // Recomendación adicional para perfiles equilibrados
        if (avgScore > 70) {
            recommendations.push({
                title: 'Aprovecha tu perfil equilibrado',
                description: 'Tienes un perfil muy equilibrado. Explora cómo combinar tus múltiples talentos en proyectos complejos que requieran diferentes habilidades. Esta versatilidad es una ventaja significativa en entornos multidisciplinarios.'
            });
        }

        // Recomendación 5: Metas de desarrollo
        recommendations.push({
            title: 'Establece metas de desarrollo específicas',
            description: 'Define objetivos claros y medibles para cada tipo de inteligencia. Establece plazos realistas y realiza seguimiento regular de tu progreso. Celebra tus avances y ajusta tus estrategias según los resultados.'
        });

        return recommendations;
    }

    static getShortTitle(title) {
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
    }

    static getLevel(score) {
        if (score >= 80) return 'MUY DESARROLLADA';
        if (score >= 60) return 'DESARROLLADA';
        if (score >= 40) return 'MODERADA';
        return 'EN DESARROLLO';
    }

    static getAnalysisText(score) {
        if (score >= 80) return 'Excelente desarrollo. Esta es una de tus áreas naturales de talento donde destacas notablemente y puedes alcanzar niveles de excelencia. Sigue cultivando esta inteligencia mediante prácticas avanzadas y desafíos progresivos.';
        if (score >= 60) return 'Buen desarrollo. Tienes habilidades sólidas en esta área que puedes seguir potenciando mediante la práctica constante. Considera explorar aplicaciones más complejas de esta inteligencia.';
        if (score >= 40) return 'Desarrollo moderado. Existen oportunidades significativas para seguir creciendo y fortalecer esta dimensión de tu inteligencia. La práctica regular te ayudará a mejorar tu competencia.';
        return 'Área de crecimiento. Considera practicar actividades relacionadas para desarrollar esta inteligencia de manera progresiva. Comienza con ejercicios básicos y aumenta gradualmente la dificultad.';
    }

    static getSafeColor(hexColor) {
        // Mapeo de colores hexadecimales a RGB seguros
        const colorMap = {
            '#0b3e9c': { r: 11, g: 62, b: 156 },
            '#0bc5b3': { r: 11, g: 197, b: 179 },
            '#f7a389': { r: 247, g: 163, b: 137 },
            '#eed0cd': { r: 238, g: 208, b: 205 },
            '#1a56db': { r: 26, g: 86, b: 219 },
            '#0dd6c4': { r: 13, g: 214, b: 196 },
            '#ffb6a3': { r: 255, g: 182, b: 163 },
            '#9c27b0': { r: 156, g: 39, b: 176 },
            '#ba68c8': { r: 186, g: 104, b: 200 },
            '#4caf50': { r: 76, g: 175, b: 80 },
            '#66bb6a': { r: 102, g: 187, b: 106 },
            '#ff9800': { r: 255, g: 152, b: 0 },
            '#ffb74d': { r: 255, g: 183, b: 77 },
            '#2196f3': { r: 33, g: 150, b: 243 },
            '#64b5f6': { r: 100, g: 181, b: 246 },
            '#795548': { r: 121, g: 85, b: 72 },
            '#a1887f': { r: 161, g: 136, b: 127 }
        };

        return colorMap[hexColor] || { r: 0, g: 0, b: 0 }; // Negro por defecto
    }
}

// Exportar para uso global
window.PDFGenerator = PDFGenerator;