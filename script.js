document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const backToTop = document.getElementById("back-to-top");
  const year = document.getElementById("year");
  const counters = document.querySelectorAll(".count");
  const revealItems = document.querySelectorAll("[data-reveal]");
  const forms = [
    {
      element: document.getElementById("newsletter-form"),
      successText: "Subscribed",
      resetDelay: 2200,
    },
    {
      element: document.getElementById("contact-form"),
      successText: "Message Sent",
      resetDelay: 2400,
    },
    {
      element: document.getElementById("mpesa-form"),
      successText: "Donation Started",
      resetDelay: 2600,
    },
  ];

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      mainNav.classList.toggle("open");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mainNav.classList.remove("open");
      });
    });
  }

  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (counters.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const counter = entry.target;
          const target = Number(counter.dataset.target || 0);
          const duration = 1600;
          const startTime = performance.now();

          const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = target > 999 ? value.toLocaleString() : value.toString();

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              counter.textContent = target > 999 ? `${target.toLocaleString()}+` : target.toString();
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(counter);
        });
      },
      { threshold: 0.45 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  }

  forms.forEach(({ element, successText, resetDelay }) => {
    if (!element) return;

    element.addEventListener("submit", (event) => {
      event.preventDefault();

      const submitButton = element.querySelector("button[type='submit']");
      if (!submitButton) return;

      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = successText;

      setTimeout(() => {
        element.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }, resetDelay);
    });
  });

  const sectionIds = ["about", "programs", "impact", "governance", "stories", "faq", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const handleScroll = () => {
    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 700);
    }

    let activeId = "";
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${activeId}`);
    });
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });
});
