// ===== DATOS DEL CUESTIONARIO =====
const QUESTIONNAIRE_DATA = {
    sections: [
        {
            id: 'linguistic',
            title: 'Inteligencia Lingüística',
            description: 'Habilidad para usar palabras de manera efectiva',
            icon: 'fas fa-book',
            color: '#0b3e9c',
            questions: [
                {
                    id: 'linguistic_1',
                    text: '¿Disfrutas leer libros, artículos o cualquier tipo de texto?'
                },
                {
                    id: 'linguistic_2',
                    text: '¿Te resulta fácil expresar tus ideas por escrito?'
                },
                {
                    id: 'linguistic_3',
                    text: '¿Te gusta aprender nuevas palabras y ampliar tu vocabulario?'
                },
                {
                    id: 'linguistic_4',
                    text: '¿Disfrutas contar historias o explicar cosas a otras personas?'
                },
                {
                    id: 'linguistic_5',
                    text: '¿Te resulta fácil entender y seguir instrucciones escritas?'
                }
            ]
        },
        {
            id: 'logical',
            title: 'Inteligencia Lógico-Matemática',
            description: 'Capacidad para usar números y razonar lógicamente',
            icon: 'fas fa-calculator',
            color: '#0bc5b3',
            questions: [
                {
                    id: 'logical_1',
                    text: '¿Disfrutas resolver problemas matemáticos o lógicos?'
                },
                {
                    id: 'logical_2',
                    text: '¿Te resulta fácil identificar patrones en la información?'
                },
                {
                    id: 'logical_3',
                    text: '¿Te gusta analizar situaciones de manera racional?'
                },
                {
                    id: 'logical_4',
                    text: '¿Disfrutas los juegos de estrategia como ajedrez o sudoku?'
                },
                {
                    id: 'logical_5',
                    text: '¿Te resulta fácil entender conceptos científicos?'
                }
            ]
        },
        {
            id: 'spatial',
            title: 'Inteligencia Espacial',
            description: 'Habilidad para percibir el mundo visual-espacial',
            icon: 'fas fa-palette',
            color: '#f7a389',
            questions: [
                {
                    id: 'spatial_1',
                    text: '¿Te resulta fácil visualizar objetos en tres dimensiones?'
                },
                {
                    id: 'spatial_2',
                    text: '¿Disfrutas dibujar, pintar o crear arte visual?'
                },
                {
                    id: 'spatial_3',
                    text: '¿Tienes buen sentido de la orientación y ubicación?'
                },
                {
                    id: 'spatial_4',
                    text: '¿Disfrutas los rompecabezas visuales?'
                },
                {
                    id: 'spatial_5',
                    text: '¿Te resulta fácil leer mapas y diagramas?'
                }
            ]
        },
        {
            id: 'musical',
            title: 'Inteligencia Musical',
            description: 'Capacidad para percibir y expresar formas musicales',
            icon: 'fas fa-music',
            color: '#9c27b0',
            questions: [
                {
                    id: 'musical_1',
                    text: '¿Eres sensible a los sonidos y ritmos musicales?'
                },
                {
                    id: 'musical_2',
                    text: '¿Disfrutas cantar o tocar instrumentos musicales?'
                },
                {
                    id: 'musical_3',
                    text: '¿Puedes identificar fácilmente melodías y tonos?'
                },
                {
                    id: 'musical_4',
                    text: '¿La música influye en tu estado de ánimo?'
                },
                {
                    id: 'musical_5',
                    text: '¿Disfrutas crear o componer música?'
                }
            ]
        },
        {
            id: 'kinesthetic',
            title: 'Inteligencia Kinestésica',
            description: 'Habilidad para usar el cuerpo para expresar ideas',
            icon: 'fas fa-running',
            color: '#4caf50',
            questions: [
                {
                    id: 'kinesthetic_1',
                    text: '¿Aprendes mejor haciendo las cosas en lugar de solo leer o escuchar?'
                },
                {
                    id: 'kinesthetic_2',
                    text: '¿Disfrutas los deportes y actividades físicas?'
                },
                {
                    id: 'kinesthetic_3',
                    text: '¿Tienes buena coordinación y control corporal?'
                },
                {
                    id: 'kinesthetic_4',
                    text: '¿Te gusta trabajar con las manos (manualidades, reparaciones)?'
                },
                {
                    id: 'kinesthetic_5',
                    text: '¿Usas gestos y lenguaje corporal al comunicarte?'
                }
            ]
        },
        {
            id: 'interpersonal',
            title: 'Inteligencia Interpersonal',
            description: 'Capacidad para entender a los demás',
            icon: 'fas fa-users',
            color: '#ff9800',
            questions: [
                {
                    id: 'interpersonal_1',
                    text: '¿Te resulta fácil entender los sentimientos de los demás?'
                },
                {
                    id: 'interpersonal_2',
                    text: '¿Disfrutas trabajar en equipo?'
                },
                {
                    id: 'interpersonal_3',
                    text: '¿Eres bueno resolviendo conflictos entre personas?'
                },
                {
                    id: 'interpersonal_4',
                    text: '¿Te consideras una persona empática?'
                },
                {
                    id: 'interpersonal_5',
                    text: '¿Disfrutas ayudar a otros a resolver sus problemas?'
                }
            ]
        },
        {
            id: 'intrapersonal',
            title: 'Inteligencia Intrapersonal',
            description: 'Conocimiento de sí mismo y habilidad para adaptarse',
            icon: 'fas fa-user',
            color: '#2196f3',
            questions: [
                {
                    id: 'intrapersonal_1',
                    text: '¿Eres consciente de tus propias emociones y sentimientos?'
                },
                {
                    id: 'intrapersonal_2',
                    text: '¿Disfrutas pasar tiempo a solas reflexionando?'
                },
                {
                    id: 'intrapersonal_3',
                    text: '¿Tienes claras tus metas y objetivos personales?'
                },
                {
                    id: 'intrapersonal_4',
                    text: '¿Eres bueno evaluando tus propias fortalezas y debilidades?'
                },
                {
                    id: 'intrapersonal_5',
                    text: '¿Prefieres trabajar de manera independiente?'
                }
            ]
        },
        {
            id: 'naturalist',
            title: 'Inteligencia Naturalista',
            description: 'Habilidad para distinguir elementos del medio ambiente',
            icon: 'fas fa-leaf',
            color: '#795548',
            questions: [
                {
                    id: 'naturalist_1',
                    text: '¿Disfrutas pasar tiempo en la naturaleza?'
                },
                {
                    id: 'naturalist_2',
                    text: '¿Te interesa aprender sobre plantas y animales?'
                },
                {
                    id: 'naturalist_3',
                    text: '¿Eres bueno clasificando y categorizando información?'
                },
                {
                    id: 'naturalist_4',
                    text: '¿Te preocupan los temas ambientales?'
                },
                {
                    id: 'naturalist_5',
                    text: '¿Observas y disfrutas los cambios en la naturaleza?'
                }
            ]
        }
    ],
    
    // Opciones de respuesta
    options: [
        { value: 1, label: 'Nunca' },
        { value: 2, label: 'Rara vez' },
        { value: 3, label: 'A veces' },
        { value: 4, label: 'Frecuentemente' },
        { value: 5, label: 'Siempre' }
    ]
};