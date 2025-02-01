// Configuración
const CONFIG = {
    SCROLL: {
        FOOTER_THRESHOLD: 300, // px antes del final
        BEHAVIOR: 'smooth',
        BLOCK: 'start'
    },
    ANIMATION: {
        THRESHOLD: 0.15,
        ROOT_MARGIN: '0px 0px -10% 0px'
    },
    WHATSAPP: {
        BUTTON_MARGIN: 100 // px de margen para mostrar/ocultar
    }
};

// Utilidades
const DOM = {
    get: selector => document.querySelector(selector),
    getAll: selector => document.querySelectorAll(selector),
    addClass: (element, className) => element?.classList.add(className),
    removeClass: (element, className) => element?.classList.remove(className),
    toggleClass: (element, className) => element?.classList.toggle(className),
    scrollTo: (options = {}) => window.scrollTo({ behavior: CONFIG.SCROLL.BEHAVIOR, ...options }),
    throttle: (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeMobileMenu();
    initializeScrollLinks();
    initializeScrollButton();
});

// Inicialización de animaciones
function initializeAnimations() {
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                DOM.addClass(entry.target, 'visible');
            }
        }),
        {
            threshold: CONFIG.ANIMATION.THRESHOLD,
            rootMargin: CONFIG.ANIMATION.ROOT_MARGIN
        }
    );

    DOM.getAll('.animate-on-scroll').forEach(element => observer.observe(element));
}

// Inicialización del menú móvil
function initializeMobileMenu() {
    const menuToggle = DOM.get('.menu-toggle');
    const navLinks = DOM.get('.nav-links');
    
    if (!menuToggle || !navLinks) return;

    const toggleMenu = () => {
        DOM.toggleClass(navLinks, 'active');
        DOM.toggleClass(menuToggle, 'active');
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', toggleMenu);
    });
}

// Inicialización de links con scroll suave
function initializeScrollLinks() {
    DOM.getAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetElement = DOM.get(anchor.getAttribute('href'));
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: CONFIG.SCROLL.BEHAVIOR,
                    block: CONFIG.SCROLL.BLOCK
                });

                // Cerrar menú móvil
                const navLinks = DOM.get('.nav-links');
                const menuToggle = DOM.get('.menu-toggle');
                DOM.removeClass(navLinks, 'active');
                DOM.removeClass(menuToggle, 'active');
            }
        });
    });
}

// Inicialización del botón de scroll y WhatsApp
function initializeScrollButton() {
    const scrollButton = DOM.get('.scroll-top-button');
    const whatsappButton = DOM.get('.whatsapp-button');
    const contactButton = DOM.get('.whatsapp-btn');
    
    if (!scrollButton || !whatsappButton || !contactButton) return;

    const toggleButtons = () => {
        const contactButtonRect = contactButton.getBoundingClientRect();
        const isNearContactButton = contactButtonRect.top < window.innerHeight && 
                                  contactButtonRect.bottom > 0;

        if (window.scrollY > 100) { // Mostrar WhatsApp después de un poco de scroll
            if (isNearContactButton) {
                // Cerca del botón de contacto: ocultar WhatsApp y mostrar scroll
                DOM.addClass(whatsappButton, 'hidden');
                DOM.addClass(scrollButton, 'visible');
            } else {
                // En cualquier otra posición con scroll: mostrar WhatsApp y ocultar scroll
                DOM.removeClass(whatsappButton, 'hidden');
                DOM.removeClass(scrollButton, 'visible');
            }
        } else {
            // Al inicio de la página: ocultar ambos botones
            DOM.addClass(whatsappButton, 'hidden');
            DOM.removeClass(scrollButton, 'visible');
        }
    };

    window.addEventListener('scroll', DOM.throttle(toggleButtons, 100));
    scrollButton.addEventListener('click', () => {
        DOM.scrollTo({ top: 0 });
    });

    // Llamada inicial
    toggleButtons();
}
