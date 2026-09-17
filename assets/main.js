// Stockloop site — minimal shared JS (no framework, no build step)
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var header = document.querySelector(".site-header");
  if (toggle && header) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  // Help-center FAQ search (index page only — filters all inlined FAQs)
  var searchInput = document.getElementById("faq-search");
  if (searchInput) {
    var items = Array.prototype.slice.call(document.querySelectorAll("[data-faq-item]"));
    var countEl = document.getElementById("faq-search-count");
    var emptyEl = document.getElementById("faq-search-empty");
    var categoryHeadings = Array.prototype.slice.call(document.querySelectorAll("[data-faq-category-heading]"));

    function normalize(str) {
      return (str || "").toLowerCase();
    }

    function applyFilter() {
      var q = normalize(searchInput.value.trim());
      var visibleCount = 0;

      items.forEach(function (item) {
        var haystack = normalize(item.getAttribute("data-search"));
        var matches = q === "" || haystack.indexOf(q) !== -1;
        item.setAttribute("data-hidden", matches ? "false" : "true");
        if (matches) visibleCount++;
        if (q !== "" && matches) {
          item.open = true;
        } else if (q === "") {
          item.open = false;
        }
      });

      // Hide category headings with no visible children
      categoryHeadings.forEach(function (heading) {
        var cat = heading.getAttribute("data-faq-category-heading");
        var anyVisible = items.some(function (item) {
          return item.getAttribute("data-category") === cat && item.getAttribute("data-hidden") !== "true";
        });
        heading.style.display = anyVisible ? "" : "none";
      });

      if (countEl) {
        countEl.textContent = q === ""
          ? "Showing all " + items.length + " articles."
          : "Showing " + visibleCount + " of " + items.length + " articles.";
      }
      if (emptyEl) {
        emptyEl.style.display = visibleCount === 0 ? "block" : "none";
      }
    }

    searchInput.addEventListener("input", applyFilter);
    applyFilter();
  }
})();
