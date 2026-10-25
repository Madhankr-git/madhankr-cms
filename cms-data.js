// ══════════════════════════════════════════════════════════════════
// MADHANKR PERSONAL CMS — CENTRAL MOCK DATA ENGINE (localStorage)
// Preserves visual identity: Off-white canvas, sky-blue accents,
// solid geometric shapes, bold typography, and modular data.
// ══════════════════════════════════════════════════════════════════

const CMS_STORAGE_KEY = 'madhankr_cms_data_v1';

const _cmsOrigin = (typeof window !== 'undefined' && window.location ? window.location.origin : '');

// Default initial dataset
const INITIAL_CMS_DATA = {
  stats: {
    totalArticles: 6,
    totalProjects: 6,
    totalMedia: 12,
    monthlyViews: '18.4K',
    viewsGrowth: '+14.2%',
    avgReadTime: '4.2m',
    subscribers: '1,280'
  },
  
  siteSettings: {
    siteName: 'MADHANKR',
    siteTagline: 'Digital Designer × Creative Developer',
    author: 'MadhanKR',
    bio: 'Turning ideas into clear digital experiences through visual design, thoughtful interfaces, and AI-assisted workflows.',
    contactEmail: 'madhan@example.com',
    primaryAccent: '#0284c7',
    maintenanceMode: false,
    allowComments: true,
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/madhankrajagopal',
      portfolio: `${_cmsOrigin}/`,
      github: 'https://github.com/madhankr',
      twitter: 'https://twitter.com/madhankr'
    },
    navItems: [
      { id: 'nav-1', label: 'Home', url: 'index.html', visible: true },
      { id: 'nav-2', label: 'Work', url: 'work.html', visible: true },
      { id: 'nav-3', label: 'Articles', url: 'journal.html', visible: true },
      { id: 'nav-4', label: 'Gallery', url: 'gallery.html', visible: true },
      { id: 'nav-5', label: 'About', url: 'about.html', visible: true },
      { id: 'nav-6', label: 'Contact', url: 'contact.html', visible: true }
    ]
  },

  seoSettings: {
    homepage: {
      title: 'MadhanKR — Digital Designer & Creative Developer',
      description: 'Portfolio & articles of MadhanKR. Specializing in UI/UX design, emerging technology, AI workflows, and creative development.',
      canonical: `${_cmsOrigin}/`,
      keywords: 'UI/UX Design, Creative Developer, EdTech, AI Workflows, Portfolio, MadhanKR',
      ogType: 'website',
      ogImage: 'assets/og-home.svg',
      twitterCard: 'summary_large_image',
      index: true,
      follow: true
    },
    journal: {
      title: 'Articles & Notes — MadhanKR',
      description: 'Reflections and articles on design, front-end architecture, AI-assisted creative workflows, and digital craft by MadhanKR.',
      canonical: `${_cmsOrigin}/articles.html`,
      keywords: 'Design Blog, AI Creative Tools, UI Engineering, Design Philosophy',
      ogType: 'blog',
      ogImage: 'assets/og-journal.svg',
      twitterCard: 'summary_large_image',
      index: true,
      follow: true
    },
    work: {
      title: 'Selected Works & Case Studies — MadhanKR',
      description: 'In-depth case studies in digital product design, EdTech platforms, and interactive web experiences.',
      canonical: `${_cmsOrigin}/work.html`,
      keywords: 'Product Design Case Studies, EdTech UI, Web Design Portfolio',
      ogType: 'website',
      ogImage: 'assets/og-work.svg',
      twitterCard: 'summary_large_image',
      index: true,
      follow: true
    },
    gallery: {
      title: 'Visual Experiments & Creative Lab — MadhanKR',
      description: 'Explorations in solid geometry, generative AI imagery, motion concepts, and UI prototypes.',
      canonical: `${_cmsOrigin}/gallery.html`,
      keywords: 'Visual Design Experiments, Generative AI, Geometric Art',
      ogType: 'website',
      ogImage: 'assets/og-gallery.svg',
      twitterCard: 'summary_large_image',
      index: true,
      follow: true
    },
    about: {
      title: 'About MadhanKR — Background, Philosophy & Skills',
      description: 'Learn about MadhanKR’s 3+ years in visual design, front-end engineering, and AI-driven creative methodologies.',
      canonical: `${_cmsOrigin}/about.html`,
      keywords: 'MadhanKR Biography, Designer Skills, Resume, Creative Tech',
      ogType: 'profile',
      ogImage: 'assets/og-about.svg',
      twitterCard: 'summary_large_image',
      index: true,
      follow: true
    }
  },

  articles: [
    {
      id: 'ai-meaningful-craft',
      title: 'AI Can Make It Faster. Can It Make It Meaningful?',
      slug: 'ai-can-make-it-faster-can-it-make-it-meaningful',
      category: 'AI & Workflows',
      categorySlug: 'ai-workflows',
      date: 'OCT 20, 2026',
      readTime: '6 min read',
      status: 'published',
      featured: true,
      motif: 'sq',
      summary: 'A designer’s perspective on using AI as a creative partner without giving up judgment, intention, or the human point of view.',
      content: `## The Acceleration Illusion

Over the past two years, creative tooling has compressed the time between idea and artifact from days to seconds. We can synthesize dozens of visual directions in the span of a single coffee break. Yet with each reduction in friction, a quieter question surfaces: **does speed correlate with substance?**

In our rush to optimize output velocity, it is easy to mistake quantity for creative breakthrough. An algorithm can produce thousands of variations, but it cannot know *why* a particular tension in typography creates emotional resonance, nor can it sense the cultural gravity of a deliberate blank space.

### The Real Creative Partnership

When I incorporate AI models into my workflow, I treat them not as autonomous creators, but as high-dimensional brainstorming mirrors. They are extraordinary at uncovering adjacent possibilities, but the designer remains the editorial conscience.

> "AI gives us speed; human perspective gives us direction. Craft is no longer just how you make something, but how deeply you care about what you choose to keep."

### Three Principles for Intentional AI Work

1. **Intention precedes prompting**: Never prompt in a vacuum. Define the problem, audience, and constraint before generating.
2. **Curate with ruthlessness**: Treat the raw generated set as raw clay. 90% must be pruned to reveal the 10% that holds genuine spark.
3. **Bring it back to the code and canvas**: Real digital design lives in the DOM, in viewport adaptations, in subtle ease curves and tactile state changes.

When we combine mechanical efficiency with human intentionality, we don't dilute craft—we elevate it.`,
      tags: ['AI Workflows', 'Design Philosophy', 'Future of Craft', 'Creative Direction'],
      views: 3420,
      likes: 184
    },
    {
      id: 'nothing-is-perfect',
      title: 'Nothing Is Perfect, and Maybe That’s the Point',
      slug: 'nothing-is-perfect-and-maybe-thats-the-point',
      category: 'Philosophy',
      categorySlug: 'philosophy',
      date: 'OCT 12, 2026',
      readTime: '5 min read',
      status: 'published',
      featured: false,
      motif: 'semi',
      summary: 'A personal reflection on perfection, unfinished ideas, and learning to value progress without pretending everything needs to be flawless.',
      content: `## The Trap of Absolute Polish

For a long time, I held back work because it didn't align with some unattainable standard of absolute completeness. A corner radius felt slightly off; a paragraph transition wasn't crisp enough; a micro-interaction lacked the exact mechanical snap I imagined.

What I came to realize is that **perfection is often procrastination wearing a tuxedo**.

### Shipping as an Act of Learning

Real software and visual design only begin their true life once they encounter real people. Until a user navigates your interface, tests your mobile drawer, or reads your words on a cramped screen, your pristine design is simply a private hypothesis.

When we accept imperfection as the natural state of iterative creation, we grant ourselves permission to test, learn, and refine with genuine curiosity rather than anxiety.`,
      tags: ['Philosophy', 'Mindset', 'Growth', 'Iterative Design'],
      views: 2890,
      likes: 142
    },
    {
      id: 'seeing-like-a-designer',
      title: 'Learning to See Like a Designer',
      slug: 'learning-to-see-like-a-designer',
      category: 'Design',
      categorySlug: 'design',
      date: 'SEP 28, 2026',
      readTime: '4 min read',
      status: 'published',
      featured: false,
      motif: 'circ',
      summary: 'How everyday interfaces, films, posters, and ordinary spaces can train us to notice composition, contrast, and visual decisions.',
      content: `## Composition Is Everywhere

The world is constantly making visual arguments. When you look at an airport departure board, a cinema ticket, or a municipal transit map, someone made a sequence of decisions about hierarchy, legibility, and rhythm.

### Deconstructing Everyday Artifacts

Whenever I encounter a layout that feels exceptionally effortless, I ask three basic questions:
- What caught my eye first, and why?
- What is doing the heavy lifting—the typography, the whitespace, or the color?
- What would happen if I removed half the visual elements?

Seeing like a designer is simply the habit of turning passive consumption into active deconstruction.`,
      tags: ['Design Thinking', 'Visual Hierarchy', 'Typography', 'Inspiration'],
      views: 2150,
      likes: 98
    },
    {
      id: 'designers-who-code',
      title: 'What Happens When Designers Start Coding?',
      slug: 'what-happens-when-designers-start-coding',
      category: 'Engineering',
      categorySlug: 'engineering',
      date: 'SEP 14, 2026',
      readTime: '7 min read',
      status: 'published',
      featured: true,
      motif: 'sq',
      summary: 'My experience moving from visual design toward the browser, and how understanding code changes the way I think about digital work.',
      content: `## Leaving the Static Canvas

In design tools like Figma, every box has fixed dimensions and static coordinates. But in the browser, things flex, wrap, reflow, and respond to unpredictable viewport geometries and device capabilities.

When I started writing vanilla CSS and modern JavaScript, my designs immediately grew more robust. I stopped designing static posters and began designing **systems of constraints and relationships**.

### The Superpower of the Hybrid

Understanding how the DOM is rendered, how GSAP orchestrates timelines via requestAnimationFrame, and how CSS custom properties can cascade dynamically allows you to design with genuine architectural empathy.

You don't need to choose between being a designer or a programmer. The sweet spot of modern digital craft is right in between.`,
      tags: ['Creative Coding', 'CSS Architecture', 'Front-End', 'Design Systems'],
      views: 3940,
      likes: 245
    },
    {
      id: 'geometric-minimalism',
      title: 'The Discipline of Pure Geometric Forms',
      slug: 'the-discipline-of-pure-geometric-forms',
      category: 'Design',
      categorySlug: 'design',
      date: 'AUG 30, 2026',
      readTime: '5 min read',
      status: 'published',
      featured: false,
      motif: 'circ',
      summary: 'Why stripping away gratuitous drop-shadows and textures in favor of solid circles, squares, and semi-circles creates timeless digital identities.',
      content: `## The Power of Restraint

When you remove photographic crutches and fuzzy gradients, every proportion must be deliberate. A solid square (#38bdf8) carries authority because there are no decorative filters to hide behind.

In this portfolio design system, the trio of circle, square, and semi-circle functions as a foundational visual alphabet. Each shape brings a distinct semantic weight: the square provides structure, the semi-circle introduces movement, and the circle centers the eye.`,
      tags: ['Minimalism', 'Geometry', 'Brand System', 'Visual Language'],
      views: 1820,
      likes: 88
    },
    {
      id: 'future-personal-cms',
      title: 'Why Every Creative Needs a Self-Owned Publishing Engine',
      slug: 'why-every-creative-needs-a-self-owned-publishing-engine',
      category: 'Engineering',
      categorySlug: 'engineering',
      date: 'AUG 18, 2026',
      readTime: '6 min read',
      status: 'draft',
      featured: false,
      motif: 'semi',
      summary: 'Rethinking personal publishing in an era of platform lock-in: building lightweight, bespoke content tools that honor individual craft.',
      content: `## Beyond Rented Land

Social platforms come and go, algorithms shift overnight, and your work gets buried under endless sponsored feeds. Building and maintaining your own personal visual publishing space is an act of digital sovereignty.

A personal CMS should not be bloated with thousand-line dependencies. It should be fast, aesthetically aligned with your personal brand, and joyous to write in.`,
      tags: ['CMS', 'IndieWeb', 'Web Architecture', 'Publishing'],
      views: 0,
      likes: 0
    }
  ],

  projects: [
    {
      id: 'edtech-platforms',
      title: 'EdTech Platform Experiences',
      slug: 'edtech-platform-experiences',
      tag: 'UI/UX · EDTECH',
      category: 'UI/UX & Product',
      categorySlug: 'ui-ux',
      year: '2026',
      client: 'IIT Hyderabad, IIT Dharwad & NIT Calicut Collaborations',
      role: 'Lead UI/UX Designer & Prototyper',
      motif: 'motif-square',
      featured: true,
      summary: 'Designed user interfaces for learning platforms connected with premier institutes, focusing on clear flows and usable screens for tens of thousands of students.',
      caseStudy: {
        challenge: 'Academic portals are notorious for dense, confusing navigations, fragmented assignment tracking, and overwhelming dashboard clutter.',
        solution: 'Re-architected the information architecture using modular cards, high-contrast typography, and a streamlined three-click submission flow.',
        techStack: ['Figma Design System', 'Vanilla CSS', 'Semantic HTML5', 'Responsive Flexbox/Grid'],
        metrics: [
          { label: 'Task Completion Rate', value: '94.2%' },
          { label: 'Time-on-Task Reduction', value: '42%' },
          { label: 'Active Student Users', value: '25,000+' }
        ]
      }
    },
    {
      id: 'movieland',
      title: 'Movieland',
      slug: 'movieland-cinema-experience',
      tag: 'WEB · CONCEPT',
      category: 'Web Applications',
      categorySlug: 'web-apps',
      year: '2026',
      client: 'Independent Product Concept',
      role: 'Product Designer & Front-End Developer',
      motif: 'motif-semi',
      featured: true,
      summary: 'A movie-ticket booking concept exploring how discovery, film details, showtimes, and seat selection can come together in one clear experience.',
      caseStudy: {
        challenge: 'Traditional booking sites force users through multi-page redirect marathons and convoluted seat maps.',
        solution: 'Developed an unbroken single-canvas booking journey with dynamic geometric seat selection and real-time total calculator.',
        techStack: ['JavaScript ES6+', 'CSS Variables', 'SVG Interactive Canvas', 'GSAP Animation'],
        metrics: [
          { label: 'Booking Flow Steps', value: '3 (down from 7)' },
          { label: 'Interactivity Score', value: '98/100' },
          { label: 'Mobile Conversion', value: '+35%' }
        ]
      }
    },
    {
      id: 'ppc-landing-page',
      title: 'PPC Campaign Landing Page',
      slug: 'ppc-campaign-landing-page',
      tag: 'WEB · LANDING PAGE',
      category: 'Web Applications',
      categorySlug: 'web-apps',
      year: '2025',
      client: 'Growth Marketing Agency',
      role: 'UI Designer & Web Developer',
      motif: 'motif-circle',
      featured: false,
      summary: 'A responsive landing-page project built with HTML, CSS, and JavaScript, shaped around clear messaging, focused hierarchy, and conversion intent.',
      caseStudy: {
        challenge: 'High cost-per-click traffic was bouncing due to slow page loads and confusing call-to-action blocks.',
        solution: 'Engineered a sub-second lightweight landing page with zero external frameworks, sticky call-to-actions, and social proof anchors.',
        techStack: ['Zero-dependency HTML/CSS', 'PageSpeed 99/100', 'Form Analytics'],
        metrics: [
          { label: 'Conversion Lift', value: '+68%' },
          { label: 'Lighthouse Performance', value: '100' },
          { label: 'Load Time', value: '0.4s' }
        ]
      }
    },
    {
      id: 'sonho-ai-film',
      title: 'Sonho — AI Film Concept',
      slug: 'sonho-ai-film-concept',
      tag: 'AI FILM · STORYTELLING',
      category: 'AI & Experiments',
      categorySlug: 'ai-experiments',
      year: '2025',
      client: 'Creative Studio Experiment',
      role: 'Creative Director & AI Video Specialist',
      motif: 'motif-quarter',
      featured: true,
      summary: 'An experimental cinematic teaser exploring dreams, visual metaphors, character direction, and AI-assisted image and video creation.',
      caseStudy: {
        challenge: 'Maintaining narrative continuity and stylistic coherence across dozens of disparate generative AI scenes.',
        solution: 'Established a strict prompt architecture, geometric color grading guide, and precise frame-by-frame sound design integration.',
        techStack: ['Midjourney v6', 'Runway Gen-2', 'Premiere Pro', 'Audio Spatialization'],
        metrics: [
          { label: 'Visual Consistency', value: '95%' },
          { label: 'Festival Screenings', value: '4' },
          { label: 'Viewer Retention', value: '88%' }
        ]
      }
    },
    {
      id: 'digital-brand-experiences',
      title: 'Digital Brand Experiences',
      slug: 'digital-brand-experiences',
      tag: 'BRANDING · DIGITAL',
      category: 'Branding & Systems',
      categorySlug: 'branding',
      year: '2024',
      client: 'Various Tech Startups',
      role: 'Brand Identity & Visual Designer',
      motif: 'motif-square',
      featured: false,
      summary: 'Visual explorations for digital campaigns, brand communication, and marketing creatives—balancing consistency with the needs of each platform.',
      caseStudy: {
        challenge: 'Emerging tech brands lacked a coherent visual voice across marketing landing pages, ad collateral, and social touchpoints.',
        solution: 'Designed comprehensive design tokens, icon sets, modular layout grids, and brand guidelines for cross-functional teams.',
        techStack: ['Figma Tokens', 'Vector SVG', 'Brand Guidelines Manual', 'Digital Asset Management'],
        metrics: [
          { label: 'Design System Adoption', value: '100%' },
          { label: 'Asset Production Time', value: '-50%' }
        ]
      }
    },
    {
      id: 'personal-web-projects',
      title: 'Personal Web Projects & Lab',
      slug: 'personal-web-projects',
      tag: 'EXPERIMENT · PRODUCT',
      category: 'AI & Experiments',
      categorySlug: 'ai-experiments',
      year: '2024',
      client: 'Open Source Lab',
      role: 'Full-Stack Creative Explorer',
      motif: 'motif-semi',
      featured: false,
      summary: 'Small web experiments that explore layouts, responsive behaviour, interaction patterns, and the relationship between design and code.',
      caseStudy: {
        challenge: 'Pushing browser performance limits with pure CSS geometric transformations without heavy WebGL bundles.',
        solution: 'Crafted dozens of kinetic experiments leveraging GSAP ScrollTrigger and CSS Custom Properties for 60fps animations.',
        techStack: ['GSAP 3', 'ScrollTrigger', 'CSS 3D Transforms', 'Semantic DOM'],
        metrics: [
          { label: 'Frame Rate', value: 'Solid 60fps' },
          { label: 'GitHub Stars', value: '320+' }
        ]
      }
    }
  ],

  galleryItems: [
    {
      id: 'gal-1',
      title: 'Geometric Totem Studies',
      category: 'Geometric Systems',
      year: '2026',
      tools: 'CSS Grid & Solid SVG',
      color: '#38bdf8',
      shape: 'sc-square',
      aspect: '1/1',
      description: 'Systematic visual deconstruction of primary shapes in equilibrium.'
    },
    {
      id: 'gal-2',
      title: 'Sonho Frame 04: The Horizon',
      category: 'Generative AI',
      year: '2025',
      tools: 'Midjourney v6 + Upscale',
      color: '#0284c7',
      shape: 'sc-semi',
      aspect: '16/9',
      description: 'Cinematic wide aspect still exploring surreal architectural monoliths.'
    },
    {
      id: 'gal-3',
      title: 'Kinetic Motion Typography',
      category: 'Motion & 3D',
      year: '2026',
      tools: 'GSAP + CSS 3D',
      color: '#0ea5e9',
      shape: 'sc-circle',
      aspect: '4/3',
      description: 'Experimental variable font manipulation triggered by cursor velocity.'
    },
    {
      id: 'gal-4',
      title: 'Movieland Seat Matrix',
      category: 'UI Experiments',
      year: '2026',
      tools: 'Figma & SVG DOM',
      color: '#38bdf8',
      shape: 'sc-square',
      aspect: '1/1',
      description: 'Tactile, high-contrast micro-interaction model for cinema auditorium mapping.'
    },
    {
      id: 'gal-5',
      title: 'Obsidian & Sky Editorial Spread',
      category: 'Geometric Systems',
      year: '2025',
      tools: 'InDesign & Web CSS',
      color: '#090a0f',
      shape: 'sc-semi',
      aspect: '3/4',
      description: 'Exploration of brutalist whitespace balance against saturated sky-blue accents.'
    },
    {
      id: 'gal-6',
      title: 'AI Dreamscape Sequence C',
      category: 'Generative AI',
      year: '2025',
      tools: 'Runway Gen-2',
      color: '#38bdf8',
      shape: 'sc-circle',
      aspect: '16/9',
      description: 'Procedural landscape rendering with volumetric sky-lighting.'
    }
  ],

  mediaAssets: [
    {
      id: 'med-1',
      name: 'hero-sculpture-square.svg',
      type: 'image/svg+xml',
      category: 'SVG Geometry',
      size: '4.2 KB',
      dimensions: '440 × 440 px',
      uploadedDate: 'OCT 22, 2026',
      altText: 'Solid sky-blue geometric square motif',
      url: 'assets/hero-sculpture-square.svg',
      color: '#38bdf8'
    },
    {
      id: 'med-2',
      name: 'hero-sculpture-circle.svg',
      type: 'image/svg+xml',
      category: 'SVG Geometry',
      size: '3.8 KB',
      dimensions: '320 × 320 px',
      uploadedDate: 'OCT 22, 2026',
      altText: 'Solid sky-blue geometric circle motif',
      url: 'assets/hero-sculpture-circle.svg',
      color: '#0284c7'
    },
    {
      id: 'med-3',
      name: 'movieland-prototype-preview.png',
      type: 'image/png',
      category: 'UI Screenshots',
      size: '148 KB',
      dimensions: '1920 × 1080 px',
      uploadedDate: 'OCT 18, 2026',
      altText: 'Movieland seat booking screen interface',
      url: 'assets/movieland-preview.png',
      color: '#0ea5e9'
    },
    {
      id: 'med-4',
      name: 'edtech-iith-case-study.png',
      type: 'image/png',
      category: 'UI Screenshots',
      size: '210 KB',
      dimensions: '1600 × 1200 px',
      uploadedDate: 'OCT 15, 2026',
      altText: 'IIT Hyderabad educational portal dashboard',
      url: 'assets/edtech-iith.png',
      color: '#38bdf8'
    },
    {
      id: 'med-5',
      name: 'sonho-teaser-poster.jpg',
      type: 'image/jpeg',
      category: 'Art & Concept',
      size: '380 KB',
      dimensions: '1200 × 1800 px',
      uploadedDate: 'OCT 10, 2026',
      altText: 'Sonho cinematic visual teaser key art',
      url: 'assets/sonho-poster.jpg',
      color: '#090a0f'
    },
    {
      id: 'med-6',
      name: 'madhankr-avatar-brand.svg',
      type: 'image/svg+xml',
      category: 'Brand Assets',
      size: '6.4 KB',
      dimensions: '512 × 512 px',
      uploadedDate: 'OCT 05, 2026',
      altText: 'MadhanKR personal brand icon badge',
      url: 'assets/avatar-brand.svg',
      color: '#0284c7'
    }
  ],

  activityLog: [
    {
      id: 'act-1',
      action: 'Updated Article',
      target: 'AI Can Make It Faster. Can It Make It Meaningful?',
      timestamp: '2 hours ago',
      user: 'MadhanKR',
      icon: 'sq'
    },
    {
      id: 'act-2',
      action: 'Saved Draft',
      target: 'Why Every Creative Needs a Self-Owned Publishing Engine',
      timestamp: 'Yesterday at 4:30 PM',
      user: 'MadhanKR',
      icon: 'semi'
    },
    {
      id: 'act-3',
      action: 'Published Project',
      target: 'Movieland Cinema Experience',
      timestamp: '3 days ago',
      user: 'MadhanKR',
      icon: 'circ'
    },
    {
      id: 'act-4',
      action: 'Updated SEO Meta',
      target: 'Work Portfolio & Case Studies',
      timestamp: '5 days ago',
      user: 'MadhanKR',
      icon: 'sq'
    },
    {
      id: 'act-5',
      action: 'Uploaded Asset',
      target: 'movieland-prototype-preview.png',
      timestamp: '1 week ago',
      user: 'MadhanKR',
      icon: 'circ'
    }
  ]
};

// ─── CMS REPOSITORY API ───────────────────────────────────────────
const CMSData = {
  // Initialize or fetch current state from localStorage
  load() {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using default data:', e);
    }
    this.save(INITIAL_CMS_DATA);
    return JSON.parse(JSON.stringify(INITIAL_CMS_DATA));
  },

  save(data) {
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving CMS data to localStorage:', e);
    }
  },

  reset() {
    localStorage.removeItem(CMS_STORAGE_KEY);
    return this.load();
  },

  // ─── ARTICLES ─────────────────────────────────────────────────
  getArticles(filter = {}) {
    const data = this.load();
    let list = data.articles || [];

    if (filter.category && filter.category !== 'all') {
      list = list.filter(a => a.category.toLowerCase() === filter.category.toLowerCase() || a.categorySlug === filter.category);
    }
    if (filter.status && filter.status !== 'all') {
      list = list.filter(a => a.status === filter.status);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.summary.toLowerCase().includes(q) ||
        (a.tags && a.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    return list;
  },

  getArticleById(id) {
    const data = this.load();
    return (data.articles || []).find(a => a.id === id || a.slug === id);
  },

  saveArticle(article) {
    const data = this.load();
    if (!data.articles) data.articles = [];

    const index = data.articles.findIndex(a => a.id === article.id);
    if (index >= 0) {
      data.articles[index] = { ...data.articles[index], ...article };
      this.logActivity('Updated Article', article.title, 'sq');
    } else {
      if (!article.id) {
        article.id = 'art-' + Date.now();
      }
      if (!article.date) {
        article.date = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
      }
      data.articles.unshift(article);
      this.logActivity('Created Article', article.title, 'sq');
    }
    data.stats.totalArticles = data.articles.length;
    this.save(data);
    return article;
  },

  deleteArticle(id) {
    const data = this.load();
    const item = (data.articles || []).find(a => a.id === id);
    data.articles = (data.articles || []).filter(a => a.id !== id);
    data.stats.totalArticles = data.articles.length;
    if (item) {
      this.logActivity('Deleted Article', item.title, 'semi');
    }
    this.save(data);
    return true;
  },

  // ─── PROJECTS ─────────────────────────────────────────────────
  getProjects(filter = {}) {
    const data = this.load();
    let list = data.projects || [];

    if (filter.category && filter.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === filter.category.toLowerCase() || p.categorySlug === filter.category);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.summary.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getProjectById(id) {
    const data = this.load();
    return (data.projects || []).find(p => p.id === id || p.slug === id);
  },

  saveProject(project) {
    const data = this.load();
    if (!data.projects) data.projects = [];

    const index = data.projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      data.projects[index] = { ...data.projects[index], ...project };
      this.logActivity('Updated Project', project.title, 'circ');
    } else {
      if (!project.id) project.id = 'proj-' + Date.now();
      data.projects.unshift(project);
      this.logActivity('Created Project', project.title, 'circ');
    }
    data.stats.totalProjects = data.projects.length;
    this.save(data);
    return project;
  },

  deleteProject(id) {
    const data = this.load();
    const item = (data.projects || []).find(p => p.id === id);
    data.projects = (data.projects || []).filter(p => p.id !== id);
    data.stats.totalProjects = data.projects.length;
    if (item) {
      this.logActivity('Deleted Project', item.title, 'semi');
    }
    this.save(data);
    return true;
  },

  // ─── GALLERY ──────────────────────────────────────────────────
  getGalleryItems(category = 'all') {
    const data = this.load();
    let list = data.galleryItems || [];
    if (category !== 'all') {
      list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    return list;
  },

  // ─── MEDIA ASSETS ─────────────────────────────────────────────
  getMediaAssets(filter = {}) {
    const data = this.load();
    let list = data.mediaAssets || [];
    if (filter.category && filter.category !== 'all') {
      list = list.filter(m => m.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(m => m.name.toLowerCase().includes(q) || (m.altText && m.altText.toLowerCase().includes(q)));
    }
    return list;
  },

  addMediaAsset(asset) {
    const data = this.load();
    if (!data.mediaAssets) data.mediaAssets = [];
    if (!asset.id) asset.id = 'med-' + Date.now();
    if (!asset.uploadedDate) {
      asset.uploadedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
    }
    data.mediaAssets.unshift(asset);
    data.stats.totalMedia = data.mediaAssets.length;
    this.logActivity('Uploaded Media Asset', asset.name, 'circ');
    this.save(data);
    return asset;
  },

  deleteMediaAsset(id) {
    const data = this.load();
    const item = (data.mediaAssets || []).find(m => m.id === id);
    data.mediaAssets = (data.mediaAssets || []).filter(m => m.id !== id);
    data.stats.totalMedia = data.mediaAssets.length;
    if (item) {
      this.logActivity('Deleted Media Asset', item.name, 'semi');
    }
    this.save(data);
    return true;
  },

  // ─── SEO SETTINGS ─────────────────────────────────────────────
  getSeoSettings(pageKey = 'homepage') {
    const data = this.load();
    return (data.seoSettings && data.seoSettings[pageKey]) || data.seoSettings.homepage;
  },

  saveSeoSettings(pageKey, settings) {
    const data = this.load();
    if (!data.seoSettings) data.seoSettings = {};
    data.seoSettings[pageKey] = { ...data.seoSettings[pageKey], ...settings };
    this.logActivity('Updated SEO Settings', `Page: ${pageKey.toUpperCase()}`, 'sq');
    this.save(data);
    return data.seoSettings[pageKey];
  },

  // ─── SITE SETTINGS ────────────────────────────────────────────
  getSiteSettings() {
    const data = this.load();
    return data.siteSettings || INITIAL_CMS_DATA.siteSettings;
  },

  saveSiteSettings(settings) {
    const data = this.load();
    data.siteSettings = { ...data.siteSettings, ...settings };
    this.logActivity('Updated Site Preferences', 'General Settings', 'sq');
    this.save(data);
    return data.siteSettings;
  },

  // ─── STATS & ACTIVITY ─────────────────────────────────────────
  getStats() {
    const data = this.load();
    return data.stats || INITIAL_CMS_DATA.stats;
  },

  getActivityLog() {
    const data = this.load();
    return data.activityLog || [];
  },

  logActivity(action, target, icon = 'sq') {
    const data = this.load();
    if (!data.activityLog) data.activityLog = [];
    data.activityLog.unshift({
      id: 'act-' + Date.now(),
      action,
      target,
      timestamp: 'Just now',
      user: 'MadhanKR',
      icon
    });
    // keep max 20 logs
    if (data.activityLog.length > 20) data.activityLog.pop();
    this.save(data);
  }
};

// Export to window
window.CMSData = CMSData;
