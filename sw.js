// Service Worker para Faro Formoso
// Versão do cache - incrementar quando atualizar recursos
const CACHE_VERSION = 'v1';
const CACHE_NAME = `faro-formoso-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Recursos essenciais para cache inicial (precache)
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/offline.html',
    '/css/style.css',
    '/css/accessibility.css',
    '/js/main.js',
    '/js/accessibility.js',
    '/js/favorites.js',
    '/js/search.js',
    '/js/dados-api.js'
];

// Páginas HTML para cache
const HTML_PAGES = [
    '/transportes.html',
    '/saude.html',
    '/ambiente.html',
    '/lazer.html',
    '/restaurantes.html',
    '/hoteis.html',
    '/oque-fazer-hoje.html',
    '/mapa.html',
    '/problemas-frequentes.html',
    '/viver-em-faro.html',
    '/mobilidade.html',
    '/historia-faro.html',
    '/favoritos.html'
];

// Scripts específicos de páginas
const PAGE_SCRIPTS = [
    '/js/mapa.js',
    '/js/hoteis.js',
    '/js/restaurantes.js',
    '/js/mobilidade.js'
];

// Dados JSON
const DATA_FILES = [
    '/data/hoteis.json',
    '/data/restaurantes.json',
    '/data/municipio-faro.json'
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
                ...PAGE_SCRIPTS,
                ...DATA_FILES
            ]);
        }).then(() => {
            console.log('[Service Worker] Precache concluído');
            // Forçar ativação imediata
            return self.skipWaiting();
        }).catch((error) => {
            console.error('[Service Worker] Erro no precache:', error);
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
                    if (cacheName !== CACHE_NAME) {
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
    if (url.hostname === 'overpass-api.de' || url.hostname.endsWith('.api.')) {
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
