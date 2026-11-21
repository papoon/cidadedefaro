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
 * Renderiza lista de farmácias
 */
function renderFarmacias(farmacias, container, isExtra = false) {
    if (!container || !farmacias || farmacias.length === 0) return '';

    let html = '';

    farmacias.forEach(farmacia => {
        const extraClass = isExtra ? ' class="farmacia-extra"' : '';
        html += `
            <li${extraClass}>
                <strong>${farmacia.nome}</strong>
                Morada: ${farmacia.morada}<br>
                Telefone: ${farmacia.telefone}<br>
                <a href="${farmacia.mapsLink}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="btn-maps">Ver no Google Maps</a>
            </li>
        `;
    });

    return html;
}

/**
 * Retorna dados das farmácias para o mapa
 */
function getFarmaciasParaMapa(farmacias) {
    return farmacias.map(farmacia => ({
        nome: farmacia.nome,
        coordenadas: farmacia.coordenadas,
        tipo: 'farmacia',
        descricao: `Farmácia em ${farmacia.morada.split(',')[0]}`
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
    
    const htmlInicial = renderFarmacias(initialFarmacias, container, false);
    const htmlExtra = renderFarmacias(extraFarmacias, container, true);
    
    container.innerHTML = htmlInicial + htmlExtra;

    return farmaciasManager.getFarmacias();
}

/**
 * Função para alternar visibilidade das farmácias extras
 */
function toggleFarmacias() {
    const extraFarmacias = document.querySelectorAll('.farmacia-extra');
    const btn = document.getElementById('btn-ver-mais-farmacias');
    
    extraFarmacias.forEach(farmacia => {
        farmacia.classList.toggle('show');
    });
    
    if (btn.textContent === 'Ver mais farmácias') {
        btn.textContent = 'Ver menos farmácias';
    } else {
        btn.textContent = 'Ver mais farmácias';
    }
}

// Exportar para uso global (se necessário para compatibilidade)
if (typeof window !== 'undefined') {
    window.toggleFarmacias = toggleFarmacias;
    window.farmaciasManager = farmaciasManager;
    window.initializeFarmaciasSection = initializeFarmaciasSection;
    window.getFarmaciasParaMapa = getFarmaciasParaMapa;
}
