// mapa.js - Funcionalidades relacionadas com mapas

// Coordenadas de Faro, Portugal
const FARO_COORDENADAS = {
    lat: 37.0194,
    lng: -7.9322
};

// Variável para armazenar a instância do mapa
let mapa = null;

// Função para inicializar mapa
function inicializarMapa() {
    // Verifica se o elemento do mapa existe
    const mapaElemento = document.getElementById('mapa');
    if (!mapaElemento) {
        console.error('Elemento do mapa não encontrado');
        return;
    }

    // Verifica se Leaflet está carregado
    if (typeof L === 'undefined') {
        console.error('Leaflet não carregado. Verifique a conexão com o CDN.');
        return;
    }

    try {
        // Cria o mapa centrado em Faro
        mapa = L.map('mapa').setView([FARO_COORDENADAS.lat, FARO_COORDENADAS.lng], 13);

        // Adiciona camada de tiles do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            minZoom: 10
        }).addTo(mapa);

        // Adiciona marcador principal em Faro
        const marcador = L.marker([FARO_COORDENADAS.lat, FARO_COORDENADAS.lng]).addTo(mapa);

        // Adiciona popup informativo ao marcador
        marcador.bindPopup(`
            <div style="text-align: center;">
                <strong>Faro</strong><br>
                Capital do Algarve<br>
                <em>Bem-vindo a Faro!</em>
            </div>
        `).openPopup();

        console.log('Mapa inicializado com sucesso');
    } catch (erro) {
        console.error('Erro ao inicializar o mapa:', erro);
    }
}

// Função para adicionar marcador
function adicionarMarcador(latitude, longitude, titulo, descricao = '') {
    if (!mapa) {
        console.error('Mapa não inicializado');
        return null;
    }

    const marcador = L.marker([latitude, longitude]).addTo(mapa);
    
    if (titulo || descricao) {
        const popupContent = `
            <div style="text-align: center;">
                ${titulo ? `<strong>${titulo}</strong><br>` : ''}
                ${descricao ? `${descricao}` : ''}
            </div>
        `;
        marcador.bindPopup(popupContent);
    }

    console.log(`Marcador adicionado: ${titulo} em ${latitude}, ${longitude}`);
    return marcador;
}

// Inicializar mapa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarMapa);
} else {
    // DOM já está pronto
    inicializarMapa();
}
