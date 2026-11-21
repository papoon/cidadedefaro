// frases.js - Pronúncia das frases úteis (frases-uteis.html) com a Web Speech API.
//
// Progressive enhancement: os botões "ouvir" só são criados se o browser tiver
// speechSynthesis. Prefere uma voz pt-PT; se não houver, usa qualquer voz "pt"
// (a pronúncia pode ser brasileira) e, em último caso, a voz por omissão com lang pt-PT.

/** Escolhe a melhor voz: pt-PT > pt-* > null. */
export function pickVoice(voices) {
    const list = Array.isArray(voices) ? voices : [];
    const norm = (v) => (v.lang || '').replace('_', '-').toLowerCase();
    return list.find((v) => norm(v) === 'pt-pt') || list.find((v) => norm(v).startsWith('pt')) || null;
}

function label(phrase) {
    const template = window.i18n?.t('phrases.listen_label') || 'Ouvir: {phrase}';
    return template.replace('{phrase}', phrase);
}

function init() {
    const synth = window.speechSynthesis;
    if (!synth || typeof window.SpeechSynthesisUtterance !== 'function') return;

    let voice = pickVoice(synth.getVoices());
    // Em alguns browsers (Chrome) as vozes só chegam de forma assíncrona
    synth.addEventListener?.('voiceschanged', () => { voice = pickVoice(synth.getVoices()) || voice; });

    const phrases = document.querySelectorAll('.phrase-pt[lang="pt-PT"]');
    phrases.forEach((el) => {
        const text = el.textContent.trim();
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'phrase-listen';
        button.setAttribute('aria-label', label(text));
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'icon');
        svg.setAttribute('aria-hidden', 'true');
        const use = document.createElementNS(svgNS, 'use');
        use.setAttribute('href', '#i-volume');
        svg.appendChild(use);
        button.appendChild(svg);

        button.addEventListener('click', () => {
            synth.cancel();
            const utterance = new window.SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-PT';
            if (voice) utterance.voice = voice;
            utterance.rate = 0.85;
            synth.speak(utterance);
        });
        el.parentElement.insertBefore(button, el);
    });

    // Atualizar os aria-label quando a língua muda
    document.addEventListener('i18nLoaded', () => {
        document.querySelectorAll('.phrase-listen').forEach((b) => {
            const text = b.nextElementSibling?.textContent.trim() || '';
            b.setAttribute('aria-label', label(text));
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
