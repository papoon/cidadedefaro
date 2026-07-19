// tempo.js - Widget de previsão do tempo para Faro via Open-Meteo
// API gratuita, sem necessidade de chave: https://open-meteo.com

(function () {
    'use strict';

    const FARO_LAT = 37.0194;
    const FARO_LNG = -7.9322;
    const CACHE_KEY = 'guiafaro-weather-cache';
    const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos

    const FORECAST_URL =
        `https://api.open-meteo.com/v1/forecast?latitude=${FARO_LAT}&longitude=${FARO_LNG}` +
        '&current=temperature_2m,apparent_temperature,weather_code' +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
        '&timezone=Europe%2FLisbon&forecast_days=4';

    // Mapeamento de códigos WMO (https://open-meteo.com/en/docs) para ícone + descrição
    const WEATHER_CODES = {
        0: { icon: '☀️', pt: 'Céu limpo', en: 'Clear sky' },
        1: { icon: '🌤️', pt: 'Poucas nuvens', en: 'Mostly clear' },
        2: { icon: '⛅', pt: 'Parcialmente nublado', en: 'Partly cloudy' },
        3: { icon: '☁️', pt: 'Nublado', en: 'Overcast' },
        45: { icon: '🌫️', pt: 'Nevoeiro', en: 'Fog' },
        48: { icon: '🌫️', pt: 'Nevoeiro com geada', en: 'Depositing rime fog' },
        51: { icon: '🌦️', pt: 'Chuvisco fraco', en: 'Light drizzle' },
        53: { icon: '🌦️', pt: 'Chuvisco moderado', en: 'Moderate drizzle' },
        55: { icon: '🌦️', pt: 'Chuvisco forte', en: 'Dense drizzle' },
        61: { icon: '🌧️', pt: 'Chuva fraca', en: 'Slight rain' },
        63: { icon: '🌧️', pt: 'Chuva moderada', en: 'Moderate rain' },
        65: { icon: '🌧️', pt: 'Chuva forte', en: 'Heavy rain' },
        66: { icon: '🌧️', pt: 'Chuva gelada', en: 'Freezing rain' },
        67: { icon: '🌧️', pt: 'Chuva gelada forte', en: 'Heavy freezing rain' },
        71: { icon: '🌨️', pt: 'Neve fraca', en: 'Slight snow' },
        73: { icon: '🌨️', pt: 'Neve moderada', en: 'Moderate snow' },
        75: { icon: '🌨️', pt: 'Neve forte', en: 'Heavy snow' },
        77: { icon: '🌨️', pt: 'Grãos de neve', en: 'Snow grains' },
        80: { icon: '🌦️', pt: 'Aguaceiros fracos', en: 'Slight rain showers' },
        81: { icon: '🌧️', pt: 'Aguaceiros moderados', en: 'Moderate rain showers' },
        82: { icon: '⛈️', pt: 'Aguaceiros fortes', en: 'Violent rain showers' },
        95: { icon: '⛈️', pt: 'Trovoada', en: 'Thunderstorm' },
        96: { icon: '⛈️', pt: 'Trovoada com granizo', en: 'Thunderstorm with hail' },
        99: { icon: '⛈️', pt: 'Trovoada com granizo forte', en: 'Thunderstorm with heavy hail' }
    };

    const DAY_NAMES = {
        pt: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };

    function pickLang() {
        return localStorage.getItem('guiafaro-lang') || 'pt';
    }

    function describeCode(code, lang) {
        const entry = WEATHER_CODES[code];
        if (!entry) return { icon: '🌡️', text: '' };
        return { icon: entry.icon, text: entry[lang] || entry.pt };
    }

    function loadFromCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (!parsed || !parsed.timestamp || !parsed.data) return null;
            if (Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
            return parsed.data;
        } catch (error) {
            return null;
        }
    }

    function saveToCache(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (error) {
            // localStorage indisponível/cheio - ignorar, o widget simplesmente não fica em cache
        }
    }

    async function fetchWeather() {
        const cached = loadFromCache();
        if (cached) return cached;

        const response = await fetch(FORECAST_URL);
        if (!response.ok) {
            throw new Error(`Falha ao obter previsão do tempo: ${response.status}`);
        }
        const data = await response.json();
        saveToCache(data);
        return data;
    }

    function renderWidget(container, data, lang) {
        const current = data.current;
        const daily = data.daily;
        if (!current || !daily) return;

        const currentWeather = describeCode(current.weather_code, lang);
        const temp = Math.round(current.temperature_2m);
        const feelsLike = Math.round(current.apparent_temperature);

        const currentLabel = lang === 'en' ? 'Feels like' : 'Sensação térmica';
        const forecastLabel = lang === 'en' ? 'Next days' : 'Próximos dias';

        let forecastHtml = '';
        for (let i = 1; i < Math.min(daily.time.length, 4); i++) {
            const date = new Date(daily.time[i]);
            const dayName = DAY_NAMES[lang]?.[date.getDay()] || DAY_NAMES.pt[date.getDay()];
            const dayWeather = describeCode(daily.weather_code[i], lang);
            const max = Math.round(daily.temperature_2m_max[i]);
            const min = Math.round(daily.temperature_2m_min[i]);

            forecastHtml += `
                <div class="tempo-day">
                    <span class="tempo-day-name">${dayName.slice(0, 3)}</span>
                    <span class="tempo-day-icon" aria-hidden="true">${dayWeather.icon}</span>
                    <span class="tempo-day-temps"><strong>${max}°</strong> ${min}°</span>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="tempo-current">
                <span class="tempo-icon" aria-hidden="true">${currentWeather.icon}</span>
                <div class="tempo-current-info">
                    <span class="tempo-temp">${temp}°C</span>
                    <span class="tempo-description">${currentWeather.text}</span>
                    <span class="tempo-feels-like">${currentLabel}: ${feelsLike}°C</span>
                </div>
            </div>
            <div class="tempo-forecast">
                <span class="tempo-forecast-label">${forecastLabel}</span>
                <div class="tempo-forecast-days">${forecastHtml}</div>
            </div>
        `;
        container.classList.remove('tempo-loading');
    }

    function renderError(container, lang) {
        const message = lang === 'en'
            ? 'Weather forecast unavailable right now.'
            : 'Previsão do tempo indisponível de momento.';
        container.innerHTML = `<p class="tempo-error">🌡️ ${message}</p>`;
        container.classList.remove('tempo-loading');
    }

    async function initWeatherWidgets() {
        const containers = document.querySelectorAll('.tempo-widget');
        if (containers.length === 0) return;

        const lang = pickLang();

        try {
            const data = await fetchWeather();
            containers.forEach((container) => renderWidget(container, data, lang));
        } catch (error) {
            console.error('Erro ao carregar previsão do tempo:', error);
            containers.forEach((container) => renderError(container, lang));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWeatherWidgets);
    } else {
        initWeatherWidgets();
    }

    // Volta a desenhar o widget (a partir da cache, sem novo pedido de rede)
    // quando o utilizador muda de idioma.
    document.addEventListener('languageChanged', function (e) {
        const containers = document.querySelectorAll('.tempo-widget');
        if (containers.length === 0) return;
        const cached = loadFromCache();
        if (cached) {
            containers.forEach((container) => renderWidget(container, cached, e.detail.language));
        }
    });
})();
