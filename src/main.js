// src/main.js
import { Actions } from './modules/actions.js';
import { Store } from './core/store.js';
import { Render } from './ui/interface.js';
import { state, context } from './core/state.js';

function init() {
    firebase.auth().signInAnonymously()
        .then(() => {
            console.log("RPG Site: Modular & Connected.");
            Store.listen(() => Render.all());
            setupImageHandler();
        })
        .catch(err => console.error("Erro Auth:", err));
}

function setupImageHandler() {
    const input = document.getElementById('imageInput');
    if (!input) return;
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && context.currentImageTarget) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                const mod = state.modules.find(m => m.id === context.currentImageTarget.id);
                if (mod) {
                    const { key, idx, subKey } = context.currentImageTarget;
                    if (idx !== null) {
                        if (subKey) mod[key][idx][subKey] = base64;
                        else mod[key][idx] = base64;
                    } else {
                        mod[key] = base64;
                    }
                    Store.save().then(() => Render.all());
                }
                e.target.value = '';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Global Export to maintain compatibility with onclick handlers in HTML
window.Actions = Actions;

init();
