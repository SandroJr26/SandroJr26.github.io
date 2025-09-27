/**
 * Navbar Component
 * Handles navigation behavior, scroll effects, and mobile menu
 */

class NavbarComponent {
    constructor() {
        this.header = document.querySelector('.header');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.lastScrollY = window.scrollY;
        this.scrollThreshold = 100;
        
        this.init();
    }
    
    init() {
        if (!this.header) return;
        
        this.initScrollEffects();
        this.initActiveNavigation();
        this.initKeyboardNavigation();
    }
    
    initScrollEffects() {
        let ticking = false;
        
        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class for styling
            if (currentScrollY > 50) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll (optional)
            if (currentScrollY > this.scrollThreshold) {
                if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
                    // Scrolling down - hide header
                    this.header.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up - show header
                    this.header.style.transform = 'translateY(0)';
                }
            }
            
            this.lastScrollY = currentScrollY;
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
        
        // Initial call
        updateHeader();
    }
    
    initActiveNavigation() {
        // Get all sections that have an ID
        const sections = document.querySelectorAll('section[id]');
        
        if (sections.length === 0) return;
        
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -50% 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navLink = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
                
                if (entry.isIntersecting) {
                    // Remove active class from all nav links
                    this.navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current nav link
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    initKeyboardNavigation() {
        // Handle keyboard navigation for nav links
        this.navLinks.forEach((link, index) => {
            link.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % this.navLinks.length;
                        this.navLinks[nextIndex].focus();
                        break;
                        
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = index === 0 ? this.navLinks.length - 1 : index - 1;
                        this.navLinks[prevIndex].focus();
                        break;
                        
                    case 'Home':
                        e.preventDefault();
                        this.navLinks[0].focus();
                        break;
                        
                    case 'End':
                        e.preventDefault();
                        this.navLinks[this.navLinks.length - 1].focus();
                        break;
                }
            });
        });
    }
    
    // Method to highlight a specific nav item
    setActiveNavItem(sectionId) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Method to scroll to a section
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        const headerHeight = this.header.offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update active nav item
        this.setActiveNavItem(sectionId);
        
        // Update URL
        history.pushState(null, null, `#${sectionId}`);
    }
    
    // Mobile menu functionality (for future enhancement)
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (!mobileToggle || !mobileMenu) return;
        
        let isOpen = false;
        
        const toggleMenu = () => {
            isOpen = !isOpen;
            
            mobileMenu.classList.toggle('open', isOpen);
            mobileToggle.setAttribute('aria-expanded', isOpen.toString());
            
            // Trap focus in mobile menu when open
            if (isOpen) {
                this.trapFocus(mobileMenu);
            } else {
                this.releaseFocus();
            }
        };
        
        mobileToggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (isOpen && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                toggleMenu();
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleMenu();
            }
        });
    }
    
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
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
        });
        
        firstFocusable.focus();
    }
    
    releaseFocus() {
        // Remove focus trap
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.removeEventListener('keydown', this.trapFocus);
        }
    }
    
    // Method to add custom scroll behavior
    addScrollBehavior(callback) {
        window.addEventListener('scroll', callback, { passive: true });
    }
    
    // Cleanup method
    destroy() {
        // Remove event listeners if needed
        window.removeEventListener('scroll', this.updateHeader);
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navbarComponent = new NavbarComponent();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavbarComponent;
}
