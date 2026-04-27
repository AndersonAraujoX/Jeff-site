// src/modules/actions.js
import { state, context } from '../core/state.js';
import { Store } from '../core/store.js';
import { Render } from '../ui/interface.js';

export const Actions = {
    toggleEdit: () => {
        state.isEditing = !state.isEditing;
        document.body.classList.toggle('editing-mode', state.isEditing);
        const sidebar = document.getElementById('editor-sidebar');
        if (sidebar) {
            sidebar.style.transform = state.isEditing ? 'translateX(0)' : 'translateX(100%)';
        }
        Render.all();
    },

    updateModule: (id, key, val) => {
        const mod = state.modules.find(m => m.id === id);
        if (mod) { mod[key] = val; Store.save(); }
    },

    updateModuleItem: (id, idx, key, val) => {
        const mod = state.modules.find(m => m.id === id);
        if (mod && mod.items[idx]) { mod.items[idx][key] = val; Store.save(); }
    },

    updateListItem: (id, idx, key, val) => {
        const mod = state.modules.find(m => m.id === id);
        if (mod && mod.list[idx]) { mod.list[idx][key] = val; Store.save(); }
    },

    addArrayItem: (id, key, defaultVal) => {
        const mod = state.modules.find(m => m.id === id);
        if (mod) {
            if (!mod[key]) mod[key] = [];
            mod[key].push(defaultVal);
            Store.save();
        }
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
        state.modules.push({ id: 'mod_' + Date.now(), type, ...defaults[type] });
        Store.save();
    },

    moveModule: (id, dir) => {
        const idx = state.modules.findIndex(m => m.id === id);
        const newIdx = idx + dir;
        if (newIdx >= 0 && newIdx < state.modules.length) {
            [state.modules[idx], state.modules[newIdx]] = [state.modules[newIdx], state.modules[idx]];
            Store.save();
        }
    },

    deleteModule: (id) => {
        if (confirm('Deletar esta seção?')) {
            state.modules = state.modules.filter(m => m.id !== id);
            Store.save();
        }
    },

    triggerUpload: (id, key, idx = null, subKey = null) => {
        context.currentImageTarget = { id, key, idx, subKey };
        document.getElementById('imageInput').click();
    }
};
