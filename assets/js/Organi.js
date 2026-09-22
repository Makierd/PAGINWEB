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