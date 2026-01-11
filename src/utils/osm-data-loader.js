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
 * Renderizar lista de POIs numa página
 * @param {Array} items - Array de itens a renderizar
 * @param {HTMLElement} container - Elemento container onde renderizar
 */
export function renderPOIList(items, container) {
  if (!items || items.length === 0) {
    container.innerHTML = '<p class="no-results">Nenhum resultado encontrado.</p>';
    return;
  }

  const listHTML = items.map(item => `
    <div class="poi-card" data-id="${item.id}">
      <h3 class="poi-name">${item.name}</h3>
      <p class="poi-category">${item.category}</p>
      ${item.address ? `<p class="poi-address">📍 ${item.address}</p>` : ''}
      <div class="poi-actions">
        <a href="https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}" 
           target="_blank" 
           rel="noopener noreferrer"
           class="btn-map">
          Ver no mapa
        </a>
        <button class="btn-favorite" data-id="${item.id}" aria-label="Adicionar aos favoritos">
          ⭐
        </button>
      </div>
    </div>
  `).join('');

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
 * Exemplo de uso: Carregar e exibir restaurantes
 */
export async function initRestaurantPage() {
  const container = document.getElementById('restaurants-list');
  const searchInput = document.getElementById('search-input');
  
  if (!container) {
    console.error('Container #restaurants-list não encontrado');
    return;
  }

  // Carregar dados
  const restaurants = await loadOSMData('restaurantes');
  
  // Renderizar todos os restaurantes
  renderPOIList(restaurants, container);

  // Adicionar filtro de pesquisa
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const filtered = filterPOIs(restaurants, e.target.value);
      renderPOIList(filtered, container);
    });
  }
}

/**
 * Exemplo de uso: Carregar e exibir cafés
 */
export async function initCafePage() {
  const container = document.getElementById('cafes-list');
  const searchInput = document.getElementById('search-input');
  
  if (!container) {
    console.error('Container #cafes-list não encontrado');
    return;
  }

  // Carregar dados
  const cafes = await loadOSMData('cafes');
  
  // Renderizar todos os cafés
  renderPOIList(cafes, container);

  // Adicionar filtro de pesquisa
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const filtered = filterPOIs(cafes, e.target.value);
      renderPOIList(filtered, container);
    });
  }
}

/**
 * Exemplo de uso: Carregar e exibir pastelarias
 */
export async function initBakeryPage() {
  const container = document.getElementById('bakeries-list');
  const searchInput = document.getElementById('search-input');
  
  if (!container) {
    console.error('Container #bakeries-list não encontrado');
    return;
  }

  // Carregar dados
  const bakeries = await loadOSMData('pastelarias');
  
  // Renderizar todas as pastelarias
  renderPOIList(bakeries, container);

  // Adicionar filtro de pesquisa
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const filtered = filterPOIs(bakeries, e.target.value);
      renderPOIList(filtered, container);
    });
  }
}

/**
 * Exemplo de uso: Carregar e exibir hotéis
 */
export async function initHotelPage() {
  const container = document.getElementById('hotels-list');
  const searchInput = document.getElementById('search-input');
  
  if (!container) {
    console.error('Container #hotels-list não encontrado');
    return;
  }

  // Carregar dados
  const hotels = await loadOSMData('hoteis');
  
  // Renderizar todos os hotéis
  renderPOIList(hotels, container);

  // Adicionar filtro de pesquisa
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const filtered = filterPOIs(hotels, e.target.value);
      renderPOIList(filtered, container);
    });
  }
}
