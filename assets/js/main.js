/**
 * BLESSED PLUMBING & ENGINEERING LTD - MAIN JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFAQAccordion();
    initScrollAnimations();
    initSmoothScroll();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle icon between bars and times if using FontAwesome or similar,
            // or just let CSS handle it. Here we toggle aria-expanded if needed.
            const isActive = navMenu.classList.contains('active');
            menuToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
}

/**
 * FAQ Accordion
 */
function initFAQAccordion() {
    const faqHeaders = document.querySelectorAll('.faq-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const faqItem = header.parentElement;
            const faqBody = faqItem.querySelector('.faq-body');

            // Toggle active class
            faqItem.classList.toggle('active');

            if (faqItem.classList.contains('active')) {
                faqBody.style.maxHeight = faqBody.scrollHeight + 'px';
            } else {
                faqBody.style.maxHeight = null;
            }
        });
    });
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const scrollObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('appear');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => scrollObserver.observe(el));
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('appear'));
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
