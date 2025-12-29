// i18n.js - Internationalization system for Guia de Faro

// Current language and translations cache
let currentLang = 'pt';
let translations = {};

// Initialize i18n system
function initI18n() {
    // Get saved language from localStorage or default to Portuguese
    const savedLang = localStorage.getItem('guiafaro-lang') || 'pt';
    loadLanguage(savedLang);
}

// Load language file and apply translations
async function loadLanguage(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language file: ${lang}`);
        }
        
        translations = await response.json();
        currentLang = lang;
        
        // Save to localStorage
        localStorage.setItem('guiafaro-lang', lang);
        
        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', lang);
        
        // Apply translations to the page
        applyTranslations();
        
        // Update language switcher UI
        updateLanguageSwitcher();
        
        console.log(`Language loaded: ${lang}`);
    } catch (error) {
        console.error('Error loading language:', error);
        // Fallback to Portuguese if there's an error
        if (lang !== 'pt') {
            loadLanguage('pt');
        }
    }
}

// Apply translations to all elements with data-i18n attribute
function applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(key);
        
        if (translation) {
            // Check if element has data-i18n-attr to translate attribute instead of content
            const attr = element.getAttribute('data-i18n-attr');
            const htmlMode = element.getAttribute('data-i18n-html') === 'true';
            if (attr) {
                // Support multiple attributes separated by comma
                const attrs = attr.split(',').map(a => a.trim());
                attrs.forEach(a => {
                    element.setAttribute(a, translation);
                });
            } else if (htmlMode) {
                // Explicit HTML mode: inject translation as HTML. Use only when translations are trusted.
                element.innerHTML = translation;
            } else {
                // For span elements inside links/other elements, default to textContent to avoid accidental HTML injection
                if (element.tagName === 'SPAN') {
                    element.textContent = translation;
                }
                // Preserve HTML structure if element has children with specific classes
                else if (element.querySelector('.favorites-count, .notice-label, .notice-disclaimer')) {
                    // For complex elements, only replace text nodes
                    replaceTextNodes(element, translation);
                } else {
                    element.innerHTML = translation;
                }
            }
        }
        
        // Handle secondary translation attributes (data-i18n2, data-i18n-attr2)
        const key2 = element.getAttribute('data-i18n2');
        if (key2) {
            const translation2 = getNestedTranslation(key2);
            if (translation2) {
                const attr2 = element.getAttribute('data-i18n-attr2');
                if (attr2) {
                    const attrs2 = attr2.split(',').map(a => a.trim());
                    attrs2.forEach(a => {
                        element.setAttribute(a, translation2);
                    });
                }
            }
        }
    });
}

// Helper function to replace only text nodes (preserve child elements)
function replaceTextNodes(element, translation) {
    // Get all child nodes
    const childNodes = Array.from(element.childNodes);
    
    // Find text nodes and replace the first one with translation
    let replaced = false;
    childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && !replaced && node.textContent.trim()) {
            node.textContent = translation;
            replaced = true;
        }
    });
    
    // If no text node found, just set innerHTML
    if (!replaced) {
        element.innerHTML = translation;
    }
}

// Get nested translation using dot notation (e.g., "nav.home")
function getNestedTranslation(key) {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return null;
        }
    }
    
    return value;
}

// Switch to a different language
function switchLanguage(lang) {
    if (lang !== currentLang) {
        loadLanguage(lang);
    }
}

// Update language switcher button to show current language
function updateLanguageSwitcher() {
    const switcher = document.getElementById('lang-switcher');
    if (switcher) {
        const ptBtn = switcher.querySelector('[data-lang="pt"]');
        const enBtn = switcher.querySelector('[data-lang="en"]');
        
        if (ptBtn && enBtn) {
            // Remove active class from all buttons
            ptBtn.classList.remove('active');
            enBtn.classList.remove('active');
            
            // Add active class to current language button
            if (currentLang === 'pt') {
                ptBtn.classList.add('active');
            } else {
                enBtn.classList.add('active');
            }
        }
    }
}

// Get current language
function getCurrentLanguage() {
    return currentLang;
}

// Get translation for a specific key
function getTranslation(key) {
    return getNestedTranslation(key);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initI18n);
} else {
    initI18n();
}

// Export functions for use in other scripts
window.i18n = {
    switchLanguage,
    getCurrentLanguage,
    loadLanguage,
    getTranslation,
    t: getTranslation // alias for convenience
};
