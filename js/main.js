/**
 * Åsebø Bygg og Betong - Main JavaScript
 * ======================================
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initHeaderScroll();
    initSmoothScroll();
    initContactForm();
    initProjectFilter();
    initAnimations();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.querySelector('.nav-mobile');
    const body = document.body;

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

/**
 * Header Scroll Effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        const messageContainer = document.getElementById('form-message');

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sender...';
        submitBtn.classList.add('loading');

        // Collect form data
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            phone: form.querySelector('#phone').value,
            address: form.querySelector('#address')?.value || '',
            projectType: form.querySelector('#project-type').value,
            description: form.querySelector('#description').value,
            wantSiteVisit: form.querySelector('#site-visit')?.checked || false,
            timestamp: new Date().toISOString()
        };

        try {
            // Simulate form submission (replace with actual Resend API call)
            await simulateFormSubmission(formData);

            // Show success message
            showFormMessage(messageContainer, 'success',
                'Takk for førespurnaden din! Eg vil kontakte deg så snart som mogleg, vanlegvis innan éin arbeidsdag.'
            );

            // Reset form
            form.reset();

        } catch (error) {
            // Show error message
            showFormMessage(messageContainer, 'error',
                'Beklagar, noko gjekk galt. Prøv igjen eller ring oss direkte.'
            );
            console.error('Form submission error:', error);
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('loading');
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

/**
 * Simulate form submission (replace with actual API call)
 */
async function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success (90% of the time)
            if (Math.random() > 0.1) {
                console.log('Form data submitted:', data);
                resolve({ success: true });
            } else {
                reject(new Error('Simulated error'));
            }
        }, 1500);
    });
}

/**
 * Show form message
 */
function showFormMessage(container, type, message) {
    if (!container) return;

    container.className = `form-message ${type}`;
    container.textContent = message;
    container.style.display = 'block';

    // Scroll to message
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Hide success message after 10 seconds
    if (type === 'success') {
        setTimeout(() => {
            container.style.display = 'none';
        }, 10000);
    }
}

/**
 * Validate individual form field
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Required field check
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Dette feltet er påkravd';
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi ei gyldig e-postadresse';
        }
    }

    // Phone validation (Norwegian format)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^(\+47)?[\s]?[0-9]{8}$/;
        const cleanedPhone = value.replace(/\s/g, '');
        if (!phoneRegex.test(cleanedPhone)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi eit gyldig telefonnummer';
        }
    }

    // Update field styling
    if (!isValid) {
        field.classList.add('error');
        field.style.borderColor = '#dc3545';
    } else {
        field.classList.remove('error');
        field.style.borderColor = '';
    }

    return isValid;
}

/**
 * Project Filter (for projects page)
 */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.category-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const cardCategory = card.dataset.category;

                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Scroll Animations
 */
function initAnimations() {
    // Simple fade-in animation for elements
    const animateElements = document.querySelectorAll('.service-card, .benefit-item, .value-card, .project-card');

    if (!animateElements.length) return;

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(el);
        });
    } else {
        // Fallback for older browsers
        animateElements.forEach(el => {
            el.classList.add('animate-in');
        });
    }
}

// Add animate-in styles
document.head.insertAdjacentHTML('beforeend', `
    <style>
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    </style>
`);

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Click to call tracking (for analytics)
 */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track phone call clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'Contact',
                event_label: 'Phone Call'
            });
        }
        console.log('Phone call initiated');
    });
});

/**
 * Email link tracking
 */
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track email clicks
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'Contact',
                event_label: 'Email'
            });
        }
        console.log('Email link clicked');
    });
});
