function renderAttorneys(container, attorneys) {
  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  container.innerHTML = attorneys
    .map(function (a) {
      var tags = a.practiceAreas
        .map(function (t) {
          return '<span class="attorney-card__tag">' + escapeHtml(t) + "</span>";
        })
        .join("");

      var facts = "";
      if (a.barAdmissions && a.barAdmissions.length) {
        facts +=
          "<div><dt>Bar admissions</dt><dd>" + escapeHtml(a.barAdmissions.join(" · ")) + "</dd></div>";
      }
      if (a.education && a.education.length) {
        facts += "<div><dt>Education</dt><dd>" + escapeHtml(a.education.join(" · ")) + "</dd></div>";
      }

      var contact = a.email
        ? '<a class="attorney-card__contact" href="mailto:' +
          a.email +
          '">' +
          escapeHtml(a.email) +
          (a.phoneExt ? " <span>· ext. " + escapeHtml(a.phoneExt) + "</span>" : "") +
          "</a>"
        : "";

      return (
        '<article class="attorney-card">' +
        '<div class="attorney-card__head">' +
        '<div class="attorney-card__avatar" aria-hidden="true">' +
        escapeHtml(a.initials) +
        "</div>" +
        "<div>" +
        '<h3 class="attorney-card__name">' +
        escapeHtml(a.name) +
        "</h3>" +
        '<p class="attorney-card__title">' +
        escapeHtml(a.title) +
        "</p>" +
        "</div>" +
        "</div>" +
        '<div class="attorney-card__tags">' +
        tags +
        "</div>" +
        '<p class="attorney-card__bio">' +
        escapeHtml(a.bio) +
        "</p>" +
        '<dl class="attorney-card__facts">' +
        facts +
        "</dl>" +
        contact +
        "</article>"
      );
    })
    .join("");
}
