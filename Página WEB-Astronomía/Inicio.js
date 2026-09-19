// Bloquea el scroll del body durante la intro
document.body.classList.add('no-scroll');

const container = document.getElementById('sun-canvas-container');

// 1. Detección Inteligente del Dispositivo
function getDeviceSettings() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    if (width <= 480) {
        // Celulares pequeños/medianos
        return { cameraZ: height > width ? 22 : 16, pixelRatio: 1.5, scale: 0.75 };
    } else if (width <= 768) {
        // Celulares grandes / Phablets
        return { cameraZ: height > width ? 20 : 15, pixelRatio: 1.75, scale: 0.85 };
    } else if (width <= 1024) {
        // Tablets / iPads (Vertical y Horizontal)
        return { cameraZ: aspect < 1 ? 18 : 14, pixelRatio: 2, scale: 0.95 };
    } else {
        // Computadoras / Laptops
        return { cameraZ: 12, pixelRatio: 2, scale: 1.0 };
    }
}

let devSettings = getDeviceSettings();

// 2. Configuración de Escena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

// Iniciar cámara con alejamientio inicial para el efecto zoom
camera.position.z = devSettings.cameraZ + 8;
camera.position.y = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, devSettings.pixelRatio));
container.appendChild(renderer.domElement);

// 3. Luces
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 2, 100);
scene.add(sunLight);

// 4. Objetos 3D (Escalados según el dispositivo)
const sunGroup = new THREE.Group();
scene.add(sunGroup);

// Sol
const sunGeometry = new THREE.SphereGeometry(2.8 * devSettings.scale, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sunGroup.add(sun);

// Resplandor del Sol
const glowGeometry = new THREE.SphereGeometry(3.4 * devSettings.scale, 32, 32);
const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff6600,
    transparent: true,
    opacity: 0.4,
    side: THREE.BackSide
});
const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
sunGroup.add(sunGlow);

// Tierra
const earthGeometry = new THREE.SphereGeometry(0.6 * devSettings.scale, 24, 24);
const earthMaterial = new THREE.MeshStandardMaterial({ color: 0x2277ff, roughness: 0.6 });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Marte
const marsGeometry = new THREE.SphereGeometry(0.42 * devSettings.scale, 24, 24);
const marsMaterial = new THREE.MeshStandardMaterial({ color: 0xcc4422, roughness: 0.7 });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);
scene.add(mars);

// 5. Animación
let earthAngle = 0;
let marsAngle = Math.PI;

function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.003;

    // Órbitas adaptadas a la escala del dispositivo
    const earthDist = 5.8 * devSettings.scale;
    const marsDist = 8.5 * devSettings.scale;

    earthAngle += 0.012;
    earth.position.x = Math.cos(earthAngle) * earthDist;
    earth.position.z = Math.sin(earthAngle) * earthDist;
    earth.position.y = Math.sin(earthAngle * 0.5) * 1.2;
    earth.rotation.y += 0.02;

    marsAngle += 0.008;
    mars.position.x = Math.cos(marsAngle) * marsDist;
    mars.position.z = Math.sin(marsAngle) * marsDist;
    mars.position.y = Math.cos(marsAngle * 0.5) * 1.5;
    mars.rotation.y += 0.015;

    // Acercamiento inicial suave
    if (camera.position.z > devSettings.cameraZ) {
        camera.position.z -= 0.08;
    }

    renderer.render(scene, camera);
}

animate();

// 6. Revelar Tarjeta
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const card = document.getElementById('intro-card');
        if (card) {
            card.classList.remove('hidden-content');
            card.classList.add('visible-content');
        }
    }, 2000);
});

// 7. Entrar al sitio
function enterSite() {
    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
        introScreen.classList.add('fade-out');
    }
    // Habilitar scroll normal
    document.body.classList.remove('no-scroll');
}

// 8. Re-escalado dinámico inmediato al rotar o cambiar el tamaño de ventana
window.addEventListener('resize', () => {
    devSettings = getDeviceSettings();
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = devSettings.cameraZ;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, devSettings.pixelRatio));
});


// Para aplicar un zoom al poster 
function togglePosterModal() {
    const modal = document.getElementById('poster-modal');
    modal.classList.toggle('active');
}