// =============================================
// INITIAL SETUP
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupScrollEffects();
    setupMobileMenu();
    setupThemeToggle();
    setupMenuFilter();
    setupGalleryLightbox();
    setupTestimonialSlider();
    setupForms();
    setupModal();
    displayTodaysSpecial();
    updateOpeningHours();
    setMinDateForReservation();
}

// =============================================
// NAVIGATION & SCROLL EFFECTS
// =============================================

function setupNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Sticky header effect
        const header = document.getElementById('mainHeader');
        if (scrollPosition > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scrolling on click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navMenu = document.querySelector('.nav-menu');
                const mobileToggle = document.querySelector('.mobile-menu-toggle');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            }
        });
    });
}

function setupScrollEffects() {
    // Scroll to top button
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Fade in elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.menu-item, .gallery-item, .testimonial, .stat').forEach(el => {
        el.classList.add('fade-in-on-scroll');
        observer.observe(el);
    });
}

// =============================================
// MOBILE MENU
// =============================================

function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });
}

// =============================================
// THEME TOGGLE (DARK/LIGHT MODE)
// =============================================

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// =============================================
// MENU FILTERING
// =============================================

function setupMenuFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items with animation
            menuItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// =============================================
// GALLERY LIGHTBOX
// =============================================

function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-nav.prev');
    const nextBtn = document.querySelector('.lightbox-nav.next');
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentIndex = index;
            showLightbox();
        });
    });

    function showLightbox() {
        lightboxImg.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hideLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    lightboxClose.addEventListener('click', hideLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            hideLightbox();
        }
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') hideLightbox();
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
        }
    });
}

// =============================================
// TESTIMONIAL SLIDER
// =============================================

function setupTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(n) {
        testimonials.forEach(t => t.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        currentSlide = (n + testimonials.length) % testimonials.length;
        
        testimonials[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopSlideShow() {
        clearInterval(slideInterval);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });

    startSlideShow();

    // Pause on hover
    const slider = document.querySelector('.testimonials-slider');
    slider.addEventListener('mouseenter', stopSlideShow);
    slider.addEventListener('mouseleave', startSlideShow);
}

// =============================================
// FORM VALIDATION & SUBMISSION
// =============================================

function setupForms() {
    // Reservation Form
    const reservationForm = document.getElementById('reservationForm');
    reservationForm.addEventListener('submit', handleReservationSubmit);

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', handleContactSubmit);

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    newsletterForm.addEventListener('submit', handleNewsletterSubmit);

    // Real-time validation
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.parentElement.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

function validateField(field) {
    const formGroup = field.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Remove previous error
    formGroup.classList.remove('error');
    if (errorMessage) errorMessage.textContent = '';

    // Check if required field is empty
    if (field.hasAttribute('required') && !field.value.trim()) {
        formGroup.classList.add('error');
        if (errorMessage) errorMessage.textContent = 'This field is required';
        return false;
    }

    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            formGroup.classList.add('error');
            if (errorMessage) errorMessage.textContent = 'Please enter a valid email';
            return false;
        }
    }

    // Phone validation
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(field.value)) {
            formGroup.classList.add('error');
            if (errorMessage) errorMessage.textContent = 'Please enter a valid phone number';
            return false;
        }
    }

    // Date validation (not in the past)
    if (field.type === 'date' && field.value) {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            formGroup.classList.add('error');
            if (errorMessage) errorMessage.textContent = 'Please select a future date';
            return false;
        }
    }

    return true;
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function handleReservationSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        occasion: document.getElementById('occasion').value,
        requests: document.getElementById('requests').value
    };

    console.log('Reservation Data:', formData);

    // Simulate API call
    showNotification('Processing your reservation...', 'info');
    
    setTimeout(() => {
        showNotification('Thank you! Your reservation has been confirmed. We will contact you shortly.', 'success');
        e.target.reset();
        
        // Remove any error states
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
    }, 1500);
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }

    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    console.log('Contact Data:', formData);

    showNotification('Sending your message...', 'info');
    
    setTimeout(() => {
        showNotification('Thank you for contacting us! We will respond within 24 hours.', 'success');
        e.target.reset();
        
        document.querySelectorAll('.form-group.error').forEach(group => {
            group.classList.remove('error');
        });
    }, 1500);
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = document.getElementById('newsletterEmail').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    console.log('Newsletter Subscription:', email);

    showNotification('Subscribing...', 'info');
    
    setTimeout(() => {
        showNotification('Successfully subscribed to our newsletter!', 'success');
        e.target.reset();
    }, 1500);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const styles = {
        position: 'fixed',
        top: '100px',
        right: '30px',
        padding: '1rem 2rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        maxWidth: '400px'
    };

    Object.assign(notification.style, styles);

    if (type === 'success') {
        notification.style.background = '#4CAF50';
    } else if (type === 'error') {
        notification.style.background = '#f44336';
    } else {
        notification.style.background = '#2196F3';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// =============================================
// SPECIAL OFFERS MODAL
// =============================================

function setupModal() {
    const modal = document.getElementById('specialModal');
    const closeBtn = document.querySelector('.modal-close');

    // Show modal after 2 seconds
    setTimeout(() => {
        modal.classList.add('show');
    }, 2000);

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Don't show again for 24 hours
    if (sessionStorage.getItem('modalShown')) {
        modal.classList.remove('show');
    } else {
        sessionStorage.setItem('modalShown', 'true');
    }
}

function displayTodaysSpecial() {
    const specials = [
        {
            name: 'Truffle Risotto',
            description: 'Creamy arborio rice with black truffle and parmesan',
            discount: '20% OFF'
        },
        {
            name: 'Grilled Sea Bass',
            description: 'Fresh sea bass with lemon butter sauce and vegetables',
            discount: '15% OFF'
        },
        {
            name: 'Tiramisu Deluxe',
            description: 'Classic tiramisu with extra mascarpone and amaretto',
            discount: 'Buy 1 Get 1 Free'
        }
    ];

    const dayOfWeek = new Date().getDay();
    const todaySpecial = specials[dayOfWeek % specials.length];

    const specialContainer = document.getElementById('todaySpecial');
    specialContainer.innerHTML = `
        <h3>${todaySpecial.name}</h3>
        <p>${todaySpecial.description}</p>
        <p style="color: var(--primary); font-weight: 700; font-size: 1.2rem; margin-top: 1rem;">
            ${todaySpecial.discount}
        </p>
    `;
}

// =============================================
// OPENING HOURS & STATUS
// =============================================

function updateOpeningHours() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;

    const statusElement = document.getElementById('currentStatus');
    
    let isOpen = false;
    let openTime, closeTime;

    // Monday-Thursday: 12:00 PM - 11:00 PM
    if (day >= 1 && day <= 4) {
        openTime = 12 * 60; // 12:00 PM
        closeTime = 23 * 60; // 11:00 PM
    }
    // Friday-Saturday: 12:00 PM - 12:00 AM
    else if (day === 5 || day === 6) {
        openTime = 12 * 60;
        closeTime = 24 * 60;
    }
    // Sunday: 11:00 AM - 11:00 PM
    else {
        openTime = 11 * 60;
        closeTime = 23 * 60;
    }

    isOpen = currentTime >= openTime && currentTime < closeTime;

    if (isOpen) {
        const minutesUntilClose = closeTime - currentTime;
        const hoursUntilClose = Math.floor(minutesUntilClose / 60);
        
        statusElement.textContent = `🟢 We're Open Now! Closing in ${hoursUntilClose} hours`;
        statusElement.style.background = 'rgba(76, 175, 80, 0.2)';
        statusElement.style.color = '#4CAF50';
    } else {
        statusElement.textContent = `🔴 Currently Closed`;
        statusElement.style.background = 'rgba(244, 67, 54, 0.2)';
        statusElement.style.color = '#f44336';
    }
}

// =============================================
// RESERVATION DATE CONSTRAINTS
// =============================================

function setMinDateForReservation() {
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const formattedDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', formattedDate);
    
    // Set max date to 3 months from now
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
}

// =============================================
// PERFORMANCE OPTIMIZATION
// =============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// Update opening hours every minute
setInterval(updateOpeningHours, 60000);

console.log('🍝 Zestha Restaurant Website Loaded Successfully!');