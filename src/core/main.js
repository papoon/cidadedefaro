// main.js - Script principal da aplicação

document.addEventListener('DOMContentLoaded', function() {
    // Marcar o link da página atual (nav principal + índice)
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });

    initNavIndex();
});

// "Índice" — painel com todas as secções do site (src/partials/navigation.html)
function initNavIndex() {
    const toggle = document.querySelector('.nav-index-toggle');
    const panel = document.getElementById('nav-index');
    if (!toggle || !panel) return;

    const open = () => {
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
    };
    const close = (returnFocus) => {
        if (panel.hidden) return;
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.hidden ? open() : close(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !panel.hidden) close(true);
    });

    document.addEventListener('click', (e) => {
        if (!panel.hidden && !panel.contains(e.target) && !toggle.contains(e.target)) close(false);
    });

    // Fechar quando o foco sai do painel (Tab para fora)
    panel.addEventListener('focusout', (e) => {
        if (e.relatedTarget && !panel.contains(e.relatedTarget) && e.relatedTarget !== toggle) close(false);
    });
}
