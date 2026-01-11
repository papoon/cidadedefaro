#!/usr/bin/env node

/**
 * Script para atualizar dados do OpenStreetMap via Overpass API
 * 
 * Este script consulta a Overpass API para obter POIs (Points of Interest)
 * na cidade de Faro, Portugal, dentro de um raio de 5 km do centro.
 * 
 * Categorias:
 * - Cafés (amenity=cafe)
 * - Restaurantes (amenity=restaurant)
 * - Pastelarias (shop=bakery)
 * - Hotéis (tourism=hotel)
 * 
 * Os dados são guardados em ficheiros JSON estáticos em assets/data/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Coordenadas do centro de Faro
const FARO_CENTER = {
  lat: 37.0194,
  lng: -7.9322
};

// Raio de busca em metros (5 km)
const SEARCH_RADIUS = 5000;

// URL da Overpass API
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

/**
 * Construir query Overpass QL para uma categoria específica
 */
function buildOverpassQuery(category, tag) {
  return `
    [out:json][timeout:25];
    (
      node["${tag}"](around:${SEARCH_RADIUS},${FARO_CENTER.lat},${FARO_CENTER.lng});
      way["${tag}"](around:${SEARCH_RADIUS},${FARO_CENTER.lat},${FARO_CENTER.lng});
      relation["${tag}"](around:${SEARCH_RADIUS},${FARO_CENTER.lat},${FARO_CENTER.lng});
    );
    out center;
  `;
}

/**
 * Fazer request à Overpass API
 */
async function fetchFromOverpass(query) {
  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    body: query,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Processar elementos do OSM e converter para o formato desejado
 */
function processElements(elements, category) {
  return elements
    .map(element => {
      // Obter coordenadas
      let lat, lng;
      if (element.type === 'node') {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center) {
        lat = element.center.lat;
        lng = element.center.lon;
      } else {
        return null; // Ignorar elementos sem coordenadas
      }

      // Extrair nome
      const name = element.tags?.name || 'Sem nome';

      // Extrair endereço (quando disponível)
      const addressParts = [];
      if (element.tags?.['addr:street']) {
        addressParts.push(element.tags['addr:street']);
      }
      if (element.tags?.['addr:housenumber']) {
        addressParts.push(element.tags['addr:housenumber']);
      }
      if (element.tags?.['addr:city']) {
        addressParts.push(element.tags['addr:city']);
      }
      const address = addressParts.length > 0 ? addressParts.join(', ') : null;

      return {
        id: `osm-${element.type}-${element.id}`,
        name: name,
        address: address,
        lat: lat,
        lng: lng,
        category: category,
        osm_id: element.id,
        osm_type: element.type
      };
    })
    .filter(item => item !== null && item.name !== 'Sem nome'); // Filtrar elementos inválidos
}

/**
 * Atualizar dados de uma categoria
 */
async function updateCategory(categoryName, tag, outputFile) {
  console.log(`\n🔍 A obter dados de ${categoryName}...`);

  try {
    const query = buildOverpassQuery(categoryName, tag);
    const data = await fetchFromOverpass(query);

    console.log(`✓ Recebidos ${data.elements.length} elementos de ${categoryName}`);

    // Usar o nome do ficheiro sem extensão como categoria para consistência
    const categoryId = outputFile.replace('osm-', '').replace('.json', '');
    const processedData = processElements(data.elements, categoryId);
    console.log(`✓ Processados ${processedData.length} ${categoryName} válidos`);

    // Ordenar por nome
    processedData.sort((a, b) => a.name.localeCompare(b.name, 'pt'));

    // Guardar ficheiro JSON
    const outputPath = path.join(__dirname, '..', 'assets', 'data', outputFile);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2), 'utf-8');

    console.log(`✓ Guardado em ${outputFile}`);

    return processedData.length;
  } catch (error) {
    console.error(`✗ Erro ao atualizar ${categoryName}:`, error.message);
    throw error;
  }
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Iniciando atualização de dados do OpenStreetMap...');
  console.log(`📍 Centro: Faro (${FARO_CENTER.lat}, ${FARO_CENTER.lng})`);
  console.log(`📏 Raio: ${SEARCH_RADIUS / 1000} km`);

  const categories = [
    { name: 'cafés', tag: 'amenity=cafe', file: 'osm-cafes.json' },
    { name: 'restaurantes', tag: 'amenity=restaurant', file: 'osm-restaurantes.json' },
    { name: 'pastelarias', tag: 'shop=bakery', file: 'osm-pastelarias.json' },
    { name: 'hotéis', tag: 'tourism=hotel', file: 'osm-hoteis.json' }
  ];

  let totalItems = 0;

  for (const category of categories) {
    try {
      const count = await updateCategory(category.name, category.tag, category.file);
      totalItems += count;

      // Pequena pausa entre requests para não sobrecarregar a API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Falha ao processar ${category.name}`);
      // Continuar com as outras categorias
    }
  }

  console.log(`\n✅ Atualização concluída!`);
  console.log(`📊 Total: ${totalItems} itens processados`);
  console.log(`📅 Data: ${new Date().toISOString()}`);
  console.log(`\n⚖️ Dados © OpenStreetMap contributors (ODbL)`);
}

// Executar script
main().catch(error => {
  console.error('\n❌ Erro fatal:', error);
  process.exit(1);
});
