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
     9. Project Details Exploration Modal
     ========================================================================== */
  const projectData = {
    'maynu-clinics': {
      title: 'MAYNU CLINICS',
      type: 'WEBSITE DESIGN',
      number: '01',
      color: '#c8ff3d',
      role: 'WEB DESIGN',
      tools: 'Figma · WordPress · Elementor',
      description: 'A modern, patient-first healthcare and clinic website designed for trust, clarity, and rapid appointment booking. Crafted with clean typographic hierarchy, custom iconography, and responsive layouts.',
      image: './images/maynu-clinics.jpg',
      imageWebp: './images/maynu-clinics.webp',
      liveUrl: 'https://maynuclinics.com/'
    },
    'onclick-digital': {
      title: 'ONCLICK DIGITAL',
      type: 'WEBSITE REDESIGN',
      number: '02',
      color: '#ff7657',
      role: 'WEB DESIGN',
      tools: 'Figma · WordPress · Elementor',
      description: 'Complete brand and website redesign for a full-service digital marketing agency. Focused on high-conversion landing page structures, bold modern aesthetics, and interactive case study presentations.',
      image: './images/onclick-digital.jpg',
      imageWebp: './images/onclick-digital.webp',
      liveUrl: 'https://onclickdigitalmarketing.com/'
    },
    'jbk-it': {
      title: 'JBK IT',
      type: 'WEBSITE REDESIGN',
      number: '03',
      color: '#c8ff3d',
      role: 'WEB DESIGN',
      tools: 'Figma · WordPress · Elementor',
      description: 'Corporate tech infrastructure & enterprise services website redesign. Emphasizing technical credibility, structured service catalogs, responsive design, and seamless customer inquiry workflows.',
      image: './images/jbk-it.jpg',
      imageWebp: './images/jbk-it.webp',
      liveUrl: 'https://jbkittechnologies.com/'
    },
    'smake': {
      title: 'SMAKE',
      type: 'E-COMMERCE WEBSITE',
      number: '04',
      color: '#ff7657',
      role: 'WEB DESIGN',
      tools: 'Figma · WordPress',
      description: 'A sleek, visual-first e-commerce shopping experience for fashion and merchandise. Featuring high-impact product showcases, intuitive checkout user flows, and mobile-optimized browsing.',
      image: './images/smake.jpg',
      imageWebp: './images/smake.webp',
      liveUrl: 'https://smake.in/'
    },
    'jbk-academy': {
      title: 'JBK ACADEMY — MARATHAHALLI',
      type: 'WEBSITE REDESIGN',
      number: '05',
      color: '#c8ff3d',
      role: 'WEB DESIGN',
      tools: 'Figma · WordPress · Elementor',
      description: 'Comprehensive digital portal for an educational academy in Marathahalli. Includes interactive course roadmaps, faculty showcases, student success stories, and enrollment call-to-actions.',
      image: './images/jbk-academy.jpg',
      imageWebp: './images/jbk-academy.webp',
      liveUrl: 'https://jbkacademy.in/marathahalli/'
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
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-baseline gap-3">
          <span class="text-xs font-mono tracking-[0.2em]" style="color: ${project.color}; font-weight: 700;">${project.number}</span>
          <span class="text-[10px] tracking-[0.2em] text-cream/40 font-mono uppercase">${project.type}</span>
        </div>
      </div>
      <h3 class="text-2xl md:text-4xl font-black tracking-[-0.03em] text-cream mb-4">${project.title}</h3>
      <div class="w-full rounded-lg overflow-hidden bg-graphite border border-white/10 mb-6">
        <picture>
          <source srcset="${project.imageWebp}" type="image/webp">
          <img src="${project.image}" alt="${project.title} — preview mockup" class="w-full h-auto aspect-[16/10] object-cover" />
        </picture>
      </div>
      <p class="text-sm md:text-base text-cream/70 leading-relaxed font-light mb-6">${project.description}</p>
      <div class="py-4 border-t border-b border-white/10 mb-6 flex flex-wrap gap-6 text-xs font-mono">
        <div><span class="text-cream/30 block mb-1">ROLE</span><span class="text-cream/80">${project.role}</span></div>
        <div><span class="text-cream/30 block mb-1">TOOLS</span><span class="text-cream/80">${project.tools}</span></div>
      </div>
      <div class="flex items-center justify-end gap-4">
        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-[0.2em] uppercase font-bold transition-all duration-300 hover:opacity-90" style="background: ${project.color}; color: #0b0b0d;">
          <span>Visit Live Website</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
        </a>
      </div>
    `;

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
        const startX = width * (0.2 + Math.random() * 0.4);
        const startY = height * (0.1 + Math.random() * 0.3);
        const segments = [];
        let curX = startX;
        let curY = startY;
        const length = 4 + Math.floor(Math.random() * 4);

        for (let i = 0; i < length; i++) {
          curX += (Math.random() - 0.4) * 35;
          curY += 15 + Math.random() * 25;
          segments.push({ x: curX, y: curY });
        }

        activeArc = {
          startX,
          startY,
          segments,
          life: 8,
          maxLife: 8,
          opacity: 0.65 + Math.random() * 0.25
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
          ctx.fillStyle = `rgba(22, 139, 255, ${currentAlpha * 0.5})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(85, 183, 255, 0.6)';
          ctx.fill();
        }

        // Render micro electric arc if active (crisp Thor lightning streak)
        if (activeArc) {
          ctx.save();
          const progress = activeArc.life / activeArc.maxLife;
          ctx.strokeStyle = `rgba(22, 139, 255, ${activeArc.opacity * progress})`;
          ctx.lineWidth = 1.3;
          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(85, 183, 255, 0.95)';
          ctx.beginPath();
          ctx.moveTo(activeArc.startX, activeArc.startY);
          for (let i = 0; i < activeArc.segments.length; i++) {
            ctx.lineTo(activeArc.segments[i].x, activeArc.segments[i].y);
          }
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
