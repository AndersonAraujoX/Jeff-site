// src/ui/interface.js
import { state, getActiveModules } from '../core/state.js';
import { ModuleRenderers } from '../modules/renderers.js';

export const Render = {
    all: () => {
        // Apply settings
        if (state.settings) {
            if (state.settings.primaryColor) {
                document.documentElement.style.setProperty('--primary-color', state.settings.primaryColor);
            }
            if (state.settings.backgroundColor) {
                document.body.style.backgroundColor = state.settings.backgroundColor;
            }
            if (state.settings.backgroundImage) {
                document.body.style.backgroundImage = `url('${state.settings.backgroundImage}')`;
                // Se for uma URL do Unsplash ou similar, usa cover, senão (patterns) usa auto
                const isFullImg = state.settings.backgroundImage.includes('unsplash') || state.settings.backgroundImage.includes('images.');
                document.body.style.backgroundSize = isFullImg ? 'cover' : 'auto';
            } else {
                document.body.style.backgroundImage = 'none';
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
        const sidebar = document.getElementById('editor-sidebar');
        if (!sidebar) return;

        const isPagesTab = state.sidebarTab === 'pages';
        const modules = getActiveModules();
        
        const typeMap = {
            'hero': { icon: '🖼️', name: 'Cabeçalho Hero' },
            'text': { icon: '📝', name: 'Narrativa/Texto' },
            'cards': { icon: '🎴', name: 'Cards de Destaque' },
            'gallery': { icon: '📷', name: 'Galeria de Fotos' },
            'characters': { icon: '🎭', name: 'Fichas de Personagem' },
            'notepad': { icon: '📓', name: 'Bloco de Notas' },
            'cta': { icon: '🔗', name: 'Botão de Ação' },
            'footer': { icon: '🏁', name: 'Rodapé Final' }
        };

        sidebar.innerHTML = `
            <div class="flex flex-col h-full overflow-hidden bg-rpg-slate/95 backdrop-blur-xl">
                <!-- Header -->
                <div class="p-6 pb-4 border-b border-white/10 bg-black/40">
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex flex-col">
                            <h2 class="text-xl font-bold text-rpg-cyan tracking-tighter flex items-center gap-2">
                                <span class="w-2 h-2 bg-rpg-cyan rounded-full animate-pulse shadow-[0_0_10px_var(--primary-color)]"></span>
                                LIVE BUILDER
                            </h2>
                            <span class="text-[9px] text-rpg-silver/30 font-bold tracking-[0.3em] uppercase mt-1">Modo de Edição</span>
                        </div>
                        <button onclick="Actions.toggleEdit()" class="p-2 hover:bg-white/10 rounded-xl transition-all text-rpg-silver hover:text-red-500">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <!-- Modern Tabs -->
                    <div class="flex p-1.5 bg-black/60 rounded-2xl border border-white/5 shadow-inner">
                        <button onclick="Actions.switchSidebarTab('pages')" 
                            class="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300
                            ${isPagesTab ? 'bg-rpg-cyan text-rpg-black shadow-lg shadow-rpg-cyan/20 scale-105' : 'text-rpg-silver/40 hover:text-rpg-silver hover:bg-white/5'}">
                            Gerenciar
                        </button>
                        <button onclick="Actions.switchSidebarTab('modules')" 
                            class="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300
                            ${!isPagesTab ? 'bg-rpg-cyan text-rpg-black shadow-lg shadow-rpg-cyan/20 scale-105' : 'text-rpg-silver/40 hover:text-rpg-silver hover:bg-white/5'}">
                            + Módulos
                        </button>
                    </div>
                </div>

                <!-- Scrollable Content -->
                <div class="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8">
                    ${isPagesTab ? `
                        <!-- Config -->
                        <section class="animate-fadeIn">
                            <h3 class="text-[10px] font-bold text-rpg-silver/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span class="w-1 h-1 bg-rpg-cyan/30 rounded-full"></span>
                                Estética do Universo
                            </h3>
                            <div class="space-y-3">
                                <div class="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors shadow-xl">
                                    <div class="flex-grow flex flex-col">
                                        <span class="text-xs font-bold text-rpg-silver">Cor Primária</span>
                                        <span class="text-[9px] text-rpg-silver/30 uppercase">Interface & Destaques</span>
                                    </div>
                                    <input type="color" onchange="Actions.changeColor(this.value)" value="${state.settings.primaryColor || '#66FCF1'}" 
                                        class="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer shadow-lg">
                                </div>

                                <div class="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors shadow-xl">
                                    <div class="flex-grow flex flex-col">
                                        <span class="text-xs font-bold text-rpg-silver">Cor do Fundo</span>
                                        <span class="text-[9px] text-rpg-silver/30 uppercase">Base do Site</span>
                                    </div>
                                    <input type="color" onchange="Actions.changeBackground(this.value)" value="${state.settings.backgroundColor || '#0B0C10'}" 
                                        class="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer shadow-lg">
                                </div>

                                <button onclick="Actions.changeBackgroundImage()" class="w-full flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 hover:border-rpg-cyan/20 transition-all shadow-xl group">
                                    <div class="flex-grow flex flex-col text-left">
                                        <span class="text-xs font-bold text-rpg-silver group-hover:text-rpg-cyan transition-colors">Imagem de Fundo</span>
                                        <span class="text-[9px] text-rpg-silver/30 uppercase truncate max-w-[150px]">${state.settings.backgroundImage ? 'Ativa' : 'Nenhuma imagem'}</span>
                                    </div>
                                    <div class="p-2 bg-white/5 rounded-lg group-hover:bg-rpg-cyan/10 transition-colors">
                                        <svg class="w-4 h-4 text-rpg-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                </button>
                            </div>
                        </section>

                        <!-- Pages -->
                        <section class="animate-fadeIn" style="animation-delay: 0.1s">
                            <h3 class="text-[10px] font-bold text-rpg-silver/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span class="w-1 h-1 bg-rpg-cyan/30 rounded-full"></span>
                                Navegação (Páginas)
                            </h3>
                            <div class="space-y-2 mb-4">
                                ${Object.entries(state.pages).map(([id, page]) => `
                                    <div class="flex items-center gap-2 group/page">
                                        <button onclick="Actions.switchPage('${id}')" 
                                            class="flex-grow text-left text-xs p-4 rounded-2xl border transition-all duration-300
                                            ${state.currentPage === id ? 'bg-rpg-cyan/10 border-rpg-cyan/50 text-rpg-cyan shadow-[inset_0_0_20px_rgba(var(--primary-color-rgb),0.05)]' : 'bg-black/40 border-white/5 text-rpg-silver hover:border-white/20 hover:bg-black/60'}">
                                            <div class="flex items-center justify-between">
                                                <span class="font-bold tracking-wide">${page.title}</span>
                                                ${state.currentPage === id ? '<span class="text-[9px] bg-rpg-cyan/20 px-2 py-0.5 rounded-full uppercase">Ativa</span>' : ''}
                                            </div>
                                        </button>
                                        ${id !== 'home' ? `
                                            <button onclick="Actions.deletePage('${id}')" 
                                                class="p-4 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/20">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                            <button onclick="Actions.createPage()" class="w-full py-4 bg-rpg-cyan/5 border border-dashed border-rpg-cyan/30 rounded-2xl text-rpg-cyan text-[10px] font-bold uppercase tracking-widest hover:bg-rpg-cyan/10 hover:border-rpg-cyan/60 transition-all duration-300 active:scale-95">
                                + Criar Novo Destino
                            </button>
                        </section>

                        <!-- Active Modules -->
                        <section class="animate-fadeIn" style="animation-delay: 0.2s">
                            <h3 class="text-[10px] font-bold text-rpg-silver/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span class="w-1 h-1 bg-rpg-cyan/30 rounded-full"></span>
                                Estrutura da Jornada
                            </h3>
                            <div class="space-y-3">
                                ${modules.length === 0 ? '<p class="text-[10px] text-rpg-silver/30 italic text-center py-8 bg-black/20 rounded-2xl border border-dashed border-white/5">Nenhum módulo nesta página ainda.</p>' : 
                                    modules.map((m, idx) => {
                                        const info = typeMap[m.type] || { icon: '📦', name: 'Módulo' };
                                        return `
                                            <div class="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-white/5 group/mod hover:border-white/10 transition-all duration-300 shadow-lg">
                                                <div class="flex items-center gap-4 truncate pr-2">
                                                    <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner group-hover/mod:scale-110 transition-transform">
                                                        ${info.icon}
                                                    </div>
                                                    <div class="flex flex-col truncate">
                                                        <span class="text-xs text-rpg-silver truncate font-bold tracking-wide">${m.title || info.name}</span>
                                                        <span class="text-[9px] text-rpg-silver/30 uppercase tracking-tighter">${info.name}</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center bg-black/60 rounded-xl border border-white/5 p-1.5 shadow-xl">
                                                    <button onclick="Actions.moveModule('${m.id}', -1)" 
                                                        class="p-1.5 hover:text-rpg-cyan disabled:opacity-10 transition-colors" 
                                                        ${idx === 0 ? 'disabled' : ''}>
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M5 15l7-7 7 7"></path></svg>
                                                    </button>
                                                    <button onclick="Actions.moveModule('${m.id}', 1)" 
                                                        class="p-1.5 hover:text-rpg-cyan disabled:opacity-10 transition-colors" 
                                                        ${idx === modules.length - 1 ? 'disabled' : ''}>
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                                                    </button>
                                                    <button onclick="Actions.deleteModule('${m.id}')" 
                                                        class="p-1.5 hover:text-red-500 text-red-500/30 transition-all ml-1 border-l border-white/10 pl-3">
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')
                                }
                            </div>
                        </section>
                    ` : `
                        <!-- Add Modules Tab -->
                        <section class="animate-fadeIn">
                            <h3 class="text-[10px] font-bold text-rpg-silver/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <span class="w-1 h-1 bg-rpg-cyan/30 rounded-full"></span>
                                Forjar Novo Módulo
                            </h3>
                            <div class="grid grid-cols-1 gap-4">
                                ${Object.entries(typeMap).map(([type, info]) => `
                                    <button onclick="Actions.addModule('${type}')" 
                                        class="flex items-center gap-5 p-5 bg-black/40 border border-white/5 rounded-3xl hover:border-rpg-cyan/50 hover:bg-rpg-cyan/5 transition-all duration-500 group text-left shadow-xl hover:shadow-rpg-cyan/5 hover:-translate-y-1">
                                        <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl shadow-inner group-hover:bg-rpg-cyan/10 group-hover:scale-110 transition-all duration-500">
                                            ${info.icon}
                                        </div>
                                        <div>
                                            <div class="text-sm font-bold text-rpg-silver group-hover:text-rpg-cyan transition-colors duration-300 tracking-wide">${info.name}</div>
                                            <div class="text-[10px] text-rpg-silver/30 uppercase tracking-tighter mt-1">Clique para inserir na página</div>
                                        </div>
                                    </button>
                                `).join('')}
                            </div>
                        </section>
                    `}
                </div>

                <!-- Footer Stats -->
                <div class="p-5 bg-black/60 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <div class="flex items-center justify-between text-[8px] text-rpg-silver/20 font-bold uppercase tracking-[0.3em]">
                        <div class="flex items-center gap-3">
                            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                            Nexus Link: Estável
                        </div>
                        <div class="bg-white/5 px-2 py-1 rounded-md border border-white/5">Build v2.5.4</div>
                    </div>
                </div>
            </div>
        `;
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
