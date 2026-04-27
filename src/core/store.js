// src/core/store.js
import { state } from './state.js';

const DOC_PATH = 'sites/main-site';
const getDb = () => firebase.firestore();

export const Store = {
    save: () => {
        return getDb().doc(DOC_PATH).set({ 
            modules: state.modules, 
            settings: state.settings 
        }).catch(err => {
            console.error("Erro ao salvar:", err);
            throw err;
        });
    },

    listen: (callback) => {
        getDb().doc(DOC_PATH).onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data();
                state.modules = data.modules || [];
                state.settings = data.settings || state.settings;
                callback();
            } else {
                Store.seed(callback);
            }
        });
    },

    seed: (callback) => {
        state.modules = [
            { id: 'm1', type: 'hero', title: 'Kuar-Tor', subtitle: 'A Última Expedição', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23' },
            { id: 'm2', type: 'text', title: 'O Início', content: '<p>A fenda se abriu...</p>' }
        ];
        Store.save().then(callback);
    }
};
