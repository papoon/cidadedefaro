// voice-navigation.js - Voice Navigation System using Web Speech API

(function() {
    'use strict';

    // Check browser support for Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn('Web Speech API not supported in this browser');
        return;
    }

    // Voice Navigation State
    const voiceNavState = {
        enabled: localStorage.getItem('voice-nav-enabled') === 'true',
        listening: false,
        recognition: null,
        currentLanguage: 'pt-PT'
    };

    // Command mappings for navigation
    const commandMaps = {
        'pt-PT': {
            // Page navigation
            'início': 'index.html',
            'home': 'index.html',
            'início página principal': 'index.html',
            'transportes': 'transportes.html',
            'abrir transportes': 'transportes.html',
            'saúde': 'saude.html',
            'abrir saúde': 'saude.html',
            'ambiente': 'ambiente.html',
            'abrir ambiente': 'ambiente.html',
            'lazer': 'lazer.html',
            'abrir lazer': 'lazer.html',
            'restaurantes': 'restaurantes.html',
            'abrir restaurantes': 'restaurantes.html',
            'onde comer': 'restaurantes.html',
            'hotéis': 'hoteis.html',
            'hoteis': 'hoteis.html',
            'abrir hotéis': 'hoteis.html',
            'abrir hoteis': 'hoteis.html',
            'onde ficar': 'hoteis.html',
            'alojamento': 'hoteis.html',
            'mapa': 'mapa.html',
            'abrir mapa': 'mapa.html',
            'ver mapa': 'mapa.html',
            'problemas': 'problemas-frequentes.html',
            'problemas frequentes': 'problemas-frequentes.html',
            'viver em faro': 'viver-em-faro.html',
            'viver': 'viver-em-faro.html',
            'mobilidade': 'mobilidade.html',
            'história': 'historia-faro.html',
            'historia': 'historia-faro.html',
            'o que fazer': 'oque-fazer-hoje.html',
            'o que fazer hoje': 'oque-fazer-hoje.html',
            'fazer hoje': 'oque-fazer-hoje.html',
            'eventos': 'oque-fazer-hoje.html',
            'favoritos': 'favoritos.html',
            'meus favoritos': 'favoritos.html',
            'guia premium': 'guia-premium.html',
            'premium': 'guia-premium.html',
            'sobre': 'sobre-projeto.html',
            'sobre o projeto': 'sobre-projeto.html',
            
            // Filter actions (when on filtered pages)
            'filtrar restaurantes': { action: 'filter', category: 'restaurants' },
            'filtrar hotéis': { action: 'filter', category: 'hotels' },
            'filtrar hoteis': { action: 'filter', category: 'hotels' },
            'filtrar centro': { action: 'filter', location: 'centro' },
            'filtrar cafés': { action: 'filter', type: 'cafe' },
            'filtrar cafes': { action: 'filter', type: 'cafe' },
            
            // Search actions
            'procurar': { action: 'search' },
            'pesquisar': { action: 'search' },
            'buscar': { action: 'search' },
            
            // Utility commands
            'ajuda': { action: 'help' },
            'comandos': { action: 'help' },
            'voltar': { action: 'back' },
            'fechar': { action: 'close' }
        },
        'en-US': {
            // Page navigation
            'home': 'index.html',
            'go home': 'index.html',
            'transport': 'transportes.html',
            'open transport': 'transportes.html',
            'health': 'saude.html',
            'open health': 'saude.html',
            'environment': 'ambiente.html',
            'open environment': 'ambiente.html',
            'leisure': 'lazer.html',
            'open leisure': 'lazer.html',
            'restaurants': 'restaurantes.html',
            'open restaurants': 'restaurantes.html',
            'where to eat': 'restaurantes.html',
            'hotels': 'hoteis.html',
            'open hotels': 'hoteis.html',
            'where to stay': 'hoteis.html',
            'accommodation': 'hoteis.html',
            'map': 'mapa.html',
            'open map': 'mapa.html',
            'show map': 'mapa.html',
            'problems': 'problemas-frequentes.html',
            'frequent problems': 'problemas-frequentes.html',
            'living in faro': 'viver-em-faro.html',
            'living': 'viver-em-faro.html',
            'mobility': 'mobilidade.html',
            'history': 'historia-faro.html',
            'what to do': 'oque-fazer-hoje.html',
            'what to do today': 'oque-fazer-hoje.html',
            'events': 'oque-fazer-hoje.html',
            'favorites': 'favoritos.html',
            'my favorites': 'favoritos.html',
            'premium guide': 'guia-premium.html',
            'premium': 'guia-premium.html',
            'about': 'sobre-projeto.html',
            'about project': 'sobre-projeto.html',
            
            // Filter actions
            'filter restaurants': { action: 'filter', category: 'restaurants' },
            'filter hotels': { action: 'filter', category: 'hotels' },
            'filter center': { action: 'filter', location: 'center' },
            'filter cafes': { action: 'filter', type: 'cafe' },
            
            // Search actions
            'search': { action: 'search' },
            'find': { action: 'search' },
            
            // Utility commands
            'help': { action: 'help' },
            'commands': { action: 'help' },
            'back': { action: 'back' },
            'close': { action: 'close' }
        }
    };

    /**
     * Initialize voice navigation
     */
    function initVoiceNavigation() {
        createVoiceNavigationUI();
        
        if (voiceNavState.enabled) {
            setupRecognition();
        }
        
        // Listen for language changes
        document.addEventListener('languageChanged', function(e) {
            voiceNavState.currentLanguage = e.detail.language === 'en' ? 'en-US' : 'pt-PT';
            if (voiceNavState.recognition) {
                voiceNavState.recognition.lang = voiceNavState.currentLanguage;
            }
            // Update UI text when language changes
            updateUITranslations();
        });
        
        // Listen for i18n loaded event
        document.addEventListener('i18nLoaded', function() {
            updateUITranslations();
        });
    }
    
    /**
     * Update UI translations
     */
    function updateUITranslations() {
        // Update toggle button
        const toggleBtn = document.getElementById('voice-nav-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label', getTranslation('voice_nav.toggle_label'));
        }
        
        // Update modal elements
        const modal = document.querySelector('.voice-nav-modal');
        if (modal) {
            const title = modal.querySelector('h2');
            if (title) title.textContent = getTranslation('voice_nav.modal_title');
            
            const status = document.getElementById('voice-status');
            if (status && !voiceNavState.listening) {
                status.textContent = getTranslation('voice_nav.status_ready');
            }
            
            const startBtn = document.getElementById('voice-start-btn');
            if (startBtn) {
                startBtn.textContent = voiceNavState.listening 
                    ? getTranslation('voice_nav.stop_listening')
                    : getTranslation('voice_nav.start_listening');
            }
            
            const closeBtn = document.getElementById('voice-close-btn');
            if (closeBtn) closeBtn.textContent = getTranslation('voice_nav.close');
            
            const helpToggle = document.getElementById('voice-help-toggle');
            if (helpToggle) {
                const helpSection = document.getElementById('voice-commands-help');
                const isVisible = helpSection && helpSection.style.display !== 'none';
                helpToggle.textContent = isVisible 
                    ? getTranslation('voice_nav.hide_commands')
                    : getTranslation('voice_nav.show_commands');
            }
            
            const helpTitle = modal.querySelector('.voice-commands-help h3');
            if (helpTitle) helpTitle.textContent = getTranslation('voice_nav.example_commands');
            
            // Update commands list
            populateCommandsHelp();
        }
    }

    /**
     * Create voice navigation UI elements
     */
    function createVoiceNavigationUI() {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'voice-nav-toggle';
        toggleBtn.className = 'voice-nav-toggle';
        toggleBtn.setAttribute('aria-label', getTranslation('voice_nav.toggle_label'));
        toggleBtn.setAttribute('aria-pressed', voiceNavState.enabled);
        toggleBtn.innerHTML = '<span aria-hidden="true">🎤</span>';
        
        if (voiceNavState.enabled) {
            toggleBtn.classList.add('active');
        }
        
        toggleBtn.addEventListener('click', toggleVoiceNavigation);
        document.body.appendChild(toggleBtn);
        
        // Create overlay modal
        const overlay = document.createElement('div');
        overlay.id = 'voice-nav-overlay';
        overlay.className = 'voice-nav-overlay';
        overlay.innerHTML = `
            <div class="voice-nav-modal">
                <h2>${getTranslation('voice_nav.modal_title')}</h2>
                <div class="voice-mic-icon" id="voice-mic-icon">🎤</div>
                <div class="voice-status" id="voice-status">${getTranslation('voice_nav.status_ready')}</div>
                <div class="voice-transcript" id="voice-transcript"></div>
                
                <div class="voice-controls">
                    <button class="voice-btn voice-btn-primary" id="voice-start-btn">
                        ${getTranslation('voice_nav.start_listening')}
                    </button>
                    <button class="voice-btn voice-btn-secondary" id="voice-close-btn">
                        ${getTranslation('voice_nav.close')}
                    </button>
                </div>
                
                <div class="voice-help-section">
                    <button class="voice-help-toggle" id="voice-help-toggle">
                        ${getTranslation('voice_nav.show_commands')}
                    </button>
                </div>
                
                <div class="voice-commands-help" id="voice-commands-help" style="display: none;">
                    <h3>${getTranslation('voice_nav.example_commands')}</h3>
                    <ul id="voice-commands-list"></ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners
        document.getElementById('voice-start-btn').addEventListener('click', startListening);
        document.getElementById('voice-close-btn').addEventListener('click', closeVoiceModal);
        document.getElementById('voice-help-toggle').addEventListener('click', toggleCommandsHelp);
        
        // Close modal on overlay click
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeVoiceModal();
            }
        });
        
        // Populate commands help
        populateCommandsHelp();
    }

    /**
     * Get translation with fallback
     */
    function getTranslation(key) {
        // Try to get from i18n first
        if (window.i18n && window.i18n.t) {
            const translation = window.i18n.t(key);
            if (translation && translation !== key) {
                return translation;
            }
        }
        
        // Fallback translations (Portuguese)
        const fallbacks = {
            'voice_nav.toggle_label': 'Ativar/desativar navegação por voz',
            'voice_nav.modal_title': 'Navegação por Voz',
            'voice_nav.status_ready': 'Pronto para ouvir',
            'voice_nav.status_listening': 'A ouvir...',
            'voice_nav.status_processing': 'A processar...',
            'voice_nav.start_listening': 'Começar a Ouvir',
            'voice_nav.stop_listening': 'Parar de Ouvir',
            'voice_nav.close': 'Fechar',
            'voice_nav.show_commands': 'Ver comandos disponíveis',
            'voice_nav.hide_commands': 'Ocultar comandos',
            'voice_nav.example_commands': 'Exemplos de Comandos',
            'voice_nav.enabled': 'Navegação por voz ativada',
            'voice_nav.disabled': 'Navegação por voz desativada',
            'voice_nav.command_recognized': 'Comando reconhecido',
            'voice_nav.command_not_recognized': 'Comando não reconhecido',
            'voice_nav.navigating': 'A navegar para',
            'voice_nav.not_supported': 'Navegação por voz não suportada neste navegador',
            'voice_nav.no_speech_detected': 'Nenhuma fala detectada',
            'voice_nav.mic_permission_denied': 'Permissão de microfone negada',
            'voice_nav.filter_applied': 'Filtro aplicado'
        };
        
        return fallbacks[key] || key;
    }

    /**
     * Toggle voice navigation on/off
     */
    function toggleVoiceNavigation() {
        voiceNavState.enabled = !voiceNavState.enabled;
        localStorage.setItem('voice-nav-enabled', voiceNavState.enabled);
        
        const toggleBtn = document.getElementById('voice-nav-toggle');
        toggleBtn.setAttribute('aria-pressed', voiceNavState.enabled);
        
        if (voiceNavState.enabled) {
            toggleBtn.classList.add('active');
            setupRecognition();
            showToast(getTranslation('voice_nav.enabled'), 'success');
            showVoiceModal();
        } else {
            toggleBtn.classList.remove('active');
            if (voiceNavState.recognition) {
                try {
                    voiceNavState.recognition.abort(); // Use abort() for better cleanup on iOS
                } catch (e) {
                    voiceNavState.recognition.stop();
                }
                voiceNavState.recognition = null;
            }
            voiceNavState.listening = false;
            showToast(getTranslation('voice_nav.disabled'), 'info');
        }
    }

    /**
     * Setup speech recognition
     */
    function setupRecognition() {
        if (voiceNavState.recognition) {
            return; // Already set up
        }
        
        voiceNavState.recognition = new SpeechRecognition();
        voiceNavState.recognition.lang = voiceNavState.currentLanguage;
        voiceNavState.recognition.continuous = false;
        voiceNavState.recognition.interimResults = true;
        voiceNavState.recognition.maxAlternatives = 1;
        
        voiceNavState.recognition.onstart = function() {
            voiceNavState.listening = true;
            updateListeningUI(true);
        };
        
        voiceNavState.recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            const confidence = event.results[0][0].confidence;
            
            // Update transcript display
            const transcriptEl = document.getElementById('voice-transcript');
            if (transcriptEl) {
                transcriptEl.textContent = transcript;
            }
            
            // Only process final results
            if (event.results[0].isFinal) {
                processVoiceCommand(transcript, confidence);
            }
        };
        
        voiceNavState.recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            voiceNavState.listening = false;
            updateListeningUI(false);
            
            let errorMessage = getTranslation('voice_nav.command_not_recognized');
            if (event.error === 'no-speech') {
                errorMessage = getTranslation('voice_nav.no_speech_detected');
            } else if (event.error === 'not-allowed') {
                errorMessage = getTranslation('voice_nav.mic_permission_denied');
            }
            
            const statusEl = document.getElementById('voice-status');
            if (statusEl) {
                statusEl.textContent = errorMessage;
                statusEl.className = 'voice-status';
            }
        };
        
        voiceNavState.recognition.onend = function() {
            voiceNavState.listening = false;
            updateListeningUI(false);
        };
    }

    /**
     * Start listening for voice commands
     */
    function startListening() {
        if (!voiceNavState.recognition) {
            setupRecognition();
        }
        
        if (voiceNavState.listening) {
            voiceNavState.recognition.stop();
        } else {
            // Clear previous transcript
            const transcriptEl = document.getElementById('voice-transcript');
            if (transcriptEl) {
                transcriptEl.textContent = '';
            }
            
            const statusEl = document.getElementById('voice-status');
            if (statusEl) {
                statusEl.textContent = getTranslation('voice_nav.status_listening');
                statusEl.className = 'voice-status listening';
            }
            
            voiceNavState.recognition.start();
        }
    }

    /**
     * Process recognized voice command
     */
    function processVoiceCommand(transcript, confidence) {
        const statusEl = document.getElementById('voice-status');
        if (statusEl) {
            statusEl.textContent = getTranslation('voice_nav.status_processing');
            statusEl.className = 'voice-status';
        }
        
        // Get command map for current language
        const commandMap = commandMaps[voiceNavState.currentLanguage] || commandMaps['pt-PT'];
        
        // Try exact match first
        let command = commandMap[transcript];
        
        // If no exact match, try partial matches
        if (!command) {
            for (const key in commandMap) {
                if (transcript.includes(key) || key.includes(transcript)) {
                    command = commandMap[key];
                    break;
                }
            }
        }
        
        if (command) {
            executeCommand(command, transcript);
        } else {
            // Try to use search as fallback
            if (transcript.length > 2) {
                showToast(`${getTranslation('voice_nav.command_not_recognized')}: "${transcript}"`, 'error');
                
                if (statusEl) {
                    statusEl.textContent = getTranslation('voice_nav.command_not_recognized');
                    statusEl.className = 'voice-status';
                }
                
                // Auto-close modal after a delay
                setTimeout(() => {
                    const startBtn = document.getElementById('voice-start-btn');
                    if (startBtn && statusEl) {
                        statusEl.textContent = getTranslation('voice_nav.status_ready');
                        startBtn.textContent = getTranslation('voice_nav.start_listening');
                    }
                }, 2000);
            }
        }
    }

    /**
     * Execute a voice command
     */
    function executeCommand(command, transcript) {
        const statusEl = document.getElementById('voice-status');
        
        if (typeof command === 'string') {
            // Navigation command
            if (statusEl) {
                statusEl.textContent = `${getTranslation('voice_nav.navigating')} ${transcript}...`;
                statusEl.className = 'voice-status success';
            }
            
            showToast(`${getTranslation('voice_nav.command_recognized')}: "${transcript}"`, 'success');
            
            setTimeout(() => {
                window.location.href = command;
            }, 500);
            
        } else if (typeof command === 'object') {
            // Action command
            switch (command.action) {
                case 'help':
                    toggleCommandsHelp();
                    if (statusEl) {
                        statusEl.textContent = getTranslation('voice_nav.status_ready');
                        statusEl.className = 'voice-status';
                    }
                    break;
                    
                case 'back':
                    window.history.back();
                    break;
                    
                case 'close':
                    closeVoiceModal();
                    break;
                    
                case 'search':
                    // Focus on search input if available
                    const searchInput = document.getElementById('global-search-input');
                    if (searchInput) {
                        closeVoiceModal();
                        searchInput.focus();
                    }
                    break;
                    
                case 'filter':
                    // Apply filter if on appropriate page
                    applyFilter(command);
                    break;
                    
                default:
                    showToast(getTranslation('voice_nav.command_not_recognized'), 'error');
            }
        }
    }

    /**
     * Apply filter based on voice command
     */
    function applyFilter(filterCommand) {
        // This would integrate with existing filter functionality
        showToast(getTranslation('voice_nav.filter_applied'), 'success');
        
        // Example: trigger filter button click if available
        if (filterCommand.category) {
            const filterBtn = document.querySelector(`[data-filter="${filterCommand.category}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
        }
    }

    /**
     * Update UI based on listening state
     */
    function updateListeningUI(isListening) {
        const micIcon = document.getElementById('voice-mic-icon');
        const startBtn = document.getElementById('voice-start-btn');
        const toggleBtn = document.getElementById('voice-nav-toggle');
        
        if (isListening) {
            if (micIcon) micIcon.classList.add('listening');
            if (toggleBtn) toggleBtn.classList.add('listening');
            if (startBtn) startBtn.textContent = getTranslation('voice_nav.stop_listening');
        } else {
            if (micIcon) micIcon.classList.remove('listening');
            if (toggleBtn) toggleBtn.classList.remove('listening');
            if (startBtn) startBtn.textContent = getTranslation('voice_nav.start_listening');
        }
    }

    /**
     * Show voice modal
     */
    function showVoiceModal() {
        const overlay = document.getElementById('voice-nav-overlay');
        if (overlay) {
            overlay.classList.add('show');
            
            // Focus on start button
            const startBtn = document.getElementById('voice-start-btn');
            if (startBtn) {
                setTimeout(() => startBtn.focus(), 100);
            }
        }
    }

    /**
     * Close voice modal
     */
    function closeVoiceModal() {
        const overlay = document.getElementById('voice-nav-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
        
        // Stop listening if active - use abort() for more aggressive cleanup on iOS
        if (voiceNavState.listening && voiceNavState.recognition) {
            try {
                voiceNavState.recognition.abort(); // More aggressive than stop() for iOS
            } catch (e) {
                // Fallback to stop if abort fails
                voiceNavState.recognition.stop();
            }
        }
        
        // Reset status
        const statusEl = document.getElementById('voice-status');
        if (statusEl) {
            statusEl.textContent = getTranslation('voice_nav.status_ready');
            statusEl.className = 'voice-status';
        }
        
        // Clear transcript
        const transcriptEl = document.getElementById('voice-transcript');
        if (transcriptEl) {
            transcriptEl.textContent = '';
        }
    }

    /**
     * Toggle commands help display
     */
    function toggleCommandsHelp() {
        const helpSection = document.getElementById('voice-commands-help');
        const toggleBtn = document.getElementById('voice-help-toggle');
        
        if (helpSection && toggleBtn) {
            const isVisible = helpSection.style.display !== 'none';
            helpSection.style.display = isVisible ? 'none' : 'block';
            toggleBtn.textContent = isVisible 
                ? getTranslation('voice_nav.show_commands') 
                : getTranslation('voice_nav.hide_commands');
        }
    }

    /**
     * Populate commands help list
     */
    function populateCommandsHelp() {
        const commandsList = document.getElementById('voice-commands-list');
        if (!commandsList) return;
        
        const currentLang = voiceNavState.currentLanguage;
        const exampleCommands = currentLang === 'en-US' 
            ? [
                '"Open restaurants"',
                '"Go to map"',
                '"Show hotels"',
                '"What to do today"',
                '"Search"',
                '"Help"'
              ]
            : [
                '"Abrir restaurantes"',
                '"Ver mapa"',
                '"Mostrar hotéis"',
                '"O que fazer hoje"',
                '"Pesquisar"',
                '"Ajuda"'
              ];
        
        commandsList.innerHTML = exampleCommands
            .map(cmd => `<li><code>${cmd}</code></li>`)
            .join('');
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.voice-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = `voice-toast ${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Hide and remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVoiceNavigation);
    } else {
        initVoiceNavigation();
    }
    
    // Cleanup on page unload - important for iOS Safari to release microphone
    window.addEventListener('beforeunload', function() {
        if (voiceNavState.recognition) {
            try {
                voiceNavState.recognition.abort();
            } catch (e) {
                voiceNavState.recognition.stop();
            }
            voiceNavState.recognition = null;
            voiceNavState.listening = false;
        }
    });
    
    // Also cleanup on visibility change (when tab becomes hidden)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && voiceNavState.listening && voiceNavState.recognition) {
            try {
                voiceNavState.recognition.abort();
            } catch (e) {
                voiceNavState.recognition.stop();
            }
            voiceNavState.listening = false;
            updateListeningUI(false);
        }
    });

    // Expose API for external use
    window.voiceNavigation = {
        toggle: toggleVoiceNavigation,
        startListening: startListening,
        isEnabled: () => voiceNavState.enabled,
        isListening: () => voiceNavState.listening
    };

})();
