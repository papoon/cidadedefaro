// restaurantes.js - Sistema de listagem e filtros de restaurantes

/**
 * Classe para gerir restaurantes
 */
class RestaurantesManager {
    constructor() {
        this.restaurantes = [];
        this.filteredRestaurantes = [];
        this.searchTerm = '';
        this.activeFilters = {
            tipo: [],
            categoria: [],
            zona: [],
            preco: []
        };
    }

    /**
     * Carrega dados dos restaurantes do JSON
     */
    async loadRestaurantes() {
        try {
            const response = await fetch(new URL('assets/data/restaurantes.json', location.href).href);
            if (!response.ok) {
                throw new Error('Erro ao carregar dados dos restaurantes');
            }
            this.restaurantes = await response.json();
            this.filteredRestaurantes = [...this.restaurantes];
            return true;
        } catch (error) {
            console.error('Erro ao carregar restaurantes:', error);
            return false;
        }
    }

    /**
     * Filtra restaurantes baseado em pesquisa e filtros ativos
     */
    filterRestaurantes() {
        let results = [...this.restaurantes];

        // Aplicar pesquisa por nome
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase().trim();
            results = results.filter(rest => 
                rest.nome.toLowerCase().includes(searchLower) ||
                rest.descricao?.toLowerCase().includes(searchLower) ||
                rest.morada.toLowerCase().includes(searchLower)
            );
        }

        // Aplicar filtros por tipo
        if (this.activeFilters.tipo.length > 0) {
            results = results.filter(rest => 
                this.activeFilters.tipo.includes(rest.tipo)
            );
        }

        // Aplicar filtros por categoria
        if (this.activeFilters.categoria.length > 0) {
            results = results.filter(rest => 
                this.activeFilters.categoria.includes(rest.categoria)
            );
        }

        // Aplicar filtros por zona
        if (this.activeFilters.zona.length > 0) {
            results = results.filter(rest => 
                this.activeFilters.zona.includes(rest.zona)
            );
        }

        // Aplicar filtros por preço
        if (this.activeFilters.preco.length > 0) {
            results = results.filter(rest => 
                this.activeFilters.preco.includes(rest.preco)
            );
        }

        this.filteredRestaurantes = results;
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
            categoria: [],
            zona: [],
            preco: []
        };
        this.searchTerm = '';
    }

    /**
     * Retorna restaurantes filtrados
     */
    getFilteredRestaurantes() {
        return this.filteredRestaurantes;
    }
}

// Instância global
const restaurantesManager = new RestaurantesManager();

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
 * Renderiza cards de restaurantes
 */
function renderRestaurantes(restaurantes, container) {
    if (!container) return;

    if (restaurantes.length === 0) {
        renderEmpty(container, 'Nenhum estabelecimento encontrado', 'Tente ajustar os filtros ou termo de pesquisa');
        return;
    }

    const grid = h('div', 'restaurantes-grid');

    restaurantes.forEach(rest => {
        const card = h('article', 'restaurante-card');
        card.id = rest.id;
        card.dataset.id = rest.id;

        const header = h('div', 'restaurante-header');
        header.appendChild(h('span', 'restaurante-tipo', rest.tipo));
        if (rest.destaque) header.appendChild(h('span', 'destaque-badge', rest.destaque));
        card.appendChild(header);

        card.appendChild(h('h3', 'restaurante-nome', rest.nome));

        const info = h('div', 'restaurante-info');
        [
            infoRow('Morada', rest.morada),
            infoRow('Categoria', rest.categoria),
            infoRow('Zona', rest.zona),
            infoRow('Horário', rest.horario),
            infoRow('Preço', rest.preco, 'preco'),
            infoRow('Telefone', rest.telefone)
        ].forEach(row => row && info.appendChild(row));
        card.appendChild(info);

        if (rest.descricao) {
            const desc = h('div', 'restaurante-descricao');
            desc.appendChild(h('p', '', rest.descricao));
            card.appendChild(desc);
        }

        const maps = safeHref(rest.mapsLink);
        if (maps) {
            const actions = h('div', 'restaurante-actions');
            const a = h('a', 'btn-map', 'Ver no mapa');
            a.href = maps; a.target = '_blank'; a.rel = 'noopener noreferrer';
            actions.appendChild(a);
            card.appendChild(actions);
        }

        if (typeof createFavoriteButton === 'function') {
            header.appendChild(createFavoriteButton(rest.id, 'restaurant', rest.nome, `restaurantes.html#${rest.id}`));
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
        counter.textContent = `Mostrando ${count} de ${total} estabelecimentos`;
    }
}

/**
 * Inicializa página de restaurantes
 */
async function initializeRestaurantesPage() {
    const container = document.getElementById('restaurantes-container');
    const searchInput = document.getElementById('search-restaurantes');
    const clearSearchBtn = document.getElementById('clear-search');
    const clearFiltersBtn = document.getElementById('clear-filters');

    if (!container) return;

    // Mostrar loading
    container.innerHTML = '<div class="loading"><p>A carregar estabelecimentos...</p></div>';

    // Carregar dados
    const loaded = await restaurantesManager.loadRestaurantes();
    
    if (!loaded) {
        const errorMsg = window.i18n?.t('errors.load_restaurants') || 'Erro ao carregar dados dos estabelecimentos.';
        const tryAgain = window.i18n?.t('errors.try_again') || 'Por favor, tente novamente mais tarde.';
        container.innerHTML = `
            <div class="error-message">
                <p>${errorMsg}</p>
                <p>${tryAgain}</p>
            </div>
        `;
        return;
    }

    // Renderizar todos os restaurantes inicialmente
    renderRestaurantes(restaurantesManager.restaurantes, container);
    updateResultsCount(
        restaurantesManager.restaurantes.length,
        restaurantesManager.restaurantes.length
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
                restaurantesManager.setSearchTerm(query);
                const results = restaurantesManager.filterRestaurantes();
                renderRestaurantes(results, container);
                updateResultsCount(results.length, restaurantesManager.restaurantes.length);
            }, 300);
        });
    }

    // Event listener para limpar pesquisa
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                this.style.display = 'none';
                restaurantesManager.setSearchTerm('');
                const results = restaurantesManager.filterRestaurantes();
                renderRestaurantes(results, container);
                updateResultsCount(results.length, restaurantesManager.restaurantes.length);
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
            
            restaurantesManager.toggleFilter(filterType, filterValue);
            const results = restaurantesManager.filterRestaurantes();
            renderRestaurantes(results, container);
            updateResultsCount(results.length, restaurantesManager.restaurantes.length);
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
            restaurantesManager.clearFilters();
            const results = restaurantesManager.filterRestaurantes();
            renderRestaurantes(results, container);
            updateResultsCount(results.length, restaurantesManager.restaurantes.length);
        });
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de restaurantes
    if (document.getElementById('restaurantes-container')) {
        initializeRestaurantesPage();
    }
});
