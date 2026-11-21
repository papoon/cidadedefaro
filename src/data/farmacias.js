// farmacias.js - Sistema de carregamento dinâmico de farmácias

/**
 * Classe para gerir farmácias
 */
class FarmaciasManager {
    constructor() {
        this.farmacias = [];
    }

    /**
     * Carrega dados das farmácias do JSON
     */
    async loadFarmacias() {
        try {
            const response = await fetch('assets/data/farmacias.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar dados das farmácias');
            }
            this.farmacias = await response.json();
            return true;
        } catch (error) {
            console.error('Erro ao carregar farmácias:', error);
            return false;
        }
    }

    /**
     * Retorna todas as farmácias
     */
    getFarmacias() {
        return this.farmacias;
    }

    /**
     * Retorna as primeiras N farmácias
     */
    getInitialFarmacias(count = 5) {
        return this.farmacias.slice(0, count);
    }

    /**
     * Retorna farmácias adicionais (após as primeiras N)
     */
    getExtraFarmacias(count = 5) {
        return this.farmacias.slice(count);
    }
}

// Instância global
const farmaciasManager = new FarmaciasManager();

/**
 * Traduz uma chave i18n com fallback em português
 */
function tr(key, fallback) {
    const t = window.i18n && typeof window.i18n.t === 'function' ? window.i18n.t(key) : null;
    return t || fallback;
}

/**
 * Cria um elemento com chave data-i18n (re-traduzido automaticamente ao mudar de idioma)
 */
function i18nEl(tag, key, fallback) {
    const el = document.createElement(tag);
    el.setAttribute('data-i18n', key);
    el.textContent = tr(key, fallback);
    return el;
}

/**
 * Renderiza lista de farmácias (DOM seguro, sem innerHTML)
 */
function renderFarmacias(farmacias, container, isExtra = false) {
    if (!container || !farmacias || farmacias.length === 0) return;

    farmacias.forEach(farmacia => {
        const li = document.createElement('li');
        if (isExtra) li.className = 'farmacia-extra';

        const nome = document.createElement('strong');
        nome.textContent = farmacia.nome;
        li.appendChild(nome);

        li.append(i18nEl('span', 'saude.morada', 'Morada:'), ` ${farmacia.morada}`, document.createElement('br'));
        if (farmacia.telefone) {
            li.append(i18nEl('span', 'saude.telefone', 'Telefone:'), ` ${farmacia.telefone}`, document.createElement('br'));
        }

        if (typeof farmacia.mapsLink === 'string' && farmacia.mapsLink.startsWith('https://')) {
            const a = i18nEl('a', 'saude.ver_no_google_maps', 'Ver no Google Maps');
            a.href = farmacia.mapsLink;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'btn-maps';
            li.appendChild(a);
        }

        container.appendChild(li);
    });
}

/**
 * Retorna dados das farmácias para o mapa
 */
function getFarmaciasParaMapa(farmacias) {
    return farmacias.map(farmacia => ({
        nome: farmacia.nome,
        coordenadas: farmacia.coordenadas,
        tipo: 'farmacia',
        descricao: farmacia.morada.split(',')[0]
    }));
}

/**
 * Inicializa lista de farmácias na página de saúde
 */
async function initializeFarmaciasSection() {
    const container = document.getElementById('farmacias-list');
    
    if (!container) {
        console.warn('Container de farmácias não encontrado');
        return null;
    }

    // Carregar dados
    const loaded = await farmaciasManager.loadFarmacias();
    
    if (!loaded) {
        console.error('Falha ao carregar farmácias');
        return null;
    }

    // Renderizar farmácias iniciais e extras
    const initialFarmacias = farmaciasManager.getInitialFarmacias(5);
    const extraFarmacias = farmaciasManager.getExtraFarmacias(5);
    
    container.replaceChildren();
    renderFarmacias(initialFarmacias, container, false);
    renderFarmacias(extraFarmacias, container, true);

    const btn = document.getElementById('btn-ver-mais-farmacias');
    if (btn && extraFarmacias.length === 0) btn.hidden = true;

    return farmaciasManager.getFarmacias();
}

/**
 * Função para alternar visibilidade das farmácias extras
 */
let farmaciasExpandidas = false;
function toggleFarmacias() {
    const extraFarmacias = document.querySelectorAll('.farmacia-extra');
    const btn = document.getElementById('btn-ver-mais-farmacias');
    
    farmaciasExpandidas = !farmaciasExpandidas;
    extraFarmacias.forEach(farmacia => {
        farmacia.classList.toggle('show', farmaciasExpandidas);
    });

    if (!btn) return;
    // Trocar a chave data-i18n mantém o estado correto ao mudar de idioma
    const key = farmaciasExpandidas ? 'health.show_less_pharmacies' : 'health.show_more_pharmacies';
    btn.setAttribute('data-i18n', key);
    btn.setAttribute('aria-expanded', String(farmaciasExpandidas));
    btn.textContent = tr(key, farmaciasExpandidas ? 'Ver menos farmácias' : 'Ver mais farmácias');
}

// Exportar para uso global (se necessário para compatibilidade)
if (typeof window !== 'undefined') {
    window.toggleFarmacias = toggleFarmacias;
    window.farmaciasManager = farmaciasManager;
    window.initializeFarmaciasSection = initializeFarmaciasSection;
    window.getFarmaciasParaMapa = getFarmaciasParaMapa;
}
