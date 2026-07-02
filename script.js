(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header shrink ---- */
  var header = document.getElementById("site-header");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 40) header.classList.add("shrink");
      else header.classList.remove("shrink");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");
  if (toggle && navList) {
    var closeNav = function () {
      toggle.setAttribute("aria-expanded", "false");
      navList.classList.remove("open");
    };
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      navList.classList.toggle("open", !open);
    });
    navList.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Consultation form (front-end only, no backend wired) ---- */
  var form = document.getElementById("consult-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.className = "form-status";

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var idea = form.idea.value.trim();

      if (!name || !phone || !idea) {
        status.textContent = "Please fill in your name, phone, and tattoo idea.";
        status.classList.add("error");
        var firstEmpty = !name ? form.name : !phone ? form.phone : form.idea;
        firstEmpty.focus();
        return;
      }

      var digits = phone.replace(/\D/g, "");
      if (digits.length < 10) {
        status.textContent = "That phone number looks a little short — double-check it?";
        status.classList.add("error");
        form.phone.focus();
        return;
      }

      status.textContent =
        "Thanks, " + name + "! Your request is ready to send. This is a preview form — please call (225) 644-2856 to lock in your consult.";
      status.classList.add("success");
      form.querySelector('button[type="submit"]').disabled = true;
    });
  }
})();
