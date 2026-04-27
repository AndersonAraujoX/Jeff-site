// src/core/store.js
import { state } from './state.js';

const DOC_PATH = 'sites/main-site';
const getDb = () => firebase.firestore();

export const Store = {
    save: () => {
        return getDb().doc(DOC_PATH).set({ 
            pages: state.pages,
            settings: state.settings 
        }, { merge: true }).catch(err => {
            console.error("Erro ao salvar:", err);
            throw err;
        });
    },

    listen: (callback) => {
        getDb().doc(DOC_PATH).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                
                // Migração de legado (single page -> multi-page)
                if (data.modules && !data.pages) {
                    state.pages = {
                        'home': { title: 'Início', modules: data.modules }
                    };
                    Store.save(); // Salva no novo formato
                } else {
                    state.pages = data.pages || { 'home': { title: 'Início', modules: [] } };
                }
                
                state.settings = data.settings || state.settings;
                
                // Garante que currentPage existe
                if (!state.pages[state.currentPage]) {
                    state.currentPage = Object.keys(state.pages)[0] || 'home';
                }
                
                callback();
            } else {
                Store.seed(callback);
            }
        });
    },

    seed: (callback) => {
        state.pages = {
            'home': {
                title: 'Início',
                modules: [
                    { id: 'm1', type: 'hero', title: 'Kuar-Tor', subtitle: 'A Última Expedição', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23' },
                    { id: 'm2', type: 'text', title: 'O Início', content: '<p>A fenda se abriu...</p>' }
                ]
            }
        };
        state.currentPage = 'home';
        Store.save().then(callback);
    }
};
