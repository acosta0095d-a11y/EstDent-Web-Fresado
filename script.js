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

        if (!isMobileScreen()) {
            hamburgerButton.classList.add('hidden');
            hamburgerButton.classList.remove('show-mobile');
            hamburgerButton.classList.remove('show-desktop');
            return;
        }

        hamburgerButton.classList.remove('hidden');
        hamburgerButton.classList.add('show-mobile');
        hamburgerButton.classList.remove('show-desktop');
    };

    const handleHeaderScroll = () => {
        const header = document.getElementById('main-header');
        if (!header) return;
        const isMobile = isMobileScreen();

        if (!isMobile) {
            header.classList.remove('header-hidden');
            if (window.scrollY > 24) {
                header.classList.add('header-shrink');
                header.classList.remove('header-hero');
            } else {
                header.classList.remove('header-shrink');
                header.classList.add('header-hero');
            }
            return;
        }

        if (window.scrollY > 10) {
            header.classList.add('header-hidden');
            header.classList.remove('header-shrink', 'header-hero');
        } else {
            header.classList.remove('header-hidden');
            header.classList.remove('header-shrink');
            header.classList.add('header-hero');
        }
    };

    window.addEventListener('resize', () => {
        updateHamburgerVisibility();
        handleHeaderScroll();
    });
    window.addEventListener('scroll', () => {
        handleHeaderScroll();
        updateHamburgerVisibility();
    });
    updateHamburgerVisibility();
    handleHeaderScroll();

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            openMenu();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            closeMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            e.stopPropagation();
            closeMenu();
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    const whatsappBtn = document.getElementById('whatsappBtn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            irAWhatsapp();
        });
    }

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

    const videoDientes = document.getElementById('video-dientes');
    if (videoDientes) {
        const seekTo18 = () => {
            if (videoDientes.duration && videoDientes.currentTime < 18) {
                videoDientes.currentTime = 18;
            }
        };
        videoDientes.addEventListener('loadedmetadata', seekTo18, { once: true });
        videoDientes.addEventListener('canplay', seekTo18, { once: true });
        videoDientes.addEventListener('timeupdate', () => {
            if (videoDientes.currentTime < 17.5) {
                videoDientes.currentTime = 18;
            }
        });
    }

    const tryPlayVideos = () => {
        videoElements.forEach(video => {
            if (video.paused && video.muted) {
                video.play().catch(() => {});
            }
        });
    };

    document.body.classList.add('js-reveal');
    const revealEls = document.querySelectorAll('.reveal');
    const staggerEls = document.querySelectorAll('.reveal-stagger');

    const activateReveal = (el, observer) => {
        el.classList.add('in-view');
        if (observer) observer.unobserve(el);
    };

    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) activateReveal(entry.target, revealObserver);
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

        revealEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('in-view');
            } else {
                revealObserver.observe(el);
            }
        });
    }

    if (staggerEls.length > 0) {
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) activateReveal(entry.target, staggerObserver);
            });
        }, { threshold: 0.1 });

        staggerEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                el.classList.add('in-view');
            } else {
                staggerObserver.observe(el);
            }
        });
    }

    document.addEventListener('click', tryPlayVideos, { once: true, passive: true });
    document.addEventListener('touchstart', tryPlayVideos, { once: true, passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            tryPlayVideos();
        }
    });

    initInfiniteCarousel({
        carouselId: 'materials-carousel',
        trackSelector: '.materials-track',
        cardSelector: '.promo-card',
        prevId: 'materials-prev',
        nextId: 'materials-next',
        speed: 0.45
    });
    initInfiniteCarousel({
        carouselId: 'gallery-carousel',
        trackSelector: '.materials-track',
        cardSelector: '.gallery-card',
        prevId: 'gallery-prev',
        nextId: 'gallery-next',
        speed: 0.45
    });
    initInfiniteCarousel({
        carouselId: 'faq-carousel',
        trackSelector: '.materials-track',
        cardSelector: '.faq-slide',
        prevId: 'faq-prev',
        nextId: 'faq-next',
        speed: 0.45,
        highlightCenter: true,
        autoInterval: 2200
    });
    initHeroTyped();
});

function initHeroTyped() {
    const el = document.getElementById('hero-typed');
    if (!el || typeof Typed === 'undefined') return;

    const isLargeScreen = window.innerWidth >= 1024;
    const mobileText = 'Zirconio, disilicato y PMMA. Ajuste micrométrico y entrega ágil.';
    const desktopText = 'Para odontólogos, laboratorios, clínicas, talleres metálicos y técnicos que necesitan fresado de confianza. Estructuras en zirconio, disilicato y PMMA con inLab MC X5 — ajuste marginal micrométrico y entrega ágil.';
    const fullText = isLargeScreen ? desktopText : mobileText;

    new Typed(el, {
        strings: [fullText],
        typeSpeed: 14,
        backSpeed: 0,
        showCursor: true,
        cursorChar: '|',
        loop: false,
        onComplete(self) {
            const cursor = el.parentElement?.querySelector('.typed-cursor');
            if (cursor) cursor.classList.add('typed-cursor--done');
        }
    });
}

function initInfiniteCarousel({ carouselId, trackSelector, cardSelector, prevId, nextId, speed = 0.4, highlightCenter = true, autoInterval = 2800 }) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const track = carousel.querySelector(trackSelector);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track) return;

    const originals = [...track.querySelectorAll(cardSelector)];
    if (originals.length === 0) return;

    originals.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.classList.remove('is-center', 'is-side');
        track.appendChild(clone);
    });

    const allCards = [...track.querySelectorAll(cardSelector)];
    const isMobileCarousel = () => window.matchMedia('(max-width: 767px)').matches;

    let offset = 0;
    let activeIndex = 0;
    let paused = false;
    let nudging = false;
    let setWidth = 0;
    let gap = 0;
    let sidePad = 0;
    let rafId = null;
    let autoTimer = null;

    const measure = () => {
        const style = getComputedStyle(track);
        gap = parseFloat(style.gap) || parseFloat(style.columnGap) || 20;
        setWidth = 0;
        for (let i = 0; i < originals.length; i++) {
            setWidth += originals[i].offsetWidth + gap;
        }
        const cardWidth = originals[0]?.offsetWidth || 0;
        sidePad = Math.max(0, (carousel.clientWidth - cardWidth) / 2);
        track.style.paddingLeft = `${sidePad}px`;
        track.style.paddingRight = `${sidePad}px`;
    };

    const getOffsetForCard = (cardEl) => {
        const idx = allCards.indexOf(cardEl);
        if (idx < 0) return offset;
        let pos = 0;
        for (let i = 0; i < idx; i++) {
            pos += allCards[i].offsetWidth + gap;
        }
        const cardW = allCards[idx].offsetWidth;
        return sidePad + pos + cardW / 2 - carousel.clientWidth / 2;
    };

    const applyTransform = (animate = false) => {
        track.style.transition = animate ? 'transform 0.48s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none';
        track.style.transform = `translateX(-${offset}px)`;
    };

    const normalizeOffset = () => {
        if (setWidth <= 0) return;
        while (offset >= setWidth) offset -= setWidth;
        while (offset < 0) offset += setWidth;
    };

    const getCenteredCard = () => {
        const carouselRect = carousel.getBoundingClientRect();
        const centerX = carouselRect.left + carouselRect.width / 2;
        let closest = allCards[0];
        let closestDist = Infinity;

        allCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const dist = Math.abs(cardCenter - centerX);
            if (dist < closestDist) {
                closestDist = dist;
                closest = card;
            }
        });

        return closest;
    };

    const updateCenter = () => {
        if (!highlightCenter) return;

        if (isMobileCarousel()) {
            allCards.forEach((card, i) => {
                const isOriginal = i < originals.length;
                const logicalIdx = i % originals.length;
                const isActive = isOriginal && logicalIdx === activeIndex;
                card.classList.toggle('is-center', isActive);
                card.classList.remove('is-side');
            });
            return;
        }

        const closest = getCenteredCard();
        if (!closest) return;
        const idx = allCards.indexOf(closest);

        allCards.forEach((card, i) => {
            card.classList.toggle('is-center', card === closest);
            card.classList.toggle('is-side', i === idx - 1 || i === idx + 1);
        });
    };

    const snapToIndex = (index, animate = true, direction = 0) => {
        const len = originals.length;
        const prevIndex = activeIndex;
        activeIndex = ((index % len) + len) % len;

        // Bucle infinito: última → primera vía clon (sin saltar atrás)
        if (isMobileCarousel() && animate && direction > 0 && len > 1 && prevIndex === len - 1 && activeIndex === 0) {
            const firstClone = allCards[len];
            offset = getOffsetForCard(firstClone);
            allCards.forEach((card, i) => {
                card.classList.toggle('is-center', i === len);
                card.classList.remove('is-side');
            });
            applyTransform(true);
            window.setTimeout(() => {
                offset = getOffsetForCard(originals[0]);
                applyTransform(false);
                updateCenter();
            }, 490);
            return;
        }

        offset = getOffsetForCard(originals[activeIndex]);
        applyTransform(animate);
        updateCenter();
    };

    const snapToCard = (cardEl, animate = true) => {
        if (!cardEl) return;

        const origIdx = originals.indexOf(cardEl);
        if (origIdx >= 0 && isMobileCarousel()) {
            snapToIndex(origIdx, animate);
            return;
        }

        offset = getOffsetForCard(cardEl);
        if (!isMobileCarousel()) normalizeOffset();
        applyTransform(animate);
        updateCenter();
    };

    const snapToNearest = (animate = true) => {
        if (isMobileCarousel()) {
            snapToIndex(activeIndex, animate);
            return;
        }
        snapToCard(getCenteredCard(), animate);
    };

    const advanceOne = (direction = 1, animate = true) => {
        if (isMobileCarousel()) {
            snapToIndex(activeIndex + direction, animate, direction);
            return;
        }

        const current = getCenteredCard();
        const idx = allCards.indexOf(current);
        if (idx < 0) return;
        let nextIdx = idx + direction;
        if (nextIdx >= allCards.length) nextIdx = 0;
        if (nextIdx < 0) nextIdx = allCards.length - 1;
        snapToCard(allCards[nextIdx], animate);
    };

    const tick = () => {
        if (!isMobileCarousel() && !paused && !nudging && setWidth > 0) {
            offset += speed;
            normalizeOffset();
            applyTransform(false);
            updateCenter();
        }
        rafId = requestAnimationFrame(tick);
    };

    const startAuto = () => {
        clearInterval(autoTimer);
        if (isMobileCarousel()) {
            autoTimer = setInterval(() => {
                if (!paused && !nudging) advanceOne(1, true);
            }, autoInterval);
        }
    };

    const nudge = (direction) => {
        if (nudging || setWidth <= 0) return;
        nudging = true;
        paused = true;
        advanceOne(direction, true);

        window.setTimeout(() => {
            nudging = false;
            paused = false;
        }, 500);
    };

    const onTransitionEnd = (event) => {
        if (event.target !== track || event.propertyName !== 'transform') return;
        if (isMobileCarousel()) updateCenter();
    };

    prevBtn?.addEventListener('click', () => nudge(-1));
    nextBtn?.addEventListener('click', () => nudge(1));
    track.addEventListener('transitionend', onTransitionEnd);
    carousel.addEventListener('mouseenter', () => { paused = true; });
    carousel.addEventListener('mouseleave', () => { if (!nudging) paused = false; });

    const onResize = () => {
        measure();
        if (isMobileCarousel()) {
            snapToIndex(activeIndex, false);
        } else {
            snapToNearest(false);
        }
        clearInterval(autoTimer);
        startAuto();
    };

    window.addEventListener('resize', onResize);
    measure();
    snapToIndex(0, false);
    startAuto();
    rafId = requestAnimationFrame(tick);

    return () => {
        cancelAnimationFrame(rafId);
        clearInterval(autoTimer);
        track.removeEventListener('transitionend', onTransitionEnd);
        window.removeEventListener('resize', onResize);
    };
}

function irAWhatsapp() {
    const telefono = "573142194594";
    const mensaje = "Hola, estoy interesado en un servicio de fresado con la inLab MC X5.";
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
}
