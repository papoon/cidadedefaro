// dados-api.js - Funções para obter dados de APIs

// ===================================
// DADOS DO MUNICÍPIO (ficheiro local assets/data/municipio-faro.json)
// ===================================

/**
 * Lê os dados do município de Faro do ficheiro local (sem chamadas a APIs externas)
 * @returns {Promise<Object>} Objeto com dados do município ou null em caso de erro
 */
async function buscarDadosFaro() {
    // Config
    const CACHE_KEY = 'municipioFaroCache_v2'; // v2: dados Censos 2021 + campo fonte
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

    // retorno embutido como último recurso (quando nada mais funciona)
    const EMBEDDED_FALLBACK = {
        nome: 'Faro',
        distrito: 'Faro',
        populacao: 'N/A',
        area: 'N/A',
        source: 'embedded'
    };

    const localPath = new URL('assets/data/municipio-faro.json', location.href).href;

    // Helper: tenta extrair propriedade ignorando acentos/maiúsculas
    const pick = (obj, candidates) => {
        if (!obj) return null;
        for (const key of candidates) {
            if (key in obj && obj[key] != null) return obj[key];
        }
        // tentar buscar propriedade sem acentos/maiusculas
        const lowerMap = {};
        Object.keys(obj).forEach(k => lowerMap[k.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()] = obj[k]);
        for (const key of candidates) {
            const k2 = key.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
            if (k2 in lowerMap) return lowerMap[k2];
        }
        return null;
    };

    // tentativa de timeout (5s)
    const fetchWithTimeout = (url, timeout = 5000) => {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(id));
    };

    

    // 1) verificar cache local
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp) < CACHE_TTL && parsed.data) {
                console.log('Usando cache local de municipioFaro');
                return Object.assign({}, parsed.data, { source: 'cache' });
            }
        }
    } catch (e) {
        console.warn('Erro ao ler cache local:', e);
    }

    // Always attempt to load data from the local JSON file
    const canFetchLocal = location.protocol !== 'file:'; // fetch to /data works only over http(s)
    if (canFetchLocal) {
        try {
            const resp = await fetch(localPath, { cache: 'no-cache' });
            if (resp && resp.ok) {
                const localData = await resp.json();
                console.log('Usando dados locais de /assets/data/municipio-faro.json');
                const result = {
                    nome: localData.nome || localData.municipio || 'Faro',
                    distrito: localData.distrito || 'Faro',
                    populacao: localData.populacao || localData.population || 'N/A',
                    area: localData.area || 'N/A',
                    fonte: localData.fonte || null,
                    source: 'local'
                };
                try { localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result })); } catch (e) {}
                return result;
            } else {
                console.warn(`Falha ao carregar ${localPath}: status ${resp && resp.status}`);
            }
        } catch (e) {
            console.warn('Erro ao buscar /assets/data/municipio-faro.json:', e);
        }
    } else {
        console.warn('Protocolo file:// detectado — não é possível carregar /assets/data/municipio-faro.json via fetch');
    }

    console.error('Não foi possível obter os dados de Faro a partir dos endpoints testados. Retornando fallback embutido.');
    return EMBEDDED_FALLBACK;
}

/**
 * Exibe os dados do município de Faro no elemento especificado
 * @param {string} elementoId - ID do elemento HTML onde os dados serão exibidos
 */
async function exibirDadosFaro(elementoId) {
    const elemento = document.getElementById(elementoId);
    
    if (!elemento) {
        console.error(`Elemento com ID "${elementoId}" não encontrado`);
        return;
    }
    
    // Mostrar estado de carregamento
    elemento.innerHTML = `
        <div class="loading">
            <p>A carregar dados de Faro…</p>
        </div>
    `;
    
    // Buscar dados
    const dados = await buscarDadosFaro();
    
    if (dados) {
        // Função auxiliar para escapar HTML e prevenir XSS
        const t = (key, fallback) => window.i18n?.t(key) || fallback;
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        // determinar fonte legível
        const fonteText = dados.fonte || (dados.source === 'embedded' ? 'Dados embutidos (fallback)' : 'Arquivo local');
        
        // Exibir dados com sucesso (com sanitização)
        elemento.innerHTML = `
            <div class="dados-municipio">
                <h3>${escapeHtml(t('home.municipality_title', 'O município'))}</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">${escapeHtml(t('home.municipality_name', 'Município'))}</span>
                        <span class="info-value">${escapeHtml(String(dados.nome))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">${escapeHtml(t('home.municipality_district', 'Distrito'))}</span>
                        <span class="info-value">${escapeHtml(String(dados.distrito))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">${escapeHtml(t('home.municipality_population', 'População'))}</span>
                        <span class="info-value">${escapeHtml(String(dados.populacao))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">${escapeHtml(t('home.municipality_area', 'Área'))}</span>
                        <span class="info-value">${escapeHtml(String(dados.area))}</span>
                    </div>
                </div>
                <p class="fonte-dados">${escapeHtml(t('home.municipality_source', 'Fonte'))}: ${escapeHtml(fonteText)}</p>
            </div>
        `;
    } else {
        // Exibir mensagem de erro
        elemento.innerHTML = `
            <div class="erro-dados">
                <p>Não foi possível carregar os dados de Faro.</p>
                <p>Por favor, tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Exportar função globalmente para uso em scripts inline
window.exibirDadosFaro = exibirDadosFaro;
