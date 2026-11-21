// fora-de-epoca.js - Destaca, em oque-fazer-hoje.html, o painel que se aplica hoje
// (domingo e/ou fora de época), com base na data em Lisboa.
//
// Fora de época = 1 nov – 30 abr: coincide com o período sem barcos de Faro para o
// Farol/Culatra (assets/data/barcos.json, horário da Câmara) e sem nadadores-salvadores.

import { lisbonNow } from '../data/barcos.js';

export function lisbonWeekday(date = new Date()) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Lisbon', weekday: 'short' }).format(date);
}

/** { domingo, foraDeEpoca } para um instante. */
export function contextoHoje(date = new Date()) {
    const { md } = lisbonNow(date);
    return {
        domingo: lisbonWeekday(date) === 'Sun',
        foraDeEpoca: md < '05-01' || md > '10-31'
    };
}

function marcar(painel) {
    if (!painel || painel.classList.contains('is-today')) return;
    painel.classList.add('is-today');
    const badge = document.createElement('span');
    badge.className = 'today-badge';
    badge.setAttribute('data-i18n', 'off_season.today_badge');
    badge.textContent = window.i18n?.t('off_season.today_badge') || 'Aplica-se hoje';
    painel.querySelector('h3')?.appendChild(badge);
}

function init() {
    const { domingo, foraDeEpoca } = contextoHoje();
    if (domingo) marcar(document.getElementById('painel-domingo'));
    if (foraDeEpoca) marcar(document.getElementById('painel-fora-epoca'));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
