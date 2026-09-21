/* =========================================================
   FONDO-SISTEMA-SOLAR.JS — Fondo animado de la pagina

   Sustituye la imagen de fondo por un sistema solar en 3D que
   gira y se inclina conforme se baja por la pagina.

   - Todo vive dentro de una IIFE para no chocar con las
     variables globales de intro-3d.js (scene, camera, ...).
   - Si WebGL no esta disponible o falla, el script se retira
     solo y queda visible la imagen de fondo del CSS.
   - Respeta "prefers-reduced-motion": deja el sistema quieto
     y solo responde al scroll.
   ========================================================= */

(function () {
    'use strict';

    const contenedor = document.getElementById('fondo-3d');
    if (!contenedor || typeof THREE === 'undefined') return;

    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Renderer (si falla, fallback a la imagen CSS) ---------- */
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
        contenedor.remove();
        return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    contenedor.appendChild(renderer.domElement);
    /* Solo ahora se retira la imagen de fondo del CSS */
    document.body.classList.add('fondo-3d-activo');

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);

    /* ---------- Escala segun el ancho de pantalla ---------- */
    function escalaDispositivo() {
        const ancho = window.innerWidth;
        if (ancho <= 480) return 0.55;
        if (ancho <= 768) return 0.70;
        if (ancho <= 1024) return 0.85;
        return 1.0;
    }
    let escala = escalaDispositivo();

    /* ---------- Campo de estrellas ---------- */
    function crearEstrellas(cantidad, radio, tam, opacidad) {
        const posiciones = new Float32Array(cantidad * 3);
        for (let i = 0; i < cantidad; i++) {
            // distribucion esferica uniforme
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = radio * (0.6 + Math.random() * 0.4);
            posiciones[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
            posiciones[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            posiciones[i * 3 + 2] = r * Math.cos(phi);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
        const mat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: tam,
            sizeAttenuation: false,   /* tamano en pixeles, no por distancia */
            transparent: true,
            opacity: opacidad,
            depthWrite: false
        });
        return new THREE.Points(geo, mat);
    }

    const estrellasLejanas = crearEstrellas(1800, 600, 1.4, 0.55);
    const estrellasCercanas = crearEstrellas(550, 380, 2.2, 0.9);
    escena.add(estrellasLejanas, estrellasCercanas);

    /* ---------- Grupo del sistema solar ---------- */
    const sistema = new THREE.Group();
    escena.add(sistema);

    /* Sol */
    const sol = new THREE.Mesh(
        new THREE.SphereGeometry(2.6 * escala, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xffa62b })
    );
    sistema.add(sol);

    /* Resplandor del sol (dos capas para un degradado suave) */
    [[3.5, 0.30, 0xff8c1a], [4.6, 0.14, 0xff6a00]].forEach(function (capa) {
        const halo = new THREE.Mesh(
            new THREE.SphereGeometry(capa[0] * escala, 32, 32),
            new THREE.MeshBasicMaterial({
                color: capa[2],
                transparent: true,
                opacity: capa[1],
                side: THREE.BackSide,
                depthWrite: false
            })
        );
        sistema.add(halo);
    });

    const luzSol = new THREE.PointLight(0xffd9a0, 2.2, 400);
    sistema.add(luzSol);
    escena.add(new THREE.AmbientLight(0xffffff, 0.22));

    /* ---------- Planetas ----------
       [radio, distancia, color, velocidad, inclinacion de orbita] */
    const definicion = [
        [0.95, 11,  0xb08a6e, 1.60, 0.05],  // Mercurio
        [1.45, 17,  0xe0a868, 1.18, 0.10],  // Venus
        [1.60, 24,  0x4b90e8, 1.00, 0.00],  // Tierra
        [1.20, 32,  0xd05a33, 0.80, 0.08],  // Marte
        [3.10, 44,  0xe0bc92, 0.44, 0.03],  // Jupiter
        [2.60, 57,  0xeedcaa, 0.32, 0.12]   // Saturno
    ];

    const planetas = definicion.map(function (d, i) {
        const orbita = new THREE.Group();
        orbita.rotation.x = d[4];
        sistema.add(orbita);

        const cuerpo = new THREE.Mesh(
            new THREE.SphereGeometry(d[0] * escala, 24, 24),
            new THREE.MeshStandardMaterial({ color: d[2], roughness: 0.85, metalness: 0.05 })
        );
        orbita.add(cuerpo);

        /* Anillo tenue que marca la orbita */
        const anillo = new THREE.Mesh(
            new THREE.RingGeometry(d[1] * escala - 0.06, d[1] * escala + 0.06, 160),
            new THREE.MeshBasicMaterial({
                color: 0x93c5fd,
                transparent: true,
                opacity: 0.30,
                side: THREE.DoubleSide,
                depthWrite: false
            })
        );
        anillo.rotation.x = Math.PI / 2;
        orbita.add(anillo);

        /* Anillos de Saturno */
        if (i === 5) {
            const anilloSaturno = new THREE.Mesh(
                new THREE.RingGeometry(3.4 * escala, 5.2 * escala, 64),
                new THREE.MeshBasicMaterial({
                    color: 0xe4d3a8,
                    transparent: true,
                    opacity: 0.5,
                    side: THREE.DoubleSide,
                    depthWrite: false
                })
            );
            anilloSaturno.rotation.x = Math.PI / 2.35;
            cuerpo.add(anilloSaturno);
        }

        return {
            cuerpo: cuerpo,
            distancia: d[1] * escala,
            velocidad: d[3],
            angulo: Math.random() * Math.PI * 2
        };
    });

    /* ---------- Progreso de scroll (0 arriba → 1 abajo) ---------- */
    let progreso = 0;
    let progresoSuave = 0;

    function medirScroll() {
        const alto = document.documentElement.scrollHeight - window.innerHeight;
        progreso = alto > 0 ? Math.min(Math.max(window.scrollY / alto, 0), 1) : 0;
    }
    medirScroll();
    window.addEventListener('scroll', medirScroll, { passive: true });

    /* ---------- Bucle de animacion ---------- */
    const reloj = new THREE.Clock();

    function colocarCamara() {
        /* Al bajar, la camara se eleva: se pasa de ver el sistema casi
           de canto (orbitas como lineas) a verlo desde arriba (orbitas
           como circulos completos). */
        const altura = 5 + progresoSuave * 52;
        const distancia = 64 + progresoSuave * 20;

        camara.position.set(0, altura * escala, distancia * escala);
        camara.lookAt(0, 0, 0);

        /* El sistema se corre a la izquierda para no quedar detras de
           las tarjetas. En pantallas estrechas no sobra espacio, asi
           que el desplazamiento se reduce. */
        const aLaIzquierda = (window.innerWidth > 900 ? -30 : -10) * escala;
        sistema.position.x = aLaIzquierda;
    }

    function animar() {
        requestAnimationFrame(animar);

        const t = reloj.getElapsedTime();
        /* Suavizado exponencial para que el scroll no se sienta brusco */
        progresoSuave += (progreso - progresoSuave) * 0.06;

        /* El scroll hace avanzar las orbitas; el tiempo las mantiene vivas */
        const avance = progresoSuave * 14 + (sinMovimiento ? 0 : t * 0.12);

        planetas.forEach(function (p) {
            const a = p.angulo + avance * p.velocidad;
            p.cuerpo.position.x = Math.cos(a) * p.distancia;
            p.cuerpo.position.z = Math.sin(a) * p.distancia;
            p.cuerpo.rotation.y += 0.004;
        });

        sol.rotation.y += 0.0015;
        sistema.rotation.y = progresoSuave * 1.1;

        /* Las estrellas giran muy lento en sentido contrario: da profundidad */
        estrellasLejanas.rotation.y = -progresoSuave * 0.25 - (sinMovimiento ? 0 : t * 0.004);
        estrellasCercanas.rotation.y = -progresoSuave * 0.45 - (sinMovimiento ? 0 : t * 0.008);

        colocarCamara();
        estrellasLejanas.position.copy(camara.position);
        estrellasCercanas.position.copy(camara.position);
        renderer.render(escena, camara);
    }

    colocarCamara();
    animar();

    /* ---------- Reescalado al cambiar el tamano de ventana ---------- */
    window.addEventListener('resize', function () {
        escala = escalaDispositivo();
        camara.aspect = window.innerWidth / window.innerHeight;
        camara.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        medirScroll();
    });

})();
