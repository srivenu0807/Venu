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
  const desktopNavLinks = document.querySelectorAll('.nav-links-group [data-nav]');
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

    // Default to 'work' if near top of page
    if (!currentSection && scrollY < 500) {
      currentSection = 'work';
    }

    desktopNavLinks.forEach((link) => {
      const target = link.getAttribute('data-nav');
      if (target === currentSection) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });

    mobileNavLinks.forEach((link) => {
      const target = link.getAttribute('data-nav') || (link.getAttribute('href') || '').replace('#', '');
      if (target === currentSection) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  // Smooth scroll for desktop nav anchor clicks
  desktopNavLinks.forEach((link) => {
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

  // Mobile nav anchor clicks: navigate to section AND automatically close mobile menu
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-nav') || (link.getAttribute('href') || '').replace('#', '');
      closeMobileMenu();
      if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const pos = targetEl.getBoundingClientRect().top + window.pageYOffset;
          smoothScrollTo(pos);
        }
      }
    });
  });

  // Logo click -> smooth scroll to top
  const logo = document.querySelector('[data-logo]');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      if (mobileMenuOpen) {
        closeMobileMenu();
      }
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
     6. Mobile Navigation Menu Toggle & Accessibility
     ========================================================================== */
  const mobileMenuToggle = document.querySelector('#mobile-menu-toggle, button[aria-label="Toggle menu"]');
  const mobileMenuCloseBtn = document.getElementById('mobile-nav-close-btn');
  const mobileMenu = document.getElementById('mobile-nav-menu');
  let mobileMenuOpen = false;

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenuOpen = true;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Animate hamburger to X & update a11y
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileMenuToggle.setAttribute('aria-label', 'Close menu');
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
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
      const bars = mobileMenuToggle.querySelectorAll('span');
      if (bars.length >= 2) {
        bars[0].style.transform = 'none';
        bars[0].style.width = '22px';
        bars[1].style.transform = 'none';
        bars[1].style.width = '16px';
        bars[1].style.opacity = '0.8';
      }
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuCloseBtn) {
    mobileMenuCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  // Close mobile menu on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      closeMobileMenu();
    }
  });

  // Close mobile menu on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && mobileMenuOpen) {
      closeMobileMenu();
    }
  });

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
        <div class="case-study-header">
          <div class="case-study-top-meta">
            <div class="case-study-tag-group">
              <span class="case-study-number">${project.number}</span>
              <span class="case-study-type">${project.type}</span>
            </div>
            <span class="case-study-badge">Case Study</span>
          </div>
          <h2 class="case-study-title">${project.title}</h2>
          <p class="case-study-summary">${project.summary}</p>
        </div>

        <!-- 2. LARGE PROJECT PREVIEW -->
        <div class="case-study-preview">
          <picture>
            <source srcset="${project.imageWebp}" type="image/webp">
            <img src="${project.image}" alt="${project.title} — Case Study Preview" loading="lazy" />
          </picture>
        </div>

        <!-- 3. PROJECT OVERVIEW -->
        <div class="case-study-section">
          <h3 class="case-study-heading">01 / PROJECT OVERVIEW</h3>
          <p class="case-study-body">${project.overview}</p>
        </div>

        <!-- 4. ROLE + TOOLS -->
        <div class="case-study-meta-grid">
          <div class="case-study-meta-box">
            <span class="case-study-meta-label">ROLE</span>
            <p class="case-study-meta-value">${project.role}</p>
          </div>
          <div class="case-study-meta-box">
            <span class="case-study-meta-label">TOOLS / TECHNOLOGIES</span>
            <p class="case-study-meta-value">${project.tools}</p>
          </div>
        </div>

        <!-- 5. PROJECT OBJECTIVE -->
        <div class="case-study-section">
          <h3 class="case-study-heading">02 / PROJECT OBJECTIVE</h3>
          <p class="case-study-body">${project.objective}</p>
        </div>

        <!-- 6. DESIGN APPROACH -->
        <div class="case-study-section">
          <h3 class="case-study-heading">03 / DESIGN APPROACH</h3>
          <p class="case-study-body">${project.designApproach}</p>
        </div>

        <!-- 7. KEY FEATURES -->
        <div class="case-study-section">
          <h3 class="case-study-heading">04 / KEY FEATURES</h3>
          <div class="case-study-features-grid">
            ${project.keyFeatures.map((feat) => `
              <div class="case-study-feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${feat}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 8. RESPONSIVE DESIGN -->
        <div class="case-study-section">
          <h3 class="case-study-heading">05 / RESPONSIVE DESIGN</h3>
          <p class="case-study-body">${project.responsiveDesign}</p>
        </div>

        <!-- 9. PROJECT OUTCOME -->
        <div class="case-study-section">
          <h3 class="case-study-heading">06 / PROJECT OUTCOME</h3>
          <p class="case-study-body">${project.outcome}</p>
        </div>

        <!-- 10 & 11. ACTIONS (NEXT PROJECT + VISIT LIVE WEBSITE) -->
        <div class="case-study-actions">
          <button data-next-project="${project.nextId}" class="case-study-next-btn">
            <span>NEXT PROJECT (${project.nextTitle})</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="case-study-live-btn">
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
     10. Cinematic Dark Storm & Electric-Blue Lightning Atmosphere Controller
     - Master Reference: Dark Storm + Electric Blue Lightning + Deep Navy Atmosphere
     - Smooth slow breathing & gentle ambient glow pulse (Zero rapid flash / strobe)
     - Desktop Mouse Parallax for background depth (Website content does NOT move)
     - Auto-pausing on tab inactivity
     - Strict prefers-reduced-motion accessibility
     ========================================================================== */
  function initStormAtmosphere() {
    if (prefersReducedMotion) return;

    const bgImage = document.querySelector('.storm-bg-image') || document.querySelector('.lightning-base');
    const glowLayer = document.querySelector('.storm-bg-glow') || document.querySelector('.lightning-glow');
    const cloudsLayer = document.querySelector('.storm-bg-clouds') || document.querySelector('.lightning-clouds');

    let isTabActive = !document.hidden;
    let pulseTimeoutId = null;

    /* ------------------------------------------------------------------------
       A. Occasional Soft Atmospheric Glow Breathing Pulse (No Flash, No Strobe)
       ------------------------------------------------------------------------ */
    function triggerSoftGlowPulse() {
      if (!isTabActive || prefersReducedMotion || !glowLayer) {
        scheduleNextPulse();
        return;
      }

      // Smoothly pulse the ambient electric-blue glow without sudden flashes
      glowLayer.style.transition = 'opacity 1.8s ease-in-out';
      glowLayer.style.opacity = '0.70';

      setTimeout(() => {
        if (glowLayer) {
          glowLayer.style.transition = 'opacity 2.8s ease-in-out';
          glowLayer.style.opacity = '0.52';
        }
      }, 2000);

      scheduleNextPulse();
    }

    function scheduleNextPulse() {
      if (pulseTimeoutId) clearTimeout(pulseTimeoutId);
      // Gentle, occasional interval between 12s and 22s
      const nextDelay = 12000 + Math.random() * 10000;
      pulseTimeoutId = setTimeout(triggerSoftGlowPulse, nextDelay);
    }

    scheduleNextPulse();

    /* ------------------------------------------------------------------------
       B. Subtle Desktop Mouse Parallax (Website content does NOT move)
       ------------------------------------------------------------------------ */
    const isDesktopPointer = window.innerWidth >= 1024 && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (isDesktopPointer && bgImage) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let isTicking = false;

      window.addEventListener('mousemove', (e) => {
        if (!isTabActive) return;
        const normX = (e.clientX / window.innerWidth) - 0.5;
        const normY = (e.clientY / window.innerHeight) - 0.5;
        // Subtle shift: max 12px horizontal, 8px vertical
        targetX = normX * -12;
        targetY = normY * -8;

        if (!isTicking) {
          isTicking = true;
          requestAnimationFrame(updateParallax);
        }
      }, { passive: true });

      function updateParallax() {
        // Smooth lerp easing
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        bgImage.style.transform = `scale(1.03) translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
        if (glowLayer) {
          glowLayer.style.transform = `translate3d(${(currentX * 1.5).toFixed(2)}px, ${(currentY * 1.5).toFixed(2)}px, 0)`;
        }
        if (cloudsLayer) {
          cloudsLayer.style.transform = `translate3d(${(currentX * 0.8).toFixed(2)}px, ${(currentY * 0.8).toFixed(2)}px, 0)`;
        }

        if (Math.abs(targetX - currentX) > 0.04 || Math.abs(targetY - currentY) > 0.04) {
          requestAnimationFrame(updateParallax);
        } else {
          isTicking = false;
        }
      }
    }

    /* ------------------------------------------------------------------------
       C. Page Visibility Lifecycle
       ------------------------------------------------------------------------ */
    document.addEventListener('visibilitychange', () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        scheduleNextPulse();
      } else {
        if (pulseTimeoutId) clearTimeout(pulseTimeoutId);
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
    initStormAtmosphere();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
