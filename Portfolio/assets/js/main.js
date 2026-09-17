/**
 * PORTFOLIO JAVASCRIPT - DUMISA EMMANUEL MOYO
 * Clean, modular Vanilla ES6+ JavaScript
 * Features: Dark/Light Mode, Typewriter, Mobile Menu, Filter, Form Validation, Modal, Animations
 */

(function () {
  "use strict";

  // ==========================================================================
  // 1. THEME MANAGER (Dark / Light Mode with localStorage & system preference)
  // ==========================================================================
  const ThemeManager = {
    themeToggleBtn: document.getElementById("theme-toggle"),
    themeIcon: document.getElementById("theme-icon"),

    init() {
      if (!this.themeToggleBtn) return;

      const savedTheme = localStorage.getItem("portfolio_theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

      this.applyTheme(initialTheme);

      this.themeToggleBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        this.applyTheme(nextTheme);
        localStorage.setItem("portfolio_theme", nextTheme);
      });

      // Listen to OS scheme changes
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("portfolio_theme")) {
          this.applyTheme(e.matches ? "dark" : "light");
        }
      });
    },

    applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      if (this.themeIcon) {
        if (theme === "dark") {
          // Render Sun icon (to switch to light)
          this.themeIcon.innerHTML = `
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          `;
          this.themeToggleBtn.setAttribute("aria-label", "Switch to light mode");
        } else {
          // Render Moon icon (to switch to dark)
          this.themeIcon.innerHTML = `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          `;
          this.themeToggleBtn.setAttribute("aria-label", "Switch to dark mode");
        }
      }
    }
  };

  // ==========================================================================
  // 2. TYPEWRITER EFFECT
  // ==========================================================================
  const Typewriter = {
    element: document.getElementById("typewriter-output"),
    words: [
      "Junior Web Developer",
      "Junior App Developer",
      "Software Tester",
      "Computer Science Graduate"
    ],
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typingSpeed: 100,
    deletingSpeed: 50,
    delayBetweenWords: 1800,

    init() {
      if (!this.element) return;
      this.type();
    },

    type() {
      const currentWord = this.words[this.wordIndex];

      if (this.isDeleting) {
        this.element.textContent = currentWord.substring(0, this.charIndex - 1);
        this.charIndex--;
      } else {
        this.element.textContent = currentWord.substring(0, this.charIndex + 1);
        this.charIndex++;
      }

      let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

      if (!this.isDeleting && this.charIndex === currentWord.length) {
        speed = this.delayBetweenWords;
        this.isDeleting = true;
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.wordIndex = (this.wordIndex + 1) % this.words.length;
        speed = 400;
      }

      setTimeout(() => this.type(), speed);
    }
  };

  // ==========================================================================
  // 3. NAVBAR, MOBILE MENU & SCROLL MONITOR
  // ==========================================================================
  const Navigation = {
    header: document.getElementById("header"),
    mobileToggle: document.getElementById("mobile-toggle"),
    navMenu: document.getElementById("nav-menu"),
    navLinks: document.querySelectorAll(".nav-link"),
    sections: document.querySelectorAll("section[id]"),
    backToTopBtn: document.getElementById("back-to-top"),

    init() {
      this.bindEvents();
      this.initScrollSpy();
    },

    bindEvents() {
      // Mobile drawer toggle
      if (this.mobileToggle && this.navMenu) {
        this.mobileToggle.addEventListener("click", () => {
          const isOpen = this.navMenu.classList.toggle("open");
          this.mobileToggle.classList.toggle("open", isOpen);
          this.mobileToggle.setAttribute("aria-expanded", String(isOpen));
        });

        // Close menu on nav link click
        this.navLinks.forEach((link) => {
          link.addEventListener("click", () => {
            this.navMenu.classList.remove("open");
            this.mobileToggle.classList.remove("open");
            this.mobileToggle.setAttribute("aria-expanded", "false");
          });
        });

        // Close menu on outside click
        document.addEventListener("click", (e) => {
          if (
            this.navMenu.classList.contains("open") &&
            !this.navMenu.contains(e.target) &&
            !this.mobileToggle.contains(e.target)
          ) {
            this.navMenu.classList.remove("open");
            this.mobileToggle.classList.remove("open");
            this.mobileToggle.setAttribute("aria-expanded", "false");
          }
        });
      }

      // Scroll listener for sticky header styling & back to top visibility
      window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        if (this.header) {
          this.header.classList.toggle("scrolled", scrollY > 40);
        }

        if (this.backToTopBtn) {
          this.backToTopBtn.classList.toggle("visible", scrollY > 400);
        }
      }, { passive: true });

      // Back to top click
      if (this.backToTopBtn) {
        this.backToTopBtn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
    },

    initScrollSpy() {
      if (!("IntersectionObserver" in window)) return;

      const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");
            this.navLinks.forEach((link) => {
              const href = link.getAttribute("href");
              if (href === `#${currentId}`) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });
          }
        });
      }, observerOptions);

      this.sections.forEach((section) => observer.observe(section));
    }
  };

  // ==========================================================================
  // 4. SKILL PROGRESS BAR ANIMATION
  // ==========================================================================
  const SkillBars = {
    bars: document.querySelectorAll(".skill-progress-fill"),

    init() {
      if (!this.bars.length) return;

      if (!("IntersectionObserver" in window)) {
        // Fallback if IntersectionObserver is not supported
        this.bars.forEach((bar) => {
          const width = bar.getAttribute("data-width") || "80";
          bar.style.width = `${width}%`;
        });
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const bar = entry.target;
              const width = bar.getAttribute("data-width") || "80";
              bar.style.width = `${width}%`;
              obs.unobserve(bar);
            }
          });
        },
        { threshold: 0.25 }
      );

      this.bars.forEach((bar) => observer.observe(bar));
    }
  };

  // ==========================================================================
  // 5. PROJECT CATEGORY FILTER SYSTEM
  // ==========================================================================
  const ProjectFilter = {
    filterBtns: document.querySelectorAll(".filter-btn"),
    projectCards: document.querySelectorAll(".project-card"),

    init() {
      if (!this.filterBtns.length || !this.projectCards.length) return;

      this.filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          // Update active button
          this.filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          const selectedCategory = btn.getAttribute("data-filter");

          this.projectCards.forEach((card) => {
            const cardCategory = card.getAttribute("data-category");

            if (selectedCategory === "all" || cardCategory === selectedCategory) {
              card.classList.remove("hidden");
            } else {
              card.classList.add("hidden");
            }
          });
        });
      });
    }
  };

  // ==========================================================================
  // 6. INTERACTIVE PROJECT DETAILS MODAL
  // ==========================================================================
  const ProjectModal = {
    modalOverlay: document.getElementById("project-modal"),
    closeBtn: document.getElementById("modal-close"),
    modalTitle: document.getElementById("modal-title"),
    modalImage: document.getElementById("modal-image"),
    modalDescription: document.getElementById("modal-description"),
    modalTechStack: document.getElementById("modal-tech-stack"),
    modalLiveLink: document.getElementById("modal-live-link"),
    modalCodeLink: document.getElementById("modal-code-link"),
    detailButtons: document.querySelectorAll(".btn-view-project"),

    // Projects Data Dictionary
    projectsData: {
      plantwise: {
        title: "PlantWise — Mobile Plant Identification App",
        image: "assets/images/PlantWise.jpg",
        category: "Mobile Application",
        description:
          "PlantWise is an intuitive Android mobile application developed in Kotlin that enables users to effortlessly identify flora species by snapping or uploading photos. Dumisa designed the entire UI/UX journey with modern Android design principles and integrated computer vision REST APIs for instant high-accuracy classification.",
        features: [
          "Real-time camera viewfinder with edge detection guide",
          "Species accuracy rating and health diagnostics",
		  "Weather focecast",
          "Offline botanical care guides & watering reminders",
          "Responsive, fluid animations designed natively in Kotlin"
        ],
        tech: ["Kotlin", "Android SDK", "REST API", "Image Recognition", "Material Design 3"],
        liveUrl: "#",
        codeUrl: "https://github.com/dumisamoyo/plantwise"
      },
      techgiants: {
        title: "Portfolio Website",
        image: "assets/images/pf.png",
        category: "Web Application",
        description:
          "A responsive single-page developer portfolio designed to showcase projects, skills, and experience. Built from scratch with pure HTML5, modern CSS3 variables, and vanilla JavaScript without external framework bloat.",
        features: [
          "Dynamic project detail modal with backdrop blur & keybindings",
          "Cross-browser tested and optimized for sub-second loading",
          "Client-side form validation with real-time feedback & regex checks",
          "Intersection Observer powered smooth scroll and scrollbar progress"
        ],
        tech: ["HTML5", "CSS3", "JavaScript"],
        liveUrl: "#",
        codeUrl: "https://github.com/dumisamoyo/techgiants-portal"
      },
      taskmanager: {
        title: "Task Manager GUI — Desktop Productivity Suite",
        image: "assets/images/Notes.png",
        category: "Desktop Software",
        description:
          "A desktop productivity tool engineered with Java and JavaFX, backed by a relational SQL database. Implements an intuitive Kanban board interface with drag-and-drop prioritization, deadline scheduling, and persistent storage.",
        features: [
          "Visual task board with 'To Do', 'In Progress', and 'Completed' columns",
          "Priority flags (Urgent, Medium, Low) with color coded tags",
          "Relational SQL schema for persistent storage across sessions",
          "Statistical progress tracking and overdue alerts"
        ],
        tech: ["Java", "JavaFX", "SQL", "OOP", "Database Design"],
        liveUrl: "#",
        codeUrl: "https://github.com/dumisamoyo/task-manager-gui"
      },
      trading: {
        title: "Algorithmic Trading Solutions — MetaTrader 4/5 EA",
        image: "assets/images/mt4.jpg",
        category: "Algorithmic Trading",
        description:
          "Custom algorithmic trading robots (Expert Advisors) and technical indicators developed in MQL4 and MQL5. The algorithms analyze multi-timeframe price action, calculate statistical moving average envelopes, and execute disciplined risk-managed trades automatically.",
        features: [
          "Quantitative rule-based trade execution without emotional bias",
          "Rigorous back-testing across multi-year tick data with 74.6% win rate",
          "Dynamic position sizing and strict risk-reward management",
          "Real-time diagnostic logging and error telemetry"
        ],
        tech: ["MQL4", "MQL5", "MetaTrader 4/5", "Algorithmic Trading", "Risk Modeling"],
        liveUrl: "#",
        codeUrl: "https://github.com/dumisamoyo/algo-trading-mql"
      },
      ecommerce: {
        title: "Modern E-Commerce Storefront & Real-time Cart",
        image: "assets/images/zameals2.jpg",
        category: "Web Application",
        description:"A comprehensive food delivery platform tailored for local street-food vendors and customers. Features multi-engine backend architecture, real-time order lifecycle tracking, and location-based vendor discovery.",
        features: [
          "Live cart price computation via secure Postgres RPC functions",
          "Supabase backend schema across 6 dedicated domain engines",
          "Paystack payment Edge Function integration",
          "Location-aware vendor listing with operating hour validations"
        ],
        tech: ["Flutter", "Dart", "Supabase", "Postgres RLS", "UI/UX"],
        liveUrl: "#",
        codeUrl: "https://github.com/dumisamoyo/ecommerce-storefront"
      },
      /* qadashboard: {
        title: "QueryQuest QA & Defect Management Dashboard",
        image: "assets/images/project-qa-dashboard.svg",
        category: "QA & Testing Tool",
        description:
          "A software quality assurance dashboard created to streamline defect reporting, test case executions, and regression analysis. Reflects Dumisa's hands-on experience as a System Tester at Query Quest, achieving a 64% reduction in bug recurrence.",
        features: [
          "Defect lifecycle tracking (Logged -> Investigating -> Verified -> Closed)",
          "Pass/fail rate metric gauges and module breakdown",
          "Comprehensive regression test suite documentation",
          "Standardized bug reproduction steps generator"
        ],
        tech: ["Software Testing", "Defect Tracking", "Regression QA", "JavaScript", "SQL"],
        liveUrl: "#",
        codeUrl: "https://github.com/dumisamoyo/qa-defect-tracker"
      } */
    },

    init() {
      if (!this.modalOverlay) return;

      this.detailButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const projectId = btn.getAttribute("data-project");
          this.open(projectId);
        });
      });

      if (this.closeBtn) {
        this.closeBtn.addEventListener("click", () => this.close());
      }

      this.modalOverlay.addEventListener("click", (e) => {
        if (e.target === this.modalOverlay) {
          this.close();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.modalOverlay.classList.contains("active")) {
          this.close();
        }
      });
    },

    open(projectId) {
      const data = this.projectsData[projectId];
      if (!data) return;

      this.modalTitle.textContent = data.title;
      this.modalImage.src = data.image;
      this.modalImage.alt = data.title;

      let featuresHtml = "";
      if (data.features && data.features.length) {
        featuresHtml = `
          <h4 style="margin-top: 16px; margin-bottom: 8px; font-size: 1rem;">Key Highlights:</h4>
          <ul style="list-style: disc; padding-left: 20px; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
            ${data.features.map((f) => `<li>${f}</li>`).join("")}
          </ul>
        `;
      }

      this.modalDescription.innerHTML = `<p>${data.description}</p>${featuresHtml}`;

      this.modalTechStack.innerHTML = data.tech
        .map((t) => `<span class="tech-tag">${t}</span>`)
        .join("");

      if (this.modalLiveLink) this.modalLiveLink.href = data.liveUrl;
      if (this.modalCodeLink) this.modalCodeLink.href = data.codeUrl;

      this.modalOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    },

    close() {
      this.modalOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  // ==========================================================================
  // 7. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================================================
  const ContactForm = {
    form: document.getElementById("contact-form"),
    nameInput: document.getElementById("name"),
    emailInput: document.getElementById("email"),
    subjectInput: document.getElementById("subject"),
    messageInput: document.getElementById("message"),
    statusAlert: document.getElementById("form-status-alert"),
    submitBtn: document.getElementById("form-submit-btn"),

    init() {
      if (!this.form) return;

      this.bindLiveValidation();

      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (this.validateAll()) {
          this.submitForm();
        }
      });
    },

    bindLiveValidation() {
      const fields = [
        { input: this.nameInput, validator: () => this.validateName() },
        { input: this.emailInput, validator: () => this.validateEmail() },
        { input: this.subjectInput, validator: () => this.validateSubject() },
        { input: this.messageInput, validator: () => this.validateMessage() }
      ];

      fields.forEach(({ input, validator }) => {
        if (!input) return;
        input.addEventListener("input", validator);
        input.addEventListener("blur", validator);
      });
    },

    validateName() {
      const val = this.nameInput.value.trim();
      if (val.length < 3) {
        this.setError(this.nameInput, "Please enter your name (at least 3 characters).");
        return false;
      }
      this.setSuccess(this.nameInput);
      return true;
    },

    validateEmail() {
      const val = this.emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        this.setError(this.emailInput, "Please provide a valid email address.");
        return false;
      }
      this.setSuccess(this.emailInput);
      return true;
    },

    validateSubject() {
      const val = this.subjectInput.value.trim();
      if (val.length < 4) {
        this.setError(this.subjectInput, "Subject must be at least 4 characters.");
        return false;
      }
      this.setSuccess(this.subjectInput);
      return true;
    },

    validateMessage() {
      const val = this.messageInput.value.trim();
      if (val.length < 15) {
        this.setError(this.messageInput, "Please enter a message of at least 15 characters.");
        return false;
      }
      this.setSuccess(this.messageInput);
      return true;
    },

    validateAll() {
      const isNameValid = this.validateName();
      const isEmailValid = this.validateEmail();
      const isSubjectValid = this.validateSubject();
      const isMsgValid = this.validateMessage();

      return isNameValid && isEmailValid && isSubjectValid && isMsgValid;
    },

    setError(input, message) {
      input.classList.add("error");
      input.classList.remove("valid");
      input.setAttribute("aria-invalid", "true");

      const errorSpan = document.getElementById(`${input.id}-error`);
      if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add("visible");
      }
    },

    setSuccess(input) {
      input.classList.remove("error");
      input.classList.add("valid");
      input.setAttribute("aria-invalid", "false");

      const errorSpan = document.getElementById(`${input.id}-error`);
      if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.classList.remove("visible");
      }
    },

    submitForm() {
      if (this.submitBtn) {
        this.submitBtn.disabled = true;
        this.submitBtn.innerHTML = `
          <span>Sending message...</span>
        `;
      }

      // Simulate sending
      setTimeout(() => {
        if (this.submitBtn) {
          this.submitBtn.disabled = false;
          this.submitBtn.innerHTML = `
            <span>Send Message</span>
            <svg class="btn-icon-svg" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          `;
        }

        if (this.statusAlert) {
          this.statusAlert.className = "form-status-alert success";
          this.statusAlert.innerHTML = `
            <svg style="width:20px;height:20px;fill:currentColor;flex-shrink:0" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span>Thank you, ${this.nameInput.value.trim()}! Your message has been sent successfully. Dumisa will respond shortly.</span>
          `;
          this.statusAlert.style.display = "flex";
        }

        // Reset inputs
        this.form.reset();
        [this.nameInput, this.emailInput, this.subjectInput, this.messageInput].forEach(
          (inp) => {
            if (inp) {
              inp.classList.remove("valid", "error");
              inp.setAttribute("aria-invalid", "false");
            }
          }
        );

        // Hide success message after 7 seconds
        setTimeout(() => {
          if (this.statusAlert) {
            this.statusAlert.style.display = "none";
          }
        }, 7000);
      }, 1000);
    }
  };

  // ==========================================================================
  // 8. SCROLL REVEAL (IntersectionObserver for .reveal-fade)
  // ==========================================================================
  const ScrollReveal = {
    elements: document.querySelectorAll(".reveal-fade"),

    init() {
      if (!this.elements.length) return;

      if (!("IntersectionObserver" in window)) {
        this.elements.forEach((el) => el.classList.add("revealed"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      this.elements.forEach((el) => observer.observe(el));
    }
  };

  // ==========================================================================
  // APP INITIALIZATION
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    ThemeManager.init();
    Typewriter.init();
    Navigation.init();
    SkillBars.init();
    ProjectFilter.init();
    ProjectModal.init();
    ContactForm.init();
    ScrollReveal.init();
  });
})();
