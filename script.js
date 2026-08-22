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

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Planner date ---------- */
  var plannerDate = document.getElementById("plannerDate");
  if (plannerDate) {
    var today = new Date();
    plannerDate.textContent = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  /* ---------- Planner checklist animation ---------- */
  var plannerList = document.getElementById("plannerList");
  if (plannerList) {
    var items = Array.prototype.slice.call(plannerList.children);

    if (prefersReducedMotion) {
      items.forEach(function (item) { item.classList.add("is-done"); });
    } else {
      var i = 0;
      var checking = true;

      function step() {
        if (checking) {
          if (i < items.length) {
            items[i].classList.add("is-done");
            i++;
            setTimeout(step, 900);
          } else {
            checking = false;
            setTimeout(step, 1800);
          }
        } else {
          if (i > 0) {
            i--;
            items[i].classList.remove("is-done");
            setTimeout(step, 260);
          } else {
            checking = true;
            setTimeout(step, 700);
          }
        }
      }
      setTimeout(step, 900);
    }
  }

  /* ---------- Experience rail: drag-to-pan + arrows + dots ---------- */
  var rail = document.getElementById("experienceRail");
  var railPrev = document.getElementById("railPrev");
  var railNext = document.getElementById("railNext");
  var railDotsWrap = document.getElementById("railDots");

  if (rail && railPrev && railNext && railDotsWrap) {
    var cards = Array.prototype.slice.call(rail.children);

    var dots = cards.map(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "rail-dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Go to role " + (i + 1));
      dot.addEventListener("click", function () {
        cards[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      railDotsWrap.appendChild(dot);
      return dot;
    });

    function cardWidth() {
      return cards[0] ? cards[0].getBoundingClientRect().width + 22 : 320;
    }

    function updateActiveDot() {
      var idx = Math.round(rail.scrollLeft / cardWidth());
      idx = Math.max(0, Math.min(dots.length - 1, idx));
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === idx); });
    }

    railPrev.addEventListener("click", function () {
      rail.scrollBy({ left: -cardWidth(), behavior: "smooth" });
    });
    railNext.addEventListener("click", function () {
      rail.scrollBy({ left: cardWidth(), behavior: "smooth" });
    });

    var scrollTicking = false;
    rail.addEventListener("scroll", function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          updateActiveDot();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Mouse drag-to-pan (touch scrolling works natively already)
    var isDown = false;
    var startX = 0;
    var startScroll = 0;

    rail.addEventListener("mousedown", function (e) {
      isDown = true;
      rail.classList.add("is-dragging");
      startX = e.pageX;
      startScroll = rail.scrollLeft;
    });
    window.addEventListener("mouseup", function () {
      isDown = false;
      rail.classList.remove("is-dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      var dx = e.pageX - startX;
      rail.scrollLeft = startScroll - dx;
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    ".service-card, .pillar, .role-card, .skill-group, .credentials-col, .contact-card"
  );

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-revealed"); });
  } else {
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      var group = el.closest(".service-grid, .pillars, .skills-grid");
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

  /* ---------- Contact form ---------- */
  var contactForm = document.getElementById("contactForm");
  var formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var message = contactForm.message.value.trim();

      if (!name || !email || !message) {
        formStatus.textContent = "Please fill in all fields.";
        formStatus.classList.add("is-error");
        return;
      }

      formStatus.classList.remove("is-error");

      var subject = "New inquiry from " + name;
      var body = "Name: " + name + "\nEmail: " + email + "\n\n" + message;
      var mailtoLink =
        "mailto:liezljamindang@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailtoLink;
      formStatus.textContent = "Opening your email app to send this to Liezl...";
    });
  }
})();
