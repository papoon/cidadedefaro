// alerts.js - Non-intrusive Local Alerts System
// Sistema de alertas locais não intrusivos para informações importantes

(function() {
    'use strict';

    // Configuration
    const STORAGE_KEY = 'guiafaro-dismissed-alerts';
    const AUTO_DISMISS_DURATION = 10000; // 10 seconds (optional auto-dismiss)

    // Alert types and their icons
    const ALERT_TYPES = {
        info: 'ℹ️',
        warning: '⚠️',
        event: '📅',
        success: '✅',
        important: '❗'
    };

    // Store for active alerts
    let alertsContainer = null;
    let dismissedAlerts = new Set();
    let activeAlerts = new Map();

    /**
     * Initialize the alerts system
     */
    function init() {
        // Create alerts container
        createAlertsContainer();
        
        // Load dismissed alerts from localStorage
        loadDismissedAlerts();
        
        // Expose global API
        window.localAlerts = {
            show: showAlert,
            dismiss: dismissAlert,
            dismissAll: dismissAllAlerts,
            clearDismissed: clearDismissedAlerts
        };

        // Listen for custom events to show alerts
        document.addEventListener('showLocalAlert', function(e) {
            if (e.detail) {
                showAlert(e.detail);
            }
        });

        console.log('✨ Local alerts system initialized');
    }

    /**
     * Create the alerts container element
     */
    function createAlertsContainer() {
        if (document.getElementById('alerts-container')) {
            alertsContainer = document.getElementById('alerts-container');
            return;
        }

        alertsContainer = document.createElement('div');
        alertsContainer.id = 'alerts-container';
        alertsContainer.setAttribute('role', 'region');
        alertsContainer.setAttribute('aria-label', 'Alertas informativos');
        alertsContainer.setAttribute('aria-live', 'polite');
        
        document.body.insertBefore(alertsContainer, document.body.firstChild);
    }

    /**
     * Show an alert
     * @param {Object} options - Alert options
     * @param {string} options.id - Unique alert ID
     * @param {string} options.type - Alert type (info, warning, event, success, important)
     * @param {string} options.title - Alert title
     * @param {string} options.message - Alert message (can include HTML)
     * @param {boolean} options.dismissible - Whether alert can be dismissed (default: true)
     * @param {boolean} options.persistent - If false, remembers dismissal across sessions (default: false)
     * @param {number} options.autoDismiss - Auto-dismiss after milliseconds (optional)
     */
    function showAlert(options) {
        // Validate required options
        if (!options || !options.id) {
            console.error('Alert ID is required');
            return;
        }

        // Check if alert was already dismissed (and is persistent)
        if (!options.persistent && dismissedAlerts.has(options.id)) {
            return;
        }

        // Check if alert is already shown
        if (activeAlerts.has(options.id)) {
            return;
        }

        // Default values
        const type = options.type || 'info';
        const title = options.title || '';
        const message = options.message || '';
        const dismissible = options.dismissible !== false;
        const icon = ALERT_TYPES[type] || ALERT_TYPES.info;

        // Create alert element
        const alertElement = document.createElement('div');
        alertElement.className = `local-alert alert-${type}`;
        alertElement.setAttribute('role', 'alert');
        alertElement.setAttribute('data-alert-id', options.id);
        
        // Build alert HTML
        let alertHTML = `
            <span class="alert-icon" aria-hidden="true">${icon}</span>
            <div class="alert-content">
                ${title ? `<div class="alert-title">${title}</div>` : ''}
                <div class="alert-message">${message}</div>
            </div>
        `;

        if (dismissible) {
            alertHTML += `
                <button class="alert-close" 
                        aria-label="Fechar alerta" 
                        title="Fechar alerta"
                        data-i18n="alerts.close_button" 
                        data-i18n-attr="aria-label,title">
                    ✕
                </button>
            `;
        }

        alertElement.innerHTML = alertHTML;

        // Add close button handler
        if (dismissible) {
            const closeBtn = alertElement.querySelector('.alert-close');
            closeBtn.addEventListener('click', function() {
                dismissAlert(options.id, !options.persistent);
            });
        }

        // Add to container
        alertsContainer.appendChild(alertElement);
        activeAlerts.set(options.id, alertElement);

        // Apply i18n if available
        if (window.i18n && window.i18n.applyTranslations) {
            window.i18n.applyTranslations();
        }

        // Auto-dismiss if configured
        if (options.autoDismiss && options.autoDismiss > 0) {
            setTimeout(() => {
                dismissAlert(options.id, !options.persistent);
            }, options.autoDismiss);
        }
    }

    /**
     * Dismiss an alert
     * @param {string} alertId - Alert ID to dismiss
     * @param {boolean} remember - Remember dismissal for future sessions
     */
    function dismissAlert(alertId, remember = false) {
        const alertElement = activeAlerts.get(alertId);
        if (!alertElement) return;

        // Add closing animation
        alertElement.classList.add('closing');

        // Remove after animation
        setTimeout(() => {
            if (alertElement.parentNode) {
                alertElement.parentNode.removeChild(alertElement);
            }
            activeAlerts.delete(alertId);
        }, 300);

        // Remember dismissal if requested
        if (remember) {
            dismissedAlerts.add(alertId);
            saveDismissedAlerts();
        }
    }

    /**
     * Dismiss all active alerts
     */
    function dismissAllAlerts() {
        const alertIds = Array.from(activeAlerts.keys());
        alertIds.forEach(id => dismissAlert(id, false));
    }

    /**
     * Clear dismissed alerts history
     */
    function clearDismissedAlerts() {
        dismissedAlerts.clear();
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Load dismissed alerts from localStorage
     */
    function loadDismissedAlerts() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                dismissedAlerts = new Set(parsed);
            }
        } catch (error) {
            console.error('Error loading dismissed alerts:', error);
        }
    }

    /**
     * Save dismissed alerts to localStorage
     */
    function saveDismissedAlerts() {
        try {
            const array = Array.from(dismissedAlerts);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
        } catch (error) {
            console.error('Error saving dismissed alerts:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
