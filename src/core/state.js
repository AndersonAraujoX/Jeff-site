// src/core/state.js
export const state = {
    isEditing: false,
    pages: {}, 
    currentPage: 'home',
    sidebarTab: 'pages', // 'pages' or 'modules'
    settings: { 
        primaryColor: '#66FCF1',
        backgroundColor: '#0B0C10',
        backgroundImage: 'https://www.transparenttextures.com/patterns/dark-matter.png'
    }
};

// Getter utilitário para facilitar o acesso à página atual
export const getActiveModules = () => {
    return state.pages[state.currentPage] ? state.pages[state.currentPage].modules : [];
};

export const context = {
    currentImageTarget: null
};
