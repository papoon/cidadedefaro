// mapa.js - Funcionalidades relacionadas com mapas

// Coordenadas de Faro, Portugal
const FARO_COORDENADAS = {
    lat: 37.0194,
    lng: -7.9322
};

// Configurações de timeout para requisições
const FETCH_TIMEOUT_MS = 20000; // 20 segundos
// Deriva o timeout do Overpass a partir do timeout de fetch (em segundos), com uma margem
// de 5s para que o servidor possa responder com o seu próprio timeout antes do cliente abortar
const OVERPASS_TIMEOUT_S = Math.max(5, Math.floor(FETCH_TIMEOUT_MS / 1000) - 5);
const TOTAL_SERVICE_TYPES = 4; // Número total de tipos de serviços

// Variável para armazenar a instância do mapa
let mapa = null;
let mapaInicializado = false;
let marcadorUsuario = null;
let grupoMarcadoresServicos = null;

// Configuração de ícones personalizados para cada tipo de serviço
const iconesServicos = {
    farmacias: {
        icon: '💊',
        color: '#1dac48',
        nome: 'Farmácia'
    },
    hospitais: {
        icon: '🏥',
        color: '#c0392b',
        nome: 'Hospital'
    },
    multibancos: {
        icon: '🏧',
        color: '#42beef',
        nome: 'Multibanco'
    },
    supermercados: {
        icon: '🛒',
        color: '#d98324',
        nome: 'Supermercado'
    }
};

// Função para criar ícone personalizado
function criarIconePersonalizado(emoji, cor) {
    return L.divIcon({
        html: `<div style="background-color: ${cor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); border: 2px solid white;">${emoji}</div>`,
        className: 'emoji-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
}

// Função para inicializar mapa
function inicializarMapa() {
    // Previne inicialização duplicada
    if (mapaInicializado) {
        return;
    }

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

        // Inicializa grupo de marcadores de serviços
        grupoMarcadoresServicos = L.layerGroup().addTo(mapa);

        mapaInicializado = true;
        console.log('Mapa inicializado com sucesso');

        // Configurar event listeners para os controles
        configurarControlesServicos();
    } catch (erro) {
        console.error('Erro ao inicializar o mapa:', erro);
    }
}

// Função para configurar os controles de serviços
function configurarControlesServicos() {
    const btnLocalizacao = document.getElementById('btn-localizacao');
    const filtrosContainer = document.getElementById('filtros-servicos');

    if (btnLocalizacao) {
        btnLocalizacao.addEventListener('click', obterLocalizacaoUsuario);
    }

    // Adicionar listeners aos checkboxes de filtros
    const checkboxes = ['filtro-farmacias', 'filtro-hospitais', 'filtro-multibancos', 'filtro-supermercados'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.addEventListener('change', atualizarServicosVisiveis);
        }
    });
}

// Função para obter localização do usuário
function obterLocalizacaoUsuario() {
    const btnLocalizacao = document.getElementById('btn-localizacao');
    const filtrosContainer = document.getElementById('filtros-servicos');

    if (!navigator.geolocation) {
        alert('Geolocalização não é suportada pelo seu navegador.');
        return;
    }

    // Atualizar texto do botão
    btnLocalizacao.textContent = '🔄 Obtendo localização...';
    btnLocalizacao.disabled = true;

    navigator.geolocation.getCurrentPosition(
        // Sucesso
        function(posicao) {
            const lat = posicao.coords.latitude;
            const lng = posicao.coords.longitude;

            console.log(`Localização obtida: ${lat}, ${lng}`);

            // Remover marcador anterior do usuário se existir
            if (marcadorUsuario) {
                mapa.removeLayer(marcadorUsuario);
            }

            // Criar ícone para localização do usuário
            const iconeUsuario = L.divIcon({
                html: '<div style="background-color: #146a8c; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>',
                className: 'user-location-icon',
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            // Adicionar marcador na localização do usuário
            marcadorUsuario = L.marker([lat, lng], { icon: iconeUsuario }).addTo(mapa);
            marcadorUsuario.bindPopup('<strong>Você está aqui</strong>').openPopup();

            // Centralizar mapa na localização do usuário
            mapa.setView([lat, lng], 15);

            // Buscar serviços próximos
            buscarServicosProximos(lat, lng);

            // Mostrar filtros
            filtrosContainer.style.display = 'flex';

            // Restaurar botão
            btnLocalizacao.textContent = '✓ Localização obtida';
            btnLocalizacao.disabled = false;
        },
        // Erro
        function(erro) {
            console.error('Erro ao obter localização:', erro);
            
            let mensagem = 'Não foi possível obter sua localização.';
            switch(erro.code) {
                case erro.PERMISSION_DENIED:
                    mensagem = 'Permissão de localização negada. Por favor, permita o acesso à sua localização nas configurações do navegador.';
                    break;
                case erro.POSITION_UNAVAILABLE:
                    mensagem = 'Informação de localização indisponível.';
                    break;
                case erro.TIMEOUT:
                    mensagem = 'Tempo esgotado ao tentar obter localização.';
                    break;
            }
            
            alert(mensagem);
            
            // Restaurar botão
            btnLocalizacao.textContent = '📍 Tentar novamente';
            btnLocalizacao.disabled = false;
        },
        // Opções
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Função para buscar serviços próximos usando Overpass API
async function buscarServicosProximos(lat, lng) {
    // Raio de busca em metros (2km)
    const raio = 2000;

    // Limpar marcadores existentes
    grupoMarcadoresServicos.clearLayers();

    // Helper para buscar serviço com tratamento de erro
    const buscarComTratamento = (chave, valor, tipo, nomeTipo) => {
        return buscarServico(lat, lng, raio, chave, valor, tipo).catch(e => {
            console.warn(`Falha ao buscar ${nomeTipo}:`, e.message);
            return null;
        });
    };

    try {
        // Buscar todos os tipos de serviços em paralelo
        const promessas = [
            buscarComTratamento('amenity', 'pharmacy', 'farmacias', 'farmácias'),
            buscarComTratamento('amenity', 'hospital', 'hospitais', 'hospitais'),
            buscarComTratamento('amenity', 'atm', 'multibancos', 'multibancos'),
            buscarComTratamento('shop', 'supermarket', 'supermercados', 'supermercados')
        ];

        const resultados = await Promise.all(promessas);
        const sucessos = resultados.filter(r => r !== null).length;
        
        if (sucessos === 0) {
            throw new Error('Não foi possível carregar nenhum serviço');
        }
        
        if (sucessos < TOTAL_SERVICE_TYPES) {
            alert(`Alguns serviços não puderam ser carregados. Mostrando ${sucessos} de ${TOTAL_SERVICE_TYPES} tipos de serviços.`);
        }
        
        console.log(`Serviços carregados: ${sucessos} de ${TOTAL_SERVICE_TYPES} tipos`);
    } catch (erro) {
        console.error('Erro ao buscar serviços:', erro);
        alert('Erro ao buscar serviços próximos. Por favor, tente novamente.');
    }
}

// Função para buscar um tipo específico de serviço
async function buscarServico(lat, lng, raio, chave, valor, tipo) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    // Query Overpass QL
    const query = `
        [out:json][timeout:${OVERPASS_TIMEOUT_S}];
        (
            node["${chave}"="${valor}"](around:${raio},${lat},${lng});
            way["${chave}"="${valor}"](around:${raio},${lat},${lng});
        );
        out center;
    `;

    // Criar AbortController para controle de timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
        const resposta = await fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: 'data=' + encodeURIComponent(query),
            signal: controller.signal
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }

        const dados = await resposta.json();
        console.log(`${tipo}: ${dados.elements.length} encontrado(s)`);

        // Adicionar marcadores ao mapa
        dados.elements.forEach(elemento => {
            const lat = elemento.lat || elemento.center?.lat;
            const lng = elemento.lon || elemento.center?.lon;

            if (lat && lng) {
                const config = iconesServicos[tipo];
                const icone = criarIconePersonalizado(config.icon, config.color);
                
                const nome = elemento.tags?.name || config.nome;
                const endereco = elemento.tags?.['addr:street'] || '';
                const numero = elemento.tags?.['addr:housenumber'] || '';
                
                const marcador = L.marker([lat, lng], { 
                    icon: icone
                }).addTo(grupoMarcadoresServicos);
                
                // Store service type safely on marker options for filtering
                marcador.options.serviceTipo = tipo;

                // Criar conteúdo do popup
                let popupContent = `
                    <div style="text-align: center; min-width: 150px;">
                        <div style="font-size: 24px; margin-bottom: 8px;">${config.icon}</div>
                        <strong>${nome}</strong><br>
                `;

                if (endereco) {
                    popupContent += `<small>${endereco}${numero ? ', ' + numero : ''}</small><br>`;
                }

                popupContent += `
                        <small style="color: #666;">
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" 
                               target="_blank" 
                               style="color: #146a8c; text-decoration: none;">
                                📍 Como chegar
                            </a>
                        </small>
                    </div>
                `;

                marcador.bindPopup(popupContent);
            }
        });
    } catch (erro) {
        if (erro.name === 'AbortError') {
            console.error(`Timeout ao buscar ${tipo}`);
            throw new Error(`Timeout ao buscar ${tipo}`);
        }
        
        console.error(`Erro ao buscar ${tipo}:`, erro);
        throw erro;
    } finally {
        clearTimeout(timeoutId);
    }
}

// Função para atualizar visibilidade dos serviços baseado nos filtros
function atualizarServicosVisiveis() {
    if (!grupoMarcadoresServicos) return;

    const filtros = {
        farmacias: document.getElementById('filtro-farmacias')?.checked,
        hospitais: document.getElementById('filtro-hospitais')?.checked,
        multibancos: document.getElementById('filtro-multibancos')?.checked,
        supermercados: document.getElementById('filtro-supermercados')?.checked
    };

    grupoMarcadoresServicos.eachLayer(function(marcador) {
        // Prefer metadata stored on marker options; fall back to legacy property if present
        const tipo = marcador.options?.serviceTipo;
        if (filtros[tipo]) {
            // Check if marker is not already on the map before adding
            if (!mapa.hasLayer(marcador)) {
                mapa.addLayer(marcador);
            }
        } else {
            if (mapa.hasLayer(marcador)) {
                mapa.removeLayer(marcador);
            }
        }
    });
}

// Função para adicionar marcador (mantida para compatibilidade)
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
