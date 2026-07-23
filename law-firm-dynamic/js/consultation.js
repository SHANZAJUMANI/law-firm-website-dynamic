(function () {
  function encodeFormData(data) {
    return Object.keys(data)
      .map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
      })
      .join("&");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("consult-form");
    if (!form) return;

    var errorsBox = document.getElementById("consult-errors");
    var errorsList = document.getElementById("consult-errors-list");
    var submitBtn = document.getElementById("consult-submit");
    var formWrap = document.getElementById("consult-form-wrap");
    var successWrap = document.getElementById("consult-success");

    function validate(data) {
      var errs = [];
      if (data.fullName.trim().length < 2) errs.push("Please enter your full name.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errs.push("Please enter a valid email address.");
      if (!/^[0-9()+\-.\s]{7,20}$/.test(data.phone)) errs.push("Please enter a valid phone number.");
      if (!data.practiceArea) errs.push("Please select a practice area.");
      if (data.message.trim().length < 10) errs.push("Please describe your matter in at least 10 characters.");
      return errs;
    }

    function showErrors(errs) {
      errorsList.innerHTML = errs.map(function (e) { return "<li>" + e + "</li>"; }).join("");
      errorsBox.hidden = errs.length === 0;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var data = {
        "form-name": "enquiry",
        fullName: form.fullName.value,
        email: form.email.value,
        phone: form.phone.value,
        practiceArea: form.practiceArea.value,
        preferredContact: form.preferredContact.value,
        message: form.message.value,
        company: form.company.value, // honeypot
      };

      // Honeypot tripped — a bot filled a field real visitors never see. Drop silently.
      // (Netlify also checks this server-side via netlify-honeypot on the <form>.)
      if (data.company) return;

      var errs = validate(data);
      if (errs.length) {
        showErrors(errs);
        return;
      }

      showErrors([]);
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";

      // Netlify Forms: submitting via fetch to "/" with the same encoded body
      // a native form POST would send is the documented pattern for AJAX
      // submission without a page reload. Netlify's form-handling bot picks up
      // the "enquiry" form at build time because it's present as static markup
      // in consultation.html (data-netlify="true", matching field names).
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encodeFormData(data),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("The form service returned an error (" + res.status + ").");
          formWrap.hidden = true;
          successWrap.hidden = false;
          form.reset();
        })
        .catch(function (err) {
          showErrors([
            "We couldn't submit your request (" +
              err.message +
              "). Please try again, or call the office directly.",
          ]);
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit request";
        });
    });

    var resetBtn = document.getElementById("consult-reset");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        successWrap.hidden = true;
        formWrap.hidden = false;
      });
    }
  });
})();
