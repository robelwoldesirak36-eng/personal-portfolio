// Robel Woldesirak portfolio interactions
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const themeIcon = themeButton?.querySelector(".theme-icon");
  const menuButton = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const backToTop = document.getElementById("back-to-top");

  // Theme switcher: remembers the visitor's choice.
  function updateThemeButton() {
    const dark = root.dataset.theme === "dark";
    if (themeIcon) themeIcon.textContent = dark ? "☀" : "☾";
    if (themeButton) themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  }
  updateThemeButton();
  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    localStorage.setItem("robel-theme", nextTheme);
    updateThemeButton();
  });

  // Mobile navigation.
  menuButton?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
    });
  });

  // Reveal sections as they enter the screen. Fallback keeps content visible.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }

  // Animate skill bars once the skills section is visible.
  const skillSection = document.getElementById("skills");
  const skillFills = document.querySelectorAll(".skill-fill");
  const animateSkills = () => skillFills.forEach(fill => {
    const level = Math.max(0, Math.min(100, Number(fill.dataset.level) || 0));
    fill.style.width = level + "%";
  });
  if (skillSection && "IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some(entry => entry.isIntersecting)) {
        animateSkills();
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    skillObserver.observe(skillSection);
  } else {
    animateSkills();
  }

  // Project category filters.
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");
  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filterButtons.forEach(item => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      projectCards.forEach(card => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
    button.setAttribute("aria-pressed", String(button.classList.contains("active")));
  });

  // Contact form: validate fields, then prepare an email in the visitor's mail app.
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
    if (formStatus) formStatus.textContent = "Opening your email app with the message prepared. Please review and send it there.";
    window.location.href = "mailto:robelwoldesirak36@gmail.com?subject=" + subject + "&body=" + body;
  });

  // Footer year and back-to-top button.
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  window.addEventListener("scroll", () => {
    backToTop?.classList.toggle("visible", window.scrollY > 450);
  }, { passive: true });
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
});
