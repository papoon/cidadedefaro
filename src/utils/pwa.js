// Service Worker Registration and Offline Status Handler
// Este script deve ser incluído em todas as páginas

// Registrar Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Resolve SW path against the current location so scope is correct
        try {
            const swUrl = new URL('./sw.js', location.href);
        navigator.serviceWorker
                .register(swUrl.href)
            .then((registration) => {
                console.log('✓ Service Worker registrado com sucesso:', registration.scope);
                
                // Verificar atualizações periodicamente (a cada 15 minutos)
                setInterval(() => {
                    registration.update();
                }, 900000); // A cada 15 minutos
                
                // Notificar usuário quando houver atualização
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            mostrarNotificacaoAtualizacao();
                        }
                    });
                });
            })
            .catch((error) => {
                console.error('✗ Falha ao registrar Service Worker:', error);
            });
        } catch (err) {
            console.error('✗ SW registration setup failed:', err);
        }
    });
}

// Monitorar status de conexão
let statusOfflineExibido = false;

window.addEventListener('online', () => {
    console.log('✓ Conexão restaurada');
    ocultarNotificacaoOffline();
    mostrarNotificacao('✓ Conexão restaurada', 'success');
});

window.addEventListener('offline', () => {
    console.log('✗ Sem conexão à internet');
    mostrarNotificacaoOffline();
});

// Verificar status inicial ao carregar a página
window.addEventListener('load', () => {
    if (!navigator.onLine) {
        mostrarNotificacaoOffline();
    }
});

// Funções de notificação
function mostrarNotificacaoOffline() {
    if (statusOfflineExibido) return;
    
    // Criar elemento de notificação se não existir
    let notificacao = document.getElementById('offline-notification');
    if (!notificacao) {
        notificacao = document.createElement('div');
        notificacao.id = 'offline-notification';
        notificacao.innerHTML = `
            <div class="offline-notification-content">
                <span class="offline-icon">📡</span>
                <span class="offline-text">Você está offline. Funcionalidades limitadas.</span>
            </div>
        `;
        document.body.appendChild(notificacao);
    }
    
    // Adicionar estilos se ainda não existirem
    if (!document.getElementById('offline-notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'offline-notification-styles';
        styles.textContent = `
            #offline-notification {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background-color: #d98324;
                color: white;
                padding: 0.75rem;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                animation: slideDown 0.3s ease-out;
            }
            
            .offline-notification-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
            
            .offline-icon {
                font-size: 1.2rem;
            }
            
            .offline-text {
                font-weight: 500;
            }
            
            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                }
                to {
                    transform: translateY(0);
                }
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(0);
                }
                to {
                    transform: translateY(-100%);
                }
            }
            
            .notification-toast {
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background-color: #1dac48;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                animation: fadeInUp 0.3s ease-out;
                max-width: 400px;
            }
            
            .notification-toast.error {
                background-color: #c0392b;
            }
            
            .notification-toast.warning {
                background-color: #d98324;
            }
            
            .notification-toast.info {
                background-color: #42beef;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(1rem);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
            
            .update-notification {
                position: fixed;
                bottom: 2rem;
                left: 50%;
                transform: translateX(-50%);
                background-color: #146a8c;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 9999;
                display: flex;
                gap: 1rem;
                align-items: center;
                animation: fadeInUp 0.3s ease-out;
            }
            
            .update-notification button {
                background-color: white;
                color: #146a8c;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .update-notification button:hover {
                transform: scale(1.05);
            }
            
            .update-notification button:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(styles);
    }
    
    notificacao.style.display = 'block';
    statusOfflineExibido = true;
}

function ocultarNotificacaoOffline() {
    const notificacao = document.getElementById('offline-notification');
    if (notificacao) {
        notificacao.style.animation = 'slideUp 0.3s ease-out';
        setTimeout(() => {
            notificacao.style.display = 'none';
        }, 300);
    }
    statusOfflineExibido = false;
}

function mostrarNotificacao(mensagem, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `notification-toast ${tipo}`;
    toast.textContent = mensagem;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (toast && toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

function mostrarNotificacaoAtualizacao() {
    const notificacao = document.createElement('div');
    notificacao.className = 'update-notification';
    notificacao.innerHTML = `
        <span>🎉 Nova versão disponível!</span>
        <button onclick="atualizarPagina()">Atualizar agora</button>
    `;
    document.body.appendChild(notificacao);
}

function atualizarPagina() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
        });
    } else {
        window.location.reload();
    }
}

// Função para pré-cache de recursos adicionais
function precacheRecursos(urls) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'CACHE_URLS',
            urls: urls
        });
    }
}

// Exportar funções para uso global
window.precacheRecursos = precacheRecursos;
window.atualizarPagina = atualizarPagina;
