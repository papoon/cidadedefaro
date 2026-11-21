// hoteis.js - Sistema de listagem e filtros de hotéis e alojamento

/**
 * Classe para gerir hotéis e alojamentos
 */
class HoteisManager {
    constructor() {
        this.hoteis = [];
        this.filteredHoteis = [];
        this.searchTerm = '';
        this.activeFilters = {
            tipo: [],
            zona: [],
            preco: [],
            classificacao: [],
            servicos: []
        };
    }

    /**
     * Carrega dados dos hotéis do JSON
     */
    async loadHoteis() {
        try {
            const response = await fetch('assets/data/hoteis.json');
            if (!response.ok) {
                throw new Error('Erro ao carregar dados dos hotéis');
            }
            this.hoteis = await response.json();
            this.filteredHoteis = [...this.hoteis];
            return true;
        } catch (error) {
            console.error('Erro ao carregar hotéis:', error);
            return false;
        }
    }

    /**
     * Filtra hotéis baseado em pesquisa e filtros ativos
     */
    filterHoteis() {
        let results = [...this.hoteis];

        // Aplicar pesquisa por nome, descrição ou morada
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase().trim();
            results = results.filter(hotel => 
                hotel.nome.toLowerCase().includes(searchLower) ||
                hotel.descricao?.toLowerCase().includes(searchLower) ||
                hotel.morada.toLowerCase().includes(searchLower)
            );
        }

        // Aplicar filtros por tipo
        if (this.activeFilters.tipo.length > 0) {
            results = results.filter(hotel => 
                this.activeFilters.tipo.includes(hotel.tipo)
            );
        }

        // Aplicar filtros por zona
        if (this.activeFilters.zona.length > 0) {
            results = results.filter(hotel => 
                this.activeFilters.zona.includes(hotel.zona)
            );
        }

        // Aplicar filtros por preço
        if (this.activeFilters.preco.length > 0) {
            results = results.filter(hotel => 
                this.activeFilters.preco.includes(hotel.preco)
            );
        }

        // Aplicar filtros por classificação
        if (this.activeFilters.classificacao.length > 0) {
            results = results.filter(hotel => {
                const rating = parseInt(hotel.classificacao, 10);
                return this.activeFilters.classificacao.some(filter => {
                    if (filter === '1-2') return rating >= 1 && rating <= 2;
                    if (filter === '3') return rating === 3;
                    if (filter === '4-5') return rating >= 4 && rating <= 5;
                    return false;
                });
            });
        }

        // Aplicar filtros por serviços
        if (this.activeFilters.servicos.length > 0) {
            results = results.filter(hotel => {
                if (!hotel.servicos) return false;
                return this.activeFilters.servicos.every(servico => 
                    hotel.servicos.includes(servico)
                );
            });
        }

        this.filteredHoteis = results;
        return results;
    }

    /**
     * Define termo de pesquisa
     */
    setSearchTerm(term) {
        this.searchTerm = term;
    }

    /**
     * Adiciona ou remove filtro
     */
    toggleFilter(filterType, value) {
        const index = this.activeFilters[filterType].indexOf(value);
        if (index > -1) {
            this.activeFilters[filterType].splice(index, 1);
        } else {
            this.activeFilters[filterType].push(value);
        }
    }

    /**
     * Limpa todos os filtros
     */
    clearFilters() {
        this.activeFilters = {
            tipo: [],
            zona: [],
            preco: [],
            classificacao: [],
            servicos: []
        };
        this.searchTerm = '';
    }

    /**
     * Retorna hotéis filtrados
     */
    getFilteredHoteis() {
        return this.filteredHoteis;
    }
}

// Instância global
const hoteisManager = new HoteisManager();

// Small DOM builder: data from JSON is always set as text, never parsed as HTML
function h(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
}

function safeHref(url) {
    const u = String(url || '');
    return /^https?:\/\//i.test(u) ? u : null;
}

function infoRow(label, value, valueClass) {
    if (value === undefined || value === null || value === '') return null;
    const row = h('div', 'info-row');
    row.append(h('span', 'info-label', label), h('span', 'info-value' + (valueClass ? ' ' + valueClass : ''), value));
    return row;
}

function renderEmpty(container, title, text) {
    const box = h('div', 'no-results');
    box.append(h('h3', '', title), h('p', '', text));
    container.replaceChildren(box);
}

/**
 * Renderiza cards de hotéis
 */
function renderHoteis(hoteis, container) {
    if (!container) return;

    if (hoteis.length === 0) {
        renderEmpty(container, 'Nenhum alojamento encontrado', 'Tente ajustar os filtros ou termo de pesquisa');
        return;
    }

    const grid = h('div', 'hoteis-grid');

    hoteis.forEach(hotel => {
        const card = h('article', 'hotel-card');
        card.id = hotel.id;
        card.dataset.id = hotel.id;

        const header = h('div', 'hotel-header');
        header.appendChild(h('span', 'hotel-tipo', hotel.tipo));
        if (hotel.destaque) header.appendChild(h('span', 'destaque-badge', hotel.destaque));
        card.appendChild(header);

        card.appendChild(h('h3', 'hotel-nome', hotel.nome));

        const info = h('div', 'hotel-info');
        const estrelas = parseInt(hotel.classificacao, 10);
        [
            Number.isFinite(estrelas) ? infoRow('Classificação', `${'★'.repeat(estrelas)} (${estrelas} estrelas)`, 'classificacao') : null,
            infoRow('Zona', hotel.zona),
            infoRow('Morada', hotel.morada),
            infoRow('Preço por noite', hotel.preco, 'preco'),
            infoRow('Telefone', hotel.telefone)
        ].forEach(row => row && info.appendChild(row));
        card.appendChild(info);

        if (hotel.descricao) {
            const desc = h('div', 'hotel-descricao');
            desc.appendChild(h('p', '', hotel.descricao));
            card.appendChild(desc);
        }

        if (hotel.servicos && hotel.servicos.length > 0) {
            const servicos = h('div', 'hotel-servicos');
            hotel.servicos.forEach(servico => servicos.appendChild(h('span', 'servico-badge', servico)));
            card.appendChild(servicos);
        }

        const actions = h('div', 'hotel-actions');
        const maps = safeHref(hotel.mapsLink);
        if (maps) {
            const a = h('a', 'btn-map', 'Ver no mapa');
            a.href = maps; a.target = '_blank'; a.rel = 'noopener noreferrer';
            actions.appendChild(a);
        }
        const site = safeHref(hotel.website);
        if (site) {
            const a = h('a', 'btn-website', 'Website');
            a.href = site; a.target = '_blank'; a.rel = 'noopener noreferrer';
            actions.appendChild(a);
        }
        if (actions.childElementCount) card.appendChild(actions);

        if (typeof createFavoriteButton === 'function') {
            header.appendChild(createFavoriteButton(hotel.id, 'hotel', hotel.nome, `hoteis.html#${hotel.id}`));
        }

        grid.appendChild(card);
    });

    container.replaceChildren(grid);
}

/**
 * Atualiza contadores de resultados
 */
function updateResultsCount(count, total) {
    const counter = document.getElementById('results-count');
    if (counter) {
        counter.textContent = `Mostrando ${count} de ${total} alojamentos`;
    }
}

/**
 * Inicializa página de hotéis
 */
async function initializeHoteisPage() {
    const container = document.getElementById('hoteis-container');
    const searchInput = document.getElementById('search-hoteis');
    const clearSearchBtn = document.getElementById('clear-search');
    const clearFiltersBtn = document.getElementById('clear-filters');

    if (!container) return;

    // Mostrar loading
    container.innerHTML = '<div class="loading"><p>A carregar alojamentos...</p></div>';

    // Carregar dados
    const loaded = await hoteisManager.loadHoteis();
    
    if (!loaded) {
        const errorMsg = window.i18n?.t('errors.load_hotels') || '❌ Erro ao carregar dados dos alojamentos.';
        const tryAgain = window.i18n?.t('errors.try_again') || 'Por favor, tente novamente mais tarde.';
        container.innerHTML = `
            <div class="error-message">
                <p>${errorMsg}</p>
                <p>${tryAgain}</p>
            </div>
        `;
        return;
    }

    // Renderizar todos os hotéis inicialmente
    renderHoteis(hoteisManager.hoteis, container);
    updateResultsCount(
        hoteisManager.hoteis.length,
        hoteisManager.hoteis.length
    );

    // Event listener para pesquisa
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (clearSearchBtn) {
                clearSearchBtn.style.display = query ? 'block' : 'none';
            }

            searchTimeout = setTimeout(() => {
                hoteisManager.setSearchTerm(query);
                const results = hoteisManager.filterHoteis();
                renderHoteis(results, container);
                updateResultsCount(results.length, hoteisManager.hoteis.length);
            }, 300);
        });
    }

    // Event listener para limpar pesquisa
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                this.style.display = 'none';
                hoteisManager.setSearchTerm('');
                const results = hoteisManager.filterHoteis();
                renderHoteis(results, container);
                updateResultsCount(results.length, hoteisManager.hoteis.length);
                searchInput.focus();
            }
        });
    }

    // Event listeners para filtros
    const filterCheckboxes = document.querySelectorAll('.filter-checkbox input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const filterType = this.getAttribute('data-filter-type');
            const filterValue = this.value;
            
            hoteisManager.toggleFilter(filterType, filterValue);
            const results = hoteisManager.filterHoteis();
            renderHoteis(results, container);
            updateResultsCount(results.length, hoteisManager.hoteis.length);
        });
    });

    // Event listener para limpar filtros
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Desmarcar todos os checkboxes
            filterCheckboxes.forEach(cb => cb.checked = false);
            
            // Limpar campo de pesquisa
            if (searchInput) {
                searchInput.value = '';
            }
            if (clearSearchBtn) {
                clearSearchBtn.style.display = 'none';
            }
            
            // Resetar filtros
            hoteisManager.clearFilters();
            const results = hoteisManager.filterHoteis();
            renderHoteis(results, container);
            updateResultsCount(results.length, hoteisManager.hoteis.length);
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de hotéis
    if (document.getElementById('hoteis-container')) {
        initializeHoteisPage();
    }
});
