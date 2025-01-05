// Import Three.js animation
import './three-animation.js';

// Navigation hamburger menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar color change on scroll with modern blur effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            if (entry.target.classList.contains('stat-item')) {
                animateNumber(entry.target.querySelector('h3'));
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-content, .academic-programs, .facility-grid, .stat-item').forEach(el => {
    observer.observe(el);
});

// Number animation for statistics
function animateNumber(element) {
    const target = parseInt(element.textContent);
    let current = 0;
    const increment = target / 50;
    const duration = 1500;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
});

// Dynamic year update
document.querySelector('.footer-bottom p').innerHTML = `&copy; ${new Date().getFullYear()} Indian School Muscat. All rights reserved.`;

// Add glass morphism effect to cards on hover
document.querySelectorAll('.stat-item, .program, .facility').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.classList.add('glass-card');
    });
    card.addEventListener('mouseleave', () => {
        card.classList.remove('glass-card');
    });
});
