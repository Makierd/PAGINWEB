document.addEventListener('DOMContentLoaded', () => {
  // --- 1. LÓGICA DEL SLIDER / ROTACIÓN ORBITAL ---
  const nodes = document.querySelectorAll('.orbit-node');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let currentIndex = 0;

  function updateSlider(index) {
    const total = nodes.length;
    if (total === 0) return;

    // Normalizar índice circular
    currentIndex = (index + total) % total;

    nodes.forEach((node, i) => {
      node.classList.remove('active', 'prev', 'next');

      if (i === currentIndex) {
        node.classList.add('active');
      } else if (i === (currentIndex - 1 + total) % total) {
        node.classList.add('prev');
      } else if (i === (currentIndex + 1) % total) {
        node.classList.add('next');
      }
    });
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlider(currentIndex - 1);
      rotateOrbit3D(-0.5); // Efecto de giro 3D hacia la izquierda
    });

    nextBtn.addEventListener('click', () => {
      updateSlider(currentIndex + 1);
      rotateOrbit3D(0.5); // Efecto de giro 3D hacia la derecha
    });
  }

  // Inicializar slider
  updateSlider(0);

  // --- 2. THREE.JS: ANILLO / ÓRBITA EN 3D ---
  const canvas = document.getElementById('orbit-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Crear Anillo de la Órbita 3D
  const ringGeometry = new THREE.TorusGeometry(3.2, 0.02, 16, 100);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: false, transparent: true, opacity: 0.6 });
  const orbitRing = new THREE.Mesh(ringGeometry, ringMaterial);

  // Inclinar la órbita para dar efecto de perspectiva
  orbitRing.rotation.x = Math.PI / 2.3;
  scene.add(orbitRing);

  // Agregar pequeñas partículas orbitando
  const particlesGeo = new THREE.BufferGeometry();
  const count = 40;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * 3.2;
    positions[i * 3 + 1] = Math.sin(angle) * 3.2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({ size: 0.06, color: 0x818cf8 });
  const orbitParticles = new THREE.Points(particlesGeo, particlesMat);
  orbitParticles.rotation.x = Math.PI / 2.3;
  scene.add(orbitParticles);

  camera.position.z = 5;

  // Animación continua del fondo
  function animate() {
    requestAnimationFrame(animate);
    orbitRing.rotation.z += 0.002;
    orbitParticles.rotation.z += 0.002;
    renderer.render(scene, camera);
  }
  animate();

  // Función para acelerar la rotación del anillo al hacer clic en las flechas
  function rotateOrbit3D(dir) {
    orbitRing.rotation.z += dir;
    orbitParticles.rotation.z += dir;
  }

  // Responsive Canvas Resize
  window.addEventListener('resize', () => {
    if (!canvas) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
});


const canvas = document.getElementById('bg-canvas') || createBgCanvas();
const ctx = canvas.getContext('2d');

let width, height;
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// Si el canvas no está en el HTML, lo crea dinámicamente al fondo
function createBgCanvas() {
    const c = document.createElement('canvas');
    c.id = 'bg-canvas';
    c.style.position = 'fixed';
    c.style.top = '0';
    c.style.left = '0';
    c.style.width = '100vw';
    c.style.height = '100vh';
    c.style.zIndex = '-1'; // Detrás de todo
    c.style.pointerEvents = 'none';
    document.body.prepend(c);
    return c;
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('mousemove', (e) => {
    // Parallax suave al mover el mouse
    mouseX = (e.clientX - width / 2) * 0.05;
    mouseY = (e.clientY - height / 2) * 0.05;
});

resizeCanvas();

// Generar Estrellas / Polvo Estelar
const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005
}));

// DIBUJAR RESPLANDOR DEL PLANETA (El "Shader" en Canvas 2D)
function drawPlanetHorizon() {
    // Limpia el canvas con el fondo oscuro base
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // 1. LUZ PRINCIPAL EN EL HORIZONTE (Curvatura de Planeta)
    const centerX = width / 2 + mouseX;
    const centerY = height + 150 + mouseY; // El planeta está justo abajo
    const radius = Math.max(width, height) * 0.8;

    const planetGlow = ctx.createRadialGradient(
        centerX, centerY, 50,         // Núcleo de luz
        centerX, centerY, radius      // Dispersión atmosférica
    );

    // Paleta Neón Espacial (Cian -> Púrpura -> Azul Profundo)
    planetGlow.addColorStop(0, 'rgba(56, 189, 248, 0.45)');  // Azul celeste brillante (Atmósfera)
    planetGlow.addColorStop(0.25, 'rgba(99, 102, 241, 0.25)'); // Púrpura cósmico
    planetGlow.addColorStop(0.5, 'rgba(15, 23, 42, 0.15)');   // Transición suave
    planetGlow.addColorStop(1, 'rgba(3, 7, 18, 0)');          // Espacio profundo

    ctx.fillStyle = planetGlow;
    ctx.fillRect(0, 0, width, height);

    // 2. DIBUJAR ESTRELLAS CON DESTELLO
    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;

        ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function animate() {
    drawPlanetHorizon();
    requestAnimationFrame(animate);
}

animate();
