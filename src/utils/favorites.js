// favorites.js - Gestão de favoritos com LocalStorage

/**
 * Classe para gerir favoritos no LocalStorage
 */
class FavoritesManager {
    constructor() {
        this.storageKey = 'faroGuide_favorites';
        this.favorites = this.loadFavorites();
    }

    /**
     * Carrega favoritos do LocalStorage
     * @returns {Array} Array de favoritos
     */
    loadFavorites() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Erro ao carregar favoritos:', error);
            return [];
        }
    }

    /**
     * Guarda favoritos no LocalStorage
     */
    saveFavorites() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
            this.updateFavoritesCount();
            // Disparar evento customizado para atualizar UI
            window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
                detail: { count: this.favorites.length } 
            }));
        } catch (error) {
            console.error('Erro ao guardar favoritos:', error);
        }
    }

    /**
     * Adiciona item aos favoritos
     * @param {string} id - ID único do item
     * @param {string} type - Tipo: 'page', 'service', 'location'
     * @param {string} title - Título do item
     * @param {string} url - URL do item
     * @param {Object} metadata - Metadados adicionais (opcional)
     */
    addFavorite(id, type, title, url, metadata = {}) {
        // Verificar se já existe
        if (this.isFavorite(id)) {
            console.log('Item já está nos favoritos');
            return false;
        }

        const favorite = {
            id,
            type,
            title,
            url,
            metadata,
            addedAt: new Date().toISOString()
        };

        this.favorites.push(favorite);
        this.saveFavorites();
        console.log('Favorito adicionado:', title);
        return true;
    }

    /**
     * Remove item dos favoritos
     * @param {string} id - ID do item a remover
     * @returns {boolean} True se removido com sucesso, false caso contrário
     */
    removeFavorite(id) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(fav => fav.id !== id);
        
        if (this.favorites.length < initialLength) {
            this.saveFavorites();
            console.log('Favorito removido:', id);
            return true;
        }
        return false;
    }

    /**
     * Verifica se item está nos favoritos
     * @param {string} id - ID do item
     * @returns {boolean}
     */
    isFavorite(id) {
        return this.favorites.some(fav => fav.id === id);
    }

    /**
     * Obtém todos os favoritos
     * @returns {Array}
     */
    getAllFavorites() {
        return [...this.favorites];
    }

    /**
     * Obtém favoritos por tipo
     * @param {string} type - Tipo: 'page', 'service', 'location'
     * @returns {Array}
     */
    getFavoritesByType(type) {
        return this.favorites.filter(fav => fav.type === type);
    }

    /**
     * Limpa todos os favoritos
     */
    clearAllFavorites() {
        const confirmMsg = window.i18n?.t('favorites.confirm_clear_all') || 'Tem certeza que deseja remover todos os favoritos?';
        if (confirm(confirmMsg)) {
            this.favorites = [];
            this.saveFavorites();
            console.log('Todos os favoritos foram removidos');
            return true;
        }
        return false;
    }

    /**
     * Atualiza contador de favoritos na UI
     */
    updateFavoritesCount() {
        const countElement = document.getElementById('favorites-count');
        if (countElement) {
            const count = this.favorites.length;
            countElement.textContent = count;
            countElement.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    /**
     * Exporta favoritos como JSON
     * @returns {string}
     */
    exportFavorites() {
        return JSON.stringify(this.favorites, null, 2);
    }

    /**
     * Importa favoritos de JSON
     * @param {string} jsonData
     */
    importFavorites(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            if (Array.isArray(imported)) {
                this.favorites = imported;
                this.saveFavorites();
                return true;
            }
        } catch (error) {
            console.error('Erro ao importar favoritos:', error);
        }
        return false;
    }
}

// Instância global
const favoritesManager = new FavoritesManager();

/**
 * Cria botão de favorito
 * @param {string} id - ID do item
 * @param {string} type - Tipo do item
 * @param {string} title - Título do item
 * @param {string} url - URL do item
 * @param {Object} metadata - Metadados opcionais
 * @returns {HTMLElement}
 */
function createFavoriteButton(id, type, title, url, metadata = {}) {
    const button = document.createElement('button');
    button.className = 'btn-favorite';
    button.setAttribute('data-id', id);
    button.setAttribute('data-type', type);
    const addText = window.i18n?.t('favorites.add_to_favorites') || 'Adicionar aos favoritos';
    button.setAttribute('title', addText);
    button.setAttribute('aria-label', addText);
    
    const isFav = favoritesManager.isFavorite(id);
    button.classList.toggle('is-favorite', isFav);
    button.innerHTML = isFav ? '⭐' : '☆';
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const itemId = this.getAttribute('data-id');
        const isFavorite = favoritesManager.isFavorite(itemId);
        
        if (isFavorite) {
            favoritesManager.removeFavorite(itemId);
            this.classList.remove('is-favorite');
            this.innerHTML = '☆';
            const addLabel = window.i18n?.t('favorites.add_to_favorites') || 'Adicionar aos favoritos';
            this.setAttribute('title', addLabel);
            const removedMsg = window.i18n?.t('favorites.removed_from_favorites') || 'Removido dos favoritos';
            showNotification(removedMsg, 'info');
        } else {
            favoritesManager.addFavorite(itemId, type, title, url, metadata);
            this.classList.add('is-favorite');
            this.innerHTML = '⭐';
            const removeLabel = window.i18n?.t('favorites.remove_from_favorites') || 'Remover dos favoritos';
            this.setAttribute('title', removeLabel);
            const addedMsg = window.i18n?.t('favorites.added_to_favorites') || 'Adicionado aos favoritos';
            showNotification(addedMsg, 'success');
        }
    });
    
    return button;
}

/**
 * Mostra notificação temporária
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo: 'success', 'error', 'info'
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Renderiza lista de favoritos
 * @param {HTMLElement} container - Elemento onde renderizar
 * @param {string} filterType - Tipo para filtrar (opcional)
 */
function renderFavoritesList(container, filterType = null) {
    if (!container) return;
    
    const favorites = filterType 
        ? favoritesManager.getFavoritesByType(filterType)
        : favoritesManager.getAllFavorites();
    
    if (favorites.length === 0) {
        const emptyTitle = window.i18n?.t('favorites.empty_title') || 'Ainda não tem favoritos guardados.';
        const emptyDesc = window.i18n?.t('favorites.empty_description') || 'Adicione páginas, serviços e locais aos seus favoritos para acesso rápido!';
        container.innerHTML = `
            <div class="empty-favorites">
                <p>📌 ${emptyTitle}</p>
                <p>${emptyDesc}</p>
            </div>
        `;
        return;
    }
    
    // Agrupar por tipo
    const grouped = {
        page: favorites.filter(f => f.type === 'page'),
        service: favorites.filter(f => f.type === 'service'),
        location: favorites.filter(f => f.type === 'location')
    };
    
    const typeLabels = {
        page: window.i18n?.t('favorites.type_pages') || 'Páginas',
        service: window.i18n?.t('favorites.type_services') || 'Serviços',
        location: window.i18n?.t('favorites.type_locations') || 'Locais'
    };
    
    const typeIcons = {
        page: '📄',
        service: '🏢',
        location: '📍'
    };
    
    let html = '';
    
    for (const [type, items] of Object.entries(grouped)) {
        if (items.length === 0) continue;
        
        html += `
            <div class="favorites-group">
                <h3>${typeLabels[type]} <span class="count">(${items.length})</span></h3>
                <ul class="favorites-list">
        `;
        
        items.forEach(item => {
            const date = new Date(item.addedAt).toLocaleDateString('pt-PT');
            const addedOnText = window.i18n?.t('favorites.added_on') || 'Adicionado em';
            const removeText = window.i18n?.t('favorites.remove_button') || 'Remover';
            html += `
                <li class="favorite-item" data-id="${item.id}">
                    <div class="favorite-content">
                        <span class="favorite-icon">${typeIcons[type]}</span>
                        <div class="favorite-info">
                            <a href="${item.url}" class="favorite-title">${item.title}</a>
                            <span class="favorite-date">${addedOnText} ${date}</span>
                        </div>
                    </div>
                    <button class="btn-remove-favorite" data-id="${item.id}" title="${removeText}" aria-label="${removeText}">
                        🗑️
                    </button>
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Adicionar event listeners aos botões de remover
    container.querySelectorAll('.btn-remove-favorite').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = this.getAttribute('data-id');
            if (favoritesManager.removeFavorite(id)) {
                const removedMsg = window.i18n?.t('favorites.favorite_removed') || 'Favorito removido';
                showNotification(removedMsg, 'info');
                renderFavoritesList(container, filterType);
            }
        });
    });
}

// Exportar funções globalmente para uso em scripts inline
window.createFavoriteButton = createFavoriteButton;

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar contador inicial
    favoritesManager.updateFavoritesCount();
    
    // Escutar evento de atualização de favoritos
    window.addEventListener('favoritesUpdated', function(e) {
        console.log('Favoritos atualizados:', e.detail.count);
    });
});
