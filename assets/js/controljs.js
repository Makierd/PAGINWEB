// ==========================================
// CONTROL DE INTRO Y NAVEGACIÓN
// ==========================================

// 1. Comprobar apenas cargue la página
document.addEventListener('DOMContentLoaded', () => {
  const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

  // Si ya vio la intro en esta sesión, la ocultamos directo
  if (hasSeenIntro === 'true') {
    ocultarIntro();
  }
});

// 2. Función interna para ocultar contenedores y liberar scroll
function ocultarIntro() {
  const introScreen = document.getElementById('intro-screen');
  const sunContainer = document.getElementById('sun-canvas-container');
  const enterBtn = document.getElementById('enter-btn');

  if (introScreen) introScreen.style.display = 'none';
  if (sunContainer) sunContainer.style.display = 'none';
  if (enterBtn) enterBtn.style.display = 'none';

  // Liberar scroll en body y html
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  document.body.classList.remove('no-scroll');
}

// 3. Tu función enterSite() que ejecuta el botón al hacer clic
function enterSite() {
  // Guardamos la marca para que recuerde que ya ingresó
  sessionStorage.setItem('hasSeenIntro', 'true');
  
  // Ocultamos todo y liberamos scroll
  ocultarIntro();
}

// Hacer la función accesible globalmente para el onclick="enterSite()"
window.enterSite = enterSite;

// Hacer las funciones accesibles globalmente
window.liberarScroll = liberarScroll;
window.marcarIntroVista = marcarIntroVista;
