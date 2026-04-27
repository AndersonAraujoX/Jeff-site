/**
 * RPG Site Builder - Core Logic
 * Handles real-time editing, persistence, and export.
 */

const state = {
    isEditing: false,
    content: {},
    settings: {
        primaryColor: '#66FCF1',
    }
};

// --- DOM Elements ---
const body = document.body;
const sidebar = document.getElementById('editor-sidebar');
const toggleBtn = document.getElementById('toggle-editor');
const closeBtn = document.getElementById('close-editor');
const colorPicker = document.getElementById('primary-color-picker');
const saveBtn = document.getElementById('save-local');
const exportBtn = document.getElementById('export-html');
const editableTexts = document.querySelectorAll('.editable-text');
const imageBtns = document.querySelectorAll('.image-editor-btn');

// --- Initialization ---
function init() {
    loadFromLocalStorage();
    setupEventListeners();
    applyTheme();
    renderContent();
}

// --- Event Listeners ---
function setupEventListeners() {
    // Toggle Editor
    toggleBtn.addEventListener('click', toggleEditMode);
    closeBtn.addEventListener('click', toggleEditMode);

    // Color Picker
    colorPicker.addEventListener('input', (e) => {
        state.settings.primaryColor = e.target.value;
        applyTheme();
    });

    // Save Action
    saveBtn.addEventListener('click', () => {
        saveToLocalStorage();
        showNotification('Rascunho salvo localmente!');
    });

    // Export Action
    exportBtn.addEventListener('click', exportFinalHTML);

    // Text Editing
    editableTexts.forEach(el => {
        el.addEventListener('input', (e) => {
            const key = el.getAttribute('data-key');
            state.content[key] = el.innerHTML;
        });
    });

    // Image/Link Editing
    imageBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-target');
            const type = btn.getAttribute('data-type') || 'image';
            const targetEl = document.getElementById(targetId);

            if (type === 'link') {
                const currentUrl = targetEl.getAttribute('href');
                const newUrl = prompt('Digite a nova URL do link:', currentUrl);
                if (newUrl !== null) {
                    targetEl.setAttribute('href', newUrl);
                    state.content[`link-${targetId}`] = newUrl;
                }
            } else {
                const currentSrc = targetEl.tagName === 'IMG' ? targetEl.src : targetEl.style.backgroundImage.slice(5, -2);
                const newUrl = prompt('Digite a URL da nova imagem:', currentSrc);
                
                if (newUrl) {
                    if (targetEl.tagName === 'IMG') {
                        targetEl.src = newUrl;
                    } else {
                        targetEl.style.backgroundImage = `url('${newUrl}')`;
                    }
                    state.content[`img-${targetId}`] = newUrl;
                }
            }
        });
    });
}

// --- Core Functions ---

function toggleEditMode() {
    state.isEditing = !state.isEditing;
    body.classList.toggle('is-editing', state.isEditing);
    sidebar.classList.toggle('translate-x-full', !state.isEditing);
    
    // Enable/Disable contenteditable
    editableTexts.forEach(el => {
        el.contentEditable = state.isEditing;
    });

    // Visual feedback on toggle button
    toggleBtn.innerHTML = state.isEditing ? 
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>' : 
        '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>';
}

function applyTheme() {
    document.documentElement.style.setProperty('--primary-color', state.settings.primaryColor);
    colorPicker.value = state.settings.primaryColor;
}

function renderContent() {
    // Apply saved text
    Object.keys(state.content).forEach(key => {
        if (key.startsWith('img-')) {
            const id = key.replace('img-', '');
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === 'IMG') el.src = state.content[key];
                else el.style.backgroundImage = `url('${state.content[key]}')`;
            }
        } else if (key.startsWith('link-')) {
            const id = key.replace('link-', '');
            const el = document.getElementById(id);
            if (el) el.setAttribute('href', state.content[key]);
        } else {
            const el = document.querySelector(`[data-key="${key}"]`);
            if (el) el.innerHTML = state.content[key];
        }
    });
}

// --- Persistence ---
function saveToLocalStorage() {
    localStorage.setItem('rpg_builder_content', JSON.stringify(state.content));
    localStorage.setItem('rpg_builder_settings', JSON.stringify(state.settings));
}

function loadFromLocalStorage() {
    const savedContent = localStorage.getItem('rpg_builder_content');
    const savedSettings = localStorage.getItem('rpg_builder_settings');
    
    if (savedContent) state.content = JSON.parse(savedContent);
    if (savedSettings) state.settings = JSON.parse(savedSettings);
}

// --- Export Logic ---
function exportFinalHTML() {
    // Clone the current document
    const clone = document.documentElement.cloneNode(true);
    
    // Remove editor UI from clone
    clone.querySelector('#editor-sidebar').remove();
    clone.querySelector('#toggle-editor').remove();
    clone.querySelector('script[src="main.js"]').remove();
    clone.querySelectorAll('.image-editor-btn').forEach(btn => btn.remove());
    
    // Remove editing classes and attributes
    const bodyClone = clone.querySelector('body');
    bodyClone.classList.remove('is-editing', 'overflow-x-hidden');
    
    clone.querySelectorAll('.editable-text').forEach(el => {
        el.removeAttribute('contenteditable');
        el.classList.remove('editable-text');
    });

    // Inject final styles as a style tag to ensure it's self-contained
    const styleContent = `
        :root { --primary-color: ${state.settings.primaryColor}; }
    `;
    const styleTag = document.createElement('style');
    styleTag.textContent = styleContent;
    clone.querySelector('head').appendChild(styleTag);

    // Generate HTML string
    const finalHtml = '<!DOCTYPE html>\n' + clone.outerHTML;
    
    // Create download
    const blob = new Blob([finalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rpg-site-final.html';
    a.click();
    URL.revokeObjectURL(url);
}

function showNotification(text) {
    const note = document.createElement('div');
    note.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-rpg-cyan text-rpg-black px-6 py-2 rounded shadow-lg z-[200] font-bold animate-bounce';
    note.innerText = text;
    document.body.appendChild(note);
    setTimeout(() => note.remove(), 3000);
}

init();
