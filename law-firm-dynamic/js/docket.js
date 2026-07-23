function renderDocket(container, areas, options) {
  options = options || {};
  var openFirst = options.openFirst !== false;

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  var header =
    '<div class="docket__header" aria-hidden="true">' +
    '<span class="docket__col docket__col--code">Ref. No.</span>' +
    '<span class="docket__col docket__col--name">Matter</span>' +
    '<span class="docket__col docket__col--status">Status</span>' +
    "</div>";

  var rows = areas
    .map(function (area, index) {
      var isOpen = openFirst && index === 0;
      var matters = (area.representativeMatters || [])
        .map(function (m) {
          return "<li>" + escapeHtml(m) + "</li>";
        })
        .join("");

      return (
        '<div class="docket__row" role="listitem" data-slug="' +
        area.slug +
        '">' +
        '<button class="docket__summary" aria-expanded="' +
        isOpen +
        '" aria-controls="docket-panel-' +
        area.slug +
        '">' +
        '<span class="docket__col docket__col--code">' +
        escapeHtml(area.docketCode) +
        "</span>" +
        '<span class="docket__col docket__col--name">' +
        '<span class="docket__name">' +
        escapeHtml(area.name) +
        "</span>" +
        '<span class="docket__summary-text">' +
        escapeHtml(area.summary) +
        "</span>" +
        "</span>" +
        '<span class="docket__col docket__col--status">' +
        '<span class="docket__badge">Accepting clients</span>' +
        "</span>" +
        '<span class="docket__chevron' +
        (isOpen ? " docket__chevron--open" : "") +
        '" aria-hidden="true">+</span>' +
        "</button>" +
        '<div id="docket-panel-' +
        area.slug +
        '" class="docket__panel' +
        (isOpen ? " docket__panel--open" : "") +
        '">' +
        '<div class="docket__panel-inner">' +
        "<p>" +
        escapeHtml(area.details) +
        "</p>" +
        (matters
          ? '<p class="docket__matters-label">Representative matters</p><ul class="docket__matters">' +
            matters +
            "</ul>"
          : "") +
        "</div>" +
        "</div>" +
        "</div>"
      );
    })
    .join("");

  container.innerHTML = '<div class="docket" role="list">' + header + rows + "</div>";

  container.querySelectorAll(".docket__summary").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest(".docket__row");
      var panel = row.querySelector(".docket__panel");
      var chevron = row.querySelector(".docket__chevron");
      var isOpen = panel.classList.toggle("docket__panel--open");
      chevron.classList.toggle("docket__chevron--open", isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
    });
  });
}
