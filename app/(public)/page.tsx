import React from 'react';
import Link from 'next/link';
import { getPublishedArticles } from '@/lib/db/articles';
import { getAllProjects } from '@/lib/db/projects';
import PublicContactForm from '@/components/public/PublicContactForm';
import HomeBlogList from '@/components/public/HomeBlogList';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

export const revalidate = 3600; // Background fallback revalidation

export default async function HomePage() {
  const articles = await getPublishedArticles();
  const projects = await getAllProjects();

  return (
    <div className="home-container">
      {/* ─── HERO SECTION ─────────────────────────────────────── */}
      <section id="home" className="section hero">
        <div className="hero-grid">
          {/* Left: Massive Typography */}
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-shape-circle" />
              <span className="badge-text">DIGITAL DESIGNER × CREATIVE DEVELOPER</span>
            </div>

            <h1 className="hero-name">
              <span className="hero-row">MADHAN</span>
              <span className="hero-row hero-accent">
                KR<span className="dot">■</span>
              </span>
            </h1>

            <p className="hero-manifesto">
              I turn ideas into clear digital experiences through visual design, thoughtful interfaces, and AI-assisted workflows. Always learning, experimenting, and building at the intersection of creativity and technology.
            </p>

            <div className="hero-actions">
              <Link href="/work" className="cta-btn" id="heroExploreWorksBtn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>Explore Works</span>
                <ArrowRight size={14} />
              </Link>
              <Link href="/contact" className="ghost-btn" id="heroContactBtn">
                <span>Get In Touch</span>
              </Link>
            </div>
          </div>

          {/* Right: Kinetic Hero Geometric Sculpture (Circle, Semi-Circle, Square) */}
          <div className="hero-sculpture" id="heroSculpture">
            <div className="sculpture-item sc-square" id="scSquare" title="Solid Square" />
            <div className="sculpture-item sc-semi" id="scSemi" title="Solid Semi-Circle" />
            <div className="sculpture-item sc-circle" id="scCircle" title="Solid Circle" />
            <div className="sculpture-item sc-bar" id="scBar" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-cue">
          <div className="cue-square" />
          <span>SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* ─── SCRUBBED KINETIC TICKER ─────────────────────────── */}
      <div className="kinetic-strip" id="kineticStrip">
        <div className="strip-track" id="stripTrack">
          <span className="strip-item">DIGITAL DESIGN</span>
          <span className="strip-sep">◆</span>
          <span className="strip-item">VISUAL STORYTELLING</span>
          <span className="strip-sep">■</span>
          <span className="strip-item">AI-ASSISTED WORKFLOWS</span>
          <span className="strip-sep">●</span>
          <span className="strip-item">DESIGN × DEVELOPMENT</span>
          <span className="strip-sep">▲</span>
          <span className="strip-item">DIGITAL DESIGN</span>
          <span className="strip-sep">◆</span>
          <span className="strip-item">VISUAL STORYTELLING</span>
          <span className="strip-sep">■</span>
          <span className="strip-item">AI-ASSISTED WORKFLOWS</span>
          <span className="strip-sep">●</span>
        </div>
      </div>

      {/* ─── GEOMETRIC MORPH BAR ──────────────────────────────── */}
      <div className="shapes-showcase-section">
        <div className="showcase-header">
          <span className="sys-code">CORE GEOMETRY SYSTEM</span>
        </div>
        <div className="shapes-row" id="shapesRow">
          <div className="shape-card sc-box">
            <div className="geo-display geo-sq-display" id="geoSqDisplay" />
            <span className="geo-label">01 / SQUARE</span>
            <p className="geo-desc">Clarity, structure, and purposeful layouts</p>
          </div>

          <div className="shape-card sc-box">
            <div className="geo-display geo-semi-display" id="geoSemiDisplay" />
            <span className="geo-label">02 / SEMI-CIRCLE</span>
            <p className="geo-desc">Movement that guides attention and meaning</p>
          </div>

          <div className="shape-card sc-box">
            <div className="geo-display geo-circle-display" id="geoCircleDisplay" />
            <span className="geo-label">03 / CIRCLE</span>
            <p className="geo-desc">Balance, focus, and a natural visual flow</p>
          </div>
        </div>
      </div>

      {/* ─── PORTFOLIO SECTION ────────────────────────────────── */}
      <section id="portfolio" className="section">
        <div className="section-header">
          <div className="section-tag-box">
            <span className="section-num">01</span>
            <span className="section-bracket">[ WORKS ]</span>
          </div>
          <h2 className="section-title">SELECTED WORKS</h2>
        </div>

        <div className="portfolio-grid" id="portfolioGrid">
          {projects.slice(0, 4).map((project, idx) => (
            <article key={project.id} className={`p-card card-col-${(idx % 2) + 1}`} data-speed="1.05">
              <div className="p-card-header">
                <span className="p-card-tag">{project.tag}</span>
                <span className="p-card-year">{project.year}</span>
              </div>
              <div className="p-card-graphic">
                <div className={`p-motif ${project.motif || 'motif-square'}`} />
              </div>
              <div className="p-card-info">
                <h3 className="p-card-title">{project.title.toUpperCase()}</h3>
                <p className="p-card-desc">{project.summary}</p>
                <div className="p-card-meta">
                  <span className="p-badge">{project.category}</span>
                  <span className="p-badge">{project.role}</span>
                </div>
                <Link href={`/work/${project.slug}`} className="p-card-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Explore Case</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div style={{ marginTop: '52px', display: 'flex', justifyContent: 'center' }}>
          <Link href="/work" className="cta-btn" id="exploreAllWorkBtn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>Explore All Case Studies &amp; Filter Projects</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── ABOUT SECTION ────────────────────────────────────── */}
      <section id="about" className="section">
        <div className="section-header">
          <div className="section-tag-box">
            <span className="section-num">02</span>
            <span className="section-bracket">[ PHILOSOPHY ]</span>
          </div>
          <h2 className="section-title">ABOUT MADHANKR</h2>
        </div>

        <div className="about-grid">
          <div className="about-narrative">
            <p className="about-lead-statement">
              I work where <strong>visual design</strong>, <strong>digital experiences</strong>, and <strong>emerging technology</strong> meet.
            </p>
            <p className="about-body-text">
              My journey has moved between graphic design, UI/UX, and front-end development. I enjoy understanding how a visual idea works—not only as a composition, but as an experience people can actually use. I bring a designer’s eye and a builder’s curiosity to each project.
            </p>
            <p className="about-body-text">
              I’m drawn to thoughtful layouts, restrained colour, strong typography, and details that serve a purpose. I also explore AI-assisted tools to test ideas faster, extend creative possibilities, and make repetitive parts of the workflow more efficient.
            </p>

            {/* Skill Matrix */}
            <div className="matrix-grid">
              <div className="matrix-col">
                <div className="matrix-header">
                  <span className="shape-icon sq" />
                  <h4>DESIGN</h4>
                </div>
                <ul>
                  <li>Visual Design</li>
                  <li>UI / UX Design</li>
                  <li>Brand Identity</li>
                  <li>Digital Campaigns</li>
                  <li>Prototyping</li>
                </ul>
              </div>

              <div className="matrix-col">
                <div className="matrix-header">
                  <span className="shape-icon semi" />
                  <h4>DEVELOPMENT</h4>
                </div>
                <ul>
                  <li>HTML, CSS &amp; JavaScript</li>
                  <li>Next.js &amp; React</li>
                  <li>Modern Headless CMS</li>
                  <li>Responsive Layouts</li>
                  <li>Creative Development</li>
                </ul>
              </div>

              <div className="matrix-col">
                <div className="matrix-header">
                  <span className="shape-icon circ" />
                  <h4>EXECUTION</h4>
                </div>
                <ul>
                  <li>Detail-focused Execution</li>
                  <li>AI-assisted Workflows</li>
                  <li>Cross-platform Visuals</li>
                  <li>Design-to-Development Handoff</li>
                  <li>Continuous Learning</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Kinetic Block Stack */}
          <div className="about-totem-wrap">
            <div className="totem-stack" id="totemStack">
              <div className="totem-layer totem-circ" id="totemCirc" />
              <div className="totem-layer totem-semi" id="totemSemi" />
              <div className="totem-layer totem-sq" id="totemSq" />
            </div>
            <div className="totem-badge">
              <span className="tb-big">03+</span>
              <span className="tb-sub">YEARS OF DESIGN EXPERIENCE</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG SECTION ─────────────────────────────────────── */}
      <section id="blog" className="section">
        <div className="section-header">
          <div className="section-tag-box">
            <span className="section-num">03</span>
            <span className="section-bracket">[ WRITINGS ]</span>
          </div>
          <h2 className="section-title">NOTES &amp; IDEAS</h2>
        </div>

        <HomeBlogList initialArticles={articles} />

        <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
          <Link href="/journal" className="cta-btn" id="exploreAllJournalBtn" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>Explore All Journal Entries &amp; Search</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ─── CONTACT SECTION ──────────────────────────────────── */}
      <section id="contact" className="section">
        <div className="section-header">
          <div className="section-tag-box">
            <span className="section-num">04</span>
            <span className="section-bracket">[ TRANSMISSION ]</span>
          </div>
          <h2 className="section-title">LET’S CONNECT</h2>
        </div>

        <div className="contact-frame">
          <div className="contact-pitch">
            <h3 className="contact-big-call">
              LET’S MAKE<br />
              <span>IT MEANINGFUL.</span>
            </h3>
            <p className="contact-subtext">
              Open to opportunities in digital design, UI/UX, AI-assisted creative work, and web experiences. If you have an interesting idea or collaboration in mind, let’s talk.
            </p>

            <div className="contact-links-list">
              <a href="https://www.linkedin.com/in/madhankrajagopal" target="_blank" rel="noopener noreferrer" className="contact-row">
                <span className="cr-shape sq" />
                <span className="cr-label">LINKEDIN PROFILE</span>
                <span className="cr-val">linkedin.com/in/madhankrajagopal</span>
              </a>
              <a href="https://madhankumarrajagopal.netlify.app/" target="_blank" rel="noopener noreferrer" className="contact-row">
                <span className="cr-shape semi" />
                <span className="cr-label">PORTFOLIO</span>
                <span className="cr-val">madhankumarrajagopal.netlify.app</span>
              </a>
              <a href="https://www.linkedin.com/in/madhankrajagopal" target="_blank" rel="noopener noreferrer" className="contact-row">
                <span className="cr-shape circ" />
                <span className="cr-label">LET’S CONNECT</span>
                <span className="cr-val">MadhanKR on LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="contact-form-box">
            <PublicContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
