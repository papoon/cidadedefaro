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
    button.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-star"></use></svg>';
    button.setAttribute('aria-pressed', String(isFav));
    
    button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const itemId = this.getAttribute('data-id');
        const isFavorite = favoritesManager.isFavorite(itemId);
        
        if (isFavorite) {
            favoritesManager.removeFavorite(itemId);
            this.classList.remove('is-favorite');
            this.setAttribute('aria-pressed', 'false');
            const addLabel = window.i18n?.t('favorites.add_to_favorites') || 'Adicionar aos favoritos';
            this.setAttribute('title', addLabel);
            this.setAttribute('aria-label', addLabel);
            const removedMsg = window.i18n?.t('favorites.removed_from_favorites') || 'Removido dos favoritos';
            showNotification(removedMsg, 'info');
        } else {
            favoritesManager.addFavorite(itemId, type, title, url, metadata);
            this.classList.add('is-favorite');
            this.setAttribute('aria-pressed', 'true');
            const removeLabel = window.i18n?.t('favorites.remove_from_favorites') || 'Remover dos favoritos';
            this.setAttribute('title', removeLabel);
            this.setAttribute('aria-label', removeLabel);
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

    const el = (tag, className, text) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    };

    const favorites = filterType
        ? favoritesManager.getFavoritesByType(filterType)
        : favoritesManager.getAllFavorites();

    container.replaceChildren();

    if (favorites.length === 0) {
        const emptyTitle = window.i18n?.t('favorites.empty_title') || 'Ainda não tem favoritos guardados.';
        const emptyDesc = window.i18n?.t('favorites.empty_description') || 'Adicione páginas, serviços e locais aos seus favoritos para acesso rápido!';
        const empty = el('div', 'empty-favorites');
        empty.append(el('p', '', emptyTitle), el('p', '', emptyDesc));
        container.appendChild(empty);
        return;
    }

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

    const addedOnText = window.i18n?.t('favorites.added_on') || 'Adicionado em';
    const removeText = window.i18n?.t('favorites.remove_button') || 'Remover';

    for (const [type, items] of Object.entries(grouped)) {
        if (items.length === 0) continue;

        const group = el('div', 'favorites-group');
        const heading = el('h3', '', typeLabels[type] + ' ');
        heading.appendChild(el('span', 'count', `(${items.length})`));
        const list = el('ul', 'favorites-list');

        items.forEach(item => {
            const li = el('li', 'favorite-item');
            li.dataset.id = item.id;

            const content = el('div', 'favorite-content');
            const info = el('div', 'favorite-info');
            const link = el('a', 'favorite-title', item.title);
            // Only allow relative / http(s) links (favorites come from localStorage)
            // Parse with the URL API (same normalisation the browser applies, so
            // " javascript:" / "java\tscript:" tricks can't slip past a regex)
            let safeHref = '#';
            try {
                const parsed = new URL(String(item.url || ''), window.location.href);
                if (parsed.protocol === 'http:' || parsed.protocol === 'https:') safeHref = parsed.href;
            } catch (e) { /* invalid URL: keep '#' */ }
            link.href = safeHref;
            const date = new Date(item.addedAt).toLocaleDateString(window.i18n?.getCurrentLanguage?.() === 'en' ? 'en-GB' : 'pt-PT');
            info.append(link, el('span', 'favorite-date', `${addedOnText} ${date}`));
            content.appendChild(info);

            const removeBtn = el('button', 'btn-remove-favorite', removeText);
            removeBtn.type = 'button';
            removeBtn.dataset.id = item.id;
            removeBtn.setAttribute('aria-label', `${removeText}: ${item.title}`);
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (favoritesManager.removeFavorite(item.id)) {
                    const removedMsg = window.i18n?.t('favorites.favorite_removed') || 'Favorito removido';
                    showNotification(removedMsg, 'info');
                    renderFavoritesList(container, filterType);
                }
            });

            li.append(content, removeBtn);
            list.appendChild(li);
        });

        group.append(heading, list);
        container.appendChild(group);
    }
}

// Exportar funções globalmente para uso em scripts inline
window.createFavoriteButton = createFavoriteButton;

// Export para testes (o ficheiro já é carregado como type="module")
export { FavoritesManager };

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar contador inicial
    favoritesManager.updateFavoritesCount();
    
    // Escutar evento de atualização de favoritos
    window.addEventListener('favoritesUpdated', function(e) {
        console.log('Favoritos atualizados:', e.detail.count);
    });
});
