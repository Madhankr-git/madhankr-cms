import { Article, Project, SeoSettingsMap, SiteSettings, MediaAsset, ActivityItem } from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteName: 'MADHANKR',
  siteTagline: 'Digital Designer × Creative Developer',
  author: 'MadhanKR',
  bio: 'Turning ideas into clear digital experiences through visual design, thoughtful interfaces, and AI-assisted workflows.',
  contactEmail: 'madhankumarrajagopal@gmail.com',
  primaryAccent: '#2563eb',
  maintenanceMode: false,
  allowComments: true,
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/madhankrajagopal',
    portfolio: 'https://madhankumarrajagopal.netlify.app/',
    github: 'https://github.com/madhankr',
    twitter: 'https://twitter.com/madhankr'
  },
  navItems: [
    { id: 'nav-1', label: 'Home', url: '/', visible: true },
    { id: 'nav-2', label: 'Work', url: '/work', visible: true },
    { id: 'nav-3', label: 'Journal', url: '/journal', visible: true },
    { id: 'nav-4', label: 'Gallery', url: '/gallery', visible: true },
    { id: 'nav-5', label: 'About', url: '/about', visible: true },
    { id: 'nav-6', label: 'Contact', url: '/contact', visible: true }
  ]
};

export const INITIAL_SEO_SETTINGS: SeoSettingsMap = {
  homepage: {
    title: 'MadhanKR — Digital Designer & Creative Developer',
    description: 'Portfolio & personal journal of MadhanKR. Specializing in UI/UX design, emerging technology, AI workflows, and creative development.',
    canonical: 'https://madhankumarrajagopal.netlify.app/',
    keywords: 'UI/UX Design, Creative Developer, EdTech, AI Workflows, Portfolio, MadhanKR',
    ogType: 'website',
    ogImage: '/assets/og-home.svg',
    twitterCard: 'summary_large_image',
    index: true,
    follow: true
  },
  journal: {
    title: 'Journal & Notes — MadhanKR',
    description: 'Reflections on design, front-end architecture, AI-assisted creative workflows, and digital craft by MadhanKR.',
    canonical: 'https://madhankumarrajagopal.netlify.app/journal',
    keywords: 'Design Blog, AI Creative Tools, UI Engineering, Design Philosophy',
    ogType: 'blog',
    ogImage: '/assets/og-journal.svg',
    twitterCard: 'summary_large_image',
    index: true,
    follow: true
  },
  work: {
    title: 'Selected Works & Case Studies — MadhanKR',
    description: 'In-depth case studies in digital product design, EdTech platforms, and interactive web experiences.',
    canonical: 'https://madhankumarrajagopal.netlify.app/work',
    keywords: 'Product Design Case Studies, EdTech UI, Web Design Portfolio',
    ogType: 'website',
    ogImage: '/assets/og-work.svg',
    twitterCard: 'summary_large_image',
    index: true,
    follow: true
  },
  gallery: {
    title: 'Visual Experiments & Creative Lab — MadhanKR',
    description: 'Explorations in solid geometry, generative AI imagery, motion concepts, and UI prototypes.',
    canonical: 'https://madhankumarrajagopal.netlify.app/gallery',
    keywords: 'Visual Design Experiments, Generative AI, Geometric Art',
    ogType: 'website',
    ogImage: '/assets/og-gallery.svg',
    twitterCard: 'summary_large_image',
    index: true,
    follow: true
  },
  about: {
    title: 'About MadhanKR — Background, Philosophy & Skills',
    description: 'Learn about MadhanKR’s 3+ years in visual design, front-end engineering, and AI-driven creative methodologies.',
    canonical: 'https://madhankumarrajagopal.netlify.app/about',
    keywords: 'MadhanKR Biography, Designer Skills, Resume, Creative Tech',
    ogType: 'profile',
    ogImage: '/assets/og-about.svg',
    twitterCard: 'summary_large_image',
    index: true,
    follow: true
  }
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'ai-meaningful-craft',
    title: 'AI Can Make It Faster. Can It Make It Meaningful?',
    slug: 'ai-can-make-it-faster-can-it-make-it-meaningful',
    category: 'AI & Workflows',
    categorySlug: 'ai-workflows',
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
    cover_image: 'https://ffduaazilqxyjwcbuqkw.supabase.co/storage/v1/object/public/cms-media/uploads/1792867693247-ai-bg-abstract.webp',
    views: 3420,
    likes: 184,
    published_at: '2026-10-20T10:00:00.000Z'
  },
  {
    id: 'nothing-is-perfect',
    title: 'Nothing Is Perfect, and Maybe That’s the Point',
    slug: 'nothing-is-perfect-and-maybe-thats-the-point',
    category: 'Philosophy',
    categorySlug: 'philosophy',
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
    likes: 142,
    published_at: '2026-10-12T10:00:00.000Z'
  },
  {
    id: 'seeing-like-a-designer',
    title: 'Learning to See Like a Designer',
    slug: 'learning-to-see-like-a-designer',
    category: 'Design',
    categorySlug: 'design',
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
    likes: 98,
    published_at: '2026-09-28T10:00:00.000Z'
  },
  {
    id: 'designers-who-code',
    title: 'What Happens When Designers Start Coding?',
    slug: 'what-happens-when-designers-start-coding',
    category: 'Engineering',
    categorySlug: 'engineering',
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
    likes: 245,
    published_at: '2026-09-14T10:00:00.000Z'
  },
  {
    id: 'geometric-minimalism',
    title: 'The Discipline of Pure Geometric Forms',
    slug: 'the-discipline-of-pure-geometric-forms',
    category: 'Design',
    categorySlug: 'design',
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
    likes: 88,
    published_at: '2026-08-30T10:00:00.000Z'
  },
  {
    id: 'future-personal-cms',
    title: 'Why Every Creative Needs a Self-Owned Publishing Engine',
    slug: 'why-every-creative-needs-a-self-owned-publishing-engine',
    category: 'Engineering',
    categorySlug: 'engineering',
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
    likes: 0,
    published_at: '2026-08-18T10:00:00.000Z'
  }
];

export const INITIAL_PROJECTS: Project[] = [
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
    client: 'Digital Performance Marketing Agency',
    role: 'Conversion Rate Optimization (CRO) & UI Designer',
    motif: 'motif-square',
    featured: true,
    summary: 'A high-conversion landing page framework designed for paid search traffic with rigorous focus on clarity, trust badges, and lightning-fast load times.',
    caseStudy: {
      challenge: 'High paid-traffic bounce rates caused by generic layouts, sluggish script execution, and buried calls-to-action.',
      solution: 'Engineered a razor-sharp, zero-bloat landing page with sticky proof signals and one-step qualifying forms.',
      techStack: ['HTML5 Semantic Elements', 'Modern CSS Grid', 'Vanilla JS Form Validation'],
      metrics: [
        { label: 'Conversion Lift', value: '+28.4%' },
        { label: 'PageSpeed Score', value: '99/100' },
        { label: 'Bounce Rate Reduction', value: '-19%' }
      ]
    }
  },
  {
    id: 'ai-prompt-studio',
    title: 'AI Prompt Studio IDE',
    slug: 'ai-prompt-studio-ide',
    tag: 'AI · TOOLING',
    category: 'AI & Tooling',
    categorySlug: 'ai-tools',
    year: '2026',
    client: 'Open Source Community Experiment',
    role: 'Interface Architect & Front-End Engineer',
    motif: 'motif-circle',
    featured: true,
    summary: 'A visual playground for structuring, testing, and versioning complex system prompts with live response tokens and semantic comparisons.',
    caseStudy: {
      challenge: 'Engineers and designers frequently lose track of prompt iterations across chaotic pastebins and terminal outputs.',
      solution: 'Created a clean dual-pane IDE featuring side-by-side prompt diffing, temperature sliders, and markdown preview.',
      techStack: ['TypeScript', 'Next.js App Router', 'Vanilla CSS Variables', 'Web Storage API'],
      metrics: [
        { label: 'Prompt Iteration Speed', value: '3x Faster' },
        { label: 'GitHub Stars', value: '1,450+' },
        { label: 'Active Weekly Testers', value: '3,200' }
      ]
    }
  }
];

export const INITIAL_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'media-1',
    name: 'Brand Geometric Monogram.svg',
    category: 'Brand Assets',
    file_path: 'brand/monogram.svg',
    public_url: '/assets/monogram.svg',
    file_size: 14200,
    mime_type: 'image/svg+xml'
  },
  {
    id: 'media-2',
    name: 'EdTech Portal Screen Flow.png',
    category: 'Projects',
    file_path: 'projects/edtech-flow.png',
    public_url: '/assets/edtech-flow.png',
    file_size: 485000,
    mime_type: 'image/png'
  },
  {
    id: 'media-3',
    name: 'Movieland Interactive Prototype.png',
    category: 'Projects',
    file_path: 'projects/movieland-mockup.png',
    public_url: '/assets/movieland-mockup.png',
    file_size: 612000,
    mime_type: 'image/png'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'article_published',
    title: 'Article Published',
    detail: 'AI Can Make It Faster. Can It Make It Meaningful?',
    timestamp: '12m ago'
  },
  {
    id: 'act-2',
    type: 'project_updated',
    title: 'Project Updated',
    detail: 'EdTech Platform Experiences case study metrics updated',
    timestamp: '1h ago'
  },
  {
    id: 'act-3',
    type: 'seo_updated',
    title: 'SEO Settings Saved',
    detail: 'Homepage OpenGraph description updated for Q4 launch',
    timestamp: '3h ago'
  },
  {
    id: 'act-4',
    type: 'media_uploaded',
    title: 'New Media Asset',
    detail: 'Uploaded Brand Geometric Monogram.svg to cms-media bucket',
    timestamp: '1d ago'
  }
];
