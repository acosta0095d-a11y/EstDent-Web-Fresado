document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    const closeMenu = () => {
        if (!sidebar || !overlay) return;
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('opacity-0');
        overlay.style.pointerEvents = 'none';
        overlay.classList.add('hidden');
        document.body.classList.remove('menu-open');
        updateHamburgerVisibility();
    };

    const openMenu = () => {
        if (!sidebar || !overlay || !hamburgerButton) return;
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        overlay.style.pointerEvents = 'auto';
        overlay.classList.remove('opacity-0');
        document.body.classList.add('menu-open');
        hamburgerButton.classList.add('hidden');
    };

    const hamburgerButton = openBtn;
    const isMenuOpen = () => document.body.classList.contains('menu-open');
    const isMobileScreen = () => window.matchMedia('(max-width: 1024px)').matches;
    const updateHamburgerVisibility = () => {
        if (!hamburgerButton) return;
        if (isMenuOpen()) {
            hamburgerButton.classList.add('hidden');
            hamburgerButton.classList.remove('show-mobile');
            hamburgerButton.classList.remove('show-desktop');
            return;
        }

        if (isMobileScreen()) {
            hamburgerButton.classList.remove('hidden');
            hamburgerButton.classList.add('show-mobile');
            hamburgerButton.classList.remove('show-desktop');
            return;
        }

        hamburgerButton.classList.remove('show-mobile');
        hamburgerButton.classList.remove('show-desktop');
        if (window.scrollY > 50) {
            hamburgerButton.classList.remove('hidden');
            hamburgerButton.classList.add('show-desktop');
        } else {
            hamburgerButton.classList.add('hidden');
        }
    };

    const handleHeaderScroll = () => {
        const header = document.getElementById('main-header');
        if (!header) return;
        const isMobile = isMobileScreen();
        const shouldShrink = !isMobile && window.scrollY > 50;
        if (shouldShrink) {
            header.classList.add('header-shrink', 'fixed');
            if (hamburgerButton) {
                hamburgerButton.classList.remove('hidden');
                hamburgerButton.classList.add('show-desktop');
            }
        } else {
            header.classList.remove('header-shrink', 'fixed');
            if (hamburgerButton && !isMobile) {
                hamburgerButton.classList.add('hidden');
                hamburgerButton.classList.remove('show-desktop');
            }
        }
    };

    window.addEventListener('resize', () => {
        updateHamburgerVisibility();
        handleHeaderScroll();
    });
    window.addEventListener('scroll', handleHeaderScroll);
    updateHamburgerVisibility();
    handleHeaderScroll();

    // Abre con el botón hamburguesa
    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            openMenu();
        });
    }

    // Cierra con el botón X
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            closeMenu();
        });
    }

    // Cierra al clickear el overlay (fondo oscuro)
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    }

    // Cierra al clickear cualquier enlace del menú
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
        });
    });

    // Evita que clicks dentro del sidebar cierren el menú
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // WhatsApp
    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            irAWhatsapp();
        });
    }

    // Scroll cards observer
    const scrollCards = document.querySelectorAll('.scroll-zoom');
    if (scrollCards.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        scrollCards.forEach(card => cardObserver.observe(card));
    }

    const videoElements = document.querySelectorAll('video');
    const tryPlayVideos = () => {
        videoElements.forEach(video => {
            if (video.paused && video.muted) {
                video.play().catch(() => {
                    // Si el autoplay está bloqueado, no romperá la página.
                });
            }
        });
    };

    document.addEventListener('click', tryPlayVideos, { once: true, passive: true });
    document.addEventListener('touchstart', tryPlayVideos, { once: true, passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            tryPlayVideos();
        }
    });
});

function irAWhatsapp() {
    const telefono = "573142194594";
    const mensaje = "Hola, estoy interesado en un servicio de fresado con la inLab MC X5.";
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
}
