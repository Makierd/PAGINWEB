document.addEventListener('DOMContentLoaded', () => {
  const spheres = document.querySelectorAll('.sphere');
  const panels = document.querySelectorAll('.program-day-panel');

  spheres.forEach(sphere => {
    sphere.addEventListener('click', () => {
      // Remover clase 'active' de todas las esferas y paneles
      spheres.forEach(s => s.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Activar esfera cliqueada
      sphere.classList.add('active');

      // Mostrar el panel correspondiente
      const dayId = sphere.getAttribute('data-day');
      const targetPanel = document.getElementById(dayId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
});

// Fondo Interactivo de Partículas / Constelaciones
(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';

  let width, height, particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.7 + 0.3;
      this.color = '#38bdf8';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.floor((width * height) / 10000);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();
})();

// Manejo de Ampliación de Imagen al hacer clic en las fotos
document.addEventListener('DOMContentLoaded', () => {
  // Crear el modal en el DOM dinámicamente si no existe
  let imgModal = document.createElement('div');
  imgModal.className = 'img-modal';
  imgModal.innerHTML = `
    <div class="modal-img-container">
      <span class="close-modal-btn">&times;</span>
      <img src="" id="modal-expanded-img" alt="Foto ampliada">
    </div>
  `;
  document.body.appendChild(imgModal);

  const modalImg = document.getElementById('modal-expanded-img');
  const closeBtn = imgModal.querySelector('.close-modal-btn');

  // Evento delegado para detectar clics en cualquier imagen con la clase .zoomable-img
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('zoomable-img')) {
      modalImg.src = e.target.src;
      imgModal.classList.add('show');
    }
  });

  // Cerrar al tocar el botón o fuera de la foto
  closeBtn.addEventListener('click', () => imgModal.classList.remove('show'));
  imgModal.addEventListener('click', (e) => {
    if (e.target === imgModal) imgModal.classList.remove('show');
  });
});

function toggleEvidence(id, btn) {
  const content = document.getElementById(id);
  
  // Alternar clase de apertura
  content.classList.toggle('open');
  btn.classList.toggle('active');
}