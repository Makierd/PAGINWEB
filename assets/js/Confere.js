// Intercambia pestañas de actividad. Funciona con cualquier numero de
// pestañas: cada .tab-card usa id "tab-<clave>" y su bloque "group-<clave>".
function switchSpeakerTab(target) {
    document.querySelectorAll('.tab-card').forEach(function (tab) {
        tab.classList.toggle('active', tab.id === 'tab-' + target);
    });
    document.querySelectorAll('.speaker-group').forEach(function (grupo) {
        grupo.classList.toggle('active-group', grupo.id === 'group-' + target);
    });
}

// Función genérica para abrir y cerrar acordeones de evidencia
function toggleEvidence(elementId, btnElement) {
    const content = document.getElementById(elementId);
    
    if (content) {
        content.classList.toggle('active');
        btnElement.classList.toggle('open');
    }
}
const canvas = document.getElementById('stars-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Crear partículas/estrellas
    const numStars = Math.floor((width * height) / 9000); // Se adapta según el tamaño de la pantalla
    const stars = [];

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5, // Puntos finos de luz
            color: Math.random() > 0.4 ? '#38bdf8' : '#ffffff', // Mezcla entre azul celeste y blanco
            alpha: Math.random(),
            speed: Math.random() * 0.015 + 0.005
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, width, height);

        stars.forEach(star => {
            // Parpadeo suave
            star.alpha += star.speed;
            if (star.alpha > 1 || star.alpha < 0.2) {
                star.speed = -star.speed;
            }

            // Dibujar punto
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = Math.abs(star.alpha);
            ctx.shadowBlur = star.radius > 1.2 ? 8 : 0;
            ctx.shadowColor = star.color;
            ctx.fill();
        });

        requestAnimationFrame(animateStars);
    }

    animateStars();

    // Reajustar si cambias tamaño de ventana o giras el celular
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
}