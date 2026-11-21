// barcos.js - Horários dos barcos de Faro (Portas do Mar) para as ilhas, em praias.html.
//
// Dados: assets/data/barcos.json (transcritos do horário oficial da Câmara de Faro; ver "source").
// Mostra, para cada ligação, o estado de HOJE em hora de Lisboa: fora de época, próximo barco
// e — em destaque — a hora do último regresso. Tudo construído com createElement/textContent.

const DATA_URL = 'assets/data/barcos.json';

/** Data/hora atual em Lisboa: { year, md: 'MM-DD', minutes } — independente do fuso do browser. */
export function lisbonNow(date = new Date()) {
    const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Europe/Lisbon', year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
        }).formatToParts(date).map((p) => [p.type, p.value])
    );
    return { year: Number(parts.year), md: `${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
};

/** Época em vigor num dia 'MM-DD' (comparação lexicográfica funciona para MM-DD). */
export function findSeason(route, md) {
    return route.seasons.find((s) => md >= s.from && md <= s.to) || null;
}

/** Viagens que se realizam num dia (respeita "until" de viagens só até certa data). */
export function tripsForDay(route, md) {
    const season = findSeason(route, md);
    if (!season) return [];
    return season.trips.filter((t) => !t.until || md <= t.until);
}

/**
 * Estado de uma ligação num instante:
 *  - inSeason: há carreiras hoje
 *  - nextOut: próxima partida de Faro (ou null)
 *  - lastBack: último regresso hoje; lastBackPassed: já passou
 */
export function routeStatus(route, now) {
    const trips = tripsForDay(route, now.md);
    if (!trips.length) return { inSeason: false, trips, nextOut: null, lastBack: null, lastBackPassed: false };
    const nextOut = trips.find((t) => toMinutes(t.out) > now.minutes)?.out || null;
    const lastBack = trips.reduce((a, t) => (toMinutes(t.back) > toMinutes(a) ? t.back : a), trips[0].back);
    return { inSeason: true, trips, nextOut, lastBack, lastBackPassed: toMinutes(lastBack) <= now.minutes };
}

/** "05-01" -> "1 mai" / "1 May" */
export function formatMonthDay(md, lang) {
    const [m, d] = md.split('-').map(Number);
    return new Date(Date.UTC(2026, m - 1, d)).toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

// ---------- Renderização ----------

const t = (key, fallback) => window.i18n?.t(key) || fallback;
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (_, k) => (k in v ? v[k] : ''));
const lang = () => window.i18n?.getCurrentLanguage() || 'pt';

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
}

function price(value) {
    return new Intl.NumberFormat(lang() === 'en' ? 'en-GB' : 'pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
}

function seasonTable(route, season) {
    const table = el('table', 'ferry-table');
    const caption = el('caption', null, `${formatMonthDay(season.from, lang())} – ${formatMonthDay(season.to, lang())}`);
    table.appendChild(caption);
    const thead = el('thead');
    const hr = el('tr');
    hr.appendChild(el('th', null, t('beaches.col_from_faro', 'Partida de Faro')));
    hr.appendChild(el('th', null, fill(t('beaches.col_from_island', 'Partida de {island}'), { island: route.name[lang()] || route.name.pt })));
    hr.querySelectorAll('th').forEach((th) => th.setAttribute('scope', 'col'));
    thead.appendChild(hr);
    table.appendChild(thead);
    const tbody = el('tbody');
    season.trips.forEach((trip) => {
        const tr = el('tr');
        tr.appendChild(el('td', null, trip.out));
        const back = el('td', null, trip.back);
        if (trip.until) {
            back.appendChild(el('span', 'ferry-note', ` (${fill(t('beaches.until', 'até {date}'), { date: formatMonthDay(trip.until, lang()) })})`));
        }
        tr.appendChild(back);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}

function renderRoute(route, now) {
    const status = routeStatus(route, now);
    const card = el('article', 'ferry-route');
    card.setAttribute('aria-labelledby', `ferry-${route.id}`);

    const title = el('h3', null, route.name[lang()] || route.name.pt);
    title.id = `ferry-${route.id}`;
    card.appendChild(title);
    card.appendChild(el('p', 'ferry-meta', fill(t('beaches.duration', 'Viagem de cerca de {min} minutos'), { min: route.duration_min })));

    const today = el('div', 'ferry-today');
    today.setAttribute('role', 'status');
    if (!status.inSeason) {
        today.classList.add('is-closed');
        const seasons = route.seasons.map((s) => `${formatMonthDay(s.from, lang())} – ${formatMonthDay(s.to, lang())}`);
        const range = `${formatMonthDay(route.seasons[0].from, lang())} – ${formatMonthDay(route.seasons[route.seasons.length - 1].to, lang())}`;
        today.appendChild(el('strong', null, t('beaches.no_service_today', 'Sem barcos hoje a partir de Faro.')));
        today.appendChild(el('span', null, ' ' + fill(t('beaches.season_range', 'Época: {range}.'), { range: seasons.length > 1 ? range : seasons[0] })));
    } else {
        const next = status.nextOut
            ? fill(t('beaches.next_departure', 'Próxima partida de Faro: {time}'), { time: status.nextOut })
            : t('beaches.no_more_departures', 'Já não há mais partidas de Faro hoje.');
        today.appendChild(el('p', null, next));
        const last = el('p', 'ferry-last');
        last.appendChild(el('strong', null, fill(t('beaches.last_return', 'Último barco de regresso hoje: {time}'), { time: status.lastBack })));
        if (status.lastBackPassed) last.appendChild(el('span', null, ' ' + t('beaches.last_return_passed', '(já partiu)')));
        today.appendChild(last);
        if (status.lastBackPassed) today.classList.add('is-closed');
    }
    card.appendChild(today);

    const details = el('details', 'ferry-details');
    details.appendChild(el('summary', null, t('beaches.full_timetable', 'Horário completo e preços')));
    route.seasons.forEach((season) => details.appendChild(seasonTable(route, season)));

    const prices = el('dl', 'ferry-prices');
    [
        ['return_adult', 'beaches.price_return_adult', 'Ida e volta, adulto'],
        ['return_child', 'beaches.price_return_child', 'Ida e volta, criança (4–11 anos)'],
        ['single_adult', 'beaches.price_single_adult', 'Só ida, adulto'],
        ['single_child', 'beaches.price_single_child', 'Só ida, criança (4–11 anos)']
    ].forEach(([key, i18nKey, fallback]) => {
        prices.appendChild(el('dt', null, t(i18nKey, fallback)));
        prices.appendChild(el('dd', null, price(route.prices[key])));
    });
    details.appendChild(prices);
    card.appendChild(details);
    return card;
}

let cachedData = null;

function render(container, data) {
    const now = lisbonNow();
    container.replaceChildren();

    if (now.year > data.year) {
        container.appendChild(el('p', 'ferry-warning', fill(t('beaches.outdated', 'Horário de {year}: confirme junto do operador se já existe horário novo.'), { year: data.year })));
    }
    data.routes.forEach((route) => container.appendChild(renderRoute(route, now)));

    const source = el('p', 'ferry-source');
    source.appendChild(document.createTextNode(t('beaches.source_label', 'Fonte:') + ' '));
    const link = el('a', null, data.source.name);
    link.href = data.source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    source.appendChild(link);
    source.appendChild(document.createTextNode(' · ' + fill(t('beaches.verified', 'verificado em {date}.'), { date: data.verified }) + ' '));
    source.appendChild(document.createTextNode(fill(t('beaches.operator_contact', 'Operador: {name} ({email}).'), data.operator)));
    container.appendChild(source);
}

async function init() {
    const container = document.getElementById('ferry-routes');
    if (!container) return;
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        cachedData = await response.json();
        render(container, cachedData);
    } catch (error) {
        console.error('Erro ao carregar horários dos barcos:', error);
        container.replaceChildren(el('p', 'ferry-warning', t('beaches.load_error', 'Não foi possível carregar os horários. Consulte a fonte oficial da Câmara de Faro.')));
    }
    // Re-renderizar quando as traduções chegam ou a língua muda
    document.addEventListener('i18nLoaded', () => cachedData && render(container, cachedData));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
