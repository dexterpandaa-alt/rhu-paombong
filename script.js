// Navbar scroll effect
window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu toggle
let menuOpen = false;
function toggleMenu() {
    menuOpen = !menuOpen;
    document.getElementById('mobile-menu').classList.toggle('open', menuOpen);
    document.getElementById('ham').classList.toggle('open', menuOpen);
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (menuOpen && !e.target.closest('#mobile-menu') && !e.target.closest('.nav-mobile-btn')) {
        menuOpen = false;
        document.getElementById('mobile-menu').classList.remove('open');
        document.getElementById('ham').classList.remove('open');
    }
});

// Scroll reveal animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Dynamic nav height for announcement bar
function updateAnnounceBarMargin() {
    const navHeight = document.getElementById('navbar').offsetHeight;
    const announceBar = document.querySelector('.announce-bar');
    if (announceBar) announceBar.style.marginTop = navHeight + 'px';
    document.documentElement.style.setProperty('--nav-height', navHeight + 'px');
}
window.addEventListener('resize', updateAnnounceBarMargin);
updateAnnounceBarMargin();