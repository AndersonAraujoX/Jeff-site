// src/ui/interface.js
import { state, getActiveModules } from '../core/state.js';
import { ModuleRenderers } from '../modules/renderers.js';

export const Render = {
    all: () => {
        // Apply settings
        if (state.settings && state.settings.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', state.settings.primaryColor);
            const picker = document.getElementById('primary-color-picker');
            if (picker && picker.value !== state.settings.primaryColor) {
                picker.value = state.settings.primaryColor;
            }
        }

        Render.page();
        Render.sidebar();
        Render.navbar();
    },

    page: () => {
        const container = document.getElementById('modulesContainer');
        if (!container) return;
        
        // Hide loading overlay
        const loader = document.getElementById('loading-overlay');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }

        const modules = getActiveModules();
        container.innerHTML = modules.map(m => `
            <div class="relative group/module">
                ${ModuleRenderers[m.type] ? ModuleRenderers[m.type](m, state.isEditing) : ''}
                ${state.isEditing ? Render.controls(m.id) : ''}
            </div>
        `).join('');
    },

    controls: (id) => `
        <div class="absolute top-4 right-4 flex gap-2 z-50 bg-rpg-black/80 p-1 rounded border border-rpg-cyan/20 shadow-lg">
            <button onclick="Actions.moveModule('${id}', -1)" class="p-2 bg-rpg-black text-rpg-cyan rounded hover:bg-rpg-cyan/20 transition-colors" title="Mover para cima">↑</button>
            <button onclick="Actions.moveModule('${id}', 1)" class="p-2 bg-rpg-black text-rpg-cyan rounded hover:bg-rpg-cyan/20 transition-colors" title="Mover para baixo">↓</button>
            <button onclick="Actions.deleteModule('${id}')" class="p-2 bg-rpg-black text-red-500 rounded hover:bg-red-500/20 transition-colors" title="Deletar módulo">✕</button>
        </div>
    `,

    sidebar: () => {
        const pageListContainer = document.getElementById('sidebar-page-list');
        if (pageListContainer) {
            pageListContainer.innerHTML = Object.entries(state.pages).map(([id, page]) => `
                <div class="flex items-center justify-between mb-2">
                    <button onclick="Actions.switchPage('${id}')" class="flex-grow text-left text-sm p-2 rounded ${state.currentPage === id ? 'bg-rpg-cyan/20 text-rpg-cyan border border-rpg-cyan/50' : 'text-rpg-silver hover:bg-white/5'}">
                        ${page.title}
                    </button>
                    ${id !== 'home' ? `<button onclick="Actions.deletePage('${id}')" class="ml-2 p-2 text-red-400 hover:text-red-500 text-xs">✕</button>` : ''}
                </div>
            `).join('');
        }

        const moduleListContainer = document.getElementById('sidebar-module-list');
        if (moduleListContainer) {
            const modules = getActiveModules();
            if (modules.length === 0) {
                moduleListContainer.innerHTML = '<p class="text-xs text-rpg-silver/50 italic">Nenhum módulo nesta página.</p>';
            } else {
                moduleListContainer.innerHTML = modules.map((m, idx) => {
                    // Type to Emoji/Name mapping
                    const typeMap = {
                        'hero': { icon: '🖼️', name: 'Hero' },
                        'text': { icon: '📝', name: 'Texto' },
                        'cards': { icon: '🎴', name: 'Cards' },
                        'gallery': { icon: '📷', name: 'Galeria' },
                        'characters': { icon: '🎭', name: 'Personagens' },
                        'notepad': { icon: '📓', name: 'Bloco de Notas' },
                        'cta': { icon: '🔗', name: 'Botão' },
                        'footer': { icon: '🏁', name: 'Rodapé' }
                    };
                    const info = typeMap[m.type] || { icon: '📦', name: 'Módulo' };
                    
                    return `
                        <div class="flex items-center justify-between p-2 bg-black/40 rounded border border-white/5 text-sm">
                            <span class="flex items-center gap-2 text-rpg-silver truncate w-2/3" title="${m.title || info.name}">
                                <span>${info.icon}</span> <span class="truncate">${m.title || info.name}</span>
                            </span>
                            <div class="flex items-center gap-1">
                                <button onclick="Actions.moveModule('${m.id}', -1)" class="p-1 hover:text-white text-rpg-cyan" title="Mover para cima" ${idx === 0 ? 'disabled class="opacity-30"' : ''}>↑</button>
                                <button onclick="Actions.moveModule('${m.id}', 1)" class="p-1 hover:text-white text-rpg-cyan" title="Mover para baixo" ${idx === modules.length - 1 ? 'disabled class="opacity-30"' : ''}>↓</button>
                                <button onclick="Actions.deleteModule('${m.id}')" class="p-1 hover:text-red-400 text-red-500 ml-1" title="Deletar Módulo">✕</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }
    },

    navbar: () => {
        let navContainer = document.getElementById('top-navbar');
        if (!navContainer) {
            navContainer = document.createElement('nav');
            navContainer.id = 'top-navbar';
            navContainer.className = 'fixed top-0 left-0 w-full bg-rpg-black/90 backdrop-blur-sm border-b border-rpg-cyan/20 z-40 px-6 py-4 flex justify-center gap-6';
            document.body.insertBefore(navContainer, document.body.firstChild);
        }

        const pagesKeys = Object.keys(state.pages);
        if (pagesKeys.length > 1 || state.isEditing) {
            navContainer.style.display = 'flex';
            navContainer.innerHTML = pagesKeys.map(id => `
                <button onclick="Actions.switchPage('${id}')" class="uppercase tracking-widest text-sm font-bold transition-colors ${state.currentPage === id ? 'text-rpg-cyan' : 'text-rpg-silver/60 hover:text-rpg-silver'}">
                    ${state.pages[id].title}
                </button>
            `).join('');
        } else {
            // Hide navbar if there's only one page and not editing
            navContainer.style.display = 'none';
        }
    }
};
