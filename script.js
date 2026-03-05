// --- CONFIGURACIÓN DEL MENÚ MÓVIL Y SIDEBAR ---
const openBtn = document.getElementById('open-menu-btn');
const closeBtn = document.getElementById('close-menu-btn');
const sidebar = document.getElementById('mobile-sidebar');
const overlay = document.getElementById('mobile-overlay');
const sidebarLinks = document.querySelectorAll('.sidebar-link'); // Selecciona los links del menú lateral

// Función para ABRIR el menú
function openMenu() {
    if (sidebar && overlay) {
        sidebar.classList.remove('translate-x-full'); // Trae el menú a la pantalla
        overlay.classList.remove('hidden'); // Muestra el fondo oscuro
        setTimeout(() => {
            overlay.classList.remove('opacity-0'); // Efecto fade-in suave
        }, 10);
    }
}

// Función para CERRAR el menú
function closeMenu() {
    if (sidebar && overlay) {
        sidebar.classList.add('translate-x-full'); // Saca el menú de la pantalla
        overlay.classList.add('opacity-0'); // Efecto fade-out
        setTimeout(() => {
            overlay.classList.add('hidden'); // Oculta el fondo después de la animación
        }, 300);
    }
}

// Eventos de botones (Verificamos que existan para evitar errores)
if (openBtn) openBtn.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
if (overlay) overlay.addEventListener('click', closeMenu); // Cierra si tocas el fondo oscuro

// Cierra el menú automáticamente al tocar un enlace del sidebar
sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Un pequeño retraso para que el usuario sienta el "clic" antes de que desaparezca
        setTimeout(closeMenu, 100); 
    });
});

// --- LÓGICA DE WHATSAPP ---
function irAWhatsapp() {
    const telefono = "573142194594"; // Número de Colombia actualizado
    const mensaje = "Hola, estoy interesado en un servicio de fresado con la inLab MC X5.";
    window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// Configurar el botón flotante de WhatsApp
const whatsappBtn = document.getElementById('whatsappBtn');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function(e) {
        e.preventDefault();
        irAWhatsapp();
    });
}

// --- EFECTO DE SCROLL EN EL HEADER ---
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header'); // Usamos el ID específico
    if (header) {
        if (window.scrollY > 50) {
            // Aquí estaba el detalle: debe ser 'header-scrolled' para coincidir con tu CSS
            header.classList.add('header-scrolled'); 
        } else {
            header.classList.remove('header-scrolled');
        }
    }
});


// --- ANIMACIÓN DE ZOOM AL HACER SCROLL (SECCIÓN SERVICIOS) ---
document.addEventListener("DOMContentLoaded", function() {
    // Seleccionamos todas las tarjetas con la clase scroll-zoom
    const scrollCards = document.querySelectorAll('.scroll-zoom');
    
    // Configuramos el observador
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Se activa cuando el 15% de la tarjeta entra en la pantalla
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Le agrega la clase que la hace crecer y aparecer
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);

    // Ponemos a observar cada tarjeta
    scrollCards.forEach(card => {
        cardObserver.observe(card);
    });
});