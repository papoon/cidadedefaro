// checklist.js - Checklist "Novo residente em Faro" (viver-em-faro.html).
//
// Marcação: <section data-checklist="novo-residente"> com
//   - inputs radio name="checklist-profile" (pt | eu | noneu)
//   - <li data-step="id" data-profiles="pt eu noneu"> com um <input type="checkbox">
//   - [data-checklist-progress] onde é escrito o progresso
// Sem JavaScript todos os passos ficam visíveis e as caixas funcionam (sem guardar).
// Estado guardado em localStorage (só neste dispositivo), com o mesmo padrão try/catch de favorites.js.

export const STORAGE_KEY = 'faroGuide_checklist_novo_residente';
export const PROFILES = ['pt', 'eu', 'noneu'];

export function loadState(storage = globalThis.localStorage) {
    try {
        const raw = storage?.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return {
            profile: PROFILES.includes(parsed.profile) ? parsed.profile : null,
            done: Array.isArray(parsed.done) ? parsed.done.filter((id) => typeof id === 'string') : []
        };
    } catch {
        return { profile: null, done: [] };
    }
}

export function saveState(state, storage = globalThis.localStorage) {
    try {
        storage?.setItem(STORAGE_KEY, JSON.stringify({ profile: state.profile, done: [...new Set(state.done)] }));
    } catch {
        // Armazenamento indisponível (modo privado, etc.): a checklist continua a funcionar nesta visita.
    }
}

/** Um passo aplica-se a um perfil? Sem perfil escolhido, todos se aplicam. */
export function appliesTo(profilesAttr, profile) {
    if (!profile) return true;
    return (profilesAttr || '').split(/\s+/).includes(profile);
}

/** Progresso contando só os passos visíveis para o perfil. */
export function progress(steps, profile, done) {
    const visible = steps.filter((s) => appliesTo(s.profiles, profile));
    const doneSet = new Set(done);
    const completed = visible.filter((s) => doneSet.has(s.id)).length;
    return { completed, total: visible.length };
}

function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? values[k] : ''));
}

function initChecklist(root) {
    const items = [...root.querySelectorAll('[data-step]')];
    const steps = items.map((li) => ({ id: li.dataset.step, profiles: li.dataset.profiles }));
    const radios = [...root.querySelectorAll('input[name="checklist-profile"]')];
    const progressEl = root.querySelector('[data-checklist-progress]');
    const resetBtn = root.querySelector('[data-checklist-reset]');
    const state = loadState();

    function render() {
        radios.forEach((r) => { r.checked = r.value === state.profile; });
        items.forEach((li) => {
            li.hidden = !appliesTo(li.dataset.profiles, state.profile);
            const box = li.querySelector('input[type="checkbox"]');
            if (box) box.checked = state.done.includes(li.dataset.step);
            li.classList.toggle('is-done', !!box?.checked);
        });
        if (progressEl) {
            const { completed, total } = progress(steps, state.profile, state.done);
            const template = window.i18n?.t('checklist.progress') || '{done} de {total} passos concluídos';
            progressEl.textContent = fill(template, { done: completed, total });
        }
    }

    radios.forEach((r) => r.addEventListener('change', () => {
        state.profile = r.value;
        saveState(state);
        render();
    }));

    items.forEach((li) => {
        const box = li.querySelector('input[type="checkbox"]');
        box?.addEventListener('change', () => {
            const id = li.dataset.step;
            state.done = box.checked ? [...state.done, id] : state.done.filter((x) => x !== id);
            saveState(state);
            render();
        });
    });

    resetBtn?.addEventListener('click', () => {
        state.done = [];
        saveState(state);
        render();
    });
    if (resetBtn) resetBtn.hidden = false;

    root.classList.add('checklist-enhanced');
    render();
    // O texto do progresso depende da língua
    document.addEventListener('i18nLoaded', render);
}

function init() {
    document.querySelectorAll('[data-checklist]').forEach(initChecklist);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
