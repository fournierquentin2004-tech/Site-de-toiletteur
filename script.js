// =============================================
//  ÉLÉGANCE ANIMALE — Script
// =============================================

/* --- Navbar scroll + parallax hero --- */
const navbar       = document.getElementById('navbar');
const heroParallax = document.getElementById('heroParallax');

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);

    if (heroParallax && window.innerWidth > 768) {
        heroParallax.style.transform = `translateY(${y * 0.55}px)`;
    }
}, { passive: true });

/* --- Hamburger / menu mobile --- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) navbar.classList.add('scrolled');
    else if (window.scrollY <= 60) navbar.classList.remove('scrolled');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
        if (window.scrollY <= 60) navbar.classList.remove('scrolled');
    });
});

/* --- Placeholder race adapté mobile --- */
const raceInput = document.getElementById('race');
if (raceInput) {
    const mq = window.matchMedia('(max-width: 768px)');
    const updateRacePlaceholder = (e) => {
        raceInput.placeholder = e.matches ? 'Golden Retriever' : 'Ex : Golden Retriever, petit…';
    };
    mq.addEventListener('change', updateRacePlaceholder);
    updateRacePlaceholder(mq);
}

/* --- Date min = aujourd'hui --- */
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

/* --- Formulaire de réservation --- */
const form        = document.getElementById('reservationForm');
const overlay     = document.getElementById('modalOverlay');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        highlightInvalidFields();
        return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const reservations = JSON.parse(localStorage.getItem('elegance_animale_reservations') || '[]');
    reservations.push({ id: Date.now().toString(), ...data, createdAt: new Date().toISOString() });
    localStorage.setItem('elegance_animale_reservations', JSON.stringify(reservations));

    overlay.classList.add('show');
    form.reset();
});

function highlightInvalidFields() {
    form.querySelectorAll(':invalid').forEach(field => {
        field.style.borderColor = '#E05C5C';
        field.addEventListener('input', () => {
            field.style.borderColor = '';
        }, { once: true });
    });

    const firstInvalid = form.querySelector(':invalid');
    if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
    }
}

/* --- Fermer la modal --- */
function closeModal() {
    overlay.classList.remove('show');
}

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* --- Animation count-up des chiffres --- */
function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const prefix   = el.dataset.prefix  || '';
    const suffix   = el.dataset.suffix  || '';
    const duration = 1800;
    const steps    = 60;
    const interval = duration / steps;
    let current    = 0;

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const timer = setInterval(() => {
        current++;
        const progress = easeOut(current / steps);
        const value    = Math.round(progress * target);
        el.textContent = prefix + value + suffix;

        if (current >= steps) {
            el.textContent = prefix + target + suffix;
            clearInterval(timer);
        }
    }, interval);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* --- Scroll reveal (Intersection Observer) --- */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --- Slider témoignages mobile --- */
const testimonialsGrid = document.querySelector('.testimonials-grid');
if (testimonialsGrid) {
    const mq = window.matchMedia('(max-width: 768px)');
    const cards = testimonialsGrid.querySelectorAll('.testimonial-card');
    const total = cards.length;

    /* Wrapper pour positionner les flèches */
    const wrapper = document.createElement('div');
    wrapper.className = 'testimonials-slider-wrap';
    testimonialsGrid.parentNode.insertBefore(wrapper, testimonialsGrid);
    wrapper.appendChild(testimonialsGrid);

    /* Flèches */
    const btnPrev = document.createElement('button');
    const btnNext = document.createElement('button');
    btnPrev.className = 'testimonials-arrow testimonials-arrow--prev';
    btnNext.className = 'testimonials-arrow testimonials-arrow--next';
    btnPrev.setAttribute('aria-label', 'Avis précédent');
    btnNext.setAttribute('aria-label', 'Avis suivant');
    btnPrev.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
    btnNext.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>`;
    wrapper.appendChild(btnPrev);
    wrapper.appendChild(btnNext);

    /* Dots */
    const dotsEl = document.createElement('div');
    dotsEl.className = 'testimonials-dots';
    wrapper.parentNode.insertBefore(dotsEl, wrapper.nextSibling);

    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testimonials-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Avis ${i + 1}`);
        dot.addEventListener('click', () => {
            testimonialsGrid.scrollTo({ left: testimonialsGrid.clientWidth * i, behavior: 'smooth' });
        });
        dotsEl.appendChild(dot);
    });

    const getCurrentIndex = () => Math.round(testimonialsGrid.scrollLeft / testimonialsGrid.clientWidth);

    const updateUI = () => {
        const index = getCurrentIndex();
        dotsEl.querySelectorAll('.testimonials-dot').forEach((dot, i) => dot.classList.toggle('active', i === index));
        btnPrev.classList.toggle('hidden', index === 0);
        btnNext.classList.toggle('hidden', index === total - 1);
    };

    btnPrev.addEventListener('click', () => {
        testimonialsGrid.scrollTo({ left: testimonialsGrid.clientWidth * (getCurrentIndex() - 1), behavior: 'smooth' });
    });
    btnNext.addEventListener('click', () => {
        testimonialsGrid.scrollTo({ left: testimonialsGrid.clientWidth * (getCurrentIndex() + 1), behavior: 'smooth' });
    });

    testimonialsGrid.addEventListener('scroll', () => {
        if (!mq.matches) return;
        updateUI();
    }, { passive: true });

    const enableSlider = (e) => {
        if (e.matches) {
            cards.forEach(card => card.classList.add('visible'));
            updateUI();
        }
    };
    mq.addEventListener('change', enableSlider);
    enableSlider(mq);
}

/* --- Cartes services cliquables --- */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('.service-link')) return;
        document.body.classList.add('cards-ready');
        const isActive = card.classList.contains('featured');
        document.querySelectorAll('.service-card').forEach(c => c.classList.remove('featured'));
        if (!isActive) card.classList.add('featured');
    });
});

/* --- Smooth scroll sur les ancres --- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = navbar.offsetHeight + 12;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});
