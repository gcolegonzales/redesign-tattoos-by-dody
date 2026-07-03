(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header: shrink + reveal on any upward scroll ---- */
  var header = document.getElementById("site-header");
  if (header) {
    var lastY = window.scrollY;
    var onScroll = function () {
      var y = window.scrollY;

      if (y > 40) header.classList.add("shrink");
      else header.classList.remove("shrink");

      /* Hide when scrolling down past the header; reveal instantly on ANY upward scroll. */
      if (y > lastY && y > 120) {
        header.classList.add("hide");
      } else if (y < lastY) {
        header.classList.remove("hide");
      }
      if (y <= 0) header.classList.remove("hide");
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile nav drawer ---- */
  var toggle = document.querySelector(".nav-toggle");
  var drawerRoot = document.getElementById("nav-drawer-root");
  var navList = document.getElementById("nav-list");
  var scrim = document.getElementById("nav-scrim");

  /* Relocate the drawer to <body> ONLY at mobile width so no filtered/transformed ancestor
     (the header uses backdrop-filter) becomes its containing block and collapses the fixed
     positioning. On desktop it must stay in the header, where `display:contents` lets the
     nav-list render inline; moving it to <body> would drop the links at the page bottom. */
  if (drawerRoot) {
    var origParent = drawerRoot.parentElement;
    var origNext = drawerRoot.nextElementSibling;
    var mobileMq = window.matchMedia("(max-width: 860px)");
    var placeDrawer = function (isMobile) {
      if (isMobile) {
        if (drawerRoot.parentElement !== document.body) {
          document.body.appendChild(drawerRoot);
        }
      } else if (origParent && drawerRoot.parentElement !== origParent) {
        origParent.insertBefore(drawerRoot, origNext);
      }
    };
    placeDrawer(mobileMq.matches);
    var onMqChange = function (e) { placeDrawer(e.matches); };
    if (mobileMq.addEventListener) mobileMq.addEventListener("change", onMqChange);
    else if (mobileMq.addListener) mobileMq.addListener(onMqChange); /* Safari < 14 */
  }

  var navClose = document.getElementById("nav-close");
  if (toggle && drawerRoot && navList) {
    if (scrim) scrim.hidden = false; /* controlled via .open / pointer-events, not [hidden] */

    var isOpen = false;
    /* Siblings of the drawer we mark inert while it's open (everything except drawerRoot). */
    var lastFocused = null;

    var isMobile = function () {
      return window.matchMedia("(max-width: 860px)").matches;
    };

    /* Elements that should NOT be reachable by Tab when the drawer is closed. */
    var drawerFocusables = function () {
      return Array.prototype.slice.call(
        drawerRoot.querySelectorAll("a[href], button:not([disabled])")
      );
    };

    /* Remove/restore the off-canvas links from the tab order when closed (mobile only). */
    var syncClosedTabOrder = function () {
      var hide = isMobile() && !isOpen;
      drawerFocusables().forEach(function (el) {
        if (hide) el.setAttribute("tabindex", "-1");
        else el.removeAttribute("tabindex");
      });
    };

    /* Mark the rest of the page inert/aria-hidden (all body children except drawerRoot). */
    var setBackgroundInert = function (on) {
      Array.prototype.forEach.call(document.body.children, function (el) {
        if (el === drawerRoot) return;
        if (on) {
          el.setAttribute("aria-hidden", "true");
          el.setAttribute("data-nav-inert", "");
          if ("inert" in HTMLElement.prototype) el.inert = true;
        } else if (el.hasAttribute("data-nav-inert")) {
          el.removeAttribute("aria-hidden");
          el.removeAttribute("data-nav-inert");
          if ("inert" in HTMLElement.prototype) el.inert = false;
        }
      });
    };

    var setNav = function (open) {
      isOpen = open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      drawerRoot.classList.toggle("open", open);
      if (navClose) navClose.hidden = !open;

      if (open) {
        lastFocused = document.activeElement;
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        setBackgroundInert(true);
        syncClosedTabOrder(); /* clears tabindex=-1 so links are focusable */
        var focusables = drawerFocusables();
        var first = navClose || focusables[0];
        if (first) first.focus();
      } else {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        setBackgroundInert(false);
        syncClosedTabOrder();
      }
    };

    var closeNav = function (returnFocus) {
      if (!isOpen) return;
      setNav(false);
      if (returnFocus !== false && toggle) toggle.focus();
    };

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      if (open) closeNav();
      else setNav(true);
      /* keep header visible while menu is open */
      if (header) header.classList.remove("hide");
    });

    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav(false); /* let the anchor take focus/scroll */
    });
    if (navClose) navClose.addEventListener("click", function () { closeNav(); });
    if (scrim) scrim.addEventListener("click", function () { closeNav(); });

    /* Escape closes + focus trap (Tab cycles within the drawer). */
    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;
      if (e.key === "Escape") { closeNav(); return; }
      if (e.key !== "Tab") return;
      var focusables = [navClose].concat(drawerFocusables()).filter(Boolean);
      if (!focusables.length) return;
      var firstEl = focusables[0];
      var lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault(); lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault(); firstEl.focus();
      } else if (!drawerRoot.contains(document.activeElement)) {
        e.preventDefault(); firstEl.focus();
      }
    });

    /* Reset state cleanly when crossing the desktop breakpoint. */
    var bpMq = window.matchMedia("(max-width: 860px)");
    var onBpChange = function () {
      if (isOpen) closeNav(false);
      isOpen = false;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      drawerRoot.classList.remove("open");
      if (navClose) navClose.hidden = true;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      setBackgroundInert(false);
      syncClosedTabOrder();
    };
    if (bpMq.addEventListener) bpMq.addEventListener("change", onBpChange);
    else if (bpMq.addListener) bpMq.addListener(onBpChange);

    syncClosedTabOrder(); /* initial: hide off-canvas links from Tab on mobile */
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
