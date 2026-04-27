// src/ui/interface.js
import { state } from '../core/state.js';
import { ModuleRenderers } from '../modules/renderers.js';

export const Render = {
    all: () => {
        const container = document.getElementById('modulesContainer');
        if (!container) return;
        
        // Hide loading overlay
        const loader = document.getElementById('loading-overlay');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }

        container.innerHTML = state.modules.map(m => `
            <div class="relative group/module">
                ${ModuleRenderers[m.type] ? ModuleRenderers[m.type](m, state.isEditing) : ''}
                ${state.isEditing ? Render.controls(m.id) : ''}
            </div>
        `).join('');
    },

    controls: (id) => `
        <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/module:opacity-100 transition-opacity z-50">
            <button onclick="Actions.moveModule('${id}', -1)" class="p-2 bg-rpg-black border border-rpg-cyan/20 text-rpg-cyan rounded hover:bg-rpg-cyan/10">↑</button>
            <button onclick="Actions.moveModule('${id}', 1)" class="p-2 bg-rpg-black border border-rpg-cyan/20 text-rpg-cyan rounded hover:bg-rpg-cyan/10">↓</button>
            <button onclick="Actions.deleteModule('${id}')" class="p-2 bg-red-900/40 border border-red-500/40 text-red-500 rounded hover:bg-red-500/20">×</button>
        </div>
    `
};
