/**
 * TFC - Tasty Fried Chicken Website JavaScript
 * Complete functionality for navigation, menu filtering, testimonials, and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initMenuFiltering();
    initTestimonialsSlider();
    initScrollAnimations();
    initBackToTop();
    initFranchiseForm();
    initSmoothScroll();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link based on scroll position
        updateActiveNavLink();
    });

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================
   MENU CATEGORY FILTERING
   ============================================ */
function initMenuFiltering() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter menu cards with animation
            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* ============================================
   TESTIMONIALS SLIDER
   ============================================ */
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('testimonialsDots');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const totalCards = cards.length;
    
    if (totalCards === 0) return;

    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, totalCards - cardsPerView);

    // Create dots
    createDots();

    function getCardsPerView() {
        if (window.innerWidth >= 992) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        
        const numDots = maxIndex + 1;
        for (let i = 0; i < numDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        const cardWidth = cards[0].offsetWidth + 25; // card width + gap
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateSlider();
    }

    function nextSlide() {
        currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
        updateSlider();
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    let autoPlayInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    });

    // Handle resize
    window.addEventListener('resize', () => {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            maxIndex = Math.max(0, totalCards - cardsPerView);
            currentIndex = Math.min(currentIndex, maxIndex);
            createDots();
            updateSlider();
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.menu-card, .benefit-item, .investment-card, .location-card, .franchise-form-wrapper');
    
    // Add reveal class to elements
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Stagger animation for menu cards
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
    });

    // Stagger animation for benefit items
    const benefitItems = document.querySelectorAll('.benefit-item');
    benefitItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // Stagger animation for investment cards
    const investmentCards = document.querySelectorAll('.investment-card');
    investmentCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   FRANCHISE FORM
   ============================================ */
function initFranchiseForm() {
    const form = document.getElementById('franchiseForm');
    
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simple validation
        if (!data.name || !data.email || !data.phone || !data.city) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Phone validation (Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
            showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        // Simulate form submission
        showNotification('Thank you for your interest! We will contact you soon.', 'success');
        form.reset();

        // In a real application, you would send this data to a server
        console.log('Franchise Inquiry:', data);
    });
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 20px;
    }
`;
document.head.appendChild(notificationStyles);

/* ============================================
   LAZY LOADING IMAGES (if needed)
   ============================================ */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */
// Debounce function for scroll events
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================
   COUNTER ANIMATION (for stats)
   ============================================ */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Initialize counter animation when stats are in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const value = parseInt(stat.textContent);
                if (!isNaN(value)) {
                    animateCounter(stat, value);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

/* ============================================
   PREFERS REDUCED MOTION
   ============================================ */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

/* ============================================
   CONSOLE WELCOME MESSAGE
   ============================================ */
console.log('%c🍗 Welcome to TFC - Tasty Fried Chicken!', 'color: #DC143C; font-size: 20px; font-weight: bold;');
console.log('%cLive Kitchen | Hyderabad, India', 'color: #FFD700; font-size: 14px;');
console.log('%cOrder on WhatsApp: 9985666252', 'color: #25D366; font-size: 14px;');
