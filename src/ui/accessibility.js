// accessibility.js - Sistema de Acessibilidade

(function() {
    'use strict';

    // Estado da acessibilidade
    const accessibilityState = {
        fontSize: parseInt(localStorage.getItem('accessibility-fontSize')) || 100,
        highContrast: localStorage.getItem('accessibility-highContrast') === 'true'
    };

    // Inicializar acessibilidade quando DOM carregar
    function initAccessibility() {
        createAccessibilityToolbar();
        applyAccessibilitySettings();
        setupKeyboardNavigation();
        addSkipLink();
    }

    // Criar barra de ferramentas de acessibilidade
    function createAccessibilityToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'accessibility-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        
        // Get translations with fallbacks
        const toolbarLabel = window.i18n?.t('accessibility.toolbar_label') || 'Ferramentas de acessibilidade';
        const openMenu = window.i18n?.t('accessibility.open_menu') || 'Abrir menu de acessibilidade';
        const menuTitle = window.i18n?.t('accessibility.menu_title') || 'Opções de Acessibilidade';
        const fontSizeLabel = window.i18n?.t('accessibility.font_size_label') || 'Tamanho da Letra';
        const decreaseFont = window.i18n?.t('accessibility.decrease_font') || 'Diminuir tamanho da letra';
        const resetFont = window.i18n?.t('accessibility.reset_font') || 'Redefinir tamanho da letra';
        const increaseFont = window.i18n?.t('accessibility.increase_font') || 'Aumentar tamanho da letra';
        const contrastLabel = window.i18n?.t('accessibility.contrast_label') || 'Contraste';
        const toggleContrast = window.i18n?.t('accessibility.toggle_contrast') || 'Alternar modo de alto contraste';
        const highContrast = window.i18n?.t('accessibility.high_contrast') || 'Alto Contraste';
        const keyboardShortcuts = window.i18n?.t('accessibility.keyboard_shortcuts') || 'Atalhos de teclado:';
        const shortcutOpenMenu = window.i18n?.t('accessibility.shortcut_open_menu') || 'Abrir menu';
        const shortcutIncrease = window.i18n?.t('accessibility.shortcut_increase') || 'Aumentar letra';
        const shortcutDecrease = window.i18n?.t('accessibility.shortcut_decrease') || 'Diminuir letra';
        const shortcutContrast = window.i18n?.t('accessibility.shortcut_contrast') || 'Alto contraste';
        
        toolbar.setAttribute('aria-label', toolbarLabel);
        
        toolbar.innerHTML = `
            <button class="accessibility-toggle" 
                    aria-label="${openMenu}"
                    aria-expanded="false"
                    aria-controls="accessibility-menu">
                <span aria-hidden="true">♿</span>
                <span class="sr-only">${toolbarLabel}</span>
            </button>
            <div class="accessibility-menu" id="accessibility-menu" role="menu" aria-hidden="true">
                <h3>${menuTitle}</h3>
                
                <div class="accessibility-group" role="group" aria-labelledby="font-size-label">
                    <label id="font-size-label">${fontSizeLabel}</label>
                    <div class="accessibility-controls">
                        <button class="btn-accessibility" 
                                id="decrease-font" 
                                role="menuitem"
                                aria-label="${decreaseFont}">
                            <span aria-hidden="true">A-</span>
                        </button>
                        <button class="btn-accessibility" 
                                id="reset-font" 
                                role="menuitem"
                                aria-label="${resetFont}">
                            <span aria-hidden="true">A</span>
                        </button>
                        <button class="btn-accessibility" 
                                id="increase-font" 
                                role="menuitem"
                                aria-label="${increaseFont}">
                            <span aria-hidden="true">A+</span>
                        </button>
                    </div>
                    <span class="font-size-display" aria-live="polite">${accessibilityState.fontSize}%</span>
                </div>
                
                <div class="accessibility-group" role="group" aria-labelledby="contrast-label">
                    <label id="contrast-label">${contrastLabel}</label>
                    <div class="accessibility-controls">
                        <button class="btn-accessibility btn-toggle" 
                                id="toggle-contrast" 
                                role="menuitemcheckbox"
                                aria-checked="${accessibilityState.highContrast}"
                                aria-label="${toggleContrast}">
                            <span aria-hidden="true">◐</span>
                            <span>${highContrast}</span>
                        </button>
                    </div>
                </div>
                
                <div class="accessibility-info">
                    <p><small>${keyboardShortcuts}</small></p>
                    <ul>
                        <li><kbd>Alt</kbd> + <kbd>A</kbd>: ${shortcutOpenMenu}</li>
                        <li><kbd>Alt</kbd> + <kbd>+</kbd>: ${shortcutIncrease}</li>
                        <li><kbd>Alt</kbd> + <kbd>-</kbd>: ${shortcutDecrease}</li>
                        <li><kbd>Alt</kbd> + <kbd>C</kbd>: ${shortcutContrast}</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(toolbar);
        
        // Event listeners
        const toggleBtn = toolbar.querySelector('.accessibility-toggle');
        const menu = toolbar.querySelector('.accessibility-menu');
        
        toggleBtn.addEventListener('click', () => toggleMenu(toggleBtn, menu));
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!toolbar.contains(e.target)) {
                closeMenu(toggleBtn, menu);
            }
        });
        
        // Controles de fonte
        document.getElementById('increase-font').addEventListener('click', () => adjustFontSize(10));
        document.getElementById('decrease-font').addEventListener('click', () => adjustFontSize(-10));
        document.getElementById('reset-font').addEventListener('click', () => resetFontSize());
        
        // Controle de contraste
        document.getElementById('toggle-contrast').addEventListener('click', toggleHighContrast);
        
        // Navegação por teclado no menu
        menu.addEventListener('keydown', handleMenuKeyboard);
    }

    // Toggle do menu de acessibilidade
    function toggleMenu(button, menu) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        menu.setAttribute('aria-hidden', isExpanded);
        menu.classList.toggle('show');
        
        if (!isExpanded) {
            // Focar no primeiro botão quando abrir
            menu.querySelector('button').focus();
        }
    }

    // Fechar menu
    function closeMenu(button, menu) {
        button.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        menu.classList.remove('show');
    }

    // Ajustar tamanho da fonte
    function adjustFontSize(change) {
        accessibilityState.fontSize = Math.max(80, Math.min(150, accessibilityState.fontSize + change));
        localStorage.setItem('accessibility-fontSize', accessibilityState.fontSize);
        applyFontSize();
        updateFontSizeDisplay();
        announceChange(`Tamanho da letra: ${accessibilityState.fontSize}%`);
    }

    // Resetar tamanho da fonte
    function resetFontSize() {
        accessibilityState.fontSize = 100;
        localStorage.setItem('accessibility-fontSize', '100');
        applyFontSize();
        updateFontSizeDisplay();
        announceChange('Tamanho da letra redefinido para 100%');
    }

    // Aplicar tamanho da fonte
    function applyFontSize() {
        document.documentElement.style.fontSize = `${accessibilityState.fontSize}%`;
    }

    // Atualizar display do tamanho da fonte
    function updateFontSizeDisplay() {
        const display = document.querySelector('.font-size-display');
        if (display) {
            display.textContent = `${accessibilityState.fontSize}%`;
        }
    }

    // Toggle de alto contraste
    function toggleHighContrast() {
        accessibilityState.highContrast = !accessibilityState.highContrast;
        localStorage.setItem('accessibility-highContrast', accessibilityState.highContrast);
        applyHighContrast();
        
        const btn = document.getElementById('toggle-contrast');
        btn.setAttribute('aria-checked', accessibilityState.highContrast);
        
        announceChange(`Alto contraste ${accessibilityState.highContrast ? 'ativado' : 'desativado'}`);
    }

    // Aplicar alto contraste
    function applyHighContrast() {
        if (accessibilityState.highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    // Aplicar todas as configurações de acessibilidade
    function applyAccessibilitySettings() {
        applyFontSize();
        applyHighContrast();
    }

    // Adicionar link "Pular para conteúdo"
    function addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const main = document.querySelector('main');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
                main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true });
            }
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Configurar navegação por teclado
    function setupKeyboardNavigation() {
        // Atalhos de teclado globais
        // NOTA IMPORTANTE: Alt+A pode conflitar com alguns leitores de tela ou funcionalidades
        // do navegador. Se você usa tecnologia assistiva e este atalho causar problemas,
        // pode sempre usar Tab para navegar até o botão de acessibilidade ou desabilitar
        // os atalhos via configurações do seu leitor de tela.
        // Escolhemos Alt+A por ser intuitivo (A de Acessibilidade), mas esteja ciente de
        // possíveis conflitos com JAWS, NVDA ou outras ferramentas.
        document.addEventListener('keydown', (e) => {
            // Alt + A: Abrir menu de acessibilidade (case insensitive)
            if (e.altKey && e.key.toLowerCase() === 'a') {
                e.preventDefault();
                const toggleBtn = document.querySelector('.accessibility-toggle');
                const menu = document.querySelector('.accessibility-menu');
                if (toggleBtn && menu) {
                    toggleMenu(toggleBtn, menu);
                }
            }
            
            // Alt + +: Aumentar fonte
            if (e.altKey && (e.key === '+' || e.key === '=')) {
                e.preventDefault();
                adjustFontSize(10);
            }
            
            // Alt + -: Diminuir fonte
            if (e.altKey && e.key === '-') {
                e.preventDefault();
                adjustFontSize(-10);
            }
            
            // Alt + C: Toggle contraste (case insensitive)
            if (e.altKey && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                toggleHighContrast();
            }
        });
        
        // Melhorar indicadores de foco
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    // Navegação por teclado no menu
    function handleMenuKeyboard(e) {
        const focusableElements = e.currentTarget.querySelectorAll('button, a, [tabindex]:not([tabindex="-1"])');
        const focusedIndex = Array.from(focusableElements).indexOf(document.activeElement);
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (focusedIndex < focusableElements.length - 1) {
                    focusableElements[focusedIndex + 1].focus();
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (focusedIndex > 0) {
                    focusableElements[focusedIndex - 1].focus();
                }
                break;
            case 'Escape':
                e.preventDefault();
                const toggleBtn = document.querySelector('.accessibility-toggle');
                const menu = document.querySelector('.accessibility-menu');
                closeMenu(toggleBtn, menu);
                toggleBtn.focus();
                break;
        }
    }

    // Anunciar mudanças para leitores de tela
    function announceChange(message) {
        const announcement = document.getElementById('accessibility-announcement');
        if (announcement) {
            announcement.textContent = message;
        }
    }

    // Adicionar região de anúncios para leitores de tela
    function addAnnouncementRegion() {
        const region = document.createElement('div');
        region.id = 'accessibility-announcement';
        region.className = 'sr-only';
        region.setAttribute('aria-live', 'polite');
        region.setAttribute('aria-atomic', 'true');
        document.body.appendChild(region);
    }

    // Inicializar quando DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            addAnnouncementRegion();
            initAccessibility();
        });
    } else {
        addAnnouncementRegion();
        initAccessibility();
    }
})();
