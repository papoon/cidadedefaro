// alertas.js - Carrega alertas ativos de assets/data/alertas.json e mostra-os
// através do sistema de alertas locais (src/ui/alerts.js).

(function () {
    'use strict';

    const ALERTS_URL = 'assets/data/alertas.json';

    function pickLang() {
        return localStorage.getItem('guiafaro-lang') || 'pt';
    }

    function isExpired(alerta) {
        if (!alerta.expires) return false;
        const expiryDate = new Date(alerta.expires);
        if (Number.isNaN(expiryDate.getTime())) return false;
        return expiryDate.getTime() < Date.now();
    }

    async function carregarAlertas() {
        if (!window.localAlerts) {
            // O sistema de alertas ainda não foi inicializado (ver src/ui/alerts.js)
            return;
        }

        try {
            const resposta = await fetch(ALERTS_URL);
            if (!resposta.ok) {
                throw new Error(`Falha ao carregar ${ALERTS_URL}: ${resposta.status}`);
            }

            const alertas = await resposta.json();
            if (!Array.isArray(alertas)) return;

            const lang = pickLang();

            alertas
                .filter((alerta) => alerta && alerta.active && !isExpired(alerta))
                .forEach((alerta) => {
                    const title = alerta.title ? (alerta.title[lang] || alerta.title.pt) : '';
                    const message = alerta.message ? (alerta.message[lang] || alerta.message.pt) : '';
                    if (!message) return;

                    window.localAlerts.show({
                        id: alerta.id,
                        type: alerta.type || 'info',
                        title,
                        message,
                        dismissible: alerta.dismissible !== false,
                        persistent: alerta.persistent === true,
                        autoDismiss: alerta.autoDismiss
                    });
                });
        } catch (error) {
            console.error('Erro ao carregar alertas:', error);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', carregarAlertas);
    } else {
        carregarAlertas();
    }
})();
