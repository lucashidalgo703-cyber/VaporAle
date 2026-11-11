// Vape Smoke & Intro Effects Engine — VaporAle
(function() {
    // 1. ANIMACIÓN DE INTRODUCCIÓN CON VAPOR
    function initVapeIntro() {
        const overlay = document.getElementById("vape-intro-overlay");
        const introCanvas = document.getElementById("intro-smoke-canvas");
        if (!overlay || !introCanvas) return;

        const ctx = introCanvas.getContext("2d");
        let width = introCanvas.width = window.innerWidth;
        let height = introCanvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            width = introCanvas.width = window.innerWidth;
            height = introCanvas.height = window.innerHeight;
        });

        // Partículas de humo para la intro
        const particles = [];
        const particleCount = 45;
        const centerX = width / 2;
        const centerY = height / 2;

        class SmokeParticle {
            constructor(x, y) {
                this.x = x + (Math.random() - 0.5) * 80;
                this.y = y + (Math.random() - 0.5) * 60;
                this.vx = (Math.random() - 0.5) * 3;
                this.vy = -Math.random() * 2.5 - 1;
                this.radius = 40 + Math.random() * 70;
                this.maxRadius = this.radius * (2.5 + Math.random());
                this.growth = 0.8 + Math.random() * 0.8;
                this.alpha = 0.05 + Math.random() * 0.25;
                this.decay = 0.003 + Math.random() * 0.004;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.02;
                // Tonos cyan y vapor blanco
                this.isCyan = Math.random() > 0.45;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vx *= 0.99;
                this.vy *= 0.99;
                if (this.radius < this.maxRadius) {
                    this.radius += this.growth;
                }
                this.rotation += this.rotationSpeed;
                this.alpha -= this.decay;
            }

            draw(ctx) {
                if (this.alpha <= 0) return;
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
                if (this.isCyan) {
                    grad.addColorStop(0, `rgba(0, 210, 255, ${this.alpha * 0.6})`);
                    grad.addColorStop(0.5, `rgba(0, 114, 206, ${this.alpha * 0.3})`);
                    grad.addColorStop(1, 'rgba(6, 9, 19, 0)');
                } else {
                    grad.addColorStop(0, `rgba(235, 255, 255, ${this.alpha * 0.5})`);
                    grad.addColorStop(0.6, `rgba(180, 240, 255, ${this.alpha * 0.2})`);
                    grad.addColorStop(1, 'rgba(6, 9, 19, 0)');
                }

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        let isRunning = true;

        function addBurst() {
            for (let i = 0; i < 6; i++) {
                if (particles.length < particleCount) {
                    particles.push(new SmokeParticle(centerX, centerY));
                }
            }
        }

        const burstInterval = setInterval(addBurst, 150);

        function animate() {
            if (!isRunning) return;
            ctx.clearRect(0, 0, width, height);

            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].update();
                particles[i].draw(ctx);
                if (particles[i].alpha <= 0) {
                    particles.splice(i, 1);
                }
            }

            requestAnimationFrame(animate);
        }

        animate();

        // Finalizar y desvanecer la intro después de 2.2 segundos
        function finishIntro() {
            clearInterval(burstInterval);
            overlay.classList.add("fade-out");
            setTimeout(() => {
                isRunning = false;
                overlay.remove();
                initHeroSmoke(); // Iniciar vapor en el fondo del hero
            }, 800);
        }

        setTimeout(finishIntro, 2200);

        // Permitir saltar con clic en el botón o pantalla
        overlay.addEventListener("click", finishIntro);
    }

    // 2. VAPOR AMBIENTAL EN EL HERO BANNER
    function initHeroSmoke() {
        const canvas = document.getElementById("hero-smoke-canvas");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let width = canvas.width = canvas.parentElement.offsetWidth;
        let height = canvas.height = canvas.parentElement.offsetHeight;

        window.addEventListener("resize", () => {
            if (canvas.parentElement) {
                width = canvas.width = canvas.parentElement.offsetWidth;
                height = canvas.height = canvas.parentElement.offsetHeight;
            }
        });

        const ambientParticles = [];
        const maxParticles = 20;

        class AmbientSmoke {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + 40;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = -Math.random() * 0.9 - 0.3;
                this.radius = 60 + Math.random() * 80;
                this.growth = 0.3 + Math.random() * 0.4;
                this.alpha = 0.08 + Math.random() * 0.14;
                this.decay = 0.0008 + Math.random() * 0.0006;
                this.isCyan = Math.random() > 0.4;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.radius += this.growth;
                this.alpha -= this.decay;
                if (this.alpha <= 0 || this.y < -this.radius) {
                    this.reset();
                }
            }

            draw(ctx) {
                ctx.save();
                const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
                if (this.isCyan) {
                    grad.addColorStop(0, `rgba(0, 210, 255, ${this.alpha * 0.7})`);
                    grad.addColorStop(0.6, `rgba(0, 114, 206, ${this.alpha * 0.25})`);
                    grad.addColorStop(1, 'transparent');
                } else {
                    grad.addColorStop(0, `rgba(235, 255, 255, ${this.alpha * 0.5})`);
                    grad.addColorStop(0.6, `rgba(180, 240, 255, ${this.alpha * 0.15})`);
                    grad.addColorStop(1, 'transparent');
                }

                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < maxParticles; i++) {
            const p = new AmbientSmoke();
            p.y = Math.random() * height; // Distribuir inicialmente
            ambientParticles.push(p);
        }

        // Interacción sutil con el mouse
        let mouseX = -999;
        let mouseY = -999;
        canvas.parentElement.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            // Generar bocanada suave cerca del mouse
            if (ambientParticles.length < maxParticles + 4 && Math.random() > 0.7) {
                const puff = new AmbientSmoke();
                puff.x = mouseX + (Math.random() - 0.5) * 30;
                puff.y = mouseY + (Math.random() - 0.5) * 30;
                puff.vy = -Math.random() * 1.2 - 0.4;
                ambientParticles.push(puff);
            }
        });

        function animateAmbient() {
            ctx.clearRect(0, 0, width, height);

            ambientParticles.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            requestAnimationFrame(animateAmbient);
        }

        animateAmbient();
    }

    document.addEventListener("DOMContentLoaded", () => {
        initVapeIntro();
    });
})();
