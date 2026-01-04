// ux.js - User Experience Interactive Features
// Funcionalidades: Scroll suave, Modo escuro, Filtros, Animações

(function() {
    'use strict';

    // ===================================
    // 1. SMOOTH SCROLL (Scroll Suave)
    // ===================================
    function initSmoothScroll() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add smooth scroll to top button
        const scrollToTopBtn = document.getElementById('scroll-to-top');
        if (scrollToTopBtn) {
            // Show/hide button based on scroll position
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            });

            // Scroll to top on click
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ===================================
    // 2. DARK MODE (Modo Escuro)
    // ===================================
    function initDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (!darkModeToggle) return;

        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.setAttribute('aria-pressed', 'true');
            updateDarkModeIcon(darkModeToggle, true);
            updateLogoForTheme(true);
        }

        // Toggle dark mode
        darkModeToggle.addEventListener('click', function() {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            this.setAttribute('aria-pressed', isDark);
            updateDarkModeIcon(this, isDark);
            updateLogoForTheme(isDark);
        });
    }

    function updateDarkModeIcon(button, isDark) {
        const icon = button.querySelector('.dark-mode-icon');
        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }
    }

    // Update site logo src according to theme, using data attributes on the <img>
    function updateLogoForTheme(isDark) {
        try {
            const img = document.getElementById('site-logo-img');
            if (!img) return;
            const lightSrc = img.getAttribute('data-light-src');
            const darkSrc = img.getAttribute('data-dark-src');
            if (isDark && darkSrc) img.src = darkSrc;
            else if (!isDark && lightSrc) img.src = lightSrc;
        } catch (e) {
            // silent
        }
    }

    // ===================================
    // 3. SIMPLE FILTERS (Filtros Simples)
    // ===================================
    function initFilters() {
        // Generic filter functionality for any page
        const filterContainer = document.querySelector('.filter-container');
        if (!filterContainer) return;

        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        const filterableItems = document.querySelectorAll('[data-filter-category]');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filterValue = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Filter items
                filterableItems.forEach(item => {
                    const categories = item.getAttribute('data-filter-category').split(',');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        item.style.display = '';
                        item.classList.add('fade-in');
                    } else {
                        item.style.display = 'none';
                        item.classList.remove('fade-in');
                    }
                });
            });
        });
    }

    // ===================================
    // 4. LIGHT ANIMATIONS (Animações Leves)
    // ===================================
    function initAnimations() {
        // Fade in elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe cards and sections
        document.querySelectorAll('.card, .hero, .dados-faro-section, section').forEach(element => {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });

        // Add hover animation class to interactive elements
        document.querySelectorAll('.card, .btn, nav a').forEach(element => {
            element.classList.add('animate-hover');
        });
    }

    // ===================================
    // 5. SCROLL TO TOP BUTTON
    // ===================================
    function createScrollToTopButton() {
        // Check if button already exists
        if (document.getElementById('scroll-to-top')) return;

        const button = document.createElement('button');
        button.id = 'scroll-to-top';
        button.className = 'scroll-to-top';
        button.setAttribute('aria-label', 'Voltar ao topo');
        button.innerHTML = '<span class="scroll-icon">↑</span>';
        
        document.body.appendChild(button);
    }

    // ===================================
    // 6. KEYBOARD NAVIGATION IMPROVEMENTS
    // ===================================
    function initKeyboardNavigation() {
        // Add keyboard support for filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.setAttribute('role', 'button');
            button.setAttribute('tabindex', '0');
            
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Trap focus in modal/dialog if any
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close any open modals or overlays
                const openModals = document.querySelectorAll('.modal.show, .overlay.show');
                openModals.forEach(modal => {
                    modal.classList.remove('show');
                });
            }
        });
    }

    // ===================================
    // INITIALIZATION
    // ===================================
    function init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Initialize all features
        createScrollToTopButton();
        initSmoothScroll();
        initDarkMode();
        initFilters();
        initAnimations();
        initKeyboardNavigation();

        // Development mode logging (can be removed in production)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('✨ UX features initialized');
        }
    }

    // Start initialization
    init();

})();
