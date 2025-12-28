// dados-api.js - Funções para obter dados de APIs

// Função para buscar dados (a ser implementada)
async function buscarDados(endpoint) {
    console.log(`Buscando dados de: ${endpoint}`);
    // Implementação futura para integração com APIs
    return null;
}

// Função para processar dados (a ser implementada)
function processarDados(dados) {
    console.log('Processando dados');
    // Implementação futura
    return dados;
}

// ===================================
// INTEGRAÇÃO COM GEO API PT
// ===================================

/**
 * Busca dados do município de Faro através da GEO API PT
 * @returns {Promise<Object>} Objeto com dados do município ou null em caso de erro
 */
async function buscarDadosFaro() {
    // Config
    const CACHE_KEY = 'municipioFaroCache';
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

    // retorno embutido como último recurso (quando nada mais funciona)
    const EMBEDDED_FALLBACK = {
        nome: 'Faro',
        distrito: 'Faro',
        populacao: 'N/A',
        area: 'N/A',
        source: 'embedded'
    };

    // Tentar múltiplos endpoints (algumas variações e formatos possíveis)
    const endpoints = [
        'https://geoapi.pt/municipio/Faro',
        'https://geoapi.pt/municipio/faro',
        'https://geoapi.pt/municipio/Faro.json',
        'https://geoapi.pt/municipio/faro.json'
    ];

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

    console.log('Buscando dados de Faro (tentando múltiplos endpoints)...');

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

    // 2) se estivermos em ambiente de desenvolvimento (localhost) e protocolo HTTP(S), tentar arquivo local primeiro
    const isLocalHost = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
    const canFetchLocal = location.protocol !== 'file:'; // fetch to /data works only over http(s)
    if (isLocalHost && canFetchLocal) {
        try {
            const lr = await fetch('/data/municipio-faro.json');
            if (lr && lr.ok) {
                const localData = await lr.json();
                console.log('Usando dados locais de /data/municipio-faro.json (dev)');
                const result = {
                    nome: localData.nome || localData.municipio || 'Faro',
                    distrito: localData.distrito || 'Faro',
                    populacao: localData.populacao || 'N/A',
                    area: localData.area || 'N/A',
                    source: 'local'
                };
                try { localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result })); } catch (e) {}
                return result;
            }
        } catch (e) {
            console.warn('Falha ao buscar arquivo local de desenvolvimento:', e);
        }
    }

    for (const url of endpoints) {
        try {
            const resp = await fetchWithTimeout(url, 6000);
            if (!resp.ok) {
                console.warn(`Endpoint ${url} respondeu com status ${resp.status}`);
                continue;
            }

            // tentar parse JSON (algumas respostas podem ser texto)
            let dadosRaw;
            try {
                dadosRaw = await resp.json();
            } catch (e) {
                // se não for JSON, tentar texto e procurar um JSON embutido
                const txt = await resp.text();
                try {
                    dadosRaw = JSON.parse(txt);
                } catch (ee) {
                    console.warn('Resposta não é JSON:', txt.slice(0, 200));
                    continue;
                }
            }

            console.log(`Dados recebidos de ${url}:`, dadosRaw);

            // alguns endpoints retornam um objeto com propriedades aninhadas
            const root = dadosRaw || {};
            const candidateObj = root.properties || root.result || root.data || root;

            const nome = pick(candidateObj, ['Município', 'Municipio', 'municipio', 'nome', 'name']) || 'Faro';
            const distrito = pick(candidateObj, ['Distrito', 'distrito', 'district']) || 'Faro';
            const populacao = pick(candidateObj, ['População', 'Populacao', 'populacao', 'population']) || 'N/A';
            const area = pick(candidateObj, ['Área', 'Area', 'area']) || 'N/A';

            const result = { nome, distrito, populacao, area, source: 'geoapi' };
            // armazenar em cache
            try { localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result })); } catch (e) {}
            return result;

        } catch (err) {
            if (err.name === 'AbortError') {
                console.warn(`Pedido ao ${url} expirou (timeout)`);
            } else {
                console.warn(`Erro ao aceder ${url}:`, err.message || err);
            }
            // tentar próximo endpoint
            continue;
        }
    }

    // fallback: tentar um ficheiro local (se existir) se protocolo permitir
    if (canFetchLocal) {
        try {
            const localResp2 = await fetch('/data/municipio-faro.json');
            if (localResp2.ok) {
                const localData = await localResp2.json();
                const result = {
                    nome: localData.nome || localData.municipio || 'Faro',
                    distrito: localData.distrito || 'Faro',
                    populacao: localData.populacao || 'N/A',
                    area: localData.area || 'N/A',
                    source: 'local'
                };
                try { localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result })); } catch (e) {}
                return result;
            }
        } catch (e) {
            // ignorar
        }
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
            <p>🔄 A carregar dados de Faro...</p>
        </div>
    `;
    
    // Buscar dados
    const dados = await buscarDadosFaro();
    
    if (dados) {
        // Função auxiliar para escapar HTML e prevenir XSS
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        // determinar fonte legível
        let fonteText = 'GEO API PT';
        try {
            const src = dados.source || 'geoapi';
            if (src === 'local') fonteText = 'Arquivo local';
            else if (src === 'cache') {
                fonteText = 'Cache local';
                // tentar obter timestamp do cache
                try {
                    const raw = localStorage.getItem('municipioFaroCache');
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed && parsed.timestamp) {
                            const dt = new Date(parsed.timestamp);
                            fonteText += ` (atualizado em ${dt.toLocaleString()})`;
                        }
                    }
                } catch (e) { /* ignore */ }
            } else if (src === 'embedded') fonteText = 'Dados embutidos (fallback)';
        } catch (e) { /* ignore */ }
        
        // Exibir dados com sucesso (com sanitização)
        elemento.innerHTML = `
            <div class="dados-municipio">
                <h3>📍 Informações do Município</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Município:</span>
                        <span class="info-value">${escapeHtml(String(dados.nome))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Distrito:</span>
                        <span class="info-value">${escapeHtml(String(dados.distrito))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">População:</span>
                        <span class="info-value">${escapeHtml(String(dados.populacao))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Área:</span>
                        <span class="info-value">${escapeHtml(String(dados.area))}</span>
                    </div>
                </div>
                <p class="fonte-dados">Fonte: ${escapeHtml(fonteText)}</p>
            </div>
        `;
    } else {
        // Exibir mensagem de erro
        elemento.innerHTML = `
            <div class="erro-dados">
                <p>❌ Não foi possível carregar os dados de Faro.</p>
                <p>Por favor, tente novamente mais tarde.</p>
            </div>
        `;
    }
}
