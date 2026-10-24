// ══════════════════════════════════════════════════════════════════
// MADHAN — DESIGN CUM DEVELOPER
// KINETIC GSAP ENGINE WITH SCROLL-DRIVEN MECHANICAL MOTION
// ══════════════════════════════════════════════════════════════════

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
  initHeroIntro();
  initScrollShapesParallax();
  initKineticScrubMarquee();
  initGeometricShowcaseScroll();
  initPortfolioScrollMotion();
  initAboutTotemScroll();
  initBurgerNav();
  initContactForm();
});

/* ─── 1. HERO MECHANICAL ENTRANCE ───────────────────────────── */
function initHeroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.fromTo(
    '.hero-badge',
    { opacity: 0, y: -25, scale: 0.95 },
    { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.15 }
  )
    .fromTo(
      '.hero-name .hero-row',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: 'expo.out' },
      '-=0.5'
    )
    .fromTo(
      '.hero-manifesto',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.9 },
      '-=0.6'
    )
    .fromTo(
      '.hero-actions .cta-btn, .hero-actions .ghost-btn',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
      '-=0.5'
    )
    .fromTo(
      '.burger',
      { scale: 0, opacity: 0, rotate: -90 },
      { scale: 1, opacity: 1, rotate: 0, duration: 0.8, ease: 'back.out(2)' },
      '-=0.8'
    )
    .fromTo(
      '.scroll-cue',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.3'
    );

  // Hero Sculpture entrance (Square, Semi-Circle, Circle, Bar)
  tl.fromTo(
    '#scSquare',
    { scale: 0, rotate: -45, opacity: 0 },
    { scale: 1, rotate: 0, opacity: 0.95, duration: 1, ease: 'back.out(1.6)' },
    0.3
  )
    .fromTo(
      '#scSemi',
      { scale: 0, y: 40, opacity: 0 },
      { scale: 1, y: 0, opacity: 0.85, duration: 1, ease: 'back.out(1.7)' },
      0.45
    )
    .fromTo(
      '#scCircle',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2)' },
      0.6
    )
    .fromTo(
      '#scBar',
      { scaleX: 0, opacity: 0 },
      { scaleX: 1, opacity: 0.4, duration: 0.7, transformOrigin: 'left center' },
      0.75
    );

  // Hero Sculpture interactive scroll scrub (Deconstructs on scroll)
  gsap.to('#scSquare', {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    },
    y: 160,
    rotate: 90,
    opacity: 0.3,
    ease: 'none'
  });

  gsap.to('#scSemi', {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    },
    x: -80,
    y: 100,
    rotate: 180,
    ease: 'none'
  });

  gsap.to('#scCircle', {
    scrollTrigger: {
      trigger: '#home',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.8
    },
    scale: 1.4,
    x: 60,
    y: 200,
    ease: 'none'
  });
}

/* ─── 2. FLOATING BACKGROUND GEOMETRIC PARALLAX (SCROLL-DRIVEN) ─ */
function initScrollShapesParallax() {
  // Semi-Circle: Rotates and slides down
  gsap.to('#bgSemi1', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5
    },
    y: 650,
    rotate: 360,
    ease: 'none'
  });

  // Solid Square: Spins and glides horizontally
  gsap.to('#bgSquare1', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2
    },
    y: 800,
    x: -120,
    rotate: -180,
    ease: 'none'
  });

  // Solid Circle: Scales up and down with scroll
  gsap.to('#bgCircle1', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    },
    y: 900,
    scale: 1.6,
    ease: 'none'
  });

  // Bottom Semi-circle
  gsap.to('#bgSemi2', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.4
    },
    y: -400,
    rotate: 270,
    ease: 'none'
  });

  // Small circle floating
  gsap.to('#bgCircle2', {
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8
    },
    y: 500,
    x: -80,
    ease: 'none'
  });
}

/* ─── 3. SCRUBBED KINETIC TICKER (Scrolls With Page Scroll) ──── */
function initKineticScrubMarquee() {
  const track = document.getElementById('stripTrack');
  if (!track) return;

  // Move marquee track based on page scroll position
  gsap.to(track, {
    x: '-35%',
    ease: 'none',
    scrollTrigger: {
      trigger: '#kineticStrip',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6
    }
  });
}

/* ─── 4. GEOMETRIC SYSTEM MORPH ON SCROLL ─────────────────────── */
function initGeometricShowcaseScroll() {
  // Square morph: rotates 90° continuously as user scrolls past
  gsap.to('#geoSqDisplay', {
    scrollTrigger: {
      trigger: '.shapes-showcase-section',
      start: 'top 85%',
      end: 'bottom 20%',
      scrub: 1
    },
    rotate: 180,
    scale: 1.15,
    ease: 'none'
  });

  // Semi-Circle morph: Flips 180° on scroll
  gsap.to('#geoSemiDisplay', {
    scrollTrigger: {
      trigger: '.shapes-showcase-section',
      start: 'top 85%',
      end: 'bottom 20%',
      scrub: 1.2
    },
    rotate: 180,
    scale: 1.2,
    ease: 'none'
  });

  // Circle morph: Scales dynamically with scroll
  gsap.to('#geoCircleDisplay', {
    scrollTrigger: {
      trigger: '.shapes-showcase-section',
      start: 'top 85%',
      end: 'bottom 20%',
      scrub: 1
    },
    scale: 1.3,
    ease: 'none'
  });
}

/* ─── 5. PORTFOLIO SCROLL MOTION & STAGGER ───────────────────── */
function initPortfolioScrollMotion() {
  // Staggered column parallax scroll (Column 2 moves slightly faster than Column 1)
  const col2Cards = document.querySelectorAll('.card-col-2');
  col2Cards.forEach((card) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.4
      },
      y: -50,
      ease: 'none'
    });
  });

  const col1Cards = document.querySelectorAll('.card-col-1');
  col1Cards.forEach((card) => {
    gsap.to(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.1
      },
      y: 20,
      ease: 'none'
    });
  });

  // Card entrances with scroll scrub
  document.querySelectorAll('.p-card').forEach((card) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ─── 6. ABOUT TOTEM STACK ANIMATE ON SCROLL ──────────────────── */
function initAboutTotemScroll() {
  const totemStack = document.getElementById('totemStack');
  if (!totemStack) return;

  // The 3 shapes assemble tightly together as the user scrolls into About section
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
      end: 'center 45%',
      scrub: 1
    }
  });

  // Circle drops down onto semi-circle
  tl.fromTo(
    '#totemCirc',
    { y: -80, scale: 0.6, opacity: 0.4 },
    { y: 0, scale: 1, opacity: 1, ease: 'none' }
  )
    // Semi-circle rotates into alignment
    .fromTo(
      '#totemSemi',
      { rotate: 180, scale: 0.8 },
      { rotate: 0, scale: 1, ease: 'none' },
      0
    )
    // Square expands into solid foundation
    .fromTo(
      '#totemSq',
      { scale: 0.7, y: 50 },
      { scale: 1, y: 0, ease: 'none' },
      0
    );

  // Skill matrix column reveal
  gsap.fromTo(
    '.matrix-col',
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.matrix-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    }
  );

  // Blog articles entrance
  gsap.fromTo(
    '.b-entry',
    { opacity: 0, x: -30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#blogList',
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    }
  );

  // Contact frame entrance
  gsap.fromTo(
    '.contact-frame',
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    }
  );
}

/* ─── 7. RIGHT SIDE BURGER NAV & SMOOTH SCROLL ────────────────── */
function initBurgerNav() {
  const burger = document.getElementById('burger');
  const sideNav = document.getElementById('sideNav');
  const overlay = document.getElementById('overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  let isOpen = false;

  const openDrawer = () => {
    isOpen = true;
    burger.classList.add('open');
    sideNav.classList.add('open');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Stagger in links with mechanical snap
    gsap.fromTo(
      navLinks,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.1
      }
    );

    // Animate shapes in drawer (Square, Circle, Semi)
    gsap.fromTo(
      '.nav-shape-item',
      { scale: 0, rotate: -45 },
      {
        scale: 1,
        rotate: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(2)',
        delay: 0.35
      }
    );
  };

  const closeDrawer = () => {
    isOpen = false;
    burger.classList.remove('open');
    sideNav.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  burger.addEventListener('click', () => {
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  overlay.addEventListener('click', closeDrawer);

  // Nav link clicks with GSAP ScrollTo
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        closeDrawer();

        if (targetSection) {
          gsap.to(window, {
            duration: 1.1,
            scrollTo: {
              y: targetSection,
              offsetY: 20
            },
            ease: 'power4.inOut'
          });
        }
      }
    });
  });

  // Track active section and update active nav link
  const sections = document.querySelectorAll('.section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.dataset.section === current) {
        link.classList.add('active');
      }
    });
  });
}

/* ─── 8. CONTACT FORM SUBMISSION ─────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  if (!form || !btn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const originalContent = btn.innerHTML;

    btn.innerHTML = '<span class="btn-text">TRANSMITTED SUCCESSFUL ■</span>';
    btn.style.backgroundColor = '#090a0f';
    btn.style.color = '#ffffff';

    gsap.fromTo(
      btn,
      { scale: 0.95 },
      { scale: 1, duration: 0.4, ease: 'back.out(2)' }
    );

    form.reset();

    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.style.backgroundColor = '';
      btn.style.color = '';
    }, 4000);
  });
}
