document.addEventListener('DOMContentLoaded', function() {
    // Declare AOS variable
    const AOS = window.AOS || {};
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out-cubic'
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Custom cursor follower
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        requestAnimationFrame(function() {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
            cursorFollower.style.opacity = '1';
        });
    });

    // Hover effect for buttons, links and cards
    const hoverElements = document.querySelectorAll('.btn, a, .program-card, .testimonial-card');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursorFollower.style.width = '50px';
            cursorFollower.style.height = '50px';
            cursorFollower.style.backgroundColor = 'rgba(255, 107, 107, 0.2)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
            cursorFollower.style.backgroundColor = 'rgba(255, 107, 107, 0.5)';
        });
    });

    // Hide cursor follower when leaving window
    document.addEventListener('mouseout', function(e) {
        if (e.relatedTarget === null) {
            cursorFollower.style.opacity = '0';
        }
    });

    // Back to top button
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Program card flip animation
    const programCards = document.querySelectorAll('.program-card');
    
    programCards.forEach(card => {
        const frontBtn = card.querySelector('.flip-card-btn');
        const backBtn = card.querySelector('.flip-card-btn-back');
        const cardInner = card.querySelector('.program-card-inner');
        
        if (frontBtn) {
            frontBtn.addEventListener('click', function() {
                cardInner.style.transform = 'rotateY(180deg)';
            });
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', function() {
                cardInner.style.transform = 'rotateY(0deg)';
            });
        }
    });

    // Testimonial slider
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    if (testimonialPrev && testimonialNext && testimonialCards.length > 0) {
        // Show only the first testimonial on mobile
        function updateTestimonialVisibility() {
            if (window.innerWidth < 768) {
                testimonialCards.forEach((card, index) => {
                    if (index === currentTestimonial) {
                        card.closest('.col-lg-4').style.display = 'block';
                    } else {
                        card.closest('.col-lg-4').style.display = 'none';
                    }
                });
            } else {
                testimonialCards.forEach(card => {
                    card.closest('.col-lg-4').style.display = 'block';
                });
            }
        }
        
        // Initial update
        updateTestimonialVisibility();
        
        // Update on window resize
        window.addEventListener('resize', updateTestimonialVisibility);
        
        // Testimonial navigation
        testimonialPrev.addEventListener('click', function() {
            if (currentTestimonial > 0) {
                currentTestimonial--;
            } else {
                currentTestimonial = testimonialCards.length - 1;
            }
            updateTestimonialVisibility();
        });
        
        testimonialNext.addEventListener('click', function() {
            if (currentTestimonial < testimonialCards.length - 1) {
                currentTestimonial++;
            } else {
                currentTestimonial = 0;
            }
            updateTestimonialVisibility();
        });
    }

    // Form submission handling
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const program = document.getElementById('program').value;
            
            // Show submission animation
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(function() {
                // Success message
                const Swal = window.Swal || {};
                Swal.fire({
                    title: '¡Registro exitoso!',
                    text: `Gracias ${name} por registrarte. Hemos enviado un correo a ${email} con los detalles para acceder al módulo gratuito.`,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#1e3a5f'
                });
                
                // Reset form
                registrationForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            
            // Show submission animation
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(function() {
                // Success message
                const Swal = window.Swal || {};
                Swal.fire({
                    title: '¡Mensaje enviado!',
                    text: `Gracias ${name} por contactarnos. Te responderemos a la brevedad a ${email}.`,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#1e3a5f'
                });
                
                // Reset form
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = this.querySelector('input[type="email"]').value;
            
            // Show submission animation
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(function() {
                // Success message
                const Swal = window.Swal || {};
                Swal.fire({
                    title: '¡Suscripción exitosa!',
                    text: `Gracias por suscribirte a nuestro boletín. Hemos enviado un correo de confirmación a ${email}.`,
                    icon: 'success',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#1e3a5f'
                });
                
                // Reset form
                newsletterForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Add Sweet Alert library (fallback if not available)
    if (typeof window.Swal === 'undefined') {
        window.Swal = {
            fire: function(options) {
                alert(options.text || options.title);
            }
        };
    }

    // Brands auto-scroll animation
    const brandsSlider = document.querySelector('.brands-slider');
    if (brandsSlider) {
        // Clone items
        const brandsItems = brandsSlider.querySelectorAll('.brand-item');
        brandsItems.forEach(item => {
            const clone = item.cloneNode(true);
            brandsSlider.appendChild(clone);
        });

        // Set animation
        let scrollPosition = 0;
        const scrollSpeed = 0.5;
        const sliderWidth = brandsSlider.scrollWidth / 2;
        
        function scrollBrands() {
            scrollPosition += scrollSpeed;
            if (scrollPosition >= sliderWidth) {
                scrollPosition = 0;
            }
            brandsSlider.style.transform = `translateX(-${scrollPosition}px)`;
            requestAnimationFrame(scrollBrands);
        }
        
        // Start animation
        scrollBrands();
        
        // Pause on hover
        brandsSlider.addEventListener('mouseenter', function() {
            brandsSlider.style.animationPlayState = 'paused';
        });
        
        brandsSlider.addEventListener('mouseleave', function() {
            brandsSlider.style.animationPlayState = 'running';
        });
    }
});

// Add SweetAlert polyfill for the form submissions
if (typeof window.Swal === 'undefined') {
    function addSweetAlert() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
        document.body.appendChild(script);
    }
    addSweetAlert();
}