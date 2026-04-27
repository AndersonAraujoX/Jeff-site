// src/modules/renderers.js

export const ModuleRenderers = {
    hero: (m, isEditing) => `
        <section class="relative h-screen flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img src="${m.image}" class="w-full h-full object-cover opacity-40">
                <div class="absolute inset-0 bg-gradient-to-t from-rpg-black via-transparent to-rpg-black/60"></div>
            </div>
            <div class="relative z-10 text-center px-6">
                <h1 contenteditable="${isEditing}" oninput="Actions.updateModule('${m.id}', 'title', this.innerText)" 
                    class="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter uppercase italic">${m.title}</h1>
                <p contenteditable="${isEditing}" oninput="Actions.updateModule('${m.id}', 'subtitle', this.innerText)"
                    class="text-xl md:text-2xl text-rpg-cyan tracking-[0.3em] font-light uppercase">${m.subtitle}</p>
            </div>
            ${isEditing ? `<button onclick="Actions.triggerUpload('${m.id}', 'image')" class="absolute bottom-10 right-10 bg-rpg-cyan/20 hover:bg-rpg-cyan/40 text-rpg-cyan px-4 py-2 rounded-full border border-rpg-cyan/40 text-sm transition-all">Trocar Fundo</button>` : ''}
        </section>
    `,
    text: (m, isEditing) => `
        <section class="py-24 px-6 max-w-4xl mx-auto border-l border-rpg-cyan/10">
            <h2 contenteditable="${isEditing}" oninput="Actions.updateModule('${m.id}', 'title', this.innerText)"
                class="text-rpg-cyan text-xs uppercase tracking-[0.5em] mb-8 font-bold">${m.title}</h2>
            <div contenteditable="${isEditing}" oninput="Actions.updateModule('${m.id}', 'content', this.innerHTML)"
                 class="text-xl text-rpg-silver leading-relaxed space-y-6 opacity-80">${m.content}</div>
        </section>
    `,
    cards: (m, isEditing) => `
        <section class="py-24 px-6 bg-rpg-slate/20">
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                ${(m.items || []).map((item, idx) => `
                    <div class="p-8 bg-rpg-black/40 border border-rpg-cyan/10 rounded-2xl hover:border-rpg-cyan/40 transition-all group">
                        <h3 contenteditable="${isEditing}" oninput="Actions.updateModuleItem('${m.id}', ${idx}, 'title', this.innerText)"
                            class="text-rpg-cyan text-xl font-bold mb-4">${item.title}</h3>
                        <p contenteditable="${isEditing}" oninput="Actions.updateModuleItem('${m.id}', ${idx}, 'text', this.innerText)"
                           class="text-rpg-silver/70 leading-relaxed">${item.text}</p>
                    </div>
                `).join('')}
                ${isEditing ? `<button onclick="Actions.addArrayItem('${m.id}', 'items', {title: 'Novo', text: '...'})" class="border-2 border-dashed border-rpg-cyan/10 rounded-2xl p-8 text-rpg-cyan/30 hover:bg-rpg-cyan/5 text-2xl">+</button>` : ''}
            </div>
        </section>
    `,
    gallery: (m, isEditing) => `
        <section class="py-24 px-6">
            <h2 contenteditable="${isEditing}" oninput="Actions.updateModule('${m.id}', 'title', this.innerText)" class="text-3xl text-rpg-cyan text-center mb-12">${m.title}</h2>
            <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                ${(m.images || []).map((img, idx) => `
                    <div class="relative aspect-square group overflow-hidden rounded-lg border border-white/10">
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
                <h2 contenteditable="${isEditing}" oninput="Actions.updateModule('${m.id}', 'title', this.innerText)" class="text-4xl text-center text-rpg-cyan mb-16">${m.title}</h2>
                <div class="space-y-6">
                    ${(m.list || []).map((char, idx) => `
                        <div class="flex flex-col md:flex-row gap-8 bg-rpg-black/40 p-6 rounded-xl border border-rpg-cyan/10">
                            <div class="w-full md:w-32 h-32 flex-shrink-0 relative group">
                                <img src="${char.avatar}" class="w-full h-full object-cover rounded-lg">
                                ${isEditing ? `<button onclick="Actions.triggerUpload('${m.id}', 'list', ${idx}, 'avatar')" class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-rpg-cyan">Avatar</button>` : ''}
                            </div>
                            <div class="flex-grow">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 contenteditable="${isEditing}" oninput="Actions.updateListItem('${m.id}', ${idx}, 'name', this.innerText)" class="text-2xl text-rpg-cyan font-bold">${char.name}</h3>
                                    <span contenteditable="${isEditing}" oninput="Actions.updateListItem('${m.id}', ${idx}, 'role', this.innerText)" class="text-xs uppercase tracking-widest text-gray-500">${char.role}</span>
                                </div>
                                <p contenteditable="${isEditing}" oninput="Actions.updateListItem('${m.id}', ${idx}, 'bio', this.innerText)" class="text-sm text-rpg-silver/70 leading-relaxed">${char.bio}</p>
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
            <p contenteditable="${isEditing}" oninput="Actions.updateModule('${m.id}', 'text', this.innerText)" class="text-sm text-gray-500">${m.text}</p>
        </footer>
    `
};
