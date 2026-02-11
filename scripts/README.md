# Atualização Automática de Dados OSM

Este diretório contém o script Node.js responsável por atualizar automaticamente os dados do OpenStreetMap (OSM) sobre cafés, restaurantes, pastelarias e hotéis em Faro.

## 📋 Visão Geral

O script `update-osm-data.js` faz o seguinte:

1. Consulta a **Overpass API** do OpenStreetMap
2. Obtém dados de POIs (Points of Interest) num raio de 5 km do centro de Faro
3. Processa e formata os dados em JSON
4. Guarda os ficheiros em `assets/data/`

## 🗺️ Categorias de Dados

| Categoria | Tag OSM | Ficheiro de Saída |
|-----------|---------|-------------------|
| Cafés | `amenity=cafe` | `osm-cafes.json` |
| Restaurantes | `amenity=restaurant` | `osm-restaurantes.json` |
| Pastelarias | `shop=bakery` | `osm-pastelarias.json` |
| Hotéis | `tourism=hotel` | `osm-hoteis.json` |

## 📍 Área de Cobertura

- **Centro**: Faro (37.0194, -7.9322)
- **Raio**: 5 km

## 🔧 Como Usar

### Executar Manualmente

```bash
npm run update-osm-data
```

### Executar via GitHub Actions

O script é executado automaticamente:
- **Agendamento**: 1x por mês (dia 1 às 00:00 UTC)
- **Manual**: Através do botão "Run workflow" no GitHub Actions

## 📦 Formato dos Dados

Cada ficheiro JSON contém um array de objetos com a seguinte estrutura:

```json
{
  "id": "osm-node-123456",
  "name": "Nome do Estabelecimento",
  "address": "Rua Exemplo, 123, Faro",
  "lat": 37.0194,
  "lng": -7.9322,
  "category": "restaurantes",
  "osm_id": 123456,
  "osm_type": "node"
}
```

### Campos

- `id`: Identificador único (formato: `osm-{type}-{osm_id}`)
- `name`: Nome do estabelecimento
- `address`: Endereço (quando disponível)
- `lat`: Latitude
- `lng`: Longitude
- `category`: Categoria do POI
- `osm_id`: ID original do OpenStreetMap
- `osm_type`: Tipo do elemento OSM (node, way, relation)

## 🤖 Automação (GitHub Actions)

O workflow `.github/workflows/update-osm-data.yml` executa:

1. ✅ Checkout do repositório
2. ✅ Setup do Node.js
3. ✅ Instalação de dependências
4. ✅ Execução do script de atualização
5. ✅ Verificação de mudanças nos ficheiros JSON
6. ✅ Commit e push das alterações (se houver)
7. ✅ Build e deploy para GitHub Pages (se houver mudanças)

## 📖 Utilização no Frontend

Para usar os dados no frontend, consulte o módulo `src/utils/osm-data-loader.js`:

```javascript
import { loadOSMData, renderPOIList } from './utils/osm-data-loader.js';

// Carregar restaurantes
const restaurants = await loadOSMData('restaurantes');

// Renderizar numa página
const container = document.getElementById('restaurants-list');
renderPOIList(restaurants, container);
```

## ⚖️ Licença e Atribuição

Os dados são provenientes do **OpenStreetMap** e estão licenciados sob a **Open Database License (ODbL)**.

**É obrigatório incluir a seguinte atribuição:**

```
Dados © OpenStreetMap contributors
```

Esta atribuição já está incluída no footer do site através do ficheiro `src/partials/footer.html`.

## 🔗 Links Úteis

- [OpenStreetMap](https://www.openstreetmap.org)
- [Overpass API](https://overpass-api.de/)
- [Overpass Turbo (testar queries)](https://overpass-turbo.eu/)
- [OpenStreetMap Copyright](https://www.openstreetmap.org/copyright)
- [ODbL License](https://opendatacommons.org/licenses/odbl/)

## 🐛 Resolução de Problemas

### O script falha com "fetch failed"

- Verifique a ligação à internet
- A Overpass API pode estar temporariamente indisponível
- Tente novamente mais tarde

### Nenhum dado é retornado

- Verifique as coordenadas e o raio de busca
- Confirme que as tags OSM estão corretas
- Teste a query no [Overpass Turbo](https://overpass-turbo.eu/)

### GitHub Action não faz deploy

- Verifique que há mudanças nos ficheiros JSON
- Confirme as permissões do workflow (contents: write, pages: write)
- Verifique os logs do GitHub Actions para erros
