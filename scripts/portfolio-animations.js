/**
 * Sri Venu Puduvayila — Minimal & Smooth Portfolio Animation Engine
 * Philosophy: MINIMAL + SMOOTH + PREMIUM + PROFESSIONAL
 * Features:
 * - Native buttery-smooth desktop and mobile scroll physics (zero wheel hijacking)
 * - IntersectionObserver-based subtle scroll-triggered reveals
 * - GPU-accelerated lightweight scroll progress bar
 * - Dynamic scroll spy & active navigation tracking
 * - Interactive accordion for "I DESIGN / I BUILD / I EXPERIMENT"
 * - Interactive draggable / swipeable Side Quests track
 * - Project preview exploration modal
 * - Mobile navigation drawer
 * - Full prefers-reduced-motion accessibility support
 */

(function () {
  'use strict';

  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Scroll Progress Bar
     ========================================================================== */
  const progressBar = document.getElementById('scroll-progress-bar');

  function updateProgressBar() {
    if (!progressBar || prefersReducedMotion) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPos = window.scrollY || window.pageYOffset || 0;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollPos / docHeight, 0), 1) : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  }

  /* ==========================================================================
     2. Native Smooth Scroll Helper for Anchors
     ========================================================================== */
  function smoothScrollTo(targetY) {
    const nav = document.querySelector('nav');
    const navHeight = nav ? nav.offsetHeight : 80;
    const finalPos = Math.max(0, targetY - navHeight);
    window.scrollTo({
      top: finalPos,
      behavior: 'smooth'
    });
  }

  /* ==========================================================================
     3. Scroll-Triggered Reveal Animations
     ========================================================================== */
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('[data-reveal], [data-stagger]');

    if (prefersReducedMotion) {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '-4% 0px -4% 0px',
      threshold: 0.05
    });

    revealElements.forEach((el) => {
      // If already within viewport on page load, reveal immediately without delay
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  /* ==========================================================================
     4. Navigation & Scroll Spy
     ========================================================================== */
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('[data-nav]');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = ['work', 'journey', 'about', 'contact'];

  function updateActiveNav() {
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Navbar background blur enhancement on scroll
    if (nav) {
      if (scrollY > 40) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    }

    // Scroll spy for sections
    let currentSection = '';
    for (let i = sections.length - 1; i >= 0; i--) {
      const sectionEl = document.getElementById(sections[i]);
      if (sectionEl) {
        const rect = sectionEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
          currentSection = sections[i];
          break;
        }
      }
    }

    navLinks.forEach((link) => {
      const target = link.getAttribute('data-nav');
      if (target === currentSection) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });

    mobileNavLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const target = href.replace('#', '');
      if (target === currentSection) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  // Smooth scroll for nav anchor clicks
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-nav');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const pos = targetEl.getBoundingClientRect().top + window.pageYOffset;
        smoothScrollTo(pos);
      }
    });
  });

  // Mobile nav anchor clicks
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) {
        e.preventDefault();
        closeMobileMenu();
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          setTimeout(() => {
            const pos = targetEl.getBoundingClientRect().top + window.pageYOffset;
            smoothScrollTo(pos);
          }, 250);
        }
      }
    });
  });

  // Logo click -> smooth scroll to top
  const logo = document.querySelector('[data-logo]');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // "Explore Selected Work" button in hero -> smooth scroll to #work
  const exploreWorkBtns = document.querySelectorAll('[data-explore="work"]');
  exploreWorkBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const workSection = document.getElementById('work');
      if (workSection) {
        const pos = workSection.getBoundingClientRect().top + window.pageYOffset;
        smoothScrollTo(pos);
      }
    });
  });

  // Hero Resume / Contact CTA button -> smooth scroll to #contact
  const contactLinks = document.querySelectorAll('a[href="#contact"]');
  contactLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const pos = contactSection.getBoundingClientRect().top + window.pageYOffset;
        smoothScrollTo(pos);
      }
    });
  });

  // Hero vertical "SCROLL" button click -> scroll down smoothly
  const heroScrollBtn = document.querySelector('.hero-scroll-btn');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      smoothScrollTo(window.innerHeight * 0.85);
    });
  }

  /* ==========================================================================
     5. Lightweight Scroll Listener Loop
     ========================================================================== */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgressBar();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ==========================================================================
     6. Mobile Navigation Menu Toggle
     ========================================================================== */
  const mobileMenuToggle = document.querySelector('button[aria-label="Toggle menu"]');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  let mobileMenuOpen = false;

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenuOpen = true;
    mobileMenu.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Animate hamburger to X
    if (mobileMenuToggle) {
      const bars = mobileMenuToggle.querySelectorAll('span');
      if (bars.length >= 2) {
        bars[0].style.transform = 'translateY(4px) rotate(45deg)';
        bars[0].style.width = '22px';
        bars[1].style.transform = 'translateY(-4px) rotate(-45deg)';
        bars[1].style.width = '22px';
        bars[1].style.opacity = '1';
      }
    }
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenuOpen = false;
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';

    if (mobileMenuToggle) {
      const bars = mobileMenuToggle.querySelectorAll('span');
      if (bars.length >= 2) {
        bars[0].style.transform = 'none';
        bars[0].style.width = '20px';
        bars[1].style.transform = 'none';
        bars[1].style.width = '14px';
        bars[1].style.opacity = '0.5';
      }
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (mobileMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  /* ==========================================================================
     7. Interactive Accordion: "I DESIGN / I BUILD / I EXPERIMENT"
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach((item, index) => {
    // Open first by default
    if (index === 0) {
      item.classList.add('is-active');
    }

    item.addEventListener('mouseenter', () => {
      accordionItems.forEach((other) => other.classList.remove('is-active'));
      item.classList.add('is-active');
    });

    item.addEventListener('click', () => {
      const wasActive = item.classList.contains('is-active');
      accordionItems.forEach((other) => other.classList.remove('is-active'));
      if (!wasActive) {
        item.classList.add('is-active');
      }
    });
  });

  /* ==========================================================================
     Process Cards: Mobile / Touch Tap to Toggle
     ========================================================================== */
  const processCards = document.querySelectorAll('[data-process-card]');

  processCards.forEach((card) => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('is-active');
      processCards.forEach((c) => c.classList.remove('is-active'));
      if (!isActive) {
        card.classList.add('is-active');
      }
    });
  });

  /* ==========================================================================
     8. Horizontal Carousel: Drag-to-Scroll & Inertia (LANDING PAGES)
     ========================================================================== */
  const landingCarousel = document.querySelector('.landing-carousel-container');

  if (landingCarousel) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let isDragging = false;
    let velX = 0;
    let momentumID = null;
    let lastX = 0;
    let lastTime = 0;

    // Prevent dragging from accidentally triggering card link navigation
    landingCarousel.addEventListener('click', (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    landingCarousel.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only main button
      isDown = true;
      isDragging = false;
      landingCarousel.classList.add('is-dragging');
      landingCarousel.style.scrollSnapType = 'none';
      landingCarousel.style.scrollBehavior = 'auto';
      cancelAnimationFrame(momentumID);
      startX = e.pageX - landingCarousel.offsetLeft;
      scrollLeft = landingCarousel.scrollLeft;
      lastX = e.pageX;
      lastTime = performance.now();
      velX = 0;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const x = e.pageX - landingCarousel.offsetLeft;
      const walk = x - startX;
      if (Math.abs(walk) > 5) {
        isDragging = true;
      }
      landingCarousel.scrollLeft = scrollLeft - walk;

      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 10) {
        velX = (e.pageX - lastX) / dt;
        lastX = e.pageX;
        lastTime = now;
      }
    });

    const finishDrag = () => {
      if (!isDown) return;
      isDown = false;
      landingCarousel.classList.remove('is-dragging');

      // Smooth inertia momentum
      if (Math.abs(velX) > 0.15) {
        let currentVel = velX * 16;
        const applyMomentum = () => {
          if (Math.abs(currentVel) > 0.5) {
            landingCarousel.scrollLeft -= currentVel;
            currentVel *= 0.92;
            momentumID = requestAnimationFrame(applyMomentum);
          } else {
            landingCarousel.style.scrollSnapType = 'x mandatory';
            landingCarousel.style.scrollBehavior = 'smooth';
            setTimeout(() => { isDragging = false; }, 60);
          }
        };
        momentumID = requestAnimationFrame(applyMomentum);
      } else {
        landingCarousel.style.scrollSnapType = 'x mandatory';
        landingCarousel.style.scrollBehavior = 'smooth';
        setTimeout(() => { isDragging = false; }, 60);
      }
    };

    window.addEventListener('mouseup', finishDrag);

    // Mouse wheel horizontal scroll support
    landingCarousel.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        landingCarousel.scrollBy({
          left: e.deltaY * 1.5,
          behavior: 'smooth'
        });
      }
    }, { passive: false });
  }

  /* ==========================================================================
     9. Project Details Exploration Modal (Complete Case Study Presentation)
     ========================================================================== */
  const projectData = {
    'maynu-clinics': {
      id: 'maynu-clinics',
      title: 'MAYNU CLINICS',
      type: 'WEBSITE DESIGN',
      number: '01',
      color: '#168BFF',
      role: 'Web Design & WordPress Development',
      tools: 'WordPress · Elementor · Figma · UI/UX Design · Responsive Web Design',
      summary: 'A modern healthcare website designed to create a clean, trustworthy and responsive digital experience.',
      overview: 'Maynu Clinics needed a patient-focused healthcare website designed to establish digital credibility, showcase comprehensive clinical specialties, and facilitate rapid online appointment bookings. The project involved complete visual design, intuitive information architecture, and a responsive WordPress implementation tailored for clear medical discovery.',
      objective: 'Create an approachable, highly credible digital portal that presents medical treatments clearly, simplifies doctor discovery, and reduces friction for patients scheduling appointments.',
      designApproach: 'Implemented a clean, trust-inspiring visual hierarchy with high contrast, calm medical color tones, accessible typography, and strategically positioned call-to-action touchpoints across all service pages.',
      keyFeatures: [
        'Streamlined Online Appointment Request Flow',
        'Comprehensive Medical Specialties & Treatment Catalog',
        'Doctor Profiles with Qualifications & Clinical Focus',
        'Interactive Clinic Location & Contact Integration'
      ],
      responsiveDesign: 'Engineered with a mobile-first philosophy to ensure patients on smartphones and tablets experience rapid load times, touch-friendly appointment booking, and crisp typography across all viewport sizes.',
      outcome: 'The completed website delivers an intuitive, reassuring experience for patients, providing clear service pathways and significantly simplifying appointment inquiry workflows.',
      image: './images/maynu-clinics.jpg',
      imageWebp: './images/maynu-clinics.webp',
      liveUrl: 'https://maynuclinics.com/',
      nextId: 'onclick-digital',
      nextTitle: 'ONCLICK DIGITAL'
    },
    'onclick-digital': {
      id: 'onclick-digital',
      title: 'ONCLICK DIGITAL',
      type: 'WEBSITE REDESIGN',
      number: '02',
      color: '#168BFF',
      role: 'Web Design & Agency Brand Redesign',
      tools: 'WordPress · Elementor · Figma · UI/UX Design · CSS',
      summary: 'A bold, high-impact agency redesign focused on modern aesthetics, interactive case studies, and lead generation.',
      overview: 'OnClick Digital Marketing is a full-service agency requiring a digital presence that reflects modern creative and technical excellence. The project involved reimagining the brand’s digital identity, creating dynamic service presentations for SEO, PPC, and Web Development, and engineering conversion-oriented landing page funnels.',
      objective: 'Modernize the agency’s online identity, articulate diverse marketing capabilities with high visual impact, and increase inbound inquiry conversions from prospective business clients.',
      designApproach: 'Utilized a sleek, dark-mode design system with electric accents, engaging micro-interactions, bold editorial typography, and clear client proof-points to communicate industry authority.',
      keyFeatures: [
        'Interactive Marketing Solutions & Service Showcase',
        'Structured Case Study Presentation Layouts',
        'High-Conversion Consultation & Inquiry Funnels',
        'Performance-Optimized Responsive Component Architecture'
      ],
      responsiveDesign: 'Built using adaptive CSS grids and flexible typography so that complex service tables and portfolio visuals render flawlessly on mobile, tablet, and widescreen desktop monitors.',
      outcome: 'A modern, high-energy agency website that commands attention, showcases technical capability, and provides a clear pathway for client inquiries.',
      image: './images/onclick-digital.jpg',
      imageWebp: './images/onclick-digital.webp',
      liveUrl: 'https://onclickdigitalmarketing.com/',
      nextId: 'jbk-it',
      nextTitle: 'JBK IT'
    },
    'jbk-it': {
      id: 'jbk-it',
      title: 'JBK IT',
      type: 'WEBSITE REDESIGN',
      number: '03',
      color: '#168BFF',
      role: 'Web Design & Educational Portal Redesign',
      tools: 'WordPress · Elementor · Figma · UI/UX Design · Responsive Web Design',
      summary: 'A structured career training & certification portal for JBK Technologies featuring comprehensive course roadmaps.',
      overview: 'JBK IT (JBK Technologies) provides specialized professional training in Tally Prime, GST, SAP FICO, and Advanced Accounting. The redesign focused on transforming their portal into a structured, student-friendly platform where learners can explore curriculum details, understand certification paths, and easily register for demo sessions.',
      objective: 'Streamline course exploration for students and job-seekers, showcase practical training benefits and placement assistance, and make admission counseling inquiries effortless.',
      designApproach: 'Constructed an intuitive educational hierarchy with clear course categorization, distinct module breakdowns, prominent faculty highlights, and one-click WhatsApp and call consultation triggers.',
      keyFeatures: [
        'Comprehensive Training Course Roadmaps & Module Syllabi',
        'Student Success Reviews & 100% Placement Guidance Showcase',
        'Instant Demo Booking & Direct Inquiry Forms',
        'Branch Contact Details & Verification Assistance'
      ],
      responsiveDesign: 'Optimized specifically for mobile-first student traffic with fast-loading course sheets, clear syllabus accordions, and frictionless contact actions on mobile screens.',
      outcome: 'A clear, professional educational website that builds learner confidence and significantly simplifies the enrollment and counseling process.',
      image: './images/jbk-it.jpg',
      imageWebp: './images/jbk-it.webp',
      liveUrl: 'https://jbkittechnologies.com/',
      nextId: 'smake',
      nextTitle: 'SMAKE'
    },
    'smake': {
      id: 'smake',
      title: 'SMAKE',
      type: 'E-COMMERCE WEBSITE',
      number: '04',
      color: '#168BFF',
      role: 'E-Commerce Web Design & Development',
      tools: 'WordPress · WooCommerce · Figma · UI/UX Design · Responsive Web Design',
      summary: 'A sleek, visual-first e-commerce shopping experience for custom apparel and lifestyle merchandise.',
      overview: 'SMAKE is a contemporary fashion and custom merchandise brand. The objective was to build a visually engaging digital storefront that elevates product presentation, simplifies size and color variant selection, and provides a smooth, frictionless purchasing journey.',
      objective: 'Create an attractive, brand-aligned e-commerce store that showcases merchandise with high visual impact and delivers an effortless checkout flow.',
      designApproach: 'Applied a minimalist, product-centric aesthetic with large imagery, clean typography, intuitive category filtering, and sticky add-to-cart interactions for maximum shopping convenience.',
      keyFeatures: [
        'High-Resolution Product Showcases & Gallery Views',
        'Interactive Size, Color, and Variant Selection Matrix',
        'Streamlined Shopping Cart & Smooth Checkout Funnel',
        'Mobile-Optimized Product Filter & Navigation Drawer'
      ],
      responsiveDesign: 'Engineered for smooth handheld shopping with thumb-friendly touch targets, responsive product grids, and rapid image loading across all mobile devices.',
      outcome: 'A polished, modern e-commerce storefront that strengthens brand presence and provides customers with an enjoyable, intuitive shopping experience.',
      image: './images/smake.jpg',
      imageWebp: './images/smake.webp',
      liveUrl: 'https://smake.in/',
      nextId: 'jbk-academy',
      nextTitle: 'JBK ACADEMY – MARATHAHALLI'
    },
    'jbk-academy': {
      id: 'jbk-academy',
      title: 'JBK ACADEMY – MARATHAHALLI',
      type: 'WEBSITE REDESIGN',
      number: '05',
      color: '#168BFF',
      role: 'Web Design & Educational Portal Redesign',
      tools: 'WordPress · Elementor · Figma · UI/UX Design · Responsive Web Design',
      summary: 'A comprehensive campus portal for JBK Academy in Marathahalli featuring interactive training roadmaps.',
      overview: 'JBK Academy’s Marathahalli campus in Bengaluru required a dedicated digital portal to connect students with classroom and online software training, practical workshops, and career coaching programs. The project focused on structured branch navigation, course roadmaps, and clear batch timings.',
      objective: 'Deliver a transparent, informative campus portal that enables students to discover IT courses, review batch schedules, and connect with academic counselors.',
      designApproach: 'Designed a structured, accessible layout with modular course cards, easy-to-read batch schedules, student project displays, and direct admission inquiry triggers.',
      keyFeatures: [
        'Campus-Specific Course Schedule & Training Roadmaps',
        'Student Project Showcases & Career Placement Highlights',
        'Quick Demo Session Registration & Counseling Triggers',
        'Campus Location Map, Facility Tour & Contact Info'
      ],
      responsiveDesign: 'Built for consistent cross-device performance ensuring curriculum overviews and enrollment forms remain easily readable and accessible across mobile and desktop.',
      outcome: 'A modern, reliable academic portal that empowers students to evaluate career training options and connect directly with campus counselors.',
      image: './images/jbk-academy.jpg',
      imageWebp: './images/jbk-academy.webp',
      liveUrl: 'https://jbkacademy.in/marathahalli/',
      nextId: 'maac-kphb',
      nextTitle: 'MAAC KPHB'
    },
    'maac-kphb': {
      id: 'maac-kphb',
      title: 'MAAC KPHB',
      type: 'WEBSITE REDESIGN',
      number: '06',
      color: '#168BFF',
      role: 'Web Design & UI/UX Redesign',
      tools: 'WordPress · Elementor · UI/UX Design · Responsive Web Design',
      summary: 'A modern, responsive website redesign for MAAC KPHB showcasing creative courses and student opportunities.',
      overview: 'MAAC KPHB (Maya Academy of Advanced Creativity) is a premier training institute for 3D Animation, VFX, Gaming, and Graphic Design. The redesign focused on crafting a vibrant, visually captivating digital experience that showcases creative course offerings, student showreels, and career opportunities.',
      objective: 'Showcase specialized creative industry courses, present student artwork and showreels dynamically, and streamline inquiry submissions for free demo classes and admissions.',
      designApproach: 'Created a high-energy visual experience featuring bold typography, dark cinematic layouts, vibrant accent colors, and clear category segmentation for Animation, VFX, Gaming, and Design courses.',
      keyFeatures: [
        'Specialized Course Tracks (3D Animation, VFX, Gaming, Graphic Design)',
        'Student Portfolio & Artwork Showcase Galleries',
        'Free Demo Class Booking & Scholarship Inquiry Forms',
        'Career Placement Track Record & Alumni Success Highlights'
      ],
      responsiveDesign: 'Fully responsive design adapting fluidly from high-resolution desktop monitors to smartphones, maintaining visual richness without sacrificing mobile page speed.',
      outcome: 'An engaging, modern digital portal that captures the creative energy of MAAC KPHB and guides aspiring artists seamlessly toward course enrollment.',
      image: './images/maac-kphb.jpg',
      imageWebp: './images/maac-kphb.webp',
      liveUrl: 'https://maackphb.com/',
      nextId: 'maynu-clinics',
      nextTitle: 'MAYNU CLINICS'
    }
  };

  const modal = document.getElementById('project-modal');
  const modalContent = document.getElementById('project-modal-content');
  const modalBackdrop = document.querySelector('.project-modal-backdrop');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  function openProjectModal(projectId) {
    const project = projectData[projectId];
    if (!project || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="project-case-study">
        <!-- 1. PROJECT HEADER -->
        <div class="case-study-header mb-6">
          <div class="flex items-center justify-between gap-3 mb-3">
            <div class="flex items-baseline gap-2.5">
              <span class="text-xs font-mono tracking-[0.2em] font-bold" style="color: #168BFF;">${project.number}</span>
              <span class="text-[10px] tracking-[0.25em] text-cream/40 font-mono uppercase">${project.type}</span>
            </div>
            <span class="text-[10px] tracking-[0.15em] text-cream/35 font-mono uppercase">Case Study</span>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-cream leading-tight mb-3">${project.title}</h2>
          <p class="text-sm md:text-base text-cream/70 leading-relaxed font-light">${project.summary}</p>
        </div>

        <!-- 2. LARGE PROJECT PREVIEW -->
        <div class="case-study-preview w-full rounded-xl overflow-hidden bg-graphite/60 border border-white/10 mb-8 aspect-video shadow-2xl">
          <picture class="w-full h-full block">
            <source srcset="${project.imageWebp}" type="image/webp">
            <img src="${project.image}" alt="${project.title} — Case Study Preview" class="w-full h-full object-cover object-top" loading="lazy" />
          </picture>
        </div>

        <!-- 3. PROJECT OVERVIEW -->
        <div class="case-study-section mb-7 p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/8">
          <h3 class="text-xs font-mono tracking-[0.2em] text-[#168BFF] uppercase mb-3 font-bold">01 / PROJECT OVERVIEW</h3>
          <p class="text-sm md:text-base text-cream/80 leading-relaxed font-light">${project.overview}</p>
        </div>

        <!-- 4. ROLE + TOOLS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
          <div class="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/8">
            <span class="text-[10px] font-mono tracking-[0.2em] text-cream/40 uppercase block mb-1.5 font-bold">ROLE</span>
            <p class="text-sm font-mono text-cream/90 font-medium">${project.role}</p>
          </div>
          <div class="p-4 sm:p-5 rounded-xl bg-white/[0.03] border border-white/8">
            <span class="text-[10px] font-mono tracking-[0.2em] text-cream/40 uppercase block mb-1.5 font-bold">TOOLS / TECHNOLOGIES</span>
            <p class="text-sm font-mono text-cream/90 font-medium">${project.tools}</p>
          </div>
        </div>

        <!-- 5. PROJECT OBJECTIVE -->
        <div class="case-study-section mb-7 p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/8">
          <h3 class="text-xs font-mono tracking-[0.2em] text-[#168BFF] uppercase mb-3 font-bold">02 / PROJECT OBJECTIVE</h3>
          <p class="text-sm md:text-base text-cream/80 leading-relaxed font-light">${project.objective}</p>
        </div>

        <!-- 6. DESIGN APPROACH -->
        <div class="case-study-section mb-7 p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/8">
          <h3 class="text-xs font-mono tracking-[0.2em] text-[#168BFF] uppercase mb-3 font-bold">03 / DESIGN APPROACH</h3>
          <p class="text-sm md:text-base text-cream/80 leading-relaxed font-light">${project.designApproach}</p>
        </div>

        <!-- 7. KEY FEATURES -->
        <div class="case-study-section mb-7 p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/8">
          <h3 class="text-xs font-mono tracking-[0.2em] text-[#168BFF] uppercase mb-4 font-bold">04 / KEY FEATURES</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${project.keyFeatures.map((feat) => `
              <div class="flex items-start gap-2.5 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <svg class="w-4 h-4 text-[#168BFF] flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span class="text-xs text-cream/80 font-light leading-snug">${feat}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 8. RESPONSIVE DESIGN -->
        <div class="case-study-section mb-7 p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/8">
          <h3 class="text-xs font-mono tracking-[0.2em] text-[#168BFF] uppercase mb-3 font-bold">05 / RESPONSIVE DESIGN</h3>
          <p class="text-sm md:text-base text-cream/80 leading-relaxed font-light">${project.responsiveDesign}</p>
        </div>

        <!-- 9. PROJECT OUTCOME -->
        <div class="case-study-section mb-8 p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/8">
          <h3 class="text-xs font-mono tracking-[0.2em] text-[#168BFF] uppercase mb-3 font-bold">06 / PROJECT OUTCOME</h3>
          <p class="text-sm md:text-base text-cream/80 leading-relaxed font-light">${project.outcome}</p>
        </div>

        <!-- 10 & 11. ACTIONS (NEXT PROJECT + VISIT LIVE WEBSITE) -->
        <div class="case-study-actions flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-white/10">
          <button data-next-project="${project.nextId}" class="case-study-next-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-mono tracking-[0.18em] uppercase font-bold text-cream/80 bg-white/5 hover:bg-white/10 border border-white/15 transition-all duration-300 cursor-pointer">
            <span>NEXT PROJECT (${project.nextTitle})</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="case-study-live-btn inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold text-white bg-[#168BFF] hover:bg-[#3DA5FF] transition-all duration-300 shadow-lg shadow-blue-500/20 text-decoration-none">
            <span>VISIT LIVE WEBSITE</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
          </a>
        </div>
      </div>
    `;

    // Hook Next Project button inside modal
    const nextBtn = modalContent.querySelector('[data-next-project]');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextId = nextBtn.getAttribute('data-next-project');
        if (nextId) {
          const dialog = modal.querySelector('.project-modal-dialog');
          if (dialog) dialog.scrollTop = 0;
          openProjectModal(nextId);
        }
      });
    }

    const dialog = modal.querySelector('.project-modal-dialog');
    if (dialog) dialog.scrollTop = 0;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeProjectModal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('is-open')) {
        closeProjectModal();
      }
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    }
  });

  // Attach modal trigger to "Explore Project" buttons and image cards
  const projectCards = document.querySelectorAll('article[data-project-id]');
  projectCards.forEach((card) => {
    const projectId = card.getAttribute('data-project-id');
    const exploreBtn = card.querySelector('button[data-action="explore"]');
    const imageContainer = card.querySelector('.project-card-image-wrap');

    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openProjectModal(projectId);
      });
    }

    if (imageContainer) {
      imageContainer.addEventListener('click', () => {
        openProjectModal(projectId);
      });
    }
  });

  /* ==========================================================================
     10. Living Cinematic Electric-Blue Lightning Atmosphere Controller
     - Natural unpredictable pulse & flicker intervals (3s - 8.5s)
     - Multi-branch atmospheric illumination
     - Ultra-lightweight 60fps HTML5 dynamic ionized particle & spark canvas
     - Smooth micro-parallax scroll depth
     - Auto-pausing on tab inactivity (Page Visibility API)
     - Strict prefers-reduced-motion accessibility
     ========================================================================== */
  function initLightningAtmosphere() {
    if (prefersReducedMotion) return;

    const baseLayer = document.querySelector('.lightning-base');
    const glowLayer = document.querySelector('.lightning-glow');
    const branch1 = document.querySelector('.lightning-branch-1');
    const branch2 = document.querySelector('.lightning-branch-2');
    const cloudsLayer = document.querySelector('.lightning-clouds');
    const canvas = document.getElementById('lightning-canvas');

    let isTabActive = !document.hidden;
    let surgeTimeoutId = null;

    /* ------------------------------------------------------------------------
       A. Natural Random Lightning Surges & Branch Flickers
       ------------------------------------------------------------------------ */
    function triggerRandomLightningSurge() {
      if (!isTabActive || prefersReducedMotion) {
        scheduleNextSurge();
        return;
      }

      const patternType = Math.floor(Math.random() * 3); // 0: Double flicker, 1: Branch strike, 2: Ambient pulse

      if (patternType === 0 && baseLayer && glowLayer) {
        // Pattern 0: Realistic rapid double-surge
        baseLayer.classList.add('is-surging');
        glowLayer.classList.add('is-surging');

        setTimeout(() => {
          baseLayer.classList.remove('is-surging');
          glowLayer.classList.remove('is-surging');

          setTimeout(() => {
            baseLayer.classList.add('is-surging');
            if (branch1 && Math.random() > 0.5) branch1.classList.add('is-active');

            setTimeout(() => {
              baseLayer.classList.remove('is-surging');
              if (branch1) branch1.classList.remove('is-active');
            }, 120 + Math.random() * 80);
          }, 60 + Math.random() * 50);
        }, 80 + Math.random() * 40);

      } else if (patternType === 1) {
        // Pattern 1: Branch ionization illumination
        const targetBranch = Math.random() > 0.5 ? branch1 : branch2;
        if (targetBranch) {
          targetBranch.classList.add('is-active');
          if (glowLayer) glowLayer.classList.add('is-surging');

          setTimeout(() => {
            targetBranch.classList.remove('is-active');
            if (glowLayer) glowLayer.classList.remove('is-surging');
          }, 180 + Math.random() * 140);
        }

      } else {
        // Pattern 2: Deep ambient cloud glow swell
        if (glowLayer) {
          glowLayer.classList.add('is-surging');
          setTimeout(() => {
            glowLayer.classList.remove('is-surging');
          }, 350 + Math.random() * 200);
        }
      }

      scheduleNextSurge();
    }

    function scheduleNextSurge() {
      if (surgeTimeoutId) clearTimeout(surgeTimeoutId);
      // Random unpredictable delay between 3200ms and 8500ms
      const nextDelay = 3200 + Math.random() * 5300;
      surgeTimeoutId = setTimeout(triggerRandomLightningSurge, nextDelay);
    }

    scheduleNextSurge();

    /* ------------------------------------------------------------------------
       B. Ultra-Lightweight Dynamic Electric Canvas
       ------------------------------------------------------------------------ */
    if (canvas && canvas.getContext) {
      const ctx = canvas.getContext('2d');
      let animFrameId = null;
      let width = 0;
      let height = 0;

      function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });

      // Atmospheric ionized ambient particles (minimal count for 0% CPU footprint)
      const particleCount = window.innerWidth < 768 ? 12 : 22;
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.6,
          radius: 0.8 + Math.random() * 1.6,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.15 - 0.05,
          alpha: 0.1 + Math.random() * 0.35,
          maxAlpha: 0.25 + Math.random() * 0.35,
          pulseSpeed: 0.008 + Math.random() * 0.015,
          phase: Math.random() * Math.PI * 2
        });
      }

      // Micro electric arc burst state
      let activeArc = null;

      function spawnElectricArc() {
        if (!isTabActive || Math.random() > 0.02) return;
        // Concentrated primarily toward the right side and upper quadrant
        const startX = width * (0.55 + Math.random() * 0.4);
        const startY = height * (0.05 + Math.random() * 0.35);
        const mainSegments = [];
        const branchSegments = [];
        let curX = startX;
        let curY = startY;
        const length = 5 + Math.floor(Math.random() * 5);

        for (let i = 0; i < length; i++) {
          curX += (Math.random() - 0.45) * 32;
          curY += 16 + Math.random() * 26;
          mainSegments.push({ x: curX, y: curY });

          // Occasional branching streak
          if (i === 2 && Math.random() > 0.3) {
            let bX = curX;
            let bY = curY;
            for (let j = 0; j < 3; j++) {
              bX += (Math.random() - 0.2) * 28;
              bY += 12 + Math.random() * 18;
              branchSegments.push({ x: bX, y: bY });
            }
          }
        }

        activeArc = {
          startX,
          startY,
          mainSegments,
          branchSegments,
          life: 8,
          maxLife: 8,
          opacity: 0.75 + Math.random() * 0.25
        };
      }

      function renderCanvas() {
        if (!isTabActive) {
          animFrameId = requestAnimationFrame(renderCanvas);
          return;
        }

        ctx.clearRect(0, 0, width, height);

        // Render ambient ionized particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.phase += p.pulseSpeed;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height * 0.65;
          if (p.y > height * 0.65) p.y = 0;

          const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(85, 183, 255, ${currentAlpha * 0.55})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(22, 139, 255, 0.7)';
          ctx.fill();
        }

        // Render micro electric arc if active (realistic Thor branching lightning streak with bright white core)
        if (activeArc) {
          ctx.save();
          const progress = activeArc.life / activeArc.maxLife;

          // Pass 1: Outer Electric-Blue Glow
          ctx.beginPath();
          ctx.moveTo(activeArc.startX, activeArc.startY);
          for (let i = 0; i < activeArc.mainSegments.length; i++) {
            ctx.lineTo(activeArc.mainSegments[i].x, activeArc.mainSegments[i].y);
          }
          if (activeArc.branchSegments.length > 0) {
            ctx.moveTo(activeArc.mainSegments[1].x, activeArc.mainSegments[1].y);
            for (let i = 0; i < activeArc.branchSegments.length; i++) {
              ctx.lineTo(activeArc.branchSegments[i].x, activeArc.branchSegments[i].y);
            }
          }
          ctx.strokeStyle = `rgba(61, 165, 255, ${activeArc.opacity * progress * 0.85})`;
          ctx.lineWidth = 2.4;
          ctx.shadowBlur = 16;
          ctx.shadowColor = 'rgba(22, 139, 255, 0.95)';
          ctx.stroke();

          // Pass 2: Thin Bright White Core
          ctx.beginPath();
          ctx.moveTo(activeArc.startX, activeArc.startY);
          for (let i = 0; i < activeArc.mainSegments.length; i++) {
            ctx.lineTo(activeArc.mainSegments[i].x, activeArc.mainSegments[i].y);
          }
          if (activeArc.branchSegments.length > 0) {
            ctx.moveTo(activeArc.mainSegments[1].x, activeArc.mainSegments[1].y);
            for (let i = 0; i < activeArc.branchSegments.length; i++) {
              ctx.lineTo(activeArc.branchSegments[i].x, activeArc.branchSegments[i].y);
            }
          }
          ctx.strokeStyle = `rgba(255, 255, 255, ${activeArc.opacity * progress})`;
          ctx.lineWidth = 0.9;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#FFFFFF';
          ctx.stroke();

          ctx.restore();

          activeArc.life--;
          if (activeArc.life <= 0) {
            activeArc = null;
          }
        } else {
          spawnElectricArc();
        }

        animFrameId = requestAnimationFrame(renderCanvas);
      }

      animFrameId = requestAnimationFrame(renderCanvas);
    }

    /* ------------------------------------------------------------------------
       C. Smooth Scroll Depth Micro-Parallax
       ------------------------------------------------------------------------ */
    let lastScrollY = window.scrollY || window.pageYOffset || 0;
    let ticking = false;

    function applyScrollDepth() {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      if (cloudsLayer) {
        cloudsLayer.style.transform = `translate3d(0, ${scrollY * 0.02}px, 0)`;
      }
      if (glowLayer) {
        glowLayer.style.transform = `translate3d(0, ${scrollY * 0.012}px, 0)`;
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      lastScrollY = window.scrollY || window.pageYOffset || 0;
      if (!ticking) {
        window.requestAnimationFrame(applyScrollDepth);
        ticking = true;
      }
    }, { passive: true });

    /* ------------------------------------------------------------------------
       D. Page Visibility Lifecycle (Pause when tab inactive)
       ------------------------------------------------------------------------ */
    document.addEventListener('visibilitychange', () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        scheduleNextSurge();
      } else {
        if (surgeTimeoutId) clearTimeout(surgeTimeoutId);
      }
    });
  }

  /* ==========================================================================
     11. Initialization on DOM Ready
     ========================================================================== */
  function init() {
    initScrollReveals();
    updateProgressBar();
    updateActiveNav();
    initLightningAtmosphere();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
