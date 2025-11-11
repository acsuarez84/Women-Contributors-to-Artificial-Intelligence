/**
 * navigation.js - Navigation and routing functionality
 * Handles smooth scrolling, active link highlighting, and mobile menu
 */

class Navigation {
  constructor() {
    this.init();
  }

  init() {
    this.handleActiveLinks();
    this.setupSmoothScrolling();
    this.setupMobileMenu();
    this.handleSkipLink();
  }

  /**
   * Highlight active navigation link based on current page
   */
  handleActiveLinks() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      // Remove active class from all
      link.classList.remove('active');
      link.removeAttribute('aria-current');

      // Add active class to current page
      if (linkPath === currentPath ||
          (currentPath.includes(linkPath) && linkPath !== '/')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /**
   * Set up smooth scrolling for anchor links
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');

        // Skip if it's just "#"
        if (targetId === '#' || !targetId) return;

        e.preventDefault();

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }

          // Focus the target for accessibility
          targetElement.focus({ preventScroll: true });
          if (document.activeElement !== targetElement) {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
          }
        }
      });
    });
  }

  /**
   * Handle mobile menu toggle (if needed)
   */
  setupMobileMenu() {
    // Check if there's a mobile menu button
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');

        // Announce to screen readers
        window.a11y.announce(
          isExpanded ? 'Menu closed' : 'Menu opened'
        );
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
          if (navMenu.classList.contains('active')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
          }
        }
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
          menuToggle.setAttribute('aria-expanded', 'false');
          navMenu.classList.remove('active');
          menuToggle.focus();
        }
      });
    }
  }

  /**
   * Handle skip to main content link
   */
  handleSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  /**
   * Navigate to a different page (with state management if needed)
   */
  navigateTo(url, state = {}) {
    if (history.pushState) {
      history.pushState(state, '', url);
      // Trigger any page-specific initialization
      this.handleActiveLinks();
    } else {
      window.location.href = url;
    }
  }
}

// Breadcrumb Navigation (if needed for complex sites)
class Breadcrumbs {
  constructor(containerSelector = '.breadcrumbs') {
    this.container = document.querySelector(containerSelector);
    if (this.container) {
      this.generate();
    }
  }

  generate() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);

    if (segments.length === 0) return; // Home page

    const breadcrumbs = [
      { name: 'Home', url: '/' }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += '/' + segment;

      // Convert segment to readable name
      const name = this.formatSegmentName(segment);

      breadcrumbs.push({
        name: name,
        url: currentPath,
        isCurrent: index === segments.length - 1
      });
    });

    this.render(breadcrumbs);
  }

  formatSegmentName(segment) {
    // Remove file extensions
    segment = segment.replace(/\.[^/.]+$/, '');

    // Convert hyphens/underscores to spaces and capitalize
    return segment
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  render(breadcrumbs) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Breadcrumb');

    const ol = document.createElement('ol');
    ol.className = 'breadcrumb-list';

    breadcrumbs.forEach((crumb, index) => {
      const li = document.createElement('li');
      li.className = 'breadcrumb-item';

      if (crumb.isCurrent) {
        li.setAttribute('aria-current', 'page');
        li.textContent = crumb.name;
      } else {
        const link = document.createElement('a');
        link.href = crumb.url;
        link.textContent = crumb.name;
        li.appendChild(link);
      }

      ol.appendChild(li);

      // Add separator (except for last item)
      if (index < breadcrumbs.length - 1) {
        const separator = document.createElement('span');
        separator.className = 'breadcrumb-separator';
        separator.setAttribute('aria-hidden', 'true');
        separator.textContent = ' / ';
        ol.appendChild(separator);
      }
    });

    nav.appendChild(ol);
    this.container.appendChild(nav);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.navigation = new Navigation();

  // Initialize breadcrumbs if container exists
  if (document.querySelector('.breadcrumbs')) {
    new Breadcrumbs();
  }
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Navigation, Breadcrumbs };
}
