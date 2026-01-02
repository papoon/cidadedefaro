// search.js - Sistema de pesquisa global

/**
 * Classe para gerir pesquisa global
 */
class SearchManager {
    constructor() {
        this.searchIndex = [];
        this.initializeIndex();
    }

    /**
     * Inicializa o índice de pesquisa
     */
    initializeIndex() {
        // Páginas principais
        this.searchIndex = [
            {
                id: 'page-inicio',
                type: 'page',
                title: 'Início',
                description: 'Página inicial do Faro Formoso',
                url: 'index.html',
                keywords: ['início', 'home', 'principal', 'guia', 'faro', 'faro formoso']
            },
            {
                id: 'page-transportes',
                type: 'page',
                title: 'Transportes',
                description: 'Informações sobre autocarros, comboios e mobilidade',
                url: 'transportes.html',
                keywords: ['transportes', 'autocarros', 'comboios', 'mobilidade', 'público']
            },
            {
                id: 'page-saude',
                type: 'page',
                title: 'Saúde',
                description: 'Centros de saúde, hospitais e serviços médicos',
                url: 'saude.html',
                keywords: ['saúde', 'hospital', 'centro saúde', 'médico', 'emergência', 'inem']
            },
            {
                id: 'page-ambiente',
                type: 'page',
                title: 'Ambiente',
                description: 'Sustentabilidade, reciclagem e espaços verdes',
                url: 'ambiente.html',
                keywords: ['ambiente', 'reciclagem', 'sustentabilidade', 'verde', 'parques']
            },
            {
                id: 'page-lazer',
                type: 'page',
                title: 'Lazer',
                description: 'Cultura, turismo e atividades de lazer',
                url: 'lazer.html',
                keywords: ['lazer', 'cultura', 'turismo', 'atividades', 'diversão', 'museus']
            },
            {
                id: 'page-fazer-hoje',
                type: 'page',
                title: 'O que fazer hoje',
                description: 'Sugestões de atividades para hoje',
                url: 'oque-fazer-hoje.html',
                keywords: ['hoje', 'fazer', 'atividades', 'eventos', 'agenda']
            },
            {
                id: 'page-mapa',
                type: 'page',
                title: 'Mapa',
                description: 'Mapa interativo de Faro',
                url: 'mapa.html',
                keywords: ['mapa', 'localização', 'navegação', 'locais']
            },
            {
                id: 'page-problemas',
                type: 'page',
                title: 'Problemas Frequentes',
                description: 'Saiba como resolver problemas urbanos comuns',
                url: 'problemas-frequentes.html',
                keywords: ['problemas', 'ajuda', 'resolver', 'faq', 'questões']
            },
            {
                id: 'page-viver',
                type: 'page',
                title: 'Viver em Faro',
                description: 'Guia essencial para novos residentes',
                url: 'viver-em-faro.html',
                keywords: ['viver', 'residentes', 'morar', 'habitação', 'essencial']
            },
            {
                id: 'page-mobilidade',
                type: 'page',
                title: 'Mobilidade',
                description: 'Informações sobre mobilidade na cidade',
                url: 'mobilidade.html',
                keywords: ['mobilidade', 'deslocar', 'circulação', 'transporte']
            }
        ];

        // Adicionar serviços comuns
        this.addCommonServices();
    }

    /**
     * Adiciona serviços comuns ao índice
     */
    addCommonServices() {
        const services = [
            {
                id: 'service-hospital-faro',
                type: 'service',
                title: 'Hospital de Faro',
                description: 'Hospital central de Faro',
                url: 'saude.html#hospital-faro',
                keywords: ['hospital', 'saúde', 'urgências', 'médico']
            },
            {
                id: 'service-centro-saude',
                type: 'service',
                title: 'Centro de Saúde de Faro',
                description: 'Centro de saúde principal',
                url: 'saude.html#centro-saude',
                keywords: ['centro saúde', 'consultas', 'médico família']
            },
            {
                id: 'service-camara-municipal',
                type: 'service',
                title: 'Câmara Municipal de Faro',
                description: 'Câmara Municipal',
                url: 'viver-em-faro.html#camara',
                keywords: ['câmara', 'municipal', 'prefeitura', 'documentos']
            },
            {
                id: 'service-turismo',
                type: 'service',
                title: 'Posto de Turismo',
                description: 'Informações turísticas',
                url: 'lazer.html#turismo',
                keywords: ['turismo', 'informação', 'visitar', 'guia']
            }
        ];

        this.searchIndex.push(...services);
    }

    /**
     * Adiciona item ao índice de pesquisa
     * @param {Object} item - Item a adicionar
     */
    addToIndex(item) {
        if (!item.id || !item.title) {
            console.error('Item inválido para índice de pesquisa');
            return;
        }

        // Verificar se já existe
        const existingIndex = this.searchIndex.findIndex(i => i.id === item.id);
        if (existingIndex !== -1) {
            this.searchIndex[existingIndex] = item;
        } else {
            this.searchIndex.push(item);
        }
    }

    /**
     * Remove item do índice
     * @param {string} id - ID do item
     */
    removeFromIndex(id) {
        this.searchIndex = this.searchIndex.filter(item => item.id !== id);
    }

    /**
     * Pesquisa no índice
     * @param {string} query - Termo de pesquisa
     * @returns {Array} Resultados ordenados por relevância
     */
    search(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        const results = [];

        this.searchIndex.forEach(item => {
            let score = 0;

            // Pesquisar no título (peso 3)
            if (item.title.toLowerCase().includes(searchTerm)) {
                score += 3;
                // Bonus se for match exato
                if (item.title.toLowerCase() === searchTerm) {
                    score += 5;
                }
            }

            // Pesquisar na descrição (peso 2)
            if (item.description && item.description.toLowerCase().includes(searchTerm)) {
                score += 2;
            }

            // Pesquisar nas keywords (peso 2)
            if (item.keywords) {
                item.keywords.forEach(keyword => {
                    if (keyword.toLowerCase().includes(searchTerm)) {
                        score += 2;
                    }
                });
            }

            if (score > 0) {
                results.push({
                    ...item,
                    score,
                    highlight: this.highlightMatch(item.title, searchTerm)
                });
            }
        });

        // Ordenar por score (maior primeiro)
        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Destaca termo de pesquisa no texto
     * @param {string} text - Texto original
     * @param {string} searchTerm - Termo a destacar
     * @returns {string} Texto com destaque HTML
     */
    highlightMatch(text, searchTerm) {
        // Escape special regex characters to prevent RegExp errors
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    /**
     * Obtém sugestões de pesquisa
     * @param {string} query - Termo parcial
     * @returns {Array} Sugestões
     */
    getSuggestions(query) {
        if (!query || query.trim().length < 1) {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        const suggestions = new Set();

        this.searchIndex.forEach(item => {
            // Sugestões do título
            if (item.title.toLowerCase().startsWith(searchTerm)) {
                suggestions.add(item.title);
            }

            // Sugestões das keywords
            if (item.keywords) {
                item.keywords.forEach(keyword => {
                    if (keyword.toLowerCase().startsWith(searchTerm)) {
                        suggestions.add(keyword);
                    }
                });
            }
        });

        return Array.from(suggestions).slice(0, 5);
    }
}

// Instância global
const searchManager = new SearchManager();

/**
 * Cria interface de pesquisa
 * @returns {HTMLElement}
 */
function createSearchInterface() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-input-wrapper">
            <span class="search-icon" aria-hidden="true">🔍</span>
            <input 
                type="search" 
                id="global-search-input" 
                class="search-input" 
                placeholder="Pesquisar páginas, serviços, locais..."
                aria-label="Campo de pesquisa global"
                autocomplete="off"
            />
            <button id="search-clear-btn" class="search-clear-btn" title="Limpar pesquisa" aria-label="Limpar pesquisa">
                ✕
            </button>
        </div>
        <div id="search-results" class="search-results" role="listbox" aria-label="Resultados da pesquisa"></div>
    `;

    return searchContainer;
}

/**
 * Renderiza resultados de pesquisa
 * @param {Array} results - Resultados da pesquisa
 * @param {HTMLElement} container - Container dos resultados
 */
function renderSearchResults(results, container) {
    if (!container) return;

    if (results.length === 0) {
        const noResults = window.i18n?.t('errors.no_results') || '😕 Nenhum resultado encontrado';
        const searchTip = window.i18n?.t('errors.search_tip') || 'Tente usar outras palavras-chave';
        container.innerHTML = `
            <div class="search-no-results">
                <p>${noResults}</p>
                <p class="search-tip">${searchTip}</p>
            </div>
        `;
        container.classList.add('show');
        return;
    }

    const typeIcons = {
        page: '📄',
        service: '🏢',
        location: '📍'
    };

    const typeLabels = {
        page: 'Página',
        service: 'Serviço',
        location: 'Local'
    };

    let html = '<ul class="search-results-list">';

    results.forEach((result, index) => {
        const icon = typeIcons[result.type] || '📌';
        const label = typeLabels[result.type] || 'Item';
        
        html += `
            <li class="search-result-item" role="option" data-url="${result.url}">
                <div class="result-icon">${icon}</div>
                <div class="result-content">
                    <div class="result-title">${result.highlight}</div>
                    <div class="result-meta">
                        <span class="result-type">${label}</span>
                        ${result.description ? `<span class="result-description">${result.description}</span>` : ''}
                    </div>
                </div>
            </li>
        `;
    });

    html += '</ul>';
    container.innerHTML = html;
    container.classList.add('show');

    // Adicionar event listeners
    container.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            window.location.href = url;
        });

        // Navegação por teclado
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const url = this.getAttribute('data-url');
                window.location.href = url;
            }
        });
    });
}

/**
 * Inicializa pesquisa global
 */
function initializeGlobalSearch() {
    const header = document.querySelector('header');
    if (!header) return;

    // Criar interface de pesquisa
    const searchInterface = createSearchInterface();
    
    // Inserir antes da navegação
    const nav = header.querySelector('nav');
    if (nav) {
        header.insertBefore(searchInterface, nav);
    } else {
        header.appendChild(searchInterface);
    }

    const searchInput = document.getElementById('global-search-input');
    const searchResults = document.getElementById('search-results');
    const clearBtn = document.getElementById('search-clear-btn');

    let searchTimeout;

    // Event listener para input
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (query.length < 2) {
            searchResults.classList.remove('show');
            clearBtn.style.display = 'none';
            return;
        }

        clearBtn.style.display = 'block';

        // Debounce
        searchTimeout = setTimeout(() => {
            const results = searchManager.search(query);
            renderSearchResults(results, searchResults);
        }, 300);
    });

    // Event listener para limpar
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchResults.classList.remove('show');
        clearBtn.style.display = 'none';
        searchInput.focus();
    });

    // Event listener para tecla ESC
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            searchResults.classList.remove('show');
            clearBtn.style.display = 'none';
        }
    });

    // Fechar resultados ao clicar fora
    document.addEventListener('click', function(e) {
        if (!searchInterface.contains(e.target)) {
            searchResults.classList.remove('show');
        }
    });

    // Mostrar resultados ao focar no input
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            searchResults.classList.add('show');
        }
    });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initializeGlobalSearch();
});
