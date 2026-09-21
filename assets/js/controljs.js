// ==========================================
// CONTROL DE INTRO Y NAVEGACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

  // Si ya vio la intro, la ocultamos de una
  if (hasSeenIntro === 'true') {
    ocultarIntro();
  }
});

function ocultarIntro() {
  const introScreen = document.getElementById('intro-screen');
  const sunContainer = document.getElementById('sun-canvas-container');
  const enterBtn = document.getElementById('enter-btn');

  if (introScreen) introScreen.style.display = 'none';
  if (sunContainer) sunContainer.style.display = 'none';
  if (enterBtn) enterBtn.style.display = 'none';

  // Desbloquear scroll
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  document.body.classList.remove('no-scroll');
}

// La función exacta que llama tu botón onclick
function marcarIntroVista() {
  sessionStorage.setItem('hasSeenIntro', 'true');
  ocultarIntro();
}

// La exponemos para que el onclick del HTML la reconozca sin problemas
window.marcarIntroVista = marcarIntroVista;
