// mobilidade.js - Funcionalidades de mobilidade e cálculo de tempo

// Coordenadas dos pontos de interesse em Faro

const localizacoes = {
    centro: { lat: 37.0168, lng: -7.9351, nome: "Centro Histórico (Arco da Vila)" },
    estacao: { lat: 37.0191, lng: -7.9404, nome: "Estação de Comboios" },
    forum: { lat: 37.0288072, lng: -7.947712, nome: "Forum Algarve" },
    aeroporto: { lat: 37.0144, lng: -7.9659, nome: "Aeroporto de Faro" },
    hospital: { lat: 37.0247, lng: -7.9280, nome: "Hospital de Faro" },
    universidade: { lat: 37.0194, lng: -7.9322, nome: "Universidade do Algarve (Penha)" },
    praia: { lat: 36.9890, lng: -7.9697, nome: "Praia de Faro" },
    marina: { lat: 37.0154, lng: -7.9344, nome: "Marina de Faro" }
};

// Velocidades médias (km/h)
const velocidades = {
    pe: 5,        // 5 km/h a pé
    bicicleta: 15 // 15 km/h de bicicleta
};

let mapaRota = null;
let mapaRotaInicializado = false;

// Função para calcular distância entre dois pontos (fórmula de Haversine)
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distância em km
    
    return distancia;
}

// Função para formatar tempo em minutos ou horas
function formatarTempo(minutos) {
    if (minutos < 60) {
        return Math.round(minutos) + ' min';
    } else {
        const horas = Math.floor(minutos / 60);
        const mins = Math.round(minutos % 60);
        if (mins === 0) {
            return horas + ' h';
        }
        return horas + ' h ' + mins + ' min';
    }
}

// Função para formatar distância
function formatarDistancia(km) {
    if (km < 1) {
        return Math.round(km * 1000) + ' m';
    } else {
        return km.toFixed(2) + ' km';
    }
}

// Função para mostrar mensagem de erro
function mostrarErro(mensagem) {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = `
        <div style="background: #fdddd8; border: 2px solid #c0392b; border-radius: 8px; padding: 1.5rem; text-align: center; color: #72352c;">
            <strong>⚠️ ${mensagem}</strong>
        </div>
    `;
    resultsContainer.classList.add('active');
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Função principal para calcular tempo de viagem
function calcularTempo() {
    const origemId = document.getElementById('origem').value;
    const destinoId = document.getElementById('destino').value;

    // Validação
    if (!origemId || !destinoId) {
        mostrarErro('Por favor, selecione origem e destino.');
        return;
    }

    if (origemId === destinoId) {
        mostrarErro('Origem e destino não podem ser o mesmo local.');
        return;
    }

    const origem = localizacoes[origemId];
    const destino = localizacoes[destinoId];

    // Calcular distância em linha reta
    const distanciaReta = calcularDistancia(
        origem.lat, origem.lng,
        destino.lat, destino.lng
    );

    // Fator de correção para considerar ruas (aproximadamente 1.3x a distância em linha reta)
    // Este fator compensa o facto de que as rotas reais seguem ruas e não são linhas retas
    const fatorRua = 1.3;
    const distanciaReal = distanciaReta * fatorRua;

    // Calcular tempos
    const tempoPe = (distanciaReal / velocidades.pe) * 60; // em minutos
    const tempoBicicleta = (distanciaReal / velocidades.bicicleta) * 60; // em minutos

    // Atualizar interface
    const resultsContainer = document.getElementById('results');
    
    // Restaurar estrutura de resultados se necessário (caso tenha sido substituída por erro)
    if (!document.getElementById('tempo-pe')) {
        resultsContainer.innerHTML = `
            <div class="result-card">
                <h4>🚶‍♂️ A pé</h4>
                <div class="result-info">
                    <div class="result-item">
                        <div class="result-label">Tempo estimado</div>
                        <div class="result-value" id="tempo-pe">--</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Distância</div>
                        <div class="result-value" id="distancia-pe">--</div>
                    </div>
                </div>
            </div>

            <div class="result-card">
                <h4>🚴‍♂️ De bicicleta</h4>
                <div class="result-info">
                    <div class="result-item">
                        <div class="result-label">Tempo estimado</div>
                        <div class="result-value" id="tempo-bicicleta">--</div>
                    </div>
                    <div class="result-item">
                        <div class="result-label">Distância</div>
                        <div class="result-value" id="distancia-bicicleta">--</div>
                    </div>
                </div>
            </div>

            <div id="mapa-rota" class="map-container"></div>
        `;
    }
    
    document.getElementById('tempo-pe').textContent = formatarTempo(tempoPe);
    document.getElementById('distancia-pe').textContent = formatarDistancia(distanciaReal);
    
    document.getElementById('tempo-bicicleta').textContent = formatarTempo(tempoBicicleta);
    document.getElementById('distancia-bicicleta').textContent = formatarDistancia(distanciaReal);

    // Mostrar resultados
    resultsContainer.classList.add('active');

    // Scroll suave para os resultados
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Inicializar e atualizar mapa
    inicializarMapaRota(origem, destino);
}

// Função para inicializar o mapa de rota
function inicializarMapaRota(origem, destino) {
    const mapaElemento = document.getElementById('mapa-rota');
    
    if (!mapaElemento) {
        console.error('Elemento do mapa não encontrado');
        return;
    }

    // Verificar se Leaflet está carregado
    if (typeof L === 'undefined') {
        console.error('Leaflet não carregado');
        return;
    }

    // Se o mapa já existe, removê-lo
    if (mapaRota) {
        mapaRota.remove();
        mapaRota = null;
        mapaRotaInicializado = false;
    }

    try {
        // Calcular centro do mapa (ponto médio)
        const centroLat = (origem.lat + destino.lat) / 2;
        const centroLng = (origem.lng + destino.lng) / 2;

        // Criar o mapa
        mapaRota = L.map('mapa-rota').setView([centroLat, centroLng], 13);

        // Adicionar camada de tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(mapaRota);

        // Criar ícone personalizado para origem (verde)
        const iconeOrigem = L.divIcon({
            html: '<div style="background-color: #1dac48; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;">🏁</div>',
            className: 'custom-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        // Criar ícone personalizado para destino (vermelho)
        const iconeDestino = L.divIcon({
            html: '<div style="background-color: #c0392b; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 3px solid white;">🎯</div>',
            className: 'custom-icon',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });

        // Adicionar marcadores
        const marcadorOrigem = L.marker([origem.lat, origem.lng], { icon: iconeOrigem }).addTo(mapaRota);
        marcadorOrigem.bindPopup(`<strong>Origem</strong><br>${origem.nome}`);

        const marcadorDestino = L.marker([destino.lat, destino.lng], { icon: iconeDestino }).addTo(mapaRota);
        marcadorDestino.bindPopup(`<strong>Destino</strong><br>${destino.nome}`);

        // Adicionar linha entre origem e destino
        const linha = L.polyline([
            [origem.lat, origem.lng],
            [destino.lat, destino.lng]
        ], {
            color: '#146a8c',
            weight: 4,
            opacity: 0.7,
            dashArray: '10, 10'
        }).addTo(mapaRota);

        // Ajustar zoom para mostrar ambos os pontos
        const bounds = L.latLngBounds([
            [origem.lat, origem.lng],
            [destino.lat, destino.lng]
        ]);
        mapaRota.fitBounds(bounds, { padding: [50, 50] });

        mapaRotaInicializado = true;
        console.log('Mapa de rota inicializado com sucesso');
    } catch (erro) {
        console.error('Erro ao inicializar mapa de rota:', erro);
    }
}

// Inicializar eventos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar listeners para os selectores
    const selectOrigem = document.getElementById('origem');
    const selectDestino = document.getElementById('destino');

    if (selectOrigem && selectDestino) {
        // Esconder resultados quando mudar a seleção
        selectOrigem.addEventListener('change', function() {
            document.getElementById('results').classList.remove('active');
        });

        selectDestino.addEventListener('change', function() {
            document.getElementById('results').classList.remove('active');
        });
    }

    // Adicionar listener para o botão de calcular
    const btnCalcular = document.getElementById('btn-calcular');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', calcularTempo);
    }
});
