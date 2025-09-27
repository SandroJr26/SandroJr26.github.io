/**
 * Theme Management Module
 * Handles dark/light theme switching with localStorage persistence
 */

class ThemeManager {
  constructor() {
    this.themeToggle = document.getElementById("theme-toggle");
    this.currentTheme = this.getStoredTheme() || this.getSystemTheme();

    this.init();
  }

  init() {
    // Apply initial theme
    this.applyTheme(this.currentTheme);

    // Add event listener to toggle button
    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => this.toggleTheme());

      // Add keyboard support
      this.themeToggle.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        if (!this.getStoredTheme()) {
          this.applyTheme(e.matches ? "dark" : "light");
        }
      });
    }

    // Update aria-label based on current theme
    this.updateToggleLabel();
  }

  getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return "dark";
    }
    return "light";
  }

  getStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (error) {
      console.warn("localStorage not available:", error);
      return null;
    }
  }

  storeTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Could not store theme preference:", error);
    }
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme);

    // Store preference
    this.storeTheme(theme);

    // Update toggle button label
    this.updateToggleLabel();

    // Dispatch custom event for other components
    document.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme },
      })
    );
  }

  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }

    const colors = {
      light: "#ffffff",
      dark: "#0f172a",
    };

    metaThemeColor.content = colors[theme] || colors.light;
  }

  updateToggleLabel() {
    if (this.themeToggle) {
      const label =
        this.currentTheme === "dark"
          ? "Ativar modo claro"
          : "Ativar modo escuro";
      this.themeToggle.setAttribute("aria-label", label);
    }
  }

  toggleTheme() {
    const newTheme = this.currentTheme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);

    // Add a subtle animation to the toggle button
    if (this.themeToggle) {
      this.themeToggle.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.themeToggle.style.transform = "scale(1)";
      }, 150);
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  setTheme(theme) {
    if (theme === "dark" || theme === "light") {
      this.applyTheme(theme);
    }
  }
}

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = ThemeManager;
}
