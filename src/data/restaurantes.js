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
            const response = await fetch('assets/data/restaurantes.json');
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

/**
 * Renderiza cards de restaurantes
 */
function renderRestaurantes(restaurantes, container) {
    if (!container) return;

    if (restaurantes.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">😕</div>
                <h3>Nenhum estabelecimento encontrado</h3>
                <p>Tente ajustar os filtros ou termo de pesquisa</p>
            </div>
        `;
        return;
    }

    // Ícones por tipo
    const tipoIcons = {
        'Café': '☕',
        'Pastelaria': '🍰',
        'Restaurante': '🍽️'
    };

    let html = '<div class="restaurantes-grid">';

    restaurantes.forEach(rest => {
        const icon = tipoIcons[rest.tipo] || '🍽️';
        const destaque = rest.destaque ? `<span class="destaque-badge">${rest.destaque}</span>` : '';
        
        html += `
            <div class="restaurante-card" id="${rest.id}" data-id="${rest.id}">
                <div class="restaurante-header">
                    <div class="restaurante-icon" role="img" aria-label="Ícone ${rest.tipo}">${icon}</div>
                    <div class="restaurante-tipo">${rest.tipo}</div>
                    ${destaque}
                </div>
                
                <h3 class="restaurante-nome">${rest.nome}</h3>
                
                <div class="restaurante-info">
                    <div class="info-row">
                        <span class="info-label">📍 Morada:</span>
                        <span class="info-value">${rest.morada}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">🏷️ Categoria:</span>
                        <span class="info-value">${rest.categoria}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">📍 Zona:</span>
                        <span class="info-value">${rest.zona}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">⏰ Horário:</span>
                        <span class="info-value">${rest.horario}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">💰 Preço:</span>
                        <span class="info-value preco">${rest.preco}</span>
                    </div>
                    
                    ${rest.descricao ? `
                        <div class="restaurante-descricao">
                            <p>${rest.descricao}</p>
                        </div>
                    ` : ''}
                    
                    ${rest.telefone ? `
                        <div class="info-row">
                            <span class="info-label">📞 Telefone:</span>
                            <span class="info-value">${rest.telefone}</span>
                        </div>
                    ` : ''}
                </div>
                
                ${rest.mapsLink ? `
                    <div class="restaurante-actions">
                        <a href="${rest.mapsLink}" target="_blank" rel="noopener noreferrer" class="btn-map">
                            🗺️ Ver no Mapa
                        </a>
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Adicionar aos favoritos (integração com sistema existente)
    if (typeof createFavoriteButton === 'function') {
        container.querySelectorAll('.restaurante-card').forEach(card => {
            const id = card.getAttribute('data-id');
            const rest = restaurantes.find(r => r.id === id);
            if (rest) {
                const favoriteBtn = createFavoriteButton(
                    rest.id,
                    'restaurant',
                    rest.nome,
                    `restaurantes.html#${rest.id}`
                );
                favoriteBtn.style.position = 'absolute';
                favoriteBtn.style.top = '0.5rem';
                favoriteBtn.style.right = '0.5rem';
                card.style.position = 'relative';
                card.insertBefore(favoriteBtn, card.firstChild);
            }
        });
    }
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
        const errorMsg = window.i18n?.t('errors.load_restaurants') || '❌ Erro ao carregar dados dos estabelecimentos.';
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
