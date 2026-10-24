-- ══════════════════════════════════════════════════════════════════
-- MADHANKR CMS V2 — SUPABASE SEED DATA (from cms-data.js)
-- ══════════════════════════════════════════════════════════════════

-- 1. Site Settings Seed
INSERT INTO public.site_settings (id, site_name, site_tagline, author, bio, contact_email, primary_accent, maintenance_mode, allow_comments, social_links, nav_items)
VALUES (
  1,
  'MADHANKR',
  'Digital Designer × Creative Developer',
  'MadhanKR',
  'Turning ideas into clear digital experiences through visual design, thoughtful interfaces, and AI-assisted workflows.',
  'madhan@example.com',
  '#2563eb',
  false,
  true,
  '{
    "linkedin": "https://www.linkedin.com/in/madhankrajagopal",
    "portfolio": "https://madhankumarrajagopal.netlify.app/",
    "github": "https://github.com/madhankr",
    "twitter": "https://twitter.com/madhankr"
  }'::jsonb,
  '[
    {"id": "nav-1", "label": "Home", "url": "/", "visible": true},
    {"id": "nav-2", "label": "Work", "url": "/work", "visible": true},
    {"id": "nav-3", "label": "Journal", "url": "/journal", "visible": true},
    {"id": "nav-4", "label": "Gallery", "url": "/gallery", "visible": true},
    {"id": "nav-5", "label": "About", "url": "/about", "visible": true},
    {"id": "nav-6", "label": "Contact", "url": "/contact", "visible": true}
  ]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_tagline = EXCLUDED.site_tagline,
  bio = EXCLUDED.bio,
  social_links = EXCLUDED.social_links,
  nav_items = EXCLUDED.nav_items;

-- 2. SEO Settings Seed
INSERT INTO public.seo_settings (page_key, title, description, canonical, keywords, og_type, og_image, twitter_card, index_robots, follow_robots)
VALUES
(
  'homepage',
  'MadhanKR — Digital Designer & Creative Developer',
  'Portfolio & personal journal of MadhanKR. Specializing in UI/UX design, emerging technology, AI workflows, and creative development.',
  'https://madhankumarrajagopal.netlify.app/',
  'UI/UX Design, Creative Developer, EdTech, AI Workflows, Portfolio, MadhanKR',
  'website',
  'assets/og-home.svg',
  'summary_large_image',
  true,
  true
),
(
  'journal',
  'Journal & Notes — MadhanKR',
  'Reflections on design, front-end architecture, AI-assisted creative workflows, and digital craft by MadhanKR.',
  'https://madhankumarrajagopal.netlify.app/journal',
  'Design Blog, AI Creative Tools, UI Engineering, Design Philosophy',
  'blog',
  'assets/og-journal.svg',
  'summary_large_image',
  true,
  true
),
(
  'work',
  'Selected Works & Case Studies — MadhanKR',
  'In-depth case studies in digital product design, EdTech platforms, and interactive web experiences.',
  'https://madhankumarrajagopal.netlify.app/work',
  'Product Design Case Studies, EdTech UI, Web Design Portfolio',
  'website',
  'assets/og-work.svg',
  'summary_large_image',
  true,
  true
),
(
  'gallery',
  'Visual Experiments & Creative Lab — MadhanKR',
  'Explorations in solid geometry, generative AI imagery, motion concepts, and UI prototypes.',
  'https://madhankumarrajagopal.netlify.app/gallery',
  'Visual Design Experiments, Generative AI, Geometric Art',
  'website',
  'assets/og-gallery.svg',
  'summary_large_image',
  true,
  true
),
(
  'about',
  'About MadhanKR — Background, Philosophy & Skills',
  'Learn about MadhanKR’s 3+ years in visual design, front-end engineering, and AI-driven creative methodologies.',
  'https://madhankumarrajagopal.netlify.app/about',
  'MadhanKR Biography, Designer Skills, Resume, Creative Tech',
  'profile',
  'assets/og-about.svg',
  'summary_large_image',
  true,
  true
)
ON CONFLICT (page_key) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  canonical = EXCLUDED.canonical,
  keywords = EXCLUDED.keywords;

-- 3. Articles Seed
INSERT INTO public.articles (id, slug, title, summary, content, category, category_slug, read_time, status, featured, motif, tags, views, likes, published_at)
VALUES
(
  'ai-meaningful-craft',
  'ai-can-make-it-faster-can-it-make-it-meaningful',
  'AI Can Make It Faster. Can It Make It Meaningful?',
  'A designer’s perspective on using AI as a creative partner without giving up judgment, intention, or the human point of view.',
  '## The Acceleration Illusion

Over the past two years, creative tooling has compressed the time between idea and artifact from days to seconds. We can synthesize dozens of visual directions in the span of a single coffee break. Yet with each reduction in friction, a quieter question surfaces: **does speed correlate with substance?**

In our rush to optimize output velocity, it is easy to mistake quantity for creative breakthrough. An algorithm can produce thousands of variations, but it cannot know *why* a particular tension in typography creates emotional resonance, nor can it sense the cultural gravity of a deliberate blank space.

### The Real Creative Partnership

When I incorporate AI models into my workflow, I treat them not as autonomous creators, but as high-dimensional brainstorming mirrors. They are extraordinary at uncovering adjacent possibilities, but the designer remains the editorial conscience.

> "AI gives us speed; human perspective gives us direction. Craft is no longer just how you make something, but how deeply you care about what you choose to keep."

### Three Principles for Intentional AI Work

1. **Intention precedes prompting**: Never prompt in a vacuum. Define the problem, audience, and constraint before generating.
2. **Curate with ruthlessness**: Treat the raw generated set as raw clay. 90% must be pruned to reveal the 10% that holds genuine spark.
3. **Bring it back to the code and canvas**: Real digital design lives in the DOM, in viewport adaptations, in subtle ease curves and tactile state changes.

When we combine mechanical efficiency with human intentionality, we don''t dilute craft—we elevate it.',
  'AI & Workflows',
  'ai-workflows',
  '6 min read',
  'published',
  true,
  'sq',
  ARRAY['AI Workflows', 'Design Philosophy', 'Future of Craft', 'Creative Direction'],
  3420,
  184,
  '2026-10-20 10:00:00+00'
),
(
  'nothing-is-perfect',
  'nothing-is-perfect-and-maybe-thats-the-point',
  'Nothing Is Perfect, and Maybe That’s the Point',
  'A personal reflection on perfection, unfinished ideas, and learning to value progress without pretending everything needs to be flawless.',
  '## The Trap of Absolute Polish

For a long time, I held back work because it didn''t align with some unattainable standard of absolute completeness. A corner radius felt slightly off; a paragraph transition wasn''t crisp enough; a micro-interaction lacked the exact mechanical snap I imagined.

What I came to realize is that **perfection is often procrastination wearing a tuxedo**.

### Shipping as an Act of Learning

Real software and visual design only begin their true life once they encounter real people. Until a user navigates your interface, tests your mobile drawer, or reads your words on a cramped screen, your pristine design is simply a private hypothesis.

When we accept imperfection as the natural state of iterative creation, we grant ourselves permission to test, learn, and refine with genuine curiosity rather than anxiety.',
  'Philosophy',
  'philosophy',
  '5 min read',
  'published',
  false,
  'semi',
  ARRAY['Philosophy', 'Mindset', 'Growth', 'Iterative Design'],
  2890,
  142,
  '2026-10-12 10:00:00+00'
),
(
  'seeing-like-a-designer',
  'learning-to-see-like-a-designer',
  'Learning to See Like a Designer',
  'How everyday interfaces, films, posters, and ordinary spaces can train us to notice composition, contrast, and visual decisions.',
  '## Composition Is Everywhere

The world is constantly making visual arguments. When you look at an airport departure board, a cinema ticket, or a municipal transit map, someone made a sequence of decisions about hierarchy, legibility, and rhythm.

### Deconstructing Everyday Artifacts

Whenever I encounter a layout that feels exceptionally effortless, I ask three basic questions:
- What caught my eye first, and why?
- What is doing the heavy lifting—the typography, the whitespace, or the color?
- What would happen if I removed half the visual elements?

Seeing like a designer is simply the habit of turning passive consumption into active deconstruction.',
  'Design',
  'design',
  '4 min read',
  'published',
  false,
  'circ',
  ARRAY['Design Thinking', 'Visual Hierarchy', 'Typography', 'Inspiration'],
  2150,
  98,
  '2026-09-28 10:00:00+00'
),
(
  'designers-who-code',
  'what-happens-when-designers-start-coding',
  'What Happens When Designers Start Coding?',
  'My experience moving from visual design toward the browser, and how understanding code changes the way I think about digital work.',
  '## Leaving the Static Canvas

In design tools like Figma, every box has fixed dimensions and static coordinates. But in the browser, things flex, wrap, reflow, and respond to unpredictable viewport geometries and device capabilities.

When I started writing vanilla CSS and modern JavaScript, my designs immediately grew more robust. I stopped designing static posters and began designing **systems of constraints and relationships**.

### The Superpower of the Hybrid

Understanding how the DOM is rendered, how GSAP orchestrates timelines via requestAnimationFrame, and how CSS custom properties can cascade dynamically allows you to design with genuine architectural empathy.

You don''t need to choose between being a designer or a programmer. The sweet spot of modern digital craft is right in between.',
  'Engineering',
  'engineering',
  '7 min read',
  'published',
  true,
  'sq',
  ARRAY['Creative Coding', 'CSS Architecture', 'Front-End', 'Design Systems'],
  3940,
  245,
  '2026-09-14 10:00:00+00'
),
(
  'geometric-minimalism',
  'the-discipline-of-pure-geometric-forms',
  'The Discipline of Pure Geometric Forms',
  'Why stripping away gratuitous drop-shadows and textures in favor of solid circles, squares, and semi-circles creates timeless digital identities.',
  '## The Power of Restraint

When you remove photographic crutches and fuzzy gradients, every proportion must be deliberate. A solid square (#38bdf8) carries authority because there are no decorative filters to hide behind.

In this portfolio design system, the trio of circle, square, and semi-circle functions as a foundational visual alphabet. Each shape brings a distinct semantic weight: the square provides structure, the semi-circle introduces movement, and the circle centers the eye.',
  'Design',
  'design',
  '5 min read',
  'published',
  false,
  'circ',
  ARRAY['Minimalism', 'Geometry', 'Brand System', 'Visual Language'],
  1820,
  88,
  '2026-08-30 10:00:00+00'
),
(
  'future-personal-cms',
  'why-every-creative-needs-a-self-owned-publishing-engine',
  'Why Every Creative Needs a Self-Owned Publishing Engine',
  'Rethinking personal publishing in an era of platform lock-in: building lightweight, bespoke content tools that honor individual craft.',
  '## Beyond Rented Land

Social platforms come and go, algorithms shift overnight, and your work gets buried under endless sponsored feeds. Building and maintaining your own personal visual publishing space is an act of digital sovereignty.

A personal CMS should not be bloated with thousand-line dependencies. It should be fast, aesthetically aligned with your personal brand, and joyous to write in.',
  'Engineering',
  'engineering',
  '6 min read',
  'draft',
  false,
  'semi',
  ARRAY['CMS', 'IndieWeb', 'Web Architecture', 'Publishing'],
  0,
  0,
  '2026-08-18 10:00:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  status = EXCLUDED.status;

-- 4. Projects Seed
INSERT INTO public.projects (id, slug, title, tag, category, category_slug, year, client, role, motif, featured, summary, case_study, order_index)
VALUES
(
  'edtech-platforms',
  'edtech-platform-experiences',
  'EdTech Platform Experiences',
  'UI/UX · EDTECH',
  'UI/UX & Product',
  'ui-ux',
  '2026',
  'IIT Hyderabad, IIT Dharwad & NIT Calicut Collaborations',
  'Lead UI/UX Designer & Prototyper',
  'motif-square',
  true,
  'Designed user interfaces for learning platforms connected with premier institutes, focusing on clear flows and usable screens for tens of thousands of students.',
  '{
    "challenge": "Academic portals are notorious for dense, confusing navigations, fragmented assignment tracking, and overwhelming dashboard clutter.",
    "solution": "Re-architected the information architecture using modular cards, high-contrast typography, and a streamlined three-click submission flow.",
    "techStack": ["Figma Design System", "Vanilla CSS", "Semantic HTML5", "Responsive Flexbox/Grid"],
    "metrics": [
      {"label": "Task Completion Rate", "value": "94.2%"},
      {"label": "Time-on-Task Reduction", "value": "42%"},
      {"label": "Active Student Users", "value": "25,000+"}
    ]
  }'::jsonb,
  1
),
(
  'movieland',
  'movieland-cinema-experience',
  'Movieland',
  'WEB · CONCEPT',
  'Web Applications',
  'web-apps',
  '2026',
  'Independent Product Concept',
  'Product Designer & Front-End Developer',
  'motif-semi',
  true,
  'A movie-ticket booking concept exploring how discovery, film details, showtimes, and seat selection can come together in one clear experience.',
  '{
    "challenge": "Traditional booking sites force users through multi-page redirect marathons and convoluted seat maps.",
    "solution": "Developed an unbroken single-canvas booking journey with dynamic geometric seat selection and real-time total calculator.",
    "techStack": ["JavaScript ES6+", "CSS Variables", "SVG Interactive Canvas", "GSAP Animation"],
    "metrics": [
      {"label": "Booking Flow Steps", "value": "3 (down from 7)"},
      {"label": "Interactivity Score", "value": "98/100"},
      {"label": "Mobile Conversion", "value": "+35%"}
    ]
  }'::jsonb,
  2
),
(
  'ppc-landing-page',
  'ppc-campaign-landing-page',
  'PPC Campaign Landing Page',
  'WEB · LANDING PAGE',
  'Web Applications',
  'web-apps',
  '2025',
  'Digital Performance Marketing Agency',
  'Conversion Rate Optimization (CRO) & UI Designer',
  'motif-square',
  true,
  'A high-conversion landing page framework designed for paid search traffic with rigorous focus on clarity, trust badges, and lightning-fast load times.',
  '{
    "challenge": "High paid-traffic bounce rates caused by generic layouts, sluggish script execution, and buried calls-to-action.",
    "solution": "Engineered a razor-sharp, zero-bloat landing page with sticky proof signals and one-step qualifying forms.",
    "techStack": ["HTML5 Semantic Elements", "Modern CSS Grid", "Vanilla JS Form Validation"],
    "metrics": [
      {"label": "Conversion Lift", "value": "+28.4%"},
      {"label": "PageSpeed Score", "value": "99/100"},
      {"label": "Bounce Rate Reduction", "value": "-19%"}
    ]
  }'::jsonb,
  3
),
(
  'ai-prompt-studio',
  'ai-prompt-studio-ide',
  'AI Prompt Studio IDE',
  'AI · TOOLING',
  'AI & Tooling',
  'ai-tools',
  '2026',
  'Open Source Community Experiment',
  'Interface Architect & Front-End Engineer',
  'motif-circle',
  true,
  'A visual playground for structuring, testing, and versioning complex system prompts with live response tokens and semantic comparisons.',
  '{
    "challenge": "Engineers and designers frequently lose track of prompt iterations across chaotic pastebins and terminal outputs.",
    "solution": "Created a clean dual-pane IDE featuring side-by-side prompt diffing, temperature sliders, and markdown preview.",
    "techStack": ["TypeScript", "Next.js App Router", "Tailwind CSS", "Web Storage API"],
    "metrics": [
      {"label": "Prompt Iteration Speed", "value": "3x Faster"},
      {"label": "GitHub Stars", "value": "1,450+"},
      {"label": "Active Weekly Testers", "value": "3,200"}
    ]
  }'::jsonb,
  4
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  case_study = EXCLUDED.case_study;
