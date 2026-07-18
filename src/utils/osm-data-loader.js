/**
 * Módulo para carregar e exibir dados do OpenStreetMap
 * 
 * Este módulo carrega dados estáticos de JSON e fornece funções
 * para exibir cafés, restaurantes, pastelarias e hotéis em Faro.
 */

/**
 * Carregar dados de uma categoria do JSON
 * @param {string} category - Nome da categoria (cafes, restaurantes, pastelarias, hoteis)
 * @returns {Promise<Array>} Array com os dados da categoria
 */
export async function loadOSMData(category) {
  try {
    const response = await fetch(`./assets/data/osm-${category}.json`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar dados: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro ao carregar ${category}:`, error);
    return [];
  }
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Renderizar lista de POIs numa página
 * @param {Array} items - Array de itens a renderizar
 * @param {HTMLElement} container - Elemento container onde renderizar
 */
export function renderPOIList(items, container) {
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhum resultado encontrado.</p>';
    return;
  }

  const listHTML = items.map(item => {
    const name = escapeHTML(item.name);
    const category = escapeHTML(item.category);
    const address = item.address ? escapeHTML(item.address) : null;
    
    return `
    <div class="poi-card" data-id="${escapeHTML(item.id)}">
      <h3 class="poi-name">${name}</h3>
      <p class="poi-category">${category}</p>
      ${address ? `<p class="poi-address">📍 ${address}</p>` : ''}
      <div class="poi-actions">
        <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="btn-map">
          Ver no mapa
        </a>
        <button class="btn-favorite" data-id="${escapeHTML(item.id)}" aria-label="Adicionar aos favoritos">
          ⭐
        </button>
      </div>
    </div>
  `;
  }).join('');

  container.innerHTML = listHTML;
}

/**
 * Filtrar POIs por texto de pesquisa
 * @param {Array} items - Array de itens a filtrar
 * @param {string} searchText - Texto de pesquisa
 * @returns {Array} Array filtrado
 */
export function filterPOIs(items, searchText) {
  if (!searchText || searchText.trim() === '') {
    return items;
  }

  const search = searchText.toLowerCase().trim();
  return items.filter(item => 
    item.name.toLowerCase().includes(search) ||
    (item.address && item.address.toLowerCase().includes(search))
  );
}

/**
 * Inicializar página de POIs (genérico)
 * @param {string} category - Categoria a carregar (cafes, restaurantes, pastelarias, hoteis)
 * @param {string} containerId - ID do container onde renderizar
 * @param {string} searchInputId - ID do input de pesquisa (opcional)
 */
export async function initPOIPage(category, containerId, searchInputId = 'search-input') {
  const container = document.getElementById(containerId);
  const searchInput = document.getElementById(searchInputId);
  
  if (!container) {
    console.error(`Container #${containerId} não encontrado`);
    return;
  }

  // Carregar dados
  const items = await loadOSMData(category);
  
  // Renderizar todos os itens
  renderPOIList(items, container);

  // Adicionar filtro de pesquisa
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const filtered = filterPOIs(items, e.target.value);
      renderPOIList(filtered, container);
    });
  }
}

/**
 * Exemplo de uso: Carregar e exibir restaurantes
 */
export async function initRestaurantPage() {
  return initPOIPage('restaurantes', 'restaurants-list');
}

/**
 * Exemplo de uso: Carregar e exibir cafés
 */
export async function initCafePage() {
  return initPOIPage('cafes', 'cafes-list');
}

/**
 * Exemplo de uso: Carregar e exibir pastelarias
 */
export async function initBakeryPage() {
  return initPOIPage('pastelarias', 'bakeries-list');
}

/**
 * Exemplo de uso: Carregar e exibir hotéis
 */
export async function initHotelPage() {
  return initPOIPage('hoteis', 'hotels-list');
}
