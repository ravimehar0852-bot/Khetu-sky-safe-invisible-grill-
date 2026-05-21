/* ══════════════════════════════════════════════
   KHETU SKY SAFE – script.js
   All interactions, canvas grill animation,
   particles, scroll effects, testimonials
══════════════════════════════════════════════ */

/* ── NAVBAR SCROLL BEHAVIOR ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
});

/* ── ACTIVE NAV LINK ── */
function updateActiveNav() {
  const sections = ['home', 'services', 'about', 'gallery', 'contact'];
  const links = document.querySelectorAll('.nav-link');
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  links.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

/* ── HAMBURGER MENU ── */
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  const ham = document.getElementById('hamburger');
  nav.classList.toggle('open');
  ham.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}
function closeMenu() {
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  document.body.style.overflow = '';
}
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ══════════════════════════════════════════════
   HERO CANVAS – Animated Grill Wire Effect
══════════════════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const wires = [];
  const WIRE_COUNT = 18;
  const HORIZ_COUNT = 14;

  function createWires() {
    wires.length = 0;
    // Vertical wires
    for (let i = 0; i < WIRE_COUNT; i++) {
      wires.push({
        type: 'vertical',
        x: (canvas.width / WIRE_COUNT) * i + (canvas.width / WIRE_COUNT / 2),
        phase: Math.random() * Math.PI * 2,
        amplitude: 4 + Math.random() * 6,
        speed: 0.3 + Math.random() * 0.4,
        opacity: 0.15 + Math.random() * 0.2,
      });
    }
    // Horizontal wires
    for (let i = 0; i < HORIZ_COUNT; i++) {
      wires.push({
        type: 'horizontal',
        y: (canvas.height / HORIZ_COUNT) * i + 20,
        phase: Math.random() * Math.PI * 2,
        amplitude: 3 + Math.random() * 4,
        speed: 0.2 + Math.random() * 0.3,
        opacity: 0.1 + Math.random() * 0.15,
      });
    }
  }
  createWires();
  window.addEventListener('resize', createWires);

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.01;

    wires.forEach(wire => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(201,168,76,${wire.opacity})`;
      ctx.lineWidth = 1;

      if (wire.type === 'vertical') {
        const points = 40;
        for (let i = 0; i <= points; i++) {
          const progress = i / points;
          const y = canvas.height * progress;
          const x = wire.x + Math.sin(progress * Math.PI * 4 + t * wire.speed + wire.phase) * wire.amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      } else {
        const points = 50;
        for (let i = 0; i <= points; i++) {
          const progress = i / points;
          const x = canvas.width * progress;
          const y = wire.y + Math.sin(progress * Math.PI * 5 + t * wire.speed + wire.phase) * wire.amplitude;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    // Intersection dots
    const vWires = wires.filter(w => w.type === 'vertical');
    const hWires = wires.filter(w => w.type === 'horizontal');
    vWires.forEach(vw => {
      hWires.forEach(hw => {
        const x = vw.x + Math.sin(hw.y / canvas.height * Math.PI * 4 + t * vw.speed + vw.phase) * vw.amplitude;
        const y = hw.y + Math.sin(vw.x / canvas.width * Math.PI * 5 + t * hw.speed + hw.phase) * hw.amplitude;
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,208,96,${Math.max(vw.opacity, hw.opacity) * 1.5})`;
        ctx.fill();
      });
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════════ */
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  function createParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random() * 4;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${6 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    container.appendChild(p);
    setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, 16000);
  }

  for (let i = 0; i < 20; i++) setTimeout(createParticle, i * 400);
  setInterval(createParticle, 800);
})();

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.service-card, .why-card, .testimonial-card, .about-feat, .stat-item, .contact-card, .gallery-item, .about-content, .about-visual'
  );
  targets.forEach(el => el.classList.add('scroll-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════════ */
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.textContent.replace(/\D/g, ''));
      const duration = 1800;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════════════
   3D TILT EFFECT ON CARDS
══════════════════════════════════════════════ */
function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════════════
   GALLERY / LIGHTBOX
══════════════════════════════════════════════ */
const galleryData = [
  { bg: 'gi-1', tag: 'Invisible Grill', title: 'Premium Balcony Installation' },
  { bg: 'gi-2', tag: 'Mosquito Net',   title: 'Window Protection System' },
  { bg: 'gi-3', tag: 'Before / After', title: 'Transformation Project' },
  { bg: 'gi-4', tag: 'Child Safety',   title: 'Family Protection Solution' },
  { bg: 'gi-5', tag: 'Luxury Balcony', title: 'High-End Apartment Safety' },
];
let currentLightbox = 0;

function openLightbox(idx) {
  currentLightbox = idx;
  renderLightbox();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
}
function changeLightbox(dir) {
  currentLightbox = (currentLightbox + dir + galleryData.length) % galleryData.length;
  renderLightbox();
}
function renderLightbox() {
  const item = galleryData[currentLightbox];
  const img = document.getElementById('lightboxImg');
  img.className = 'lightbox-img ' + item.bg;
  document.getElementById('lightboxTag').textContent = item.tag;
  document.getElementById('lightboxTitle').textContent = item.title;
}
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') changeLightbox(1);
  if (e.key === 'ArrowLeft') changeLightbox(-1);
});

/* ══════════════════════════════════════════════
   TESTIMONIALS SLIDER
══════════════════════════════════════════════ */
let slideIndex = 0;
let slideInterval;

function goToSlide(idx) {
  slideIndex = idx;
  const track = document.getElementById('testimonialsTrack');
  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  let perSlide = 3;
  if (window.innerWidth <= 768) perSlide = 1;
  else if (window.innerWidth <= 1024) perSlide = 2;

  const cardW = cards[0].offsetWidth + 24;
  const maxSlide = cards.length - perSlide;
  slideIndex = Math.max(0, Math.min(idx, maxSlide));
  track.style.transform = `translateX(-${slideIndex * cardW}px)`;

  document.querySelectorAll('.tdot').forEach((dot, i) => {
    dot.classList.toggle('active', i === slideIndex);
  });
}

function startSlider() {
  clearInterval(slideInterval);
  slideInterval = setInterval(() => {
    const track = document.getElementById('testimonialsTrack');
    const cards = track.querySelectorAll('.testimonial-card');
    let perSlide = 3;
    if (window.innerWidth <= 768) perSlide = 1;
    else if (window.innerWidth <= 1024) perSlide = 2;
    const maxSlide = cards.length - perSlide;
    const next = slideIndex >= maxSlide ? 0 : slideIndex + 1;
    goToSlide(next);
  }, 4500);
}

/* ══════════════════════════════════════════════
   CONTACT FORM → WHATSAPP
══════════════════════════════════════════════ */
function submitForm() {
  const name    = document.getElementById('formName')?.value.trim();
  const phone   = document.getElementById('formPhone')?.value.trim();
  const service = document.getElementById('formService')?.value;
  const msg     = document.getElementById('formMsg')?.value.trim();

  if (!name || !phone) {
    alert('Please fill in your name and phone number.');
    return;
  }
  const text = `Hello KHETU SKY SAFE! 🙏

*Name:* ${name}
*Phone:* ${phone}
*Service Required:* ${service || 'Not specified'}
*Message:* ${msg || 'I would like to get a free quote.'}

Please get in touch with me. Thank you!`;

  const url = `https://wa.me/916378519754?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

/* ══════════════════════════════════════════════
   SMOOTH HOVER GLOW ON WHY CARDS
══════════════════════════════════════════════ */
function initGlowCards() {
  document.querySelectorAll('.why-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle 200px at ${x}px ${y}px, rgba(201,168,76,0.12), rgba(255,255,255,0.7))`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
}

/* ══════════════════════════════════════════════
   SECTION HEADER UNDERLINE ANIMATION
══════════════════════════════════════════════ */
function initSectionHeaders() {
  const headers = document.querySelectorAll('.section-header');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.section-title, .section-tag, .section-desc').forEach((el, i) => {
          el.style.animation = `revealUp 0.7s ${i * 0.15}s both`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  headers.forEach(h => observer.observe(h));
}

/* ══════════════════════════════════════════════
   RESIZE HANDLER
══════════════════════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    goToSlide(0);
    startSlider();
  }, 250);
});

/* ══════════════════════════════════════════════
   INIT ALL
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  animateCounters();
  initTilt();
  startSlider();
  initGlowCards();
  initSectionHeaders();
});
