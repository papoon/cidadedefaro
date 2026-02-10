// PWA Install Prompt Module
// Handles the display of PWA installation prompt on mobile devices

let deferredPrompt = null;

// Detect if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Detect if device is iOS
function isIOSDevice() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Check if user has already dismissed the prompt permanently
function hasUserDismissedPermanently() {
    return localStorage.getItem('guiafaro-pwa-install-dismissed') === 'true';
}

// Check if app is already installed
function isAppInstalled() {
    // Check if running in standalone mode
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
}

// Create the PWA install modal HTML
function createInstallModal() {
    const overlay = document.createElement('div');
    overlay.className = 'pwa-install-overlay';
    overlay.id = 'pwa-install-overlay';
    
    // Check if iOS for different instructions
    const isIOS = isIOSDevice();
    
    if (isIOS) {
        // iOS-specific modal with manual installation instructions
        overlay.innerHTML = `
            <div class="pwa-install-modal" role="dialog" aria-labelledby="pwa-modal-title" aria-describedby="pwa-modal-desc">
                <div class="pwa-install-header">
                    <div class="pwa-install-icon">
                        <img src="./assets/branding/pwa/icon-192x192.png" alt="Faro Formoso">
                    </div>
                    <div class="pwa-install-title-group">
                        <h2 id="pwa-modal-title" data-i18n="pwa_install.modal_title">Instalar Faro Formoso</h2>
                        <p>Faro Formoso</p>
                    </div>
                </div>
                
                <p class="pwa-install-description" id="pwa-modal-desc" data-i18n="pwa_install.modal_description_ios">
                    Para instalar esta app no seu iPhone ou iPad:
                </p>
                
                <div class="pwa-install-ios-steps">
                    <ol>
                        <li data-i18n="pwa_install.ios_step_1">Toque no botão <strong>Partilhar</strong> <span class="pwa-install-emoji">⎙</span> na barra inferior do Safari</li>
                        <li data-i18n="pwa_install.ios_step_2">Deslize para baixo e toque em <strong>"Adicionar ao Ecrã Principal"</strong> <span class="pwa-install-emoji">➕</span></li>
                        <li data-i18n="pwa_install.ios_step_3">Toque em <strong>"Adicionar"</strong> no canto superior direito</li>
                    </ol>
                </div>
                
                <div class="pwa-install-benefits">
                    <h3 data-i18n="pwa_install.modal_benefits_title">Benefícios:</h3>
                    <ul>
                        <li data-i18n="pwa_install.benefit_1">✓ Acesso rápido a partir do ecrã inicial</li>
                        <li data-i18n="pwa_install.benefit_2">✓ Funciona offline</li>
                        <li data-i18n="pwa_install.benefit_3">✓ Notificações de atualizações</li>
                        <li data-i18n="pwa_install.benefit_4">✓ Experiência otimizada para dispositivos móveis</li>
                    </ul>
                </div>
                
                <div class="pwa-install-buttons">
                    <button class="pwa-install-btn pwa-install-btn-primary" id="pwa-ok-btn" data-i18n="pwa_install.ok_button">
                        Entendi
                    </button>
                    <button class="pwa-install-btn pwa-install-btn-text" id="pwa-dismiss-btn" data-i18n="pwa_install.dont_show_button">
                        Não mostrar novamente
                    </button>
                </div>
            </div>
        `;
    } else {
        // Android/Other browsers modal with automatic installation
        overlay.innerHTML = `
            <div class="pwa-install-modal" role="dialog" aria-labelledby="pwa-modal-title" aria-describedby="pwa-modal-desc">
                <div class="pwa-install-header">
                    <div class="pwa-install-icon">
                        <img src="./assets/branding/pwa/icon-192x192.png" alt="Faro Formoso">
                    </div>
                    <div class="pwa-install-title-group">
                        <h2 id="pwa-modal-title" data-i18n="pwa_install.modal_title">Instalar Faro Formoso</h2>
                        <p>Faro Formoso</p>
                    </div>
                </div>
                
                <p class="pwa-install-description" id="pwa-modal-desc" data-i18n="pwa_install.modal_description">
                    Instale o Faro Formoso no seu dispositivo para acesso rápido e funcionalidades offline!
                </p>
                
                <div class="pwa-install-benefits">
                    <h3 data-i18n="pwa_install.modal_benefits_title">Benefícios:</h3>
                    <ul>
                        <li data-i18n="pwa_install.benefit_1">✓ Acesso rápido a partir do ecrã inicial</li>
                        <li data-i18n="pwa_install.benefit_2">✓ Funciona offline</li>
                        <li data-i18n="pwa_install.benefit_3">✓ Notificações de atualizações</li>
                        <li data-i18n="pwa_install.benefit_4">✓ Experiência otimizada para dispositivos móveis</li>
                    </ul>
                </div>
                
                <div class="pwa-install-buttons">
                    <button class="pwa-install-btn pwa-install-btn-primary" id="pwa-install-btn" data-i18n="pwa_install.install_button">
                        Instalar Agora
                    </button>
                    <button class="pwa-install-btn pwa-install-btn-secondary" id="pwa-later-btn" data-i18n="pwa_install.later_button">
                        Agora Não
                    </button>
                    <button class="pwa-install-btn pwa-install-btn-text" id="pwa-dismiss-btn" data-i18n="pwa_install.dont_show_button">
                        Não mostrar novamente
                    </button>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(overlay);
    
    // Add event listeners based on device type
    if (isIOS) {
        document.getElementById('pwa-ok-btn').addEventListener('click', handleLaterClick);
        document.getElementById('pwa-dismiss-btn').addEventListener('click', handleDismissClick);
    } else {
        document.getElementById('pwa-install-btn').addEventListener('click', handleInstallClick);
        document.getElementById('pwa-later-btn').addEventListener('click', handleLaterClick);
        document.getElementById('pwa-dismiss-btn').addEventListener('click', handleDismissClick);
    }
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            handleLaterClick();
        }
    });
    
    // Apply current translations if i18n is already loaded
    // The i18n system will automatically apply translations to elements with data-i18n attributes
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations();
    }
}

// Show the install modal
function showInstallModal() {
    const overlay = document.getElementById('pwa-install-overlay');
    if (overlay) {
        // Use setTimeout to ensure smooth animation
        setTimeout(() => {
            overlay.classList.add('show');
        }, 100);
    }
}

// Hide the install modal
function hideInstallModal() {
    const overlay = document.getElementById('pwa-install-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        // Remove from DOM after animation
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Handle install button click
async function handleInstallClick() {
    if (!deferredPrompt) {
        console.log('No deferred prompt available');
        hideInstallModal();
        return;
    }
    
    try {
        // Show the browser's install prompt
        deferredPrompt.prompt();
        
        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`User response to install prompt: ${outcome}`);
        
        if (outcome === 'accepted') {
            console.log('PWA installation accepted by user');
        }
        
        // Clear the deferred prompt
        deferredPrompt = null;
        
        // Hide modal
        hideInstallModal();
    } catch (error) {
        console.error('Error during PWA installation:', error);
        hideInstallModal();
    }
}

// Handle "Not Now" button click
function handleLaterClick() {
    hideInstallModal();
}

// Handle "Don't show again" button click
function handleDismissClick() {
    localStorage.setItem('guiafaro-pwa-install-dismissed', 'true');
    hideInstallModal();
}



// Initialize PWA install prompt
function initPWAInstallPrompt() {
    console.log('Initializing PWA install prompt...');
    
    // Check if we should show the prompt
    if (!isMobileDevice()) {
        console.log('Not a mobile device, skipping PWA install prompt');
        return;
    }
    
    if (isAppInstalled()) {
        console.log('App already installed, skipping PWA install prompt');
        return;
    }
    
    if (hasUserDismissedPermanently()) {
        console.log('User has dismissed PWA install prompt permanently');
        return;
    }
    
    // iOS devices don't support beforeinstallprompt, so show manual instructions
    if (isIOSDevice()) {
        console.log('iOS device detected, showing manual installation instructions');
        
        // Show iOS install instructions after page load
        setTimeout(() => {
            createInstallModal();
            showInstallModal();
        }, 3000); // Wait 3 seconds after page load
        
        return;
    }
    
    // Listen for the beforeinstallprompt event (Android and other browsers)
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt event fired');
        
        // Prevent the default browser install prompt
        e.preventDefault();
        
        // Store the event for later use
        deferredPrompt = e;
        
        // Create and show our custom modal
        createInstallModal();
        
        // Show modal after a short delay to ensure page is fully loaded
        setTimeout(() => {
            showInstallModal();
        }, 2000); // Wait 2 seconds after page load
    });
    
    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
        console.log('PWA was installed successfully');
        deferredPrompt = null;
        hideInstallModal();
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWAInstallPrompt);
} else {
    initPWAInstallPrompt();
}

// Export functions for testing if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isMobileDevice,
        isAppInstalled,
        hasUserDismissedPermanently
    };
}
