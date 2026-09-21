let currentSlide = 0;
const slides = document.querySelectorAll('.slide-screen');
const totalSlides = slides.length;
const slidesWorld = document.getElementById('slidesWorld');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let isCoolingDown = false;

function isMobile() {
    return window.innerWidth <= 768;
}

function updateSlidePosition() {
    if (!slidesWorld) return;

    // Detectar si es pantalla móvil
    if (window.innerWidth <= 768) {
        // EN MÓVIL: Mover ÚNICAMENTE en el eje X (horizontal)
        slidesWorld.style.transform = `translateX(-${currentSlide * 100}vw)`;
    } else {
        // EN ESCRITORIO: Mantener tu movimiento diagonal original si así lo tenías
        slidesWorld.style.transform = `translate(-${currentSlide * 100}vw, -${currentSlide * 100}vh)`;
    }
}
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlidePosition();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
}

// Botones de navegación
if (nextBtn) nextBtn.addEventListener('click', nextSlide);
if (prevBtn) prevBtn.addEventListener('click', prevSlide);

// Bloqueamos la rueda del ratón en móvil para no interferir con el scroll hacia el footer
window.addEventListener('wheel', (e) => {
    if (isMobile() || isCoolingDown) return;

    if (e.deltaY > 0) {
        nextSlide();
    } else if (e.deltaY < 0) {
        prevSlide();
    }

    isCoolingDown = true;
    setTimeout(() => { isCoolingDown = false; }, 600);
}, { passive: true });

// Teclas de dirección
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || (e.key === 'ArrowDown' && !isMobile())) {
        nextSlide();
    } else if (e.key === 'ArrowLeft' || (e.key === 'ArrowUp' && !isMobile())) {
        prevSlide();
    }
});

// Recalcular el tamaño exacto si el usuario gira el teléfono
window.addEventListener('resize', updateSlidePosition);

// Inicializar
updateSlidePosition();

// fondo.js — Fondo interactivamente cósmico (Partículas + Gravedad)
(function () {
  // Crear el canvas de fondo
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  // Ajustes de estilo para el canvas
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1'; // Detrás de todo el contenido
  canvas.style.pointerEvents = 'none';

  let width, height;
  let particles = [];
  const mouse = { x: null, y: null, radius: 150 };

  // Redimensionar canvas
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  // Clase Partícula (Estrella)
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.7 + 0.3;
      // Colores de estrellas (azul neón, blanco, celeste)
      const colors = ['#38bdf8', '#818cf8', '#ffffff', '#7dd3fc'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      // Movimiento autónomo constante
      this.x += this.vx;
      this.y += this.vy;

      // Rebotar en los bordes de pantalla
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Interacción con el cursor (Fuerza gravitacional)
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let directionX = (dx / distance) * force * 3;
          let directionY = (dy / distance) * force * 3;

          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    // Cantidad ajustada según el tamaño de la pantalla
    const count = Math.floor((width * height) / 9000);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  // Bucle de animación
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar líneas suaves de constelación si las estrellas están cerca
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 - dist / 600})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  // Eventos de ratón y ventana
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', resize);

  // Inicialización
  resize();
  animate();
})();