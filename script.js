/* ══════════════════════════════════════════════════════════
   PORTFOLIO — script.js
   ══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   1.  THEME MANAGEMENT
   ───────────────────────────────────────────────────────── */
const html       = document.documentElement;
const toggleBtn  = document.getElementById('theme-toggle');
const iconSun    = document.getElementById('icon-sun');
const iconMoon   = document.getElementById('icon-moon');

/**
 * Returns the resolved theme: checks localStorage first,
 * then falls back to the OS preference.
 * @returns {'dark'|'light'}
 */
function getInitialTheme() {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Applies a theme to the document and syncs the toggle icon. */
function applyTheme(theme) {
  if (theme === 'dark') {
    html.classList.add('dark');
    iconSun.classList.remove('hidden');
    iconMoon.classList.add('hidden');
  } else {
    html.classList.remove('dark');
    iconSun.classList.add('hidden');
    iconMoon.classList.remove('hidden');
  }
}

/** Toggles between dark ↔ light and persists the choice. */
function toggleTheme() {
  const isDark  = html.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialise on page load (before paint to avoid flash)
applyTheme(getInitialTheme());
toggleBtn.addEventListener('click', toggleTheme);

// Keep in sync if the OS preference changes while the tab is open
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});


/* ─────────────────────────────────────────────────────────
   2.  NAVBAR — scroll-shadow + active link highlight
   ───────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Active nav-link based on scroll position
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.style.color = '';            // reset
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.style.color = '#6366f1';  // accent
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });


/* ─────────────────────────────────────────────────────────
   3.  MOBILE MENU TOGGLE
   ───────────────────────────────────────────────────────── */
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu when a link is tapped
document.querySelectorAll('.mobile-nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});


/* ─────────────────────────────────────────────────────────
   4.  SCROLL-REVEAL — fade sections in as they enter view
   ───────────────────────────────────────────────────────── */
const revealElements = document.querySelectorAll(
  '.skill-card, .project-card, .stat-card, .contact-form-wrapper, #about .grid > div'
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // fire only once
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Prepare elements (hide initially, then reveal with CSS)
revealElements.forEach((el, i) => {
  el.style.opacity      = '0';
  el.style.transform    = 'translateY(24px)';
  el.style.transition   = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
  revealObserver.observe(el);
});

// CSS class that triggers the transition
const style = document.createElement('style');
style.textContent = `.revealed { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(style);


/* ─────────────────────────────────────────────────────────
   5.  CONTACT FORM — validation + submit feedback
   ───────────────────────────────────────────────────────── */
// const contactForm = document.getElementById('contact-form');

// contactForm.addEventListener('submit', (e) => {
//   e.preventDefault();

//   const name    = contactForm.name.value.trim();
//   const email   = contactForm.email.value.trim();
//   const message = contactForm.message.value.trim();
//   const btn     = contactForm.querySelector('button[type="submit"]');

//   // Basic validation
//   if (!name || !email || !message) {
//     shakeForm();
//     return;
//   }

//   if (!isValidEmail(email)) {
//     highlightField(contactForm.email);
//     return;
//   }

//   // Simulate sending (replace with your actual fetch/API call)
//   btn.disabled    = true;
//   btn.textContent = 'Sending…';

//   setTimeout(() => {
//     btn.textContent = '✓ Message sent!';
//     btn.style.background = '#10b981'; // green
//     contactForm.reset();

//     setTimeout(() => {
//       btn.disabled         = false;
//       btn.textContent      = 'Send Message →';
//       btn.style.background = '';
//     }, 3500);
//   }, 1200);
// });

// function isValidEmail(email) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// }

// function highlightField(input) {
//   input.style.borderColor = '#ef4444';
//   input.style.boxShadow   = '0 0 0 4px rgba(239,68,68,0.12)';
//   input.focus();
//   input.addEventListener('input', () => {
//     input.style.borderColor = '';
//     input.style.boxShadow   = '';
//   }, { once: true });
// }

// function shakeForm() {
//   contactForm.style.animation = 'none';
//   contactForm.offsetHeight;   // reflow
//   contactForm.style.animation = 'shake 0.45s ease';
// }

// // Shake keyframes
// const shakeStyle = document.createElement('style');
// shakeStyle.textContent = `
//   @keyframes shake {
//     0%,100% { transform: translateX(0); }
//     15%      { transform: translateX(-6px); }
//     30%      { transform: translateX(6px); }
//     45%      { transform: translateX(-4px); }
//     60%      { transform: translateX(4px); }
//     75%      { transform: translateX(-2px); }
//   }
// `;
// document.head.appendChild(shakeStyle);


/* ─────────────────────────────────────────────────────────
   6.  SMOOTH SCROLL OFFSET — account for sticky navbar
   ───────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    const navbarHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 8;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});
