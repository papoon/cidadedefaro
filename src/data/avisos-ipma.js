// avisos-ipma.js - Avisos meteorológicos do IPMA para o distrito de Faro.
//
// Fonte: API de dados abertos do IPMA (sem chave, CORS aberto).
//   https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json
// Cada entrada: { idAreaAviso, awarenessTypeName, awarenessLevelID, startTime, endTime, text }
// As horas vêm em hora local de Portugal continental, sem fuso (ex. "2026-11-21T19:28:00").
//
// Mostra avisos amarelo/laranja/vermelho ativos ou a começar nas próximas 24h através
// do sistema de alertas locais (src/ui/alerts.js). Falha em silêncio se estiver offline.

export const IPMA_WARNINGS_URL = 'https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json';
export const AREA_FARO = 'FAR';

const LEVEL_RANK = { yellow: 1, orange: 2, red: 3 };
const LOOKAHEAD_MS = 24 * 60 * 60 * 1000;

// Nome do tipo de aviso do IPMA -> sufixo da chave i18n (ipma_warnings.type_<slug>)
const TYPE_SLUGS = {
    'Agitação Marítima': 'sea',
    'Neve': 'snow',
    'Nevoeiro': 'fog',
    'Precipitação': 'rain',
    'Tempo Frio': 'cold',
    'Tempo Quente': 'heat',
    'Trovoada': 'thunder',
    'Vento': 'wind'
};

/**
 * Converte "AAAA-MM-DDTHH:MM:SS" (hora de Lisboa, sem fuso) em timestamp UTC.
 * Funciona independentemente do fuso do browser do visitante.
 */
export function parseLisbonTime(value) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value || '');
    if (!m) return NaN;
    const asUtc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
    // Offset de Lisboa nesse instante (0 no inverno, +1h no verão)
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Lisbon', timeZoneName: 'shortOffset'
    }).formatToParts(new Date(asUtc));
    const tz = parts.find((p) => p.type === 'timeZoneName')?.value || 'GMT';
    const off = /GMT([+-]\d{1,2})/.exec(tz); // Lisboa só usa offsets de horas inteiras
    const offsetMs = off ? Number(off[1]) * 3600000 : 0;
    return asUtc - offsetMs;
}

/**
 * Filtra os avisos relevantes para Faro: nível amarelo ou superior, ainda não terminados
 * e a começar nas próximas 24h. Um aviso por tipo (o de nível mais alto; em empate, o
 * que começa primeiro), ordenados do mais grave para o menos grave.
 */
export function selectFaroWarnings(list, now = Date.now()) {
    if (!Array.isArray(list)) return [];
    const byType = new Map();

    for (const w of list) {
        if (!w || w.idAreaAviso !== AREA_FARO) continue;
        const rank = LEVEL_RANK[w.awarenessLevelID];
        if (!rank) continue; // green / desconhecido
        const start = parseLisbonTime(w.startTime);
        const end = parseLisbonTime(w.endTime);
        if (Number.isNaN(start) || Number.isNaN(end)) continue;
        if (end <= now || start > now + LOOKAHEAD_MS) continue;

        const item = { type: w.awarenessTypeName, level: w.awarenessLevelID, rank, start, end, text: (w.text || '').trim() };
        const current = byType.get(item.type);
        if (!current || rank > current.rank || (rank === current.rank && start < current.start)) {
            byType.set(item.type, item);
        }
    }

    return [...byType.values()].sort((a, b) => b.rank - a.rank || a.start - b.start);
}

function formatTime(ts, lang) {
    return new Date(ts).toLocaleString(lang === 'en' ? 'en-GB' : 'pt-PT', {
        timeZone: 'Europe/Lisbon', weekday: 'short', hour: '2-digit', minute: '2-digit'
    });
}

function fill(template, values) {
    return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? values[k] : ''));
}

/** Constrói as opções para window.localAlerts.show() a partir de um aviso selecionado. */
export function toAlert(warning, t, lang, now = Date.now()) {
    const slug = TYPE_SLUGS[warning.type];
    const typeName = (slug && t(`ipma_warnings.type_${slug}`)) || warning.type;
    const levelName = t(`ipma_warnings.level_${warning.level}`) || warning.level;

    const when = warning.start > now
        ? fill(t('ipma_warnings.when_future') || 'De {start} até {end}', { start: formatTime(warning.start, lang), end: formatTime(warning.end, lang) })
        : fill(t('ipma_warnings.when_now') || 'Até {end}', { end: formatTime(warning.end, lang) });

    // O texto descritivo do IPMA só existe em português.
    const parts = [fill(t('ipma_warnings.area') || 'Distrito de Faro. {when}.', { when })];
    if (lang === 'pt' && warning.text) parts.push(warning.text);
    parts.push(t('ipma_warnings.source') || 'Fonte: IPMA (ipma.pt).');

    return {
        id: `ipma-${AREA_FARO}-${slug || 'other'}-${warning.level}-${warning.start}`,
        type: warning.rank >= 2 ? 'important' : 'warning',
        title: fill(t('ipma_warnings.title') || 'Aviso {level}: {type}', { level: levelName, type: typeName }),
        message: parts.join(' '),
        dismissible: true
    };
}

// Espera que as traduções estejam carregadas (i18n.js carrega-as de forma assíncrona).
function translationsReady() {
    if (window.i18n?.t('ipma_warnings.title')) return Promise.resolve();
    return new Promise((resolve) => {
        document.addEventListener('i18nLoaded', resolve, { once: true });
        setTimeout(resolve, 5000); // não bloquear indefinidamente se o i18n falhar
    });
}

async function loadIpmaWarnings() {
    if (!window.localAlerts) return;
    try {
        const response = await fetch(IPMA_WARNINGS_URL);
        if (!response.ok) return;
        const warnings = selectFaroWarnings(await response.json());
        if (!warnings.length) return;

        await translationsReady();
        const t = (key) => window.i18n?.t(key) || null;
        const lang = window.i18n?.getCurrentLanguage() || 'pt';
        warnings.forEach((w) => window.localAlerts.show(toAlert(w, t, lang)));
    } catch (error) {
        // Offline ou API indisponível: os avisos são um extra, não bloqueiam a página.
        console.warn('Avisos IPMA indisponíveis:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIpmaWarnings);
} else {
    loadIpmaWarnings();
}
