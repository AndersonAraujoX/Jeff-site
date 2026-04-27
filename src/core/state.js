// src/core/state.js
export const state = {
    isEditing: false,
    pages: {}, 
    currentPage: 'home',
    settings: { primaryColor: '#66FCF1' }
};

// Getter utilitário para facilitar o acesso à página atual
export const getActiveModules = () => {
    return state.pages[state.currentPage] ? state.pages[state.currentPage].modules : [];
};

export const context = {
    currentImageTarget: null
};
