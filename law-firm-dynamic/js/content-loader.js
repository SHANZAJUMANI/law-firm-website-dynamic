function loadSiteContent() {
  return Promise.all([
    fetch("data/firm.json").then(function (r) {
      if (!r.ok) throw new Error("Could not load firm.json");
      return r.json();
    }),
    fetch("data/practice-areas.json").then(function (r) {
      if (!r.ok) throw new Error("Could not load practice-areas.json");
      return r.json();
    }),
    fetch("data/attorneys.json").then(function (r) {
      if (!r.ok) throw new Error("Could not load attorneys.json");
      return r.json();
    }),
  ]).then(function (results) {
    var content = {
      firm: results[0],
      practiceAreas: results[1],
      attorneys: results[2],
    };
    window.SITE_CONTENT = content;
    applyFirmFields(content.firm);
    return content;
  });
}

function applyFirmFields(firm) {
  document.querySelectorAll("[data-firm-field]").forEach(function (el) {
    var key = el.getAttribute("data-firm-field");
    if (firm[key] !== undefined) el.textContent = firm[key];
  });

  document.querySelectorAll("[data-firm-href]").forEach(function (el) {
    var key = el.getAttribute("data-firm-href");
    if (firm[key] !== undefined) el.setAttribute("href", el.getAttribute("data-firm-href-prefix") + firm[key]);
  });

  document.querySelectorAll("[data-firm-hours]").forEach(function (el) {
    el.innerHTML = (firm.hours || [])
      .map(function (line) {
        return '<p class="footer__hours">' + line + "</p>";
      })
      .join("");
  });

  document.title = document.title.replace("Calloway Reyes LLP", firm.name);
}
