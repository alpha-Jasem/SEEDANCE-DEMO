/* ═══════════════════════════════════════════════════
   سدر للمقاولات — MAIN JS
   Logo Traveler · GSAP ScrollTrigger · Reveal · Nav
═══════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─── NAV SCROLL ────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── LOGO TRAVELER ─────────────────────────────── */
// The logo mark appears after the hero and travels
// alongside the user all the way to the footer.
const logoTraveler = document.getElementById('logoTraveler');

function updateLogoTraveler() {
  const scrollY   = window.scrollY;
  const docH      = document.documentElement.scrollHeight;
  const winH      = window.innerHeight;
  const heroH     = document.getElementById('hero').offsetHeight;
  const maxScroll = docH - winH;

  // Show after scrolling past hero
  if (scrollY > heroH * 0.7) {
    logoTraveler.classList.add('visible');
  } else {
    logoTraveler.classList.remove('visible');
  }

  // Move logo vertically: starts at top 50%, slides toward bottom 80% as page ends
  const progress = Math.min(1, Math.max(0, (scrollY - heroH * 0.7) / (maxScroll - heroH * 0.7)));
  const topPct   = 50 + progress * 30; // 50% → 80%
  logoTraveler.style.top = topPct + '%';

  // Update the decorative line height (scroll progress indicator)
  const lineH = progress * 50; // 0 → 50vh
  logoTraveler.style.setProperty('--scroll-progress', lineH + 'vh');

  // Subtle scale pulse at milestones
  const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.04;
  logoTraveler.querySelector('img').style.transform = `scale(${scale})`;
}

window.addEventListener('scroll', updateLogoTraveler, { passive: true });
updateLogoTraveler();

/* ─── SECTION REVEAL ANIMATIONS ────────────────── */
// Observe all [data-reveal] elements
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

// Stagger children within grids
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  // If inside a grid, stagger by index
  const parent = el.parentElement;
  const siblings = parent.querySelectorAll('[data-reveal]');
  const idx = Array.from(siblings).indexOf(el);
  if (idx > 0 && siblings.length > 1) {
    el.style.animationDelay = (idx * 0.12) + 's';
  }
  revealObserver.observe(el);
});

/* ─── GSAP: HERO PARALLAX ───────────────────────── */
gsap.to('.hero__video', {
  y: '20%',
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  }
});

/* ─── GSAP: STATS SECTION ───────────────────────── */
// Blue-to-black gradient slides in
gsap.fromTo('.stats__bg',
  { opacity: 0, scale: 1.05 },
  {
    opacity: 1, scale: 1,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.stats',
      start: 'top 80%',
      once: true,
    }
  }
);

/* ─── GSAP: GOLD DIVIDERS ───────────────────────── */
gsap.utils.toArray('.gold-rule').forEach(rule => {
  gsap.fromTo(rule,
    { scaleX: 0, transformOrigin: 'right center' },
    {
      scaleX: 1,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: rule,
        start: 'top 90%',
        once: true,
      }
    }
  );
});

/* ─── GSAP: PROJECT CARDS ───────────────────────── */
gsap.utils.toArray('.project-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
      }
    }
  );
});

/* ─── GSAP: SERVICE CARDS ───────────────────────── */
gsap.utils.toArray('.service-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.7,
      delay: i * 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        once: true,
      }
    }
  );
});

/* ─── STAT COUNTER ──────────────────────────────── */
const arabicNums = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toArabicNum(n) {
  return String(Math.round(n)).split('').map(d => arabicNums[+d] || d).join('');
}

document.querySelectorAll('.stat-item__num').forEach(el => {
  const target = parseInt(el.dataset.count, 10);

  ScrollTrigger.create({
    trigger: el,
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.fromTo({ val: 0 }, { val: target },
        {
          duration: 2.2,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = toArabicNum(this.targets()[0].val);
          }
        }
      );
    }
  });
});

/* ─── CONTACT FORM ──────────────────────────────── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn--gold');
  const msg = document.getElementById('formMsg');

  btn.textContent = 'جاري الإرسال...';
  btn.disabled = true;

  setTimeout(() => {
    msg.textContent = 'شكراً! تم إرسال طلبك. سيتواصل معك فريقنا خلال ٢٤ ساعة.';
    btn.textContent = 'تم الإرسال ✓';
    e.target.reset();
  }, 1400);
}

/* ─── MOBILE MENU ───────────────────────────────── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

/* ─── SMOOTH ANCHOR LINKS ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.getElementById('mobileMenu')?.classList.remove('open');
    }
  });
});

/* ─── CURSOR GLOW (desktop) ─────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9998',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
    transform: 'translate(-50%, -50%)',
    top: '0', left: '0',
    transition: 'opacity 0.3s',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}
