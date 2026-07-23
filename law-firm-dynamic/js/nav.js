(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav__toggle");
    var links = document.querySelector(".nav__links");

    if (!nav) return;

    // Sticky-scroll shadow
    function onScroll() {
      if (window.scrollY > 8) {
        nav.classList.add("nav--scrolled");
      } else {
        nav.classList.remove("nav--scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mobile menu toggle
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var isOpen = links.classList.toggle("nav__links--open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      });

      // Close the mobile menu after a nav link is tapped
      links.querySelectorAll(".nav__link").forEach(function (link) {
        link.addEventListener("click", function () {
          links.classList.remove("nav__links--open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
        });
      });
    }

    // Highlight the current page's nav link (each page sets body[data-page])
    var currentPage = document.body.getAttribute("data-page");
    if (currentPage) {
      var activeLink = document.querySelector('.nav__link[data-page="' + currentPage + '"]');
      if (activeLink) activeLink.classList.add("nav__link--active");
    }
  });
})();
