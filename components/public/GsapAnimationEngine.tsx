'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export default function GsapAnimationEngine() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Small delay ensures next DOM tree is fully mounted across route transitions
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // ─── 1. FLOATING BACKGROUND GEOMETRIC PARALLAX (ALL PAGES) ───
        const bgSemi1 = document.getElementById('bgSemi1');
        const bgSquare1 = document.getElementById('bgSquare1');
        const bgCircle1 = document.getElementById('bgCircle1');
        const bgSemi2 = document.getElementById('bgSemi2');
        const bgCircle2 = document.getElementById('bgCircle2');

        if (bgSemi1 || bgSquare1 || bgCircle1 || bgSemi2 || bgCircle2) {
          if (bgSemi1) {
            gsap.to(bgSemi1, {
              scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.5,
              },
              y: 650,
              rotate: 360,
              ease: 'none',
            });
          }

          if (bgSquare1) {
            gsap.to(bgSquare1, {
              scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2,
              },
              y: 800,
              x: -120,
              rotate: -180,
              ease: 'none',
            });
          }

          if (bgCircle1) {
            gsap.to(bgCircle1, {
              scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
              },
              y: 900,
              scale: 1.6,
              ease: 'none',
            });
          }

          if (bgSemi2) {
            gsap.to(bgSemi2, {
              scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.4,
              },
              y: -400,
              rotate: 270,
              ease: 'none',
            });
          }

          if (bgCircle2) {
            gsap.to(bgCircle2, {
              scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,
              },
              y: 500,
              x: -80,
              ease: 'none',
            });
          }
        }

        // ─── 2. HERO MECHANICAL ENTRANCE & SCROLL SCRUB (HOMEPAGE) ───
        const scSquare = document.getElementById('scSquare');
        const scSemi = document.getElementById('scSemi');
        const scCircle = document.getElementById('scCircle');
        const scBar = document.getElementById('scBar');
        const heroSection = document.getElementById('home');

        if (scSquare || document.querySelector('.hero-badge')) {
          const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });

          const heroBadge = document.querySelector('.hero-badge');
          if (heroBadge) {
            heroTl.fromTo(
              heroBadge,
              { opacity: 0, y: -25, scale: 0.95 },
              { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.1 }
            );
          }

          const heroRows = document.querySelectorAll('.hero-name .hero-row');
          if (heroRows.length > 0) {
            heroTl.fromTo(
              heroRows,
              { y: 70, opacity: 0 },
              { y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: 'expo.out' },
              '-=0.5'
            );
          }

          const heroManifesto = document.querySelector('.hero-manifesto');
          if (heroManifesto) {
            heroTl.fromTo(
              heroManifesto,
              { opacity: 0, x: -30 },
              { opacity: 1, x: 0, duration: 0.9 },
              '-=0.6'
            );
          }

          const heroBtns = document.querySelectorAll('.hero-actions .cta-btn, .hero-actions .ghost-btn');
          if (heroBtns.length > 0) {
            heroTl.fromTo(
              heroBtns,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
              '-=0.5'
            );
          }

          const scrollCue = document.querySelector('.scroll-cue');
          if (scrollCue) {
            heroTl.fromTo(
              scrollCue,
              { opacity: 0 },
              { opacity: 1, duration: 0.8 },
              '-=0.3'
            );
          }

          // Hero Geometric Sculpture entrance
          if (scSquare) {
            heroTl.fromTo(
              scSquare,
              { scale: 0, rotate: -45, opacity: 0 },
              { scale: 1, rotate: 0, opacity: 0.95, duration: 1, ease: 'back.out(1.6)' },
              0.3
            );
          }

          if (scSemi) {
            heroTl.fromTo(
              scSemi,
              { scale: 0, y: 40, opacity: 0 },
              { scale: 1, y: 0, opacity: 0.9, duration: 1, ease: 'back.out(1.7)' },
              0.45
            );
          }

          if (scCircle) {
            heroTl.fromTo(
              scCircle,
              { scale: 0, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2)' },
              0.6
            );
          }

          if (scBar) {
            heroTl.fromTo(
              scBar,
              { scaleX: 0, opacity: 0 },
              { scaleX: 1, opacity: 0.4, duration: 0.7, transformOrigin: 'left center' },
              0.75
            );
          }

          // Interactive scroll scrub for Sculpture
          if (heroSection) {
            if (scSquare) {
              gsap.to(scSquare, {
                scrollTrigger: {
                  trigger: heroSection,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 1.2,
                },
                y: 160,
                rotate: 90,
                opacity: 0.3,
                ease: 'none',
              });
            }

            if (scSemi) {
              gsap.to(scSemi, {
                scrollTrigger: {
                  trigger: heroSection,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 1.2,
                },
                x: -80,
                y: 100,
                rotate: 180,
                ease: 'none',
              });
            }

            if (scCircle) {
              gsap.to(scCircle, {
                scrollTrigger: {
                  trigger: heroSection,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: 0.8,
                },
                scale: 1.4,
                x: 60,
                y: 200,
                ease: 'none',
              });
            }
          }
        }

        // ─── 3. SCRUBBED KINETIC TICKER (Scrolls with page) ─────────
        const track = document.getElementById('stripTrack');
        const stripContainer = document.getElementById('kineticStrip');
        if (track && stripContainer) {
          gsap.to(track, {
            x: '-35%',
            ease: 'none',
            scrollTrigger: {
              trigger: stripContainer,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        }

        // ─── 4. GEOMETRIC SYSTEM MORPH ON SCROLL ───────────────────
        const showcaseSec = document.querySelector('.shapes-showcase-section');
        const geoSq = document.getElementById('geoSqDisplay');
        const geoSemi = document.getElementById('geoSemiDisplay');
        const geoCircle = document.getElementById('geoCircleDisplay');

        if (showcaseSec) {
          if (geoSq) {
            gsap.to(geoSq, {
              scrollTrigger: {
                trigger: showcaseSec,
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: 1,
              },
              rotate: 180,
              scale: 1.15,
              ease: 'none',
            });
          }

          if (geoSemi) {
            gsap.to(geoSemi, {
              scrollTrigger: {
                trigger: showcaseSec,
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: 1.2,
              },
              rotate: 180,
              scale: 1.2,
              ease: 'none',
            });
          }

          if (geoCircle) {
            gsap.to(geoCircle, {
              scrollTrigger: {
                trigger: showcaseSec,
                start: 'top 85%',
                end: 'bottom 20%',
                scrub: 1,
              },
              scale: 1.3,
              ease: 'none',
            });
          }
        }

        // ─── 5. PORTFOLIO SCROLL MOTION & STAGGER ───────────────────
        const col2Cards = document.querySelectorAll('.card-col-2');
        col2Cards.forEach((card) => {
          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.4,
            },
            y: -40,
            ease: 'none',
          });
        });

        const col1Cards = document.querySelectorAll('.card-col-1');
        col1Cards.forEach((card) => {
          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.1,
            },
            y: 20,
            ease: 'none',
          });
        });

        // Universal card reveal for all .p-card elements
        const allCards = document.querySelectorAll('.p-card');
        allCards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // ─── 6. ABOUT TOTEM STACK ANIMATION ─────────────────────────
        const totemStack = document.getElementById('totemStack');
        const aboutSec = document.getElementById('about');

        if (totemStack && aboutSec) {
          const totemTl = gsap.timeline({
            scrollTrigger: {
              trigger: aboutSec,
              start: 'top 75%',
              end: 'center 45%',
              scrub: 1,
            },
          });

          totemTl
            .fromTo(
              '#totemCirc',
              { y: -80, scale: 0.6, opacity: 0.4 },
              { y: 0, scale: 1, opacity: 1, ease: 'none' }
            )
            .fromTo(
              '#totemSemi',
              { rotate: 180, scale: 0.8 },
              { rotate: 0, scale: 1, ease: 'none' },
              0
            )
            .fromTo(
              '#totemSq',
              { scale: 0.7, y: 50 },
              { scale: 1, y: 0, ease: 'none' },
              0
            );
        }

        // Skill matrix column reveal
        const matrixCols = document.querySelectorAll('.matrix-col');
        if (matrixCols.length > 0) {
          gsap.fromTo(
            matrixCols,
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
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ─── 7. JOURNAL & BLOG CARDS ENTRANCE ────────────────────────
        const blogEntries = document.querySelectorAll('.b-entry');
        if (blogEntries.length > 0) {
          gsap.fromTo(
            blogEntries,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: blogEntries[0],
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ─── 8. CONTACT FRAME ENTRANCE ──────────────────────────────
        const contactFrame = document.querySelector('.contact-frame, .contact-card-box');
        if (contactFrame) {
          gsap.fromTo(
            contactFrame,
            { opacity: 0, y: 45 },
            {
              opacity: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: contactFrame,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        }

        // ─── 9. SECTION HEADERS REVEAL ACROSS PAGES ─────────────────
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach((sh) => {
          gsap.fromTo(
            sh,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sh,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          );
        });

        // ─── 10. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS ──────────────
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach((anchor) => {
          anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId.length > 1) {
              const targetEl = document.querySelector(targetId);
              if (targetEl) {
                e.preventDefault();
                gsap.to(window, {
                  duration: 1.1,
                  scrollTo: {
                    y: targetEl,
                    offsetY: 80,
                  },
                  ease: 'power4.inOut',
                });
              }
            }
          });
        });

        // Refresh calculations after DOM layout settles
        ScrollTrigger.refresh();
      });

      return () => {
        ctx.revert();
      };
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
