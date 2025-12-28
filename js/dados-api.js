// dados-api.js - Funções para obter dados de APIs

// Função para buscar dados (a ser implementada)
async function buscarDados(endpoint) {
    console.log(`Buscando dados de: ${endpoint}`);
    // Implementação futura para integração com APIs
    return null;
}

// Função para processar dados (a ser implementada)
function processarDados(dados) {
    console.log('Processando dados');
    // Implementação futura
    return dados;
}

// ===================================
// INTEGRAÇÃO COM GEO API PT
// ===================================

/**
 * Busca dados do município de Faro através da GEO API PT
 * @returns {Promise<Object>} Objeto com dados do município ou null em caso de erro
 */
async function buscarDadosFaro() {
    const API_URL = 'https://geoapi.pt/municipio/Faro';
    
    try {
        console.log('Buscando dados de Faro da GEO API PT...');
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const dados = await response.json();
        
        console.log('Dados recebidos:', dados);
        
        // Extrair e processar os dados relevantes
        return {
            nome: dados.Município || dados.municipio || 'Faro',
            distrito: dados.Distrito || dados.distrito || 'Faro',
            populacao: dados.População || dados.populacao || dados.population || 'N/A',
            area: dados.Área || dados.area || 'N/A'
        };
        
    } catch (erro) {
        console.error('Erro ao buscar dados de Faro:', erro);
        return null;
    }
}

/**
 * Exibe os dados do município de Faro no elemento especificado
 * @param {string} elementoId - ID do elemento HTML onde os dados serão exibidos
 */
async function exibirDadosFaro(elementoId) {
    const elemento = document.getElementById(elementoId);
    
    if (!elemento) {
        console.error(`Elemento com ID "${elementoId}" não encontrado`);
        return;
    }
    
    // Mostrar estado de carregamento
    elemento.innerHTML = `
        <div class="loading">
            <p>🔄 A carregar dados de Faro...</p>
        </div>
    `;
    
    // Buscar dados
    const dados = await buscarDadosFaro();
    
    if (dados) {
        // Função auxiliar para escapar HTML e prevenir XSS
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        // Exibir dados com sucesso (com sanitização)
        elemento.innerHTML = `
            <div class="dados-municipio">
                <h3>📍 Informações do Município</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Município:</span>
                        <span class="info-value">${escapeHtml(String(dados.nome))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Distrito:</span>
                        <span class="info-value">${escapeHtml(String(dados.distrito))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">População:</span>
                        <span class="info-value">${escapeHtml(String(dados.populacao))}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Área:</span>
                        <span class="info-value">${escapeHtml(String(dados.area))}</span>
                    </div>
                </div>
                <p class="fonte-dados">Fonte: GEO API PT</p>
            </div>
        `;
    } else {
        // Exibir mensagem de erro
        elemento.innerHTML = `
            <div class="erro-dados">
                <p>❌ Não foi possível carregar os dados de Faro.</p>
                <p>Por favor, tente novamente mais tarde.</p>
            </div>
        `;
    }
}
