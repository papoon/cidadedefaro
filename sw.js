// Service Worker para Faro Formoso
// Versão do cache - incrementar quando atualizar recursos
const CACHE_VERSION = 'v5';
const CACHE_NAME = `faro-formoso-${CACHE_VERSION}`;
const OFFLINE_URL = './offline.html';

// Cache não-versionado (não apagado no 'activate') que guarda que alertas já
// geraram uma notificação via periodicsync, para não notificar duplicado
// entre deploys - ver checkAlertsAndNotify() mais abaixo.
const NOTIFIED_CACHE = 'faro-formoso-notified-alerts';
const ALERTS_URL = './assets/data/alertas.json';

// Recursos essenciais para cache inicial (precache)
// Nota: o build de produção (Vite) faz bundling e hashing de todo o CSS/JS
// referenciado a partir das páginas HTML (ex.: `assets/main-<hash>.css`,
// `assets/mapa-<hash>.js`); os ficheiros não processados em `src/` e
// `assets/styles/` são copiados para `dist/` por segurança mas não são
// pedidos por nenhuma página em produção. Por isso não faz sentido
// precachear esses caminhos estáticos - os nomes com hash não são
// previsíveis aqui. Em vez disso, a estratégia "Cache First" no fetch
// handler abaixo (para .css/.js/.json) cacheia os bundles reais assim que
// cada página é visitada.
const PRECACHE_URLS = [
    './index.html',
    './offline.html'
];

// Páginas HTML para cache
const HTML_PAGES = [
    './transportes.html',
    './saude.html',
    './saude-onde-ir-agora.html',
    './ambiente.html',
    './lazer.html',
    './restaurantes.html',
    './hoteis.html',
    './oque-fazer-hoje.html',
    './mapa.html',
    './problemas-frequentes.html',
    './viver-em-faro.html',
    './mobilidade.html',
    './historia-faro.html',
    './favoritos.html',
    './idosos.html',
    './guia-premium.html',
    './sobre-projeto.html',
    './demo-alertas.html'
];

// Dados JSON
const DATA_FILES = [
    './assets/data/hoteis.json',
    './assets/data/restaurantes.json',
    './assets/data/municipio-faro.json',
    './assets/data/farmacias.json',
    './assets/data/alertas.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Fazendo precache de recursos essenciais');
            return cache.addAll([
                ...PRECACHE_URLS,
                ...HTML_PAGES,
                ...DATA_FILES
            ]);
        }).then(() => {
            console.log('[Service Worker] Precache concluído');
            // Forçar ativação imediata
            return self.skipWaiting();
        }).catch((error) => {
            console.error('[Service Worker] Erro no precache:', error);
            throw error;
        })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativando...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== NOTIFIED_CACHE) {
                        console.log('[Service Worker] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[Service Worker] Ativado e pronto');
            // Assumir controle de todas as páginas imediatamente
            return self.clients.claim();
        })
    );
});

// Estratégia de fetch
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Ignorar requisições não-HTTP/HTTPS
    if (!request.url.startsWith('http')) {
        return;
    }
    
    // Estratégia para páginas HTML - Network First com fallback para cache
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Se conseguir da rede, atualizar cache
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Se falhar, tentar do cache
                    return caches.match(request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Se não tiver no cache, mostrar página offline
                        return caches.match(OFFLINE_URL);
                    });
                })
        );
        return;
    }
    
    // Estratégia para CSS/JS/Dados - Cache First com fallback para network
    if (
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.json') ||
        url.pathname.startsWith('/css/') ||
        url.pathname.startsWith('/js/') ||
        url.pathname.startsWith('/data/')
    ) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Retornar do cache, mas atualizar em background
                    fetch(request).then((response) => {
                        if (response.ok) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, response);
                            });
                        }
                    }).catch(() => {
                        // Ignorar erros de atualização em background
                    });
                    return cachedResponse;
                }
                // Se não estiver no cache, buscar da rede
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                });
            })
        );
        return;
    }
    
    // Estratégia para Leaflet tiles - Cache First com duração longa
    if (url.hostname === 'a.tile.openstreetmap.org' || 
        url.hostname === 'b.tile.openstreetmap.org' || 
        url.hostname === 'c.tile.openstreetmap.org') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Retornar tile transparente se offline
                    return new Response(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#f0f0f0"/><text x="128" y="128" text-anchor="middle" fill="#999" font-size="14">Offline</text></svg>',
                        { headers: { 'Content-Type': 'image/svg+xml' } }
                    );
                });
            })
        );
        return;
    }
    
    // Estratégia para CDN externo (Leaflet) - Cache First com fallback para network
    if (url.hostname === 'unpkg.com' || url.hostname === 'cdnjs.cloudflare.com') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                    }
                    return response;
                }).catch(() => {
                    // Falhar silenciosamente para recursos externos
                    return new Response('', { status: 503 });
                });
            })
        );
        return;
    }
    
    // Estratégia para APIs externas - Network Only (não cachear)
    if (url.hostname === 'overpass-api.de') {
        event.respondWith(fetch(request));
        return;
    }
    
    // Estratégia padrão - Network First com fallback para cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        const urls = event.data.urls;
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(urls);
            })
        );
    }
});

// Verificação periódica de alertas em segundo plano (Periodic Background
// Sync). Só é registada pelo cliente (src/utils/push-notifications.js)
// quando o navegador suporta a API e o utilizador ativou notificações -
// nunca corre em navegadores sem suporte (a maioria). Não substitui Web
// Push real: só funciona enquanto a PWA estiver instalada e o navegador
// decidir agendar a sincronização (o intervalo mínimo pedido é 12h, mas
// o navegador pode espaçar mais consoante o padrão de uso).
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-alerts') {
        event.waitUntil(checkAlertsAndNotify());
    }
});

async function checkAlertsAndNotify() {
    try {
        const response = await fetch(ALERTS_URL, { cache: 'no-store' });
        if (!response.ok) return;

        const alertas = await response.json();
        if (!Array.isArray(alertas)) return;

        const notifiedCache = await caches.open(NOTIFIED_CACHE);
        const now = Date.now();

        for (const alerta of alertas) {
            if (!alerta || !alerta.active || !alerta.notify) continue;

            if (alerta.expires) {
                const expiry = new Date(alerta.expires).getTime();
                if (!Number.isNaN(expiry) && expiry < now) continue;
            }

            // Chave de marcação, não um recurso real - apenas usada como
            // entrada de cache para saber se este alerta já foi notificado.
            const marker = new Request(`./__notified__/${alerta.id}`);
            const alreadyNotified = await notifiedCache.match(marker);
            if (alreadyNotified) continue;

            // O service worker não tem acesso a localStorage, pelo que não
            // sabe a preferência de idioma do utilizador - assume Português.
            const title = (alerta.title && alerta.title.pt) || 'Faro Formoso';
            const body = (alerta.message && alerta.message.pt) || '';
            if (!body) continue;

            await self.registration.showNotification(title, {
                body,
                icon: './assets/branding/pwa/icon-192x192.png',
                badge: './assets/branding/pwa/icon-192x192.png',
                tag: alerta.id,
                data: { url: './index.html' }
            });

            await notifiedCache.put(marker, new Response('1'));
        }
    } catch (error) {
        console.error('[Service Worker] Erro ao verificar alertas periodicamente:', error);
    }
}

// Clique numa notificação: focar uma janela existente ou abrir uma nova
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) || './index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ('focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
