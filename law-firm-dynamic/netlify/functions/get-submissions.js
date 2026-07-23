// Netlify Function: GET /.netlify/functions/get-submissions
//
// Password-protected endpoint used by /admin.html to list submissions to the
// "enquiry" form. Requires two environment variables set in the Netlify
// dashboard (Site settings → Environment variables):
//
//   NETLIFY_API_TOKEN  — a personal access token (User settings → Applications
//                         → New access token) with access to this site.
//   NETLIFY_SITE_ID    — this site's API ID (Site settings → General → Site
//                         details → "Site ID" — NOT the site name).
//   ADMIN_PASSWORD     — the password /admin.html should require.
//
// The client sends the password in the x-admin-password header. This is a
// deliberately simple gate for an internal tool with a handful of staff users
// — see the README's security notes before relying on this for anything more
// sensitive.

exports.handler = async function (event) {
  const jsonHeaders = { "Content-Type": "application/json" };

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: jsonHeaders, body: JSON.stringify({ error: "Method not allowed." }) };
  }

  const { NETLIFY_API_TOKEN, NETLIFY_SITE_ID, ADMIN_PASSWORD } = process.env;

  if (!NETLIFY_API_TOKEN || !NETLIFY_SITE_ID || !ADMIN_PASSWORD) {
    return {
      statusCode: 503,
      headers: jsonHeaders,
      body: JSON.stringify({
        error:
          "Admin access isn't configured yet. Set NETLIFY_API_TOKEN, NETLIFY_SITE_ID, and ADMIN_PASSWORD in the Netlify dashboard (see README).",
      }),
    };
  }

  const providedPassword = event.headers["x-admin-password"] || event.headers["X-Admin-Password"];
  if (!providedPassword || providedPassword !== ADMIN_PASSWORD) {
    return { statusCode: 401, headers: jsonHeaders, body: JSON.stringify({ error: "Unauthorized." }) };
  }

  try {
    // 1. Find the "enquiry" form's ID for this site.
    const formsRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/forms`, {
      headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` },
    });

    if (!formsRes.ok) {
      throw new Error(`Netlify API error listing forms (${formsRes.status}).`);
    }

    const forms = await formsRes.json();
    const enquiryForm = forms.find((f) => f.name === "enquiry");

    if (!enquiryForm) {
      return {
        statusCode: 200,
        headers: jsonHeaders,
        body: JSON.stringify({
          submissions: [],
          note: "No 'enquiry' form found yet on this site — it appears after the first deploy that includes consultation.html, and after Netlify has processed at least one build.",
        }),
      };
    }

    // 2. Fetch its submissions.
    const submissionsRes = await fetch(
      `https://api.netlify.com/api/v1/forms/${enquiryForm.id}/submissions`,
      { headers: { Authorization: `Bearer ${NETLIFY_API_TOKEN}` } }
    );

    if (!submissionsRes.ok) {
      throw new Error(`Netlify API error listing submissions (${submissionsRes.status}).`);
    }

    const submissions = await submissionsRes.json();

    const cleaned = submissions
      .map((s) => ({
        id: s.id,
        createdAt: s.created_at,
        fullName: s.data.fullName || "",
        email: s.data.email || "",
        phone: s.data.phone || "",
        practiceArea: s.data.practiceArea || "",
        preferredContact: s.data.preferredContact || "",
        message: s.data.message || "",
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { statusCode: 200, headers: jsonHeaders, body: JSON.stringify({ submissions: cleaned }) };
  } catch (err) {
    return { statusCode: 502, headers: jsonHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
