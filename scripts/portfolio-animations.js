/**
 * Sri Venu Puduvayila — Creative Developer Portfolio Animations Engine
 * Features:
 * - Smooth momentum inertia scroll lerp on desktop (native on mobile)
 * - IntersectionObserver-based scroll-triggered reveals with cinematic easing
 * - GPU-accelerated scroll progress bar
 * - Multi-layer gentle parallax for background grid & floating typography
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
     2. Smooth Inertia Momentum Scroll (Desktop Only)
     ========================================================================== */
  let isTouchDevice = false;
  try {
    isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  } catch (e) {
    isTouchDevice = false;
  }

  // Smooth scroll controller
  class MomentumScroller {
    constructor() {
      this.targetY = window.scrollY;
      this.currentY = window.scrollY;
      this.ease = 0.09;
      this.isScrolling = false;
      this.rafId = null;

      // Only enable inertia scroll on desktop without reduced motion
      if (!isTouchDevice && !prefersReducedMotion && window.innerWidth >= 1024) {
        this.init();
      }
    }

    init() {
      // Sync on external scroll (e.g. scrollbar drag or anchor jump)
      window.addEventListener('scroll', () => {
        if (!this.isScrolling) {
          this.targetY = window.scrollY;
          this.currentY = window.scrollY;
        }
      }, { passive: true });

      // Intercept wheel events
      window.addEventListener('wheel', (e) => {
        // Allow modal scrolling
        if (e.target.closest('#project-modal') || e.target.closest('.side-quests-container')) {
          return;
        }

        e.preventDefault();
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        this.targetY += e.deltaY * 0.9;
        this.targetY = Math.max(0, Math.min(this.targetY, maxScroll));

        if (!this.isScrolling) {
          this.isScrolling = true;
          this.loop();
        }
      }, { passive: false });
    }

    loop() {
      const diff = this.targetY - this.currentY;
      this.currentY += diff * this.ease;

      window.scrollTo(0, Math.round(this.currentY));

      if (Math.abs(diff) > 0.5) {
        this.rafId = requestAnimationFrame(() => this.loop());
      } else {
        this.currentY = this.targetY;
        this.isScrolling = false;
      }
    }

    scrollTo(targetY) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      this.targetY = Math.max(0, Math.min(targetY, maxScroll));
      if (!isTouchDevice && !prefersReducedMotion && window.innerWidth >= 1024) {
        if (!this.isScrolling) {
          this.isScrolling = true;
          this.loop();
        }
      } else {
        window.scrollTo({
          top: this.targetY,
          behavior: 'smooth'
        });
      }
    }
  }

  const scroller = new MomentumScroller();

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
      rootMargin: '-6% 0px -4% 0px',
      threshold: 0.08
    });

    revealElements.forEach((el) => {
      // Check if already well within viewport on initial load
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        el.classList.add('is-revealed');
      } else {
        revealObserver.observe(el);
      }
    });
  }

  /* ==========================================================================
     4. Gentle Parallax on Background & Decorative Elements
     ========================================================================== */
  const heroGrid = document.querySelector('.hero-bg-grid');
  const parallaxNumbers = document.querySelectorAll('.project-badge-num');

  function updateParallax() {
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Subtle hero background grid drift
    if (heroGrid && scrollY < window.innerHeight * 1.5) {
      heroGrid.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
    }

    // Floating project numerals depth
    parallaxNumbers.forEach((numEl) => {
      const rect = numEl.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (rect.top - window.innerHeight / 2) * 0.08;
        numEl.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    });
  }

  /* ==========================================================================
     5. Unified RequestAnimationFrame Scroll Loop
     ========================================================================== */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateProgressBar();
        if (!prefersReducedMotion) {
          updateParallax();
        }
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ==========================================================================
     6. Navigation & Scroll Spy
     ========================================================================== */
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('[data-nav]');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = ['work', 'journey', 'about', 'contact'];

  function updateActiveNav() {
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Navbar background blur enhancement on scroll
    if (nav) {
      if (scrollY > 50) {
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
        if (rect.top <= window.innerHeight * 0.4) {
          currentSection = sections[i];
          break;
        }
      }
    }

    navLinks.forEach((btn) => {
      const target = btn.getAttribute('data-nav');
      if (target === currentSection) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });

    mobileNavLinks.forEach((link) => {
      const target = link.getAttribute('data-nav');
      if (target === currentSection) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  // Smooth scroll handler for nav buttons and links
  function handleNavClick(e) {
    const btn = e.currentTarget;
    const targetId = btn.getAttribute('data-nav');
    if (!targetId) return;

    e.preventDefault();

    if (targetId === 'top') {
      scroller.scrollTo(0);
    } else {
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const navHeight = nav ? nav.offsetHeight : 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - (navHeight + 20);
        scroller.scrollTo(targetPos);
      }
    }

    // Close mobile menu if open
    closeMobileMenu();
  }

  navLinks.forEach((btn) => btn.addEventListener('click', handleNavClick));
  mobileNavLinks.forEach((link) => link.addEventListener('click', handleNavClick));

  // SV Logo button click -> scroll to top
  const logoButtons = document.querySelectorAll('button[data-nav="top"], button[data-logo]');
  logoButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      scroller.scrollTo(0);
    });
  });

  // "Explore Work" button in hero -> scroll to work
  const exploreWorkBtns = document.querySelectorAll('button[data-explore="work"]');
  exploreWorkBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const workSection = document.getElementById('work');
      if (workSection) {
        const navHeight = nav ? nav.offsetHeight : 80;
        const targetPos = workSection.getBoundingClientRect().top + window.pageYOffset - (navHeight + 10);
        scroller.scrollTo(targetPos);
      }
    });
  });

  // Hero vertical "SCROLL" button click -> scroll down
  const heroScrollBtn = document.querySelector('.hero-scroll-btn');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scroller.scrollTo(window.innerHeight * 0.9);
    });
  }

  /* ==========================================================================
     7. Mobile Navigation Menu Toggle
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
     8. Interactive Accordion: "I DESIGN / I BUILD / I EXPERIMENT"
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
     9. Interactive Draggable Side Quests Carousel
     ========================================================================== */
  const sideQuestsContainer = document.querySelector('.side-quests-container');
  if (sideQuestsContainer) {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    sideQuestsContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      sideQuestsContainer.classList.add('is-dragging');
      startX = e.pageX - sideQuestsContainer.offsetLeft;
      scrollLeft = sideQuestsContainer.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        sideQuestsContainer.classList.remove('is-dragging');
      }
    });

    sideQuestsContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - sideQuestsContainer.offsetLeft;
      const walk = (x - startX) * 1.5; // Drag speed multiplier
      sideQuestsContainer.scrollLeft = scrollLeft - walk;
    });
  }

  /* ==========================================================================
     10. Project Details Exploration Modal
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

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('is-open')) {
        closeProjectModal();
      }
      if (mobileMenuOpen) {
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
     11. Initialize on DOM Ready
     ========================================================================== */
  function init() {
    updateProgressBar();
    initScrollReveals();
    updateActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
