// src/modules/actions.js
import { state, context, getActiveModules } from '../core/state.js';
import { Store } from '../core/store.js';
import { Render } from '../ui/interface.js';

export const Actions = {
    // --- UI Controls ---
    toggleEdit: () => {
        state.isEditing = !state.isEditing;
        document.body.classList.toggle('editing-mode', state.isEditing);
        const sidebar = document.getElementById('editor-sidebar');
        if (sidebar) {
            sidebar.style.transform = state.isEditing ? 'translateX(0)' : 'translateX(100%)';
        }
        Render.all();
    },

    // --- Page Management ---
    createPage: () => {
        const title = prompt("Nome da nova página:");
        if (title) {
            const pageId = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
            if (!state.pages[pageId]) {
                state.pages[pageId] = { title, modules: [] };
                state.currentPage = pageId;
                Store.save().then(() => Render.all());
            } else {
                alert("Já existe uma página com esse nome!");
            }
        }
    },

    switchPage: (pageId) => {
        if (state.pages[pageId]) {
            state.currentPage = pageId;
            Store.save().then(() => Render.all());
        }
    },

    deletePage: (pageId) => {
        if (pageId === 'home') return alert("A página Início não pode ser apagada.");
        if (confirm(`Deletar a página "${state.pages[pageId].title}"?`)) {
            delete state.pages[pageId];
            state.currentPage = 'home';
            Store.save().then(() => Render.all());
        }
    },

    // --- Module Management ---
    updateModule: (id, key, val) => {
        const mod = getActiveModules().find(m => m.id === id);
        if (mod) { mod[key] = val; Store.save(); }
    },

    addModule: (type) => {
        const defaults = {
            hero: { title: 'Novo Título', subtitle: 'Subtítulo Épico', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23' },
            text: { title: 'Narrativa', content: '<p>Comece sua história...</p>' },
            cards: { title: 'Destaques', items: [{title: 'Item 1', text: '...'}] },
            gallery: { title: 'Galeria', images: [] },
            characters: { title: 'Personagens', list: [] },
            cta: { title: 'Entre na Jornada', btnText: 'Começar', link: '#' },
            footer: { text: '© 2026 RPG Builder' }
        };
        const modules = getActiveModules();
        modules.push({ id: 'mod_' + Date.now(), type, ...defaults[type] });
        Store.save();
    },

    moveModule: (id, dir) => {
        const modules = getActiveModules();
        const idx = modules.findIndex(m => m.id === id);
        const newIdx = idx + dir;
        if (newIdx >= 0 && newIdx < modules.length) {
            [modules[idx], modules[newIdx]] = [modules[newIdx], modules[idx]];
            Store.save();
        }
    },

    deleteModule: (id) => {
        if (confirm('Deletar esta seção?')) {
            state.pages[state.currentPage].modules = getActiveModules().filter(m => m.id !== id);
            Store.save();
        }
    },

    // --- Array Item Management ---
    updateArrayItem: (id, arrayKey, idx, key, val) => {
        const mod = getActiveModules().find(m => m.id === id);
        if (mod && mod[arrayKey][idx]) { 
            mod[arrayKey][idx][key] = val; 
            Store.save(); 
        }
    },

    addArrayItem: (id, key, defaultVal) => {
        const mod = getActiveModules().find(m => m.id === id);
        if (mod) {
            if (!mod[key]) mod[key] = [];
            mod[key].push(defaultVal);
            Store.save();
        }
    },

    moveArrayItem: (id, arrayKey, idx, dir) => {
        const mod = getActiveModules().find(m => m.id === id);
        if (mod && mod[arrayKey]) {
            const newIdx = idx + dir;
            if (newIdx >= 0 && newIdx < mod[arrayKey].length) {
                [mod[arrayKey][idx], mod[arrayKey][newIdx]] = [mod[arrayKey][newIdx], mod[arrayKey][idx]];
                Store.save();
            }
        }
    },

    deleteArrayItem: (id, arrayKey, idx) => {
        if (confirm('Deletar este item?')) {
            const mod = getActiveModules().find(m => m.id === id);
            if (mod && mod[arrayKey]) {
                mod[arrayKey].splice(idx, 1);
                Store.save();
            }
        }
    },

    // --- Images ---
    triggerUpload: (id, key, idx = null, subKey = null) => {
        context.currentImageTarget = { id, key, idx, subKey };
        document.getElementById('imageInput').click();
    }
};
