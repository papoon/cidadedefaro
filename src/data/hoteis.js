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

// Ícones por tipo (constantes)
const TIPO_ICONS = {
    'Hotel': '🏨',
    'Hostel': '🏠',
    'Alojamento Local': '🏡',
    'Apartamento': '🏢'
};

// Ícones de serviços (constantes)
const SERVICO_ICONS = {
    'Pequeno-almoço': '🍳',
    'Wi-Fi': '📶',
    'Estacionamento': '🅿️',
    'Piscina': '🏊',
    'Cozinha': '🍴',
    'Cozinha Partilhada': '🍴'
};

/**
 * Renderiza cards de hotéis
 */
function renderHoteis(hoteis, container) {
    if (!container) return;

    if (hoteis.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🏨</div>
                <h3>Nenhum alojamento encontrado</h3>
                <p>Tente ajustar os filtros ou termo de pesquisa</p>
            </div>
        `;
        return;
    }

    let html = '<div class="hoteis-grid">';

    hoteis.forEach(hotel => {
        const icon = TIPO_ICONS[hotel.tipo] || '🏨';
        const destaque = hotel.destaque ? `<span class="destaque-badge">${hotel.destaque}</span>` : '';
        const stars = '⭐'.repeat(parseInt(hotel.classificacao, 10));
        
        // Renderizar serviços com ícones
        let servicosHtml = '';
        if (hotel.servicos && hotel.servicos.length > 0) {
            servicosHtml = '<div class="hotel-servicos">';
            hotel.servicos.forEach(servico => {
                const servicoIcon = SERVICO_ICONS[servico] || '✓';
                servicosHtml += `<span class="servico-badge" title="${servico}">${servicoIcon} ${servico}</span>`;
            });
            servicosHtml += '</div>';
        }
        
        html += `
            <div class="hotel-card" id="${hotel.id}" data-id="${hotel.id}">
                <div class="hotel-header">
                    <div class="hotel-icon" role="img" aria-label="Ícone ${hotel.tipo}">${icon}</div>
                    <div class="hotel-tipo">${hotel.tipo}</div>
                    ${destaque}
                </div>
                
                <h3 class="hotel-nome">${hotel.nome}</h3>
                
                <div class="hotel-info">
                    <div class="info-row">
                        <span class="info-label">⭐ Classificação:</span>
                        <span class="info-value classificacao">${stars} (${hotel.classificacao} estrelas)</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">📍 Zona:</span>
                        <span class="info-value">${hotel.zona}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">📍 Morada:</span>
                        <span class="info-value">${hotel.morada}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">💰 Preço por noite:</span>
                        <span class="info-value preco">${hotel.preco}</span>
                    </div>
                    
                    ${hotel.descricao ? `
                        <div class="hotel-descricao">
                            <p>${hotel.descricao}</p>
                        </div>
                    ` : ''}
                    
                    ${servicosHtml}
                    
                    ${hotel.telefone ? `
                        <div class="info-row">
                            <span class="info-label">📞 Telefone:</span>
                            <span class="info-value">${hotel.telefone}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="hotel-actions">
                    ${hotel.mapsLink ? `
                        <a href="${hotel.mapsLink}" target="_blank" rel="noopener noreferrer" class="btn-map">
                            🗺️ Ver no Mapa
                        </a>
                    ` : ''}
                    ${hotel.website ? `
                        <a href="${hotel.website}" target="_blank" rel="noopener noreferrer" class="btn-website">
                            🌐 Website
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;

    // Adicionar aos favoritos (integração com sistema existente)
    if (typeof createFavoriteButton === 'function') {
        container.querySelectorAll('.hotel-card').forEach(card => {
            const id = card.getAttribute('data-id');
            const hotel = hoteis.find(h => h.id === id);
            if (hotel) {
                const favoriteBtn = createFavoriteButton(
                    hotel.id,
                    'hotel',
                    hotel.nome,
                    `hoteis.html#${hotel.id}`
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
