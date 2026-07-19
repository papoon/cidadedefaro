// push-notifications.js - Notificações locais (opt-in) para alertas importantes
//
// Este projeto não tem backend, pelo que não implementa Web Push "real"
// (que exige um servidor para despachar mensagens via VAPID/push service).
// Em vez disso:
//   1. Mostra uma notificação do sistema para alertas marcados como
//      "notify": true em assets/data/alertas.json, sempre que o utilizador
//      tiver dado permissão e a app estiver aberta (via alertas.js).
//   2. Em navegadores que suportem Periodic Background Sync (PWA instalada,
//      Chromium), regista uma verificação periódica que corre mesmo com a
//      app fechada (ver o handler 'periodicsync' em sw.js).
// Não há entrega garantida com a app totalmente fechada em todos os
// navegadores - ver docs/ALERTAS.md para detalhes e limitações.

(function () {
    'use strict';

    const ENABLED_KEY = 'guiafaro-notifications-enabled';
    const NOTIFIED_KEY = 'guiafaro-notified-alerts';
    const PERIODIC_SYNC_TAG = 'check-alerts';

    function isSupported() {
        return 'Notification' in window && 'serviceWorker' in navigator;
    }

    function isEnabled() {
        return isSupported() &&
            Notification.permission === 'granted' &&
            localStorage.getItem(ENABLED_KEY) === 'true';
    }

    function loadNotifiedIds() {
        try {
            const stored = localStorage.getItem(NOTIFIED_KEY);
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch (error) {
            console.error('Erro ao carregar alertas já notificados:', error);
            return new Set();
        }
    }

    function saveNotifiedIds(ids) {
        try {
            localStorage.setItem(NOTIFIED_KEY, JSON.stringify(Array.from(ids)));
        } catch (error) {
            console.error('Erro ao guardar alertas já notificados:', error);
        }
    }

    /**
     * Mostra uma notificação do sistema para um alerta, através do
     * service worker (permite ao clique focar/abrir a app - ver sw.js).
     */
    async function showSystemNotification(alerta, lang) {
        const title = alerta.title ? (alerta.title[lang] || alerta.title.pt) : 'Faro Formoso';
        const body = alerta.message ? (alerta.message[lang] || alerta.message.pt) : '';
        if (!body) return;

        try {
            const registration = await navigator.serviceWorker.ready;
            await registration.showNotification(title, {
                body,
                icon: './assets/branding/pwa/icon-192x192.png',
                badge: './assets/branding/pwa/icon-192x192.png',
                tag: alerta.id,
                data: { url: './index.html' }
            });
        } catch (error) {
            console.error('Erro ao mostrar notificação:', error);
        }
    }

    /**
     * Verifica uma lista de alertas ativos e notifica os que têm
     * "notify": true e ainda não foram notificados nesta sessão/dispositivo.
     * Chamado por src/data/alertas.js depois de carregar alertas.json.
     */
    async function checkNewAlerts(alertas, lang) {
        if (!isEnabled() || !Array.isArray(alertas)) return;

        const notifiedIds = loadNotifiedIds();
        const toNotify = alertas.filter((alerta) => alerta && alerta.notify && !notifiedIds.has(alerta.id));

        for (const alerta of toNotify) {
            await showSystemNotification(alerta, lang);
            notifiedIds.add(alerta.id);
        }

        if (toNotify.length > 0) {
            saveNotifiedIds(notifiedIds);
        }
    }

    /**
     * Regista a verificação periódica em segundo plano, quando suportada.
     * Falha silenciosamente em navegadores sem suporte (a maioria) ou sem
     * a permissão concedida - não é um requisito para a funcionalidade
     * básica (notificações enquanto a app está aberta continuam a funcionar).
     */
    async function registerPeriodicSync() {
        if (!('serviceWorker' in navigator)) return;

        try {
            const registration = await navigator.serviceWorker.ready;
            if (!('periodicSync' in registration)) return;

            const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
            if (status.state !== 'granted') return;

            await registration.periodicSync.register(PERIODIC_SYNC_TAG, {
                minInterval: 12 * 60 * 60 * 1000 // 12 horas
            });
        } catch (error) {
            // Periodic Background Sync não suportado/permitido - ignorar silenciosamente
        }
    }

    function updateToggleUI(button) {
        const enabled = isEnabled();
        const icon = button.querySelector('.notifications-icon');

        button.classList.toggle('active', enabled);
        button.setAttribute('aria-pressed', enabled ? 'true' : 'false');

        const labelKey = enabled ? 'ui.notifications_toggle_on' : 'ui.notifications_toggle_off';
        const fallback = enabled ? 'Desativar notificações de alertas' : 'Ativar notificações de alertas';
        const label = window.i18n?.t(labelKey) || fallback;
        button.setAttribute('aria-label', label);
        button.setAttribute('data-i18n', labelKey);
        button.setAttribute('data-i18n-attr', 'aria-label');

        if (icon) icon.textContent = enabled ? '🔔' : '🔕';
    }

    async function handleToggleClick(button) {
        if (Notification.permission === 'denied') {
            // O utilizador bloqueou notificações a nível do navegador; só pode
            // ser revertido nas definições do próprio navegador/site.
            window.localAlerts?.show({
                id: 'notifications-blocked',
                type: 'warning',
                message: window.i18n?.t('ui.notifications_blocked_message') ||
                    'As notificações estão bloqueadas nas definições do navegador para este site.',
                dismissible: true,
                persistent: false,
                autoDismiss: 8000
            });
            return;
        }

        if (isEnabled()) {
            localStorage.setItem(ENABLED_KEY, 'false');
            updateToggleUI(button);
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            localStorage.setItem(ENABLED_KEY, 'true');
            registerPeriodicSync();
        } else {
            localStorage.setItem(ENABLED_KEY, 'false');
        }
        updateToggleUI(button);
    }

    function init() {
        const button = document.getElementById('notifications-toggle');
        if (!button) return;

        if (!isSupported()) {
            button.classList.add('unsupported');
            button.setAttribute('aria-hidden', 'true');
            button.setAttribute('tabindex', '-1');
            return;
        }

        updateToggleUI(button);
        button.addEventListener('click', () => handleToggleClick(button));

        if (isEnabled()) {
            registerPeriodicSync();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.pushNotifications = {
        checkNewAlerts,
        isEnabled
    };
})();
