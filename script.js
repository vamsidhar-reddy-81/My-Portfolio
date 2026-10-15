document.addEventListener('DOMContentLoaded', () => {

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-left, .fade-in-right'
    );

    animatedElements.forEach(el => observer.observe(el));


    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    if (hamburger && navLinks) {

        hamburger.addEventListener('click', () => {

            navLinks.classList.toggle('open');

            links.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation =
                        `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            hamburger.classList.toggle('toggle');
        });

        // Close mobile menu after clicking a navigation link
        links.forEach(link => {
            const navLink = link.querySelector('a');

            if (navLink) {
                navLink.addEventListener('click', () => {
                    navLinks.classList.remove('open');
                    hamburger.classList.remove('toggle');

                    links.forEach(item => {
                        item.style.animation = '';
                    });
                });
            }
        });
    }


    // Mobile Navigation Styles
    if (!document.getElementById('mobile-nav-style')) {

        const style = document.createElement('style');

        style.id = 'mobile-nav-style';

        style.innerHTML = `
            @media (max-width: 768px) {

                .nav-links.open {
                    display: flex;
                    flex-direction: column;
                    position: absolute;
                    right: 0;
                    top: 80px;
                    height: calc(100vh - 80px);
                    background: var(--nav-bg);
                    width: 100%;
                    align-items: center;
                    justify-content: center;
                    transform: translateX(0%);
                    transition: transform 0.5s ease-in;
                }

                @keyframes navLinkFade {
                    from {
                        opacity: 0;
                        transform: translateX(50px);
                    }

                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .hamburger.toggle .bar:nth-child(1) {
                    transform: rotate(-45deg) translate(-5px, 6px);
                }

                .hamburger.toggle .bar:nth-child(2) {
                    opacity: 0;
                }

                .hamburger.toggle .bar:nth-child(3) {
                    transform: rotate(45deg) translate(-5px, -6px);
                }
            }
        `;

        document.head.appendChild(style);
    }


    // AI / Tech Particle Background
    const canvas = document.getElementById('tech-bg');

    if (canvas) {

        const ctx = canvas.getContext('2d');

        let width;
        let height;
        let particles = [];

        const particleCount = 100;
        const connectionDistance = 150;
        const mouseDistance = 200;

        // Resize Canvas
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);

        resize();


        // Mouse Tracking
        const mouse = {
            x: null,
            y: null
        };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });


        // Particle Class
        class Particle {

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;

                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;

                this.size = Math.random() * 2 + 1;
            }

            update() {

                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) {
                    this.vx *= -1;
                }

                if (this.y < 0 || this.y > height) {
                    this.vy *= -1;
                }

                // Mouse Interaction
                if (mouse.x !== null && mouse.y !== null) {

                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance > 0 && distance < mouseDistance) {

                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;

                        const force =
                            (mouseDistance - distance) / mouseDistance;

                        const directionX = forceDirectionX * force * 0.5;
                        const directionY = forceDirectionY * force * 0.5;

                        this.vx -= directionX;
                        this.vy -= directionY;
                    }
                }
            }

            draw() {

                ctx.fillStyle = 'rgba(100, 255, 218, 0.5)';

                ctx.beginPath();

                ctx.arc(
                    this.x,
                    this.y,
                    this.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }
        }


        // Initialize Particles
        function initParticles() {

            particles = [];

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        initParticles();


        // Animation Loop
        function animate() {

            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {

                particles[i].update();
                particles[i].draw();

                // Draw Connections
                for (let j = i + 1; j < particles.length; j++) {

                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;

                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {

                        ctx.beginPath();

                        ctx.strokeStyle =
                            `rgba(100, 255, 218, ${1 - distance / connectionDistance})`;

                        ctx.lineWidth = 0.5;

                        ctx.moveTo(
                            particles[i].x,
                            particles[i].y
                        );

                        ctx.lineTo(
                            particles[j].x,
                            particles[j].y
                        );

                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }


    // Cursor Glow Effect
    const cursorGlow = document.querySelector('.cursor-glow');

    if (cursorGlow) {

        document.addEventListener('mousemove', (e) => {

            const x = e.clientX;
            const y = e.clientY;

            cursorGlow.style.background =
                `radial-gradient(600px at ${x}px ${y}px, rgba(100, 255, 218, 0.15), transparent 80%)`;
        });
    }


    // Contact Form Handling - FormSubmit
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {

        contactForm.addEventListener('submit', async (e) => {

            e.preventDefault();

            const submitButton = contactForm.querySelector(
                'button[type="submit"]'
            );

            if (!submitButton) {
                return;
            }

            const originalText = submitButton.textContent;

            // Prevent duplicate submissions
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            try {

                const formData = new FormData(contactForm);

                const response = await fetch(
                    'https://formsubmit.co/ajax/m.vamsidhar20061@gmail.com',
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json'
                        },
                        body: formData
                    }
                );

                const result = await response.json();

                if (response.ok && result.success) {

                    alert(
                        'Thank you! Your message has been sent successfully.'
                    );

                    contactForm.reset();

                } else {

                    alert(
                        'Sorry, your message could not be sent. Please try again.'
                    );

                    console.error('Form submission response:', result);
                }

            } catch (error) {

                console.error('Contact form error:', error);

                alert(
                    'Unable to send your message right now. Please check your internet connection and try again.'
                );

            } finally {

                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

});
