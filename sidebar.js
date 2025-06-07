// Script para el menú lateral (sidebar)
// Variables del DOM
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('closeBtn');
const sidebarOverlay = document.getElementById('sidebarOverlay');

// Función para abrir el sidebar
function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el sidebar
function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners
menuBtn.addEventListener('click', openSidebar);
closeBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Cerrar sidebar con la tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
    }
});

// Manejar clicks en los elementos del menú
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Navegando a:', this.textContent.trim());
        // Aquí puedes agregar la lógica de navegación
        closeSidebar();
    });
});

// Prevenir que el sidebar se cierre cuando se hace click dentro de él
sidebar.addEventListener('click', function(e) {
    e.stopPropagation();
});
