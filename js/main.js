/**
 * main.js - Core application logic
 * Handles theme toggle, initialization, and global utilities
 */

// Theme Management
class ThemeManager {
  constructor() {
    this.themeKey = 'site-theme';
    this.theme = this.loadTheme();
    this.init();
  }

  init() {
    // Apply saved theme or system preference
    this.applyTheme(this.theme);

    // Set up theme toggle button
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleTheme());
      this.updateToggleIcon();
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.themeKey)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  loadTheme() {
    // Check localStorage first
    const saved = localStorage.getItem(this.themeKey);
    if (saved) return saved;

    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.themeKey, theme);
    this.updateToggleIcon();
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
  }

  updateToggleIcon() {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = this.theme === 'light' ? '🌙' : '☀️';
    }

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label',
        this.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
  }
}

// Utility Functions
const utils = {
  /**
   * Fetch JSON data with error handling
   */
  async fetchJSON(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  },

  /**
   * Debounce function for search/filter inputs
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Format year range for display
   */
  formatYearRange(birthYear, deathYear) {
    if (deathYear) {
      return `${birthYear}–${deathYear}`;
    }
    return `${birthYear}–present`;
  },

  /**
   * Truncate text with ellipsis
   */
  truncate(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  },

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  },

  /**
   * Show loading indicator
   */
  showLoading(container) {
    container.innerHTML = `
      <div class="loading-message">
        <div class="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    `;
  },

  /**
   * Show error message
   */
  showError(container, message = 'An error occurred loading this content.') {
    container.innerHTML = `
      <div class="error-message">
        <p>${this.sanitizeHTML(message)}</p>
      </div>
    `;
  },

  /**
   * Smooth scroll to element
   */
  scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

// Accessibility Helpers
const a11y = {
  /**
   * Trap focus within a modal/dialog
   */
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }

      // Close on Escape
      if (e.key === 'Escape') {
        const closeBtn = element.querySelector('.close-panel, .close-btn');
        if (closeBtn) closeBtn.click();
      }
    });

    // Focus first element
    if (firstFocusable) firstFocusable.focus();
  },

  /**
   * Announce message to screen readers
   */
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.className = 'sr-only';
    announcer.textContent = message;

    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  window.themeManager = new ThemeManager();

  // Make utilities globally available
  window.utils = utils;
  window.a11y = a11y;

  console.log('Site initialized successfully');
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ThemeManager, utils, a11y };
}
