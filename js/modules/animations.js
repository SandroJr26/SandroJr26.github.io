/**
 * Animations Module
 * Handles scroll animations, intersection observer, and visual effects
 */

class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    this.init();
  }

  init() {
    // Check if user prefers reduced motion
    this.respectsReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!this.respectsReducedMotion) {
      this.initScrollAnimations();
      this.initSkillAnimations();
      this.initHoverEffects();
    }

    this.initSmoothScrolling();
  }

  initScrollAnimations() {
    // Create intersection observer for scroll animations
    this.scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");

          // Add staggered animation for child elements
          const children = entry.target.querySelectorAll(".stagger-child");
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("animate-in");
            }, index * 100);
          });
        }
      });
    }, this.observerOptions);

    // Observe elements with scroll-animate class
    const animateElements = document.querySelectorAll(".scroll-animate");
    animateElements.forEach((el) => {
      this.scrollObserver.observe(el);
    });

    // Auto-add scroll-animate class to cards and sections
    const autoAnimateElements = document.querySelectorAll(
      ".card, .skill-badge, .project-card"
    );
    autoAnimateElements.forEach((el) => {
      el.classList.add("scroll-animate");
      this.scrollObserver.observe(el);
    });
  }

  initSkillAnimations() {
    // Animate skill badges with staggered effect
    const skillBadges = document.querySelectorAll(".skill-badge");

    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const badges = entry.target.querySelectorAll(".skill-badge");
          badges.forEach((badge, index) => {
            setTimeout(() => {
              badge.style.opacity = "1";
              badge.style.transform = "translateY(0)";
            }, index * 100);
          });

          skillObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    const skillsSection = document.querySelector(".skills");
    if (skillsSection) {
      // Initially hide skill badges
      skillBadges.forEach((badge) => {
        badge.style.opacity = "0";
        badge.style.transform = "translateY(20px)";
        badge.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      });

      skillObserver.observe(skillsSection);
    }
  }

  initHoverEffects() {
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll(
      ".card, .btn, .contact-link, .project-card"
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (!this.respectsReducedMotion) {
          el.style.transform = "translateY(-2px)";
        }
      });

      el.addEventListener("mouseleave", () => {
        if (!this.respectsReducedMotion) {
          el.style.transform = "translateY(0)";
        }
      });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll(".btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", this.createRippleEffect.bind(this));
    });
  }

  createRippleEffect(e) {
    if (this.respectsReducedMotion) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  initSmoothScrolling() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");

        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();

          const headerHeight =
            document.querySelector(".header")?.offsetHeight || 0;
          const targetPosition = target.offsetTop - headerHeight - 20;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });

          // Update URL without jumping
          history.pushState(null, null, href);

          // Focus management for accessibility
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
    });
  }

  // Utility method to animate elements
  animateElement(element, animation, duration = 300) {
    if (this.respectsReducedMotion) return Promise.resolve();

    return new Promise((resolve) => {
      element.style.animation = `${animation} ${duration}ms ease-out`;

      const handleAnimationEnd = () => {
        element.style.animation = "";
        element.removeEventListener("animationend", handleAnimationEnd);
        resolve();
      };

      element.addEventListener("animationend", handleAnimationEnd);
    });
  }

  // Method to trigger entrance animations manually
  triggerEntranceAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("fade-in");
      }, index * 100);
    });
  }

  // Parallax effect for hero section
  initParallaxEffect() {
    if (this.respectsReducedMotion) return;

    const heroPhoto = document.querySelector(".hero__photo");
    if (!heroPhoto) return;

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      heroPhoto.style.transform = `translateY(${rate}px) scale(1.05)`;
    });
  }

  // Cleanup method
  destroy() {
    if (this.scrollObserver) {
      this.scrollObserver.disconnect();
    }
  }
}

// CSS for animations (injected dynamically)
const animationStyles = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .animate-slide-left {
        animation: slideInLeft 0.6s ease-out forwards;
    }
    
    .animate-slide-right {
        animation: slideInRight 0.6s ease-out forwards;
    }
`;

// Inject animation styles
const styleSheet = document.createElement("style");
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Auto-initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.animationManager = new AnimationManager();
});

// Export for module usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = AnimationManager;
}
