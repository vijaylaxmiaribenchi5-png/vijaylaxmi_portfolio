/**
 * PORTFOLIO CLIENT LOGIC
 * Handles night mode theme toggle, browser theme detection (CSS media queries),
 * pixel art hero background switcher, mobile navigation, scroll-reveal, 
 * and active nav highlighting.
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. NIGHT MODE / MEDIA QUERY BROWSER THEME DETECTION & TOGGLE
  // -------------------------------------------------------------------------
  const headerThemeToggleBtn = document.getElementById('theme-toggle');
  const heroThemeToggleBtn = document.getElementById('hero-theme-toggle');
  const themeStatusText = document.getElementById('theme-status-text');
  const heroThemeIcon = document.getElementById('hero-theme-icon');
  const heroThemeBtnLabel = document.getElementById('hero-theme-btn-label');
  const rootElement = document.documentElement;

  // Media query for user's default browser / OS theme preference
  const browserDarkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function getEffectiveTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return { theme: savedTheme, isAuto: false };
    }
    // Detect from browser media query
    return {
      theme: browserDarkMediaQuery.matches ? 'dark' : 'light',
      isAuto: true
    };
  }

  function updateThemeUI(theme, isAuto) {
    rootElement.setAttribute('data-theme', theme);

    // Update Header Button
    if (headerThemeToggleBtn) {
      headerThemeToggleBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      headerThemeToggleBtn.setAttribute(
        'title',
        theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night/Dark Mode'
      );
    }

    // Update Hero Widget Sensor Elements
    if (themeStatusText) {
      themeStatusText.textContent = isAuto
        ? `AUTO (${theme.toUpperCase()})`
        : `MANUAL (${theme.toUpperCase()})`;
    }

    if (heroThemeIcon && heroThemeBtnLabel) {
      if (theme === 'dark') {
        heroThemeIcon.textContent = '🌙';
        heroThemeBtnLabel.textContent = 'NIGHT MODE';
      } else {
        heroThemeIcon.textContent = '☀️';
        heroThemeBtnLabel.textContent = 'DAY MODE';
      }
    }
  }

  function applyTheme(theme, isAuto = false) {
    if (!isAuto) {
      localStorage.setItem('portfolio-theme', theme);
    } else {
      localStorage.removeItem('portfolio-theme');
    }
    updateThemeUI(theme, isAuto);
  }

  // Initialize theme based on saved preference or browser media query
  const initial = getEffectiveTheme();
  updateThemeUI(initial.theme, initial.isAuto);

  // Dynamic listener for browser theme changes (e.g., OS switches to dark/light mode)
  browserDarkMediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set an explicit manual override
    const saved = localStorage.getItem('portfolio-theme');
    if (!saved) {
      const newTheme = e.matches ? 'dark' : 'light';
      updateThemeUI(newTheme, true);
    }
  });

  // Toggle button click handler (shared by header and hero buttons)
  function toggleThemeAction() {
    const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, false);
  }

  if (headerThemeToggleBtn) {
    headerThemeToggleBtn.addEventListener('click', toggleThemeAction);
  }

  if (heroThemeToggleBtn) {
    heroThemeToggleBtn.addEventListener('click', toggleThemeAction);
  }

  // -------------------------------------------------------------------------
  // 2. HERO BACKGROUND IMAGE SWITCHER
  // Switches between the retro Pixel Art City and the Provided Portrait Image
  // -------------------------------------------------------------------------
  const bgToggleBtn = document.getElementById('pixel-bg-toggle');
  const bgLabel = document.getElementById('pixel-bg-label');
  const heroSection = document.getElementById('hero');

  if (bgToggleBtn && heroSection) {
    bgToggleBtn.addEventListener('click', () => {
      const isPortrait = heroSection.classList.toggle('bg-portrait');
      if (bgLabel) {
        bgLabel.textContent = isPortrait ? 'PORTRAIT PHOTO' : 'PIXEL CITY';
      }
      bgToggleBtn.setAttribute(
        'title',
        isPortrait ? 'Switch to Pixel City background' : 'Switch to Portrait photo background'
      );
    });
  }

  // -------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER TOGGLE
  // -------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');

  function closeMobileNav() {
    if (mainNav && mobileToggleBtn) {
      mainNav.classList.remove('active');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  function openMobileNav() {
    if (mainNav && mobileToggleBtn) {
      mainNav.classList.add('active');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // Prevent scroll-through on mobile
    }
  }

  if (mobileToggleBtn && mainNav) {
    mobileToggleBtn.addEventListener('click', () => {
      const isExpanded = mobileToggleBtn.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close nav when any nav link is clicked
    const navLinks = mainNav.querySelectorAll('.nav-item');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }

  // Close mobile nav when clicking outside it
  document.addEventListener('click', (e) => {
    if (
      mainNav &&
      mainNav.classList.contains('active') &&
      !mainNav.contains(e.target) &&
      !mobileToggleBtn.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  // Close mobile nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  // -------------------------------------------------------------------------
  // 4. DYNAMIC FOOTER YEAR
  // -------------------------------------------------------------------------
  const yearPlaceholder = document.getElementById('year-placeholder');
  if (yearPlaceholder) {
    yearPlaceholder.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------------------
  // 5. SCROLL-REVEAL ANIMATION (IntersectionObserver)
  // Adds .reveal, .reveal-left, .reveal-right classes to sections/cards
  // and animates them into view with a stagger effect.
  // -------------------------------------------------------------------------

  // Tag elements for reveal animations
  function tagRevealElements() {
    // Section headings
    document.querySelectorAll('.section-title-wrap').forEach((el) => {
      el.classList.add('reveal');
    });

    // About section columns
    const aboutText = document.querySelector('.about-text');
    const aboutImg = document.querySelector('.about-image-column');
    if (aboutText) aboutText.classList.add('reveal-left');
    if (aboutImg) aboutImg.classList.add('reveal-right');

    // Skill cards
    document.querySelectorAll('.skill-group-card').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`reveal-delay-${(i % 4) + 1}`);
    });

    // Timeline cards
    document.querySelectorAll('.timeline-card').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`reveal-delay-${(i % 4) + 1}`);
    });

    // Project items
    document.querySelectorAll('.project-item').forEach((el, i) => {
      el.classList.add('reveal');
      el.classList.add(`reveal-delay-${(i % 4) + 1}`);
    });

    // Contact section
    const contactBox = document.querySelector('.contact-box');
    if (contactBox) contactBox.classList.add('reveal');

    // Hero editorial content (left/right columns)
    const editorialContent = document.querySelector('.editorial-content-column');
    const editorialVisual = document.querySelector('.editorial-visual-column');
    // Hero is typically visible on load — skip reveal for instant impact
    // But still add reveal for visual column for a nice entry
    if (editorialVisual) editorialVisual.classList.add('reveal-right');
  }

  tagRevealElements();

  // IntersectionObserver to trigger .visible class
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  // Observe all animated elements
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => {
    revealObserver.observe(el);
  });

  // -------------------------------------------------------------------------
  // 6. ACTIVE NAV LINK HIGHLIGHTING (scroll-spy)
  // Highlights the nav item corresponding to the visible section.
  // -------------------------------------------------------------------------
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          navItems.forEach((item) => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${sectionId}`) {
              item.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // -------------------------------------------------------------------------
  // 7. HEADER SHADOW ON SCROLL
  // Adds a subtle elevated shadow to the header as the user scrolls down.
  // -------------------------------------------------------------------------
  const siteHeader = document.getElementById('header');
  window.addEventListener(
    'scroll',
    () => {
      if (siteHeader) {
        if (window.scrollY > 20) {
          siteHeader.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
        } else {
          siteHeader.style.boxShadow = 'none';
        }
      }
    },
    { passive: true }
  );
});

