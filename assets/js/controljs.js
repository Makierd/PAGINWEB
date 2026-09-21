

// 1. Ocultar la intro de inmediato si ya fue vista (antes de renderizar la página)
(function () {
  const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

  if (hasSeenIntro === 'true') {
    // Agrega una clase global para ocultar la intro por CSS si la tienes configurada
    document.documentElement.classList.add('skip-intro');

    // Al cargar el DOM, oculta los contenedores 3D/Intro
    document.addEventListener('DOMContentLoaded', () => {
      const introScreen = document.getElementById('intro-screen');
      const sunContainer = document.getElementById('sun-canvas-container');

      if (introScreen) introScreen.style.display = 'none';
      if (sunContainer) sunContainer.style.display = 'none';

      liberarScroll();
    });
  }
})();

// 2. Función para liberar el scroll de la página
function liberarScroll() {
  document.body.classList.remove('no-scroll');
  document.documentElement.classList.remove('no-scroll');
  document.body.style.overflow = 'unset';
  document.body.style.overflowY = 'auto';
  document.documentElement.style.overflow = 'unset';
  document.documentElement.style.overflowY = 'auto';
}

// 3. Función ejecutada cuando el usuario presiona el botón "Ingresar"
function marcarIntroVista() {
  sessionStorage.setItem('hasSeenIntro', 'true');

  const introScreen = document.getElementById('intro-screen');
  const sunContainer = document.getElementById('sun-canvas-container');

  if (introScreen) {
    introScreen.style.opacity = '0';
    introScreen.style.pointerEvents = 'none';
    setTimeout(() => {
      introScreen.style.display = 'none';
    }, 400);
  }

  if (sunContainer) {
    sunContainer.style.display = 'none';
  }

  liberarScroll();

  if (typeof window.enterSite === 'function') {
    window.enterSite();
  }
}

// Hacer las funciones accesibles globalmente
window.liberarScroll = liberarScroll;
window.marcarIntroVista = marcarIntroVista;
