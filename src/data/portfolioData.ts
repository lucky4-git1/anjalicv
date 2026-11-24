export interface Project {
  id: string
  title: string
  subtitle: string
  category: "ui-ux" | "graphic" | "social"
  year: string
  client: string
  role: string
  awards: string[]
  metrics: string
  description: string
  challenge: string
  solution: string
  technologies: string[]
  accentColor: string
  heroImage: string
  previewImage?: string
  link?: string
}

export interface ExperienceItem {
  period: string
  role: string
  company: string
  location: string
  description: string
  highlights: string[]
  tags: string[]
}

export interface EducationItem {
  degree: string
  institution: string
  location: string
  period: string
  honors: string
  details: string
}

export interface AccoladeItem {
  title: string
  organization: string
  year: string
  category: string
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Anjali",
    fullName: "Anjali Rajput",
    title: "Senior Social Media Manager & Content Strategist",
    tagline: "AESTHETIC SOCIAL CAMPAIGNS — ANJALI RAJPUT",
    subtagline: "Social media strategy, visual storytelling, viral reels, and high-impact brand growth.",
    email: "anjali@thepinkstandard.studio",
    location: "London • Remote",
    status: "Available for Social Media Management & Brand Collaborations",
    bio: "Passionate Social Media Manager specializing in high-engagement visual storytelling, aesthetic content strategy, and viral campaigns that turn audiences into loyal brand advocates.",
    philosophy: "Authentic storytelling paired with immaculate aesthetic curation creates an unforgettable digital presence.",
    stats: [
      { label: "Content Reach", value: "10M+" },
      { label: "Campaigns Led", value: "50+" },
      { label: "Growth Rate", value: "3.5x" },
      { label: "Based In", value: "London" }
    ]
  },

  skills: {
    designExpertise: [
      "Editorial Art Direction",
      "Haute Couture Brand Identity",
      "Typography & Micro-Hierarchy",
      "Spatial Layout & Print Monographs",
      "Design Systems & Token Architecture",
      "Creative Campaign Direction"
    ],
    creativeTools: [
      "Figma / FigJam (Master)",
      "Adobe InDesign & Illustrator",
      "Adobe Photoshop & After Effects",
      "Blender 3D Modeling",
      "Glyphs (Type Design)",
      "Cinema 4D / Octane"
    ],
    technicalCapabilities: [
      "WebGL & Three.js Shaders",
      "React / TypeScript / Next.js",
      "Tailwind CSS Architecture",
      "GSAP ScrollTrigger Animation",
      "HTML5 Canvas & SVG Rendering",
      "WCAG AAA Accessibility"
    ],
    professionalStrengths: [
      "Executive Stakeholder Advisory",
      "Cross-Discipline Creative Direction",
      "Design Sprint Facilitation",
      "Print & Production Quality Control",
      "Design Ops Leadership",
      "Team Mentorship"
    ]
  },

  // SECTION 4: UI / UX DESIGN SHOWCASE
  uiUxProjects: [
    {
      id: "souverain",
      title: "SOUVERAIN",
      subtitle: "Haute Horlogerie Digital Sanctuary",
      category: "ui-ux" as const,
      year: "2024",
      client: "Maison Souverain Genève",
      role: "Lead UI/UX Architect & Shader Designer",
      awards: ["Awwwards Site of the Month", "FWA of the Day"],
      metrics: "+74% Session Duration • 3.2× High-Net-Worth Inquiries",
      description: "An unprecedented virtual atelier celebrating Swiss master watchmaking. Visitors inspect tourbillon escapements rendered in bespoke real-time shaders with zero latency.",
      challenge: "Luxury horology collectors demand tactile reverence. Generic templates failed to convey the weight and physical resonance of hand-finished titanium and rose gold.",
      solution: "Engineered a custom PBR lighting pipeline paired with high-contrast serif typography and whisper-quiet interaction physics.",
      technologies: ["WebGL", "Three.js", "React", "TypeScript", "Tailwind CSS"],
      accentColor: "#CB7885",
      heroImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
      previewImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "nyx-aerospace",
      title: "NYX AEROSPACE",
      subtitle: "Autonomous Orbital Flight Interface",
      category: "ui-ux" as const,
      year: "2023",
      client: "Nyx Spacecraft Consortium",
      role: "Staff Experience Architect",
      awards: ["Red Dot: Best of the Best", "UX Design Gold"],
      metrics: "99.994% Critical Mission Telemetry Readability Under Stress",
      description: "Reimagining mission-critical aerospace telemetry consoles into a refined dark interface bathed in deep burgundy and sage telemetry channels.",
      challenge: "Flight controllers suffered severe cognitive fatigue from legacy grayscale software during 14-hour orbital handover shifts.",
      solution: "Devised a chromatic contrast system rooted in deep burgundy grounds and high-frequency olive/rose telemetry channels.",
      technologies: ["React", "TypeScript", "Canvas 2D", "WebSockets"],
      accentColor: "#893941",
      heroImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      previewImage: "https://images.unsplash.com/photo-1517976487588-e9f0d1a49ec3?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // SECTION 5: GRAPHIC DESIGN SHOWCASE
  graphicProjects: [
    {
      id: "chroma-velour",
      title: "CHROMA VELOUR",
      subtitle: "Identity System & Runway Monograph",
      category: "graphic" as const,
      year: "2023",
      client: "Velour Paris Studio",
      role: "Creative Director & Identity Lead",
      awards: ["Cannes Lions Bronze (Design Craft)"],
      metrics: "Global Identity Rollout across 18 Flagship Salons",
      description: "A comprehensive brand identity program including bespoke serif display lettering, foiled linen monograph lookbooks, and sculptural packaging.",
      challenge: "Establishing an iconic visual vocabulary that captures contemporary haute couture drape without relying on standard fashion clichés.",
      solution: "Derived a botanical color system blending deep burgundy, dusty rose, and lime sage with hand-bound Swiss typography.",
      technologies: ["Custom Typography", "Packaging Architecture", "Linen Foiling", "Brand Guidelines"],
      accentColor: "#CB7885",
      heroImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
      previewImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "elixir-botanique",
      title: "L'ÉLIXIR BOTANIQUE",
      subtitle: "Biodynamic Fragrance Packaging & Print",
      category: "graphic" as const,
      year: "2022",
      client: "Atelier Botanique Grasse",
      role: "Sole Art Director & Graphic Designer",
      awards: ["Webby Nominee (Visual Design)", "Mindsparkle Mag Winner"],
      metrics: "94% Global Stockist Adoption Rate in First Month",
      description: "Tactile glass bottle silkscreening, debossed recycled cotton cartons, and an intimate botanical monograph celebrating night-blooming Grasse jasmine.",
      challenge: "Packaging organic olfactory notes into physical paper and glass materials that evoke emotional intimacy.",
      solution: "Embossed botanical linework, blind debossing on heavy cotton paper, and custom olive-pigment letterpress printing.",
      technologies: ["Letterpress", "Silkscreening", "Cotton Stock", "Botanical Illustration"],
      accentColor: "#5E6623",
      heroImage: "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=1200&q=80",
      previewImage: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=600&q=80"
    }
  ],

  // SECTION 6: SOCIAL MEDIA DESIGN SHOWCASE
  socialProjects: [
    {
      id: "maison-campaign",
      title: "ÉTHÉRÉE CRUISE",
      subtitle: "Omnichannel Social Media Direction",
      category: "social" as const,
      year: "2024",
      client: "Maison Éthérée",
      role: "Digital Art Director",
      awards: ["Best Brand Campaign — Fashion Net"],
      metrics: "4.8M Impressions • 38% Engagement Lift Over Baseline",
      description: "Cohesive multi-platform social media campaign spanning 9-grid Instagram editorial narratives, motion video teasers, and responsive story formats.",
      challenge: "Transforming standard social promotion into an art gallery experience that elevated brand prestige.",
      solution: "Created an asymmetrical editorial layout with synchronized typographic kinetic captions and botanical framing.",
      technologies: ["After Effects", "Figma", "Motion Graphics", "Social Grid Strategy"],
      accentColor: "#D4D994",
      heroImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: "botanical-narratives",
      title: "FLORA NOCTURNA",
      subtitle: "Instagram Editorial Series",
      category: "social" as const,
      year: "2023",
      client: "Komorebi Editions",
      role: "Visual Designer & Typographer",
      awards: ["Featured in Design Milk"],
      metrics: "120K Organic Shares • 24K Saved Posts",
      description: "A serialized digital publication exploring midnight botany, pairing micro-essays with high-contrast botanical macro photography.",
      challenge: "Hooking mobile readers in under 2 seconds while maintaining the leisurely pace of an art magazine.",
      solution: "Bold oversized serif drop caps combined with lime sage accents and moody botanical photography.",
      technologies: ["Typography Layout", "Social Storyboards", "Editorial Art Direction"],
      accentColor: "#893941",
      heroImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80"
    }
  ],

  experience: [
    {
      period: "2023 — Present",
      role: "Principal Design Director & Head of Brand Experience",
      company: "Maison Éthérée Digital Studio",
      location: "Paris • New York",
      description: "Leading the global digital craft studio orchestrating luxury brand identity systems, digital flagships, and print monographs.",
      highlights: [
        "Steered 18 senior visual designers, typographers, and creative engineers.",
        "Delivered award-winning campaigns generating over $90M in verified client transaction volume.",
        "Established the studio's botanical editorial design language across European luxury accounts."
      ],
      tags: ["Creative Direction", "Editorial Systems", "Brand Architecture", "Typography"]
    },
    {
      period: "2021 — 2023",
      role: "Staff Product Designer & Creative Technologist",
      company: "Aura Kinetic Studio",
      location: "London, UK",
      description: "Spearheaded experimental interaction design and WebGL-driven brand flagships for global fashion and technology brands.",
      highlights: [
        "Architected bespoke shader engines and micro-physics animations delivering 60fps on mobile.",
        "Authored fluid spatial layout systems reducing responsive design debt by 40%.",
        "Secured 8 international design honors including 4 Awwwards Site of the Day trophies."
      ],
      tags: ["WebGL", "Three.js", "Interaction Design", "TypeScript"]
    },
    {
      period: "2018 — 2021",
      role: "Senior Art Director & Visual Designer",
      company: "Velvet & Signal Agency",
      location: "Berlin, Germany",
      description: "Directed high-concept visual identities and editorial e-commerce experiences for lifestyle and publishing brands.",
      highlights: [
        "Transformed legacy e-commerce flows into immersive editorial lookbooks, boosting checkout conversion by 28%.",
        "Directed print campaigns, bespoke packaging, and comprehensive brand guideline books."
      ],
      tags: ["Art Direction", "Print & Packaging", "Editorial Design", "Visual Identity"]
    },
    {
      period: "2015 — 2018",
      role: "Interactive Visual Designer",
      company: "Monochrome Collective",
      location: "San Francisco, CA",
      description: "Created high-impact digital experiences, identity guidelines, and responsive web products for tech unicorns and arts foundations.",
      highlights: [
        "Designed award-winning brand collateral and interactive microsites featured in FastCompany and Wired.",
        "Partnered with production printers and frontend developers to maintain brand integrity across all touchpoints."
      ],
      tags: ["Brand Identity", "Motion Design", "Visual Design", "Prototyping"]
    }
  ],

  education: [
    {
      degree: "Master of Arts in Design Innovation & New Media",
      institution: "Royal College of Art / Central Saint Martins",
      location: "London, UK",
      period: "2013 — 2015",
      honors: "First Class Honours • Distinction for Thesis 'Tactile Emotion in Digital Space'",
      details: "Specialized in experimental editorial design, kinetic typography, and luxury digital art direction."
    },
    {
      degree: "Bachelor of Design in Visual Communication",
      institution: "National Institute of Design (NID)",
      location: "Ahmedabad, India",
      period: "2009 — 2013",
      honors: "Summa Cum Laude • Gold Medal for Excellence in Typographic Architecture",
      details: "Foundational training in editorial design, classical Swiss print typography, color theory, and semiotics."
    }
  ],

  accolades: [
    { title: "Site of the Month", organization: "Awwwards", year: "2024", category: "SOUVERAIN Atelier" },
    { title: "Site of the Day (×6)", organization: "Awwwards", year: "2021–2024", category: "Multiple Flagships" },
    { title: "Best of the Best", organization: "Red Dot Design Award", year: "2023", category: "NYX Flight Console" },
    { title: "Digital Craft Bronze", organization: "Cannes Lions International", year: "2023", category: "Chroma Velour Runway" },
    { title: "Annual Jury Member", organization: "Awwwards Executive Council", year: "2023–2025", category: "International Jury" }
  ]
}
