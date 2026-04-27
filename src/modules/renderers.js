// src/modules/renderers.js

const editAttrs = (modId, key, isEditing, type = 'innerText') => 
    isEditing ? `contenteditable="true" oninput="Actions.updateModule('${modId}', '${key}', this.${type})"` : '';

const editArrayAttrs = (modId, arrayKey, idx, key, isEditing, type = 'innerText') => 
    isEditing ? `contenteditable="true" oninput="Actions.updateArrayItem('${modId}', '${arrayKey}', ${idx}, '${key}', this.${type})"` : '';

const renderItemControls = (moduleId, arrayKey, idx, isEditing, isFirst, isLast) => {
    if (!isEditing) return '';
    const btn = (icon, action, title, color = 'text-rpg-cyan') => 
        `<button onclick="Actions.${action}('${moduleId}', '${arrayKey}', ${idx}${action === 'moveArrayItem' ? `, ${title.includes('Esquerda') ? -1 : 1}` : ''})" 
                 class="p-1 hover:text-white ${color}" title="${title}">${icon}</button>`;
    
    return `
        <div class="absolute top-2 right-2 flex gap-1 bg-black/90 rounded p-1 z-20 border border-white/10 shadow-lg">
            ${!isFirst ? btn('←', 'moveArrayItem', 'Mover para Esquerda/Cima') : ''}
            ${!isLast ? btn('→', 'moveArrayItem', 'Mover para Direita/Baixo') : ''}
            ${btn('✕', 'deleteArrayItem', 'Deletar Item', 'text-red-400 ml-2')}
        </div>
    `;
};

export const ModuleRenderers = {
    hero: (m, isEditing) => `
        <section class="relative h-screen flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img src="${m.image}" class="w-full h-full object-cover opacity-40">
                <div class="absolute inset-0 bg-gradient-to-t from-rpg-black via-transparent to-rpg-black/60"></div>
            </div>
            <div class="relative z-10 text-center px-6">
                <h1 ${editAttrs(m.id, 'title', isEditing)} class="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter uppercase italic">${m.title}</h1>
                <p ${editAttrs(m.id, 'subtitle', isEditing)} class="text-xl md:text-2xl text-rpg-cyan tracking-[0.3em] font-light uppercase">${m.subtitle}</p>
            </div>
            ${isEditing ? `<button onclick="Actions.triggerUpload('${m.id}', 'image')" class="absolute bottom-10 right-10 bg-rpg-cyan/20 hover:bg-rpg-cyan/40 text-rpg-cyan px-4 py-2 rounded-full border border-rpg-cyan/40 text-sm transition-all">Trocar Fundo</button>` : ''}
        </section>
    `,
    text: (m, isEditing) => `
        <section class="py-24 px-6 max-w-4xl mx-auto border-l border-rpg-cyan/10">
            <h2 ${editAttrs(m.id, 'title', isEditing)} class="text-rpg-cyan text-xs uppercase tracking-[0.5em] mb-8 font-bold">${m.title}</h2>
            <div ${editAttrs(m.id, 'content', isEditing, 'innerHTML')} class="text-xl text-rpg-silver leading-relaxed space-y-6 opacity-80">${m.content}</div>
        </section>
    `,
    cards: (m, isEditing) => `
        <section class="py-24 px-6 bg-rpg-slate/20">
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                ${(m.items || []).map((item, idx) => `
                    <div class="relative p-8 bg-rpg-black/40 border border-rpg-cyan/10 rounded-2xl hover:border-rpg-cyan/40 transition-all group">
                        ${renderItemControls(m.id, 'items', idx, isEditing, idx === 0, idx === m.items.length - 1)}
                        <h3 ${editArrayAttrs(m.id, 'items', idx, 'title', isEditing)} class="text-rpg-cyan text-xl font-bold mb-4">${item.title}</h3>
                        <p ${editArrayAttrs(m.id, 'items', idx, 'text', isEditing)} class="text-rpg-silver/70 leading-relaxed">${item.text}</p>
                    </div>
                `).join('')}
                ${isEditing ? `<button onclick="Actions.addArrayItem('${m.id}', 'items', {title: 'Novo', text: '...'})" class="border-2 border-dashed border-rpg-cyan/10 rounded-2xl p-8 text-rpg-cyan/30 hover:bg-rpg-cyan/5 text-2xl flex items-center justify-center min-h-[150px]">+</button>` : ''}
            </div>
        </section>
    `,
    gallery: (m, isEditing) => `
        <section class="py-24 px-6">
            <h2 ${editAttrs(m.id, 'title', isEditing)} class="text-3xl text-rpg-cyan text-center mb-12">${m.title}</h2>
            <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                ${(m.images || []).map((img, idx) => `
                    <div class="relative aspect-square group overflow-hidden rounded-lg border border-white/10">
                        ${renderItemControls(m.id, 'images', idx, isEditing, idx === 0, idx === m.images.length - 1)}
                        <img src="${img}" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                        ${isEditing ? `<button onclick="Actions.triggerUpload('${m.id}', 'images', ${idx})" class="absolute inset-0 bg-rpg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-rpg-cyan">Trocar</button>` : ''}
                    </div>
                `).join('')}
                ${isEditing ? `<button onclick="Actions.addArrayItem('${m.id}', 'images', 'https://placehold.co/800x800')" class="aspect-square border-2 border-dashed border-rpg-cyan/20 flex items-center justify-center text-rpg-cyan/50 hover:bg-rpg-cyan/5 transition-colors text-3xl">+</button>` : ''}
            </div>
        </section>
    `,
    characters: (m, isEditing) => `
        <section class="py-24 px-6 bg-gradient-to-b from-rpg-black to-rpg-slate/40">
            <div class="max-w-5xl mx-auto">
                <h2 ${editAttrs(m.id, 'title', isEditing)} class="text-4xl text-center text-rpg-cyan mb-16">${m.title}</h2>
                <div class="space-y-6">
                    ${(m.list || []).map((char, idx) => `
                        <div class="relative flex flex-col md:flex-row gap-8 bg-rpg-black/40 p-6 rounded-xl border border-rpg-cyan/10 group">
                            ${renderItemControls(m.id, 'list', idx, isEditing, idx === 0, idx === m.list.length - 1)}
                            <div class="w-full md:w-32 h-32 flex-shrink-0 relative group/avatar">
                                <img src="${char.avatar}" class="w-full h-full object-cover rounded-lg">
                                ${isEditing ? `<button onclick="Actions.triggerUpload('${m.id}', 'list', ${idx}, 'avatar')" class="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center text-[10px] text-rpg-cyan">Avatar</button>` : ''}
                            </div>
                            <div class="flex-grow pt-4 md:pt-0">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 ${editArrayAttrs(m.id, 'list', idx, 'name', isEditing)} class="text-2xl text-rpg-cyan font-bold">${char.name}</h3>
                                    <span ${editArrayAttrs(m.id, 'list', idx, 'role', isEditing)} class="text-xs uppercase tracking-widest text-gray-500 mr-12">${char.role}</span>
                                </div>
                                <p ${editArrayAttrs(m.id, 'list', idx, 'bio', isEditing)} class="text-sm text-rpg-silver/70 leading-relaxed">${char.bio}</p>
                            </div>
                        </div>
                    `).join('')}
                    ${isEditing ? `<button onclick="Actions.addArrayItem('${m.id}', 'list', {name: 'Novo', role: 'CLASSE', bio: '...', avatar: 'https://placehold.co/400x400'})" class="w-full py-4 border-2 border-dashed border-rpg-cyan/10 rounded-xl text-rpg-cyan/50 hover:bg-rpg-cyan/5">+ Adicionar Personagem</button>` : ''}
                </div>
            </div>
        </section>
    `,
    footer: (m, isEditing) => `
        <footer class="bg-rpg-black border-t border-rpg-cyan/20 py-12 px-6 text-center">
            <p ${editAttrs(m.id, 'text', isEditing)} class="text-sm text-gray-500">${m.text}</p>
        </footer>
    `,
    notepad: (m, isEditing) => {
        if (!m.tabs || m.tabs.length === 0) return '';
        const activeTabIdx = m.activeTab || 0;
        const activeTab = m.tabs[activeTabIdx];

        return `
        <section class="py-20 px-6 max-w-5xl mx-auto relative group/module">
            <h2 ${editAttrs(m.id, 'title', isEditing)} class="text-3xl font-bold text-rpg-cyan mb-8 text-center font-['Cinzel']">${m.title}</h2>
            <div class="flex flex-col md:flex-row gap-6 bg-rpg-slate/30 border border-rpg-cyan/20 rounded-lg p-6 shadow-2xl">
                <div class="md:w-1/4 border-b md:border-b-0 md:border-r border-rpg-cyan/20 pb-4 md:pb-0 md:pr-4 flex flex-col gap-2">
                    <h3 class="text-xs uppercase tracking-widest text-rpg-silver/50 mb-2 font-bold">Páginas</h3>
                    ${m.tabs.map((tab, idx) => `
                        <div class="flex items-center justify-between group/tab relative">
                            <button onclick="Actions.switchNotepadTab('${m.id}', ${idx})" 
                                class="flex-grow text-left text-sm p-2 rounded transition-colors ${activeTabIdx === idx ? 'bg-rpg-cyan/20 text-rpg-cyan border border-rpg-cyan/50' : 'text-rpg-silver hover:bg-white/5'}">
                                ${isEditing ? `<span ${editArrayAttrs(m.id, 'tabs', idx, 'title', isEditing)} onclick="event.stopPropagation()">${tab.title}</span>` : tab.title}
                            </button>
                            ${isEditing && m.tabs.length > 1 ? `<button onclick="Actions.deleteNotepadTab('${m.id}', ${idx})" class="text-red-500 bg-rpg-black/80 absolute right-0 p-1 text-xs hover:bg-red-500/20 rounded z-10">✕</button>` : ''}
                        </div>
                    `).join('')}
                    ${isEditing ? `<button onclick="Actions.addNotepadTab('${m.id}')" class="mt-4 p-2 text-xs text-rpg-cyan border border-rpg-cyan/30 rounded hover:bg-rpg-cyan/10 transition-colors">+ Nova Página</button>` : ''}
                </div>
                <div class="md:w-3/4 min-h-[300px]">
                    <div class="prose prose-invert max-w-none text-rpg-silver prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2 prose-p:mb-4">
                        <div ${editArrayAttrs(m.id, 'tabs', activeTabIdx, 'content', isEditing, 'innerHTML')} class="outline-none focus:ring-1 focus:ring-rpg-cyan/50 rounded p-2 transition-all">
                            ${activeTab.content}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `;
    }
};
