/**
 * Theme Toggle Functionality
 * Handles dark/light mode switching with localStorage persistence
 */

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.themeToggleMobile = document.getElementById('theme-toggle-mobile');
    this.currentTheme = this.getStoredTheme();
    this.init();
  }

  init() {
    // Apply stored theme on page load
    this.applyTheme(this.currentTheme);

    // Add event listener to toggle button
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Listen for system theme changes
    this.watchSystemTheme();
  }

  getStoredTheme() {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }

    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);

    // Add a subtle animation feedback to both toggle buttons
    const buttons = [this.themeToggle, this.themeToggleMobile].filter(Boolean);
    buttons.forEach(button => {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    });
  }

  init() {
    // Apply stored theme on page load
    this.applyTheme(this.currentTheme);

    // Add event listeners to both desktop and mobile toggle buttons
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent navigation
        this.toggleTheme();
      });
    }

    if (this.themeToggleMobile) {
      this.themeToggleMobile.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent navigation
        this.toggleTheme();
      });
    }

    // Listen for system theme changes
    this.watchSystemTheme();
  }

  watchSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
          const newTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(newTheme);
        }
      });
    }
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
  });
} else {
  new ThemeManager();
}