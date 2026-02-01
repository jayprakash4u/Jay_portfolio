/**
 * Portfolio JavaScript
 * Modern, interactive portfolio with smooth animations and user experience enhancements
 */

// ================================================================
// THEME MANAGEMENT
// ================================================================

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light";
    this.themeToggle = document.getElementById("theme-toggle");
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
    // Respect system preferences
    if (
      this.theme === "light" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.setTheme("dark");
    }
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
    this.setTheme(this.theme);
  }

  setTheme(theme) {
    this.theme = theme;
    this.applyTheme(theme);
    localStorage.setItem("theme", theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    this.updateThemeToggle();
  }

  updateThemeToggle() {
    const isPressed = this.theme === "dark";
    this.themeToggle.setAttribute("aria-pressed", isPressed);
  }
}

// ================================================================
// NAVIGATION MANAGEMENT
// ================================================================

class NavigationManager {
  constructor() {
    this.header = document.querySelector(".header");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.mobileToggle = document.getElementById("mobile-toggle");
    this.navMenu = document.querySelector(".nav-links");
    this.init();
  }

  init() {
    // Smooth scroll and active link highlighting
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => this.handleNavClick(e));
    });

    // Mobile menu toggle
    this.mobileToggle.addEventListener("click", () => this.toggleMobileMenu());

    // Close mobile menu on link click
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => this.closeMobileMenu());
    });

    // Scroll event for header styling
    window.addEventListener("scroll", () => this.updateHeaderOnScroll());

    // Update active link on scroll
    window.addEventListener("scroll", () => this.updateActiveLink());
  }

  handleNavClick(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    const target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      this.updateActiveLink(href);
    }
  }

  updateActiveLink(href = null) {
    if (!href) {
      const scrollPos = window.scrollY + 100;

      this.navLinks.forEach((link) => {
        link.classList.remove("active");

        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const { offsetTop, offsetHeight } = targetSection;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            link.classList.add("active");
          }
        }
      });
    } else {
      this.navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === href) {
          link.classList.add("active");
        }
      });
    }
  }

  toggleMobileMenu() {
    const isExpanded =
      this.mobileToggle.getAttribute("aria-expanded") === "true";
    this.mobileToggle.setAttribute("aria-expanded", !isExpanded);
    this.navMenu.classList.toggle("mobile-open");
  }

  closeMobileMenu() {
    this.mobileToggle.setAttribute("aria-expanded", "false");
    this.navMenu.classList.remove("mobile-open");
  }

  updateHeaderOnScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add("scrolled");
    } else {
      this.header.classList.remove("scrolled");
    }
  }
}

// ================================================================
// SKILL ANIMATIONS
// ================================================================

class SkillAnimator {
  constructor() {
    this.skillBars = document.querySelectorAll(".skill-progress");
    this.hasAnimated = false;
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateSkills();
          this.hasAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    });

    const skillsSection = document.getElementById("skills");
    if (skillsSection) {
      observer.observe(skillsSection);
    }
  }

  animateSkills() {
    this.skillBars.forEach((bar, index) => {
      setTimeout(() => {
        const width = bar.style.width;
        bar.style.setProperty("--skill-width", width);
      }, index * 100);
    });
  }
}

// ================================================================
// SECTION ANIMATIONS
// ================================================================

class SectionAnimator {
  constructor() {
    this.sections = document.querySelectorAll("section");
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "slideInUp 0.8s ease-out forwards";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    this.sections.forEach((section) => {
      observer.observe(section);
    });
  }
}

// ================================================================
// FORM HANDLING
// ================================================================

class FormHandler {
  constructor() {
    this.form = document.getElementById("contact-form");
    this.formStatus = document.getElementById("form-status");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!this.validateForm()) {
      this.showStatus("Please fill in all fields correctly", "error");
      return;
    }

    // Submit form
    this.submitForm();
  }

  validateForm() {
    const name = this.form.querySelector('[name="name"]').value.trim();
    const email = this.form.querySelector('[name="email"]').value.trim();
    const subject = this.form.querySelector('[name="subject"]').value.trim();
    const message = this.form.querySelector('[name="message"]').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return name && email && emailRegex.test(email) && subject && message;
  }

  submitForm() {
    // Submit via Formspree
    const formData = new FormData(this.form);

    fetch(this.form.getAttribute("action"), {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          this.showStatus(
            "Message sent successfully! I'll get back to you soon.",
            "success",
          );
          this.form.reset();
        } else {
          throw new Error("Form submission failed");
        }
      })
      .catch(() => {
        this.showStatus("Failed to send message. Please try again.", "error");
      });
  }

  showStatus(message, type) {
    this.formStatus.textContent = message;
    this.formStatus.className = `form-status ${type}`;

    setTimeout(() => {
      this.formStatus.className = "form-status";
    }, 5000);
  }
}

// ================================================================
// SMOOTH SCROLL HELPER
// ================================================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Check if browser supports smooth scrolling
    if (!("scrollBehavior" in document.documentElement.style)) {
      this.polyfill();
    }
  }

  polyfill() {
    // Fallback for browsers that don't support smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href !== "#") {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }
}

// ================================================================
// LAZY LOADING
// ================================================================

class LazyLoader {
  constructor() {
    this.init();
  }

  init() {
    // Handle images with loading attribute
    if ("loading" in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      document.querySelectorAll("img[loading='lazy']").forEach((img) => {
        img.setAttribute("loading", "lazy");
      });
    } else {
      // Fallback for older browsers
      this.polyfill();
    }
  }

  polyfill() {
    const images = document.querySelectorAll("img[loading='lazy']");
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("loading");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// ================================================================
// INITIALIZATION
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modules
  new ThemeManager();
  new NavigationManager();
  new SkillAnimator();
  new SectionAnimator();
  new FormHandler();
  new SmoothScroll();
  new LazyLoader();

  console.log("Portfolio loaded successfully!");
});

// Handle visibility changes for animations
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause animations if tab is not visible
    document.querySelectorAll("[style*='animation']").forEach((el) => {
      el.style.animationPlayState = "paused";
    });
  } else {
    // Resume animations if tab is visible
    document.querySelectorAll("[style*='animation']").forEach((el) => {
      el.style.animationPlayState = "running";
    });
  }
});
