// Configuración global
const CONFIG = {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    isDesktop: window.innerWidth > 992
};

const COLORS = {
    primary: '#0b3e9c',
    secondary: '#0bc5b3', 
    accent: '#f7a389',
    highlight: '#FFC107',
    background: '#eed0cd'
};

const INTELLIGENCE_COLORS = {
    linguistic: ['#0b3e9c', '#1a56db'],
    logical: ['#0bc5b3', '#0dd6c4'],
    spatial: ['#f7a389', '#ffb6a3'],
    musical: ['#9c27b0', '#ba68c8'],
    kinesthetic: ['#4caf50', '#66bb6a'],
    interpersonal: ['#ff9800', '#ffb74d'],
    intrapersonal: ['#2196f3', '#64b5f6'],
    naturalist: ['#795548', '#a1887f']
};

const MOTIVATION_COLORS = {
    primary: ['#f7a389', '#eed0cd', '#FFFFFF', '#0bc5b3'],
    calculation: ['#0b3e9c', '#0bc5b3', '#f7a389']
};

window.CONFIG = CONFIG;
window.COLORS = COLORS;
window.INTELLIGENCE_COLORS = INTELLIGENCE_COLORS;
window.MOTIVATION_COLORS = MOTIVATION_COLORS;