// router.js — Control de la intro y liberación del scroll
(function () {
  const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

  if (hasSeenIntro === 'true') {
    // Si ya vio la intro, desbloqueamos el scroll de una vez antes de pintar la pantalla
    document.documentElement.classList.add('skip-intro');
    document.addEventListener('DOMContentLoaded', () => {
      liberarScroll();
    });
  }
})();

// Función para restaurar el scroll
function liberarScroll() {
  document.body.classList.remove('no-scroll');
  document.documentElement.classList.remove('no-scroll');
  document.body.style.overflow = 'unset';
  document.body.style.overflowY = 'auto';
  document.documentElement.style.overflow = 'unset';
  document.documentElement.style.overflowY = 'auto';
}

// Función que ejecuta el botón de ingresar
function marcarIntroVista() {
  // 1. Guardar en memoria
  sessionStorage.setItem('hasSeenIntro', 'true');
  
  // 2. Ocultar los elementos de la intro
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

  // 3. Forzar liberación del scroll
  liberarScroll();

  // 4. Compatibilidad con tu función previa
  if (typeof enterSite === 'function') {
    enterSite();
  }
}