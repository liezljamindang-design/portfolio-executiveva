(function () { 
  "use strict";

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Reduced motion check ---------- */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Terminal prompt animation ---------- */
  var terminalText = document.getElementById("terminalText");
  var terminalResult = document.getElementById("terminalResult");

  var prompts = [
    { text: "draft this week's investor update", result: "\u2713 Drafted, formatted, ready to send" },
    { text: "design a launch landing page", result: "\u2713 Landing page shipped" },
    { text: "clean up my inbox and calendar", result: "\u2713 Inbox zero. Week planned." },
    { text: "check this product's Amazon ROI", result: "\u2713 40% ROI. Recommended buy." }
  ];

  if (terminalText && terminalResult) {
    if (prefersReducedMotion) {
      terminalText.textContent = prompts[0].text;
      terminalResult.textContent = prompts[0].result;
      terminalResult.classList.add("is-visible");
    } else {
      var promptIndex = 0;
      var charIndex = 0;

      function typeNext() {
        var current = prompts[promptIndex];
        if (charIndex <= current.text.length) {
          terminalText.textContent = current.text.slice(0, charIndex);
          charIndex++;
          setTimeout(typeNext, 42);
        } else {
          terminalResult.textContent = current.result;
          setTimeout(function () {
            terminalResult.classList.add("is-visible");
          }, 150);
          setTimeout(eraseNext, 2600);
        }
      }

      function eraseNext() {
        terminalResult.classList.remove("is-visible");
        var current = prompts[promptIndex];
        var len = current.text.length;

        function eraseStep() {
          if (len >= 0) {
            terminalText.textContent = current.text.slice(0, len);
            len--;
            setTimeout(eraseStep, 20);
          } else {
            promptIndex = (promptIndex + 1) % prompts.length;
            charIndex = 0;
            setTimeout(typeNext, 400);
          }
        }
        setTimeout(eraseStep, 300);
      }

      typeNext();
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".service-card, .pillar, .timeline-item, .skill-group, .portfolio-placeholder, .build-card"
  );

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-revealed"); });
  } else {
    revealTargets.forEach(function (el, index) {
      el.classList.add("reveal");
      var group = el.closest(".service-grid, .pillars, .timeline, .skills-grid, .portfolio-grid");
      if (group) {
        var siblings = Array.prototype.slice.call(group.children);
        var posInGroup = siblings.indexOf(el);
        el.style.transitionDelay = (Math.min(posInGroup, 5) * 80) + "ms";
      }
    });

    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }
})();
