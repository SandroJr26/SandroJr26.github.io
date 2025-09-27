/**
 * Main Application Entry Point
 * Coordinates all modules and handles global functionality
 */

class PortfolioApp {
  constructor() {
    this.isLoaded = false;
    this.components = {};

    this.init();
  }

  init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.onDOMLoaded());
    } else {
      this.onDOMLoaded();
    }
  }

  onDOMLoaded() {
    console.log("Portfolio app initializing...");

    // Initialize core functionality
    this.initAccessibility();
    this.initPerformanceOptimizations();
    this.initErrorHandling();
    this.initAnalytics();

    // Mark as loaded
    this.isLoaded = true;
    document.body.classList.add("app-loaded");

    console.log("Portfolio app initialized successfully");
  }

  initAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector(".skip-link");
    if (skipLink) {
      skipLink.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute("href"));
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus();
          target.addEventListener(
            "blur",
            () => {
              target.removeAttribute("tabindex");
            },
            { once: true }
          );
        }
      });
    }

    // Improve focus visibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        document.body.classList.add("keyboard-navigation");
      }
    });

    document.addEventListener("mousedown", () => {
      document.body.classList.remove("keyboard-navigation");
    });

    // Announce theme changes to screen readers
    document.addEventListener("themeChanged", (e) => {
      this.announceToScreenReader(
        `Tema alterado para modo ${
          e.detail.theme === "dark" ? "escuro" : "claro"
        }`
      );
    });
  }

  initPerformanceOptimizations() {
    // Lazy load images
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll("img[data-src]").forEach((img) => {
        imageObserver.observe(img);
      });
    }

    // Preload critical resources
    this.preloadCriticalResources();

    // Monitor performance
    this.monitorPerformance();
  }

  preloadCriticalResources() {
    // Preload hero image
    const heroImg = document.querySelector(".hero__photo");
    if (heroImg && heroImg.src) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = heroImg.src;
      document.head.appendChild(link);
    }

    // Preload fonts
    const fontPreloads = [
      "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
    ];

    fontPreloads.forEach((fontUrl) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "font";
      link.type = "font/woff2";
      link.crossOrigin = "anonymous";
      link.href = fontUrl;
      document.head.appendChild(link);
    });
  }

  monitorPerformance() {
    // Monitor Core Web Vitals
    if ("web-vital" in window) {
      // This would require the web-vitals library
      // For now, we'll use basic performance monitoring
    }

    // Basic performance logging
    window.addEventListener("load", () => {
      const perfData = performance.getEntriesByType("navigation")[0];
      console.log(
        "Page load time:",
        perfData.loadEventEnd - perfData.fetchStart,
        "ms"
      );
    });
  }

  initErrorHandling() {
    // Global error handler
    window.addEventListener("error", (e) => {
      console.error("Global error:", e.error);
      this.handleError(e.error);
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (e) => {
      console.error("Unhandled promise rejection:", e.reason);
      this.handleError(e.reason);
    });
  }

  handleError(error) {
    // In a production app, you might want to send errors to a logging service
    console.error("Error handled by app:", error);

    // Show user-friendly error message if needed
    // this.showErrorMessage('Algo deu errado. Por favor, recarregue a página.');
  }

  initAnalytics() {
    // Basic analytics tracking
    this.trackPageView();
    this.trackUserInteractions();
  }

  trackPageView() {
    // Track page view (replace with your analytics service)
    console.log("Page view tracked:", window.location.pathname);
  }

  trackUserInteractions() {
    // Track button clicks
    document.addEventListener("click", (e) => {
      if (e.target.matches(".btn, .contact-link, .nav__link")) {
        const elementText = e.target.textContent.trim();
        const elementType = e.target.className.split(" ")[0];
        console.log("User interaction:", elementType, elementText);
      }
    });

    // Track theme changes
    document.addEventListener("themeChanged", (e) => {
      console.log("Theme changed to:", e.detail.theme);
    });
  }

  // Utility methods
  announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "polite");
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.setAttribute("role", "alert");

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("notification--show");
    }, 100);

    setTimeout(() => {
      notification.classList.remove("notification--show");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Method to register components
  registerComponent(name, component) {
    this.components[name] = component;
  }

  // Method to get registered components
  getComponent(name) {
    return this.components[name];
  }

  // Method to check if app is loaded
  isAppLoaded() {
    return this.isLoaded;
  }
}

// CSS for notifications and app states
const appStyles = `
    .app-loaded {
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
    }
    
    .keyboard-navigation *:focus {
        outline: 2px solid var(--color-primary) !important;
        outline-offset: 2px !important;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 300px;
    }
    
    .notification--show {
        transform: translateX(0);
    }
    
    .notification--info {
        background: var(--color-primary);
    }
    
    .notification--success {
        background: #059669;
    }
    
    .notification--error {
        background: #dc2626;
    }
    
    .notification--warning {
        background: #d97706;
    }
`;

// Inject app styles
const appStyleSheet = document.createElement("style");
appStyleSheet.textContent = appStyles;
document.head.appendChild(appStyleSheet);

// Initialize the app
window.portfolioApp = new PortfolioApp();

// Make app globally available
window.app = window.portfolioApp;
