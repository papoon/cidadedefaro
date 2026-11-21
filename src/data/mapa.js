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
        icon: 'i-pill',
        color: 'var(--ok)',
        nome: 'Farmácia'
    },
    hospitais: {
        icon: 'i-health',
        color: 'var(--danger)',
        nome: 'Hospital'
    },
    multibancos: {
        icon: 'i-landmark',
        color: 'var(--ria)',
        nome: 'Multibanco'
    },
    supermercados: {
        icon: 'i-utensils',
        color: 'var(--warn)',
        nome: 'Supermercado'
    }
};

// Camadas temáticas (dados OpenStreetMap via Overpass), carregadas só quando ativadas.
// Raio a partir do centro de Faro; cada filtro é um seletor Overpass QL aplicado a nwr.
const RAIO_CAMADAS_M = 6000;
export const CAMADAS = {
    coworking: {
        icon: 'i-laptop', color: 'var(--ria-deep)', nome: 'Coworking',
        filtros: ['["amenity"="coworking_space"]', '["office"="coworking"]']
    },
    wc_acessivel: {
        icon: 'i-accessibility', color: 'var(--ria)', nome: 'Casa de banho acessível',
        filtros: ['["amenity"="toilets"]["wheelchair"~"^(yes|designated)$"]', '["toilets:wheelchair"="yes"]']
    },
    estacionamento_pmr: {
        icon: 'i-parking', color: 'var(--ria)', nome: 'Estacionamento para pessoas com deficiência',
        filtros: ['["amenity"="parking_space"]["parking_space"="disabled"]', '["amenity"="parking"]["capacity:disabled"~"^[1-9]"]']
    },
    parque_canino: {
        icon: 'i-paw', color: 'var(--ok)', nome: 'Parque para cães',
        filtros: ['["leisure"="dog_park"]']
    },
    veterinario: {
        icon: 'i-paw', color: 'var(--terra)', nome: 'Veterinário',
        filtros: ['["amenity"="veterinary"]']
    }
};

/** Query Overpass QL para uma camada (nós, vias e relações à volta do centro). */
export function construirQueryCamada(id, centro = FARO_COORDENADAS, raio = RAIO_CAMADAS_M, timeoutS = OVERPASS_TIMEOUT_S) {
    const camada = CAMADAS[id];
    if (!camada) throw new Error(`Camada desconhecida: ${id}`);
    const area = `(around:${raio},${centro.lat},${centro.lng})`;
    const partes = camada.filtros.map((f) => `nwr${f}${area};`).join('\n            ');
    return `[out:json][timeout:${timeoutS}];
        (
            ${partes}
        );
        out center tags;`;
}

/** Camadas pedidas no URL: mapa.html?camada=coworking,veterinario (ids desconhecidos ignorados). */
export function camadasDoUrl(search) {
    const valor = new URLSearchParams(search || '').get('camada') || '';
    return [...new Set(valor.split(',').map((v) => v.trim()).filter((v) => v in CAMADAS))];
}

// Função para criar ícone personalizado
// iconId = sprite id (src/partials/icons.html); cor = CSS colour/token
function criarIconePersonalizado(iconId, cor) {
    return L.divIcon({
        html: `<span class="map-pin" style="--pin: ${cor}"><svg class="icon" aria-hidden="true"><use href="#${iconId}"></use></svg></span>`,
        className: 'map-pin-wrap',
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
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
        configurarCamadas();
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
    btnLocalizacao.textContent = 'A obter localização…';
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
                html: '<span class="map-pin-user"></span>',
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
            btnLocalizacao.textContent = 'Localização obtida';
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
            btnLocalizacao.textContent = 'Tentar novamente';
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

// Popup de um elemento OSM, construído com DOM (nomes/moradas/telefones vêm do OSM: nunca usar innerHTML)
function criarPopup(elemento, config, lat, lng) {
    const tags = elemento.tags || {};
    const popupContent = document.createElement('div');
    popupContent.style.textAlign = 'center';
    popupContent.style.minWidth = '150px';

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(svgNS, 'use');
    use.setAttribute('href', `#${config.icon}`);
    svg.appendChild(use);
    const iconWrap = document.createElement('div');
    iconWrap.style.fontSize = '24px';
    iconWrap.style.marginBottom = '8px';
    iconWrap.appendChild(svg);

    const titulo = document.createElement('strong');
    titulo.textContent = tags.name || config.nome;
    popupContent.append(iconWrap, titulo, document.createElement('br'));

    const endereco = tags['addr:street'] || '';
    const numero = tags['addr:housenumber'] || '';
    if (endereco) {
        const morada = document.createElement('small');
        morada.textContent = `${endereco}${numero ? ', ' + numero : ''}`;
        popupContent.append(morada, document.createElement('br'));
    }

    const telefone = tags.phone || tags['contact:phone'];
    if (telefone) {
        const tel = document.createElement('a');
        tel.href = `tel:${String(telefone).replace(/[^\d+]/g, '')}`;
        tel.textContent = telefone;
        const small = document.createElement('small');
        small.appendChild(tel);
        popupContent.append(small, document.createElement('br'));
    }

    if (tags.opening_hours) {
        const horario = document.createElement('small');
        horario.textContent = tags.opening_hours;
        popupContent.append(horario, document.createElement('br'));
    }

    const linkWrap = document.createElement('small');
    const link = document.createElement('a');
    link.href = `https://www.google.com/maps/dir/?api=1&destination=${Number(lat)},${Number(lng)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = (window.i18n && window.i18n.t('map.directions')) || 'Como chegar';
    linkWrap.appendChild(link);
    popupContent.appendChild(linkWrap);
    return popupContent;
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
                
                const marcador = L.marker([lat, lng], { 
                    icon: icone
                }).addTo(grupoMarcadoresServicos);
                
                // Store service type safely on marker options for filtering
                marcador.options.serviceTipo = tipo;

                marcador.bindPopup(criarPopup(elemento, config, lat, lng));
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

    let visiveis = 0;

    grupoMarcadoresServicos.eachLayer(function(marcador) {
        // Prefer metadata stored on marker options; fall back to legacy property if present
        const tipo = marcador.options?.serviceTipo;
        if (filtros[tipo]) {
            // Check if marker is not already on the map before adding
            if (!mapa.hasLayer(marcador)) {
                mapa.addLayer(marcador);
            }
            visiveis++;
        } else {
            if (mapa.hasLayer(marcador)) {
                mapa.removeLayer(marcador);
            }
        }
    });

    // Anuncia a contagem atualizada para utilizadores de leitores de ecrã,
    // já que os marcadores no mapa não são acessíveis por si só.
    const statusEl = document.getElementById('servicos-count-status');
    if (statusEl) {
        statusEl.textContent = visiveis === 1
            ? '1 serviço visível no mapa'
            : `${visiveis} serviços visíveis no mapa`;
    }
}

// ---------- Camadas temáticas ----------
const gruposCamadas = {};   // id -> L.layerGroup (já carregado)
const contagemCamadas = {}; // id -> número de locais

function t(chave, fallback) {
    return (window.i18n && window.i18n.t(chave)) || fallback;
}

function anunciarCamadas() {
    const statusEl = document.getElementById('camadas-status');
    if (!statusEl) return;
    const partes = Object.keys(CAMADAS)
        .filter((id) => document.getElementById(`camada-${id}`)?.checked && id in contagemCamadas)
        .map((id) => {
            const nome = t(`map.layer_${id}`, CAMADAS[id].nome);
            const n = contagemCamadas[id];
            return n === 0
                ? `${nome}: ${t('map.layers_none', 'nenhum local mapeado ainda')}`
                : `${nome}: ${n}`;
        });
    statusEl.textContent = partes.join(' · ');
}

async function carregarCamada(id) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const resposta = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: 'data=' + encodeURIComponent(construirQueryCamada(id)),
            signal: controller.signal
        });
        if (!resposta.ok) throw new Error(`Erro HTTP: ${resposta.status}`);
        const dados = await resposta.json();
        const config = CAMADAS[id];
        const grupo = L.layerGroup();
        let n = 0;
        dados.elements.forEach((elemento) => {
            const lat = elemento.lat || elemento.center?.lat;
            const lng = elemento.lon || elemento.center?.lon;
            if (!lat || !lng) return;
            L.marker([lat, lng], { icon: criarIconePersonalizado(config.icon, config.color) })
                .bindPopup(criarPopup(elemento, config, lat, lng))
                .addTo(grupo);
            n++;
        });
        gruposCamadas[id] = grupo;
        contagemCamadas[id] = n;
        return grupo;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function alternarCamada(id, ativa) {
    if (!mapa) return;
    const checkbox = document.getElementById(`camada-${id}`);
    if (!ativa) {
        if (gruposCamadas[id]) mapa.removeLayer(gruposCamadas[id]);
        anunciarCamadas();
        return;
    }
    try {
        checkbox?.setAttribute('aria-busy', 'true');
        const grupo = gruposCamadas[id] || await carregarCamada(id);
        // A pessoa pode ter desmarcado enquanto carregava
        if (checkbox && !checkbox.checked) return;
        grupo.addTo(mapa);
    } catch (erro) {
        console.error(`Erro ao carregar camada ${id}:`, erro);
        const statusEl = document.getElementById('camadas-status');
        if (statusEl) statusEl.textContent = t('map.layers_error', 'Não foi possível carregar a camada. Tente novamente.');
        if (checkbox) checkbox.checked = false;
        return;
    } finally {
        checkbox?.removeAttribute('aria-busy');
    }
    anunciarCamadas();
}

function configurarCamadas() {
    Object.keys(CAMADAS).forEach((id) => {
        const checkbox = document.getElementById(`camada-${id}`);
        checkbox?.addEventListener('change', () => alternarCamada(id, checkbox.checked));
    });
    // Ligações diretas a partir de outras páginas (ex.: mapa.html?camada=veterinario)
    camadasDoUrl(window.location.search).forEach((id) => {
        const checkbox = document.getElementById(`camada-${id}`);
        if (checkbox) {
            checkbox.checked = true;
            alternarCamada(id, true);
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
        const popupContent = document.createElement('div');
        popupContent.style.textAlign = 'center';
        if (titulo) {
            const strong = document.createElement('strong');
            strong.textContent = titulo;
            popupContent.append(strong, document.createElement('br'));
        }
        if (descricao) popupContent.append(document.createTextNode(descricao));
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
