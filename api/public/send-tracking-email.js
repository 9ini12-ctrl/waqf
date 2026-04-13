function getConfig() {
  return {
    supabaseUrl: (process.env.SUPABASE_URL || "").trim().replace(/\/$/, ""),
    serviceRoleKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim(),
    resendApiKey: (process.env.RESEND_API_KEY || "").trim(),
    mailFrom: (process.env.MAIL_FROM || "").trim(),
    appBaseUrl: (process.env.APP_BASE_URL || "").trim().replace(/\/$/, "")
  };
}

function buildHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json"
  };
}

async function fetchRequestByNumber({ supabaseUrl, serviceRoleKey, requestNumber }) {
  const params = new URLSearchParams();
  params.set("select", "request_number,tracking_token,email,applicant_name");
  params.set("request_number", `eq.${requestNumber}`);
  params.set("limit", "1");

  const response = await fetch(`${supabaseUrl}/rest/v1/waqf_requests?${params.toString()}`, {
    method: "GET",
    headers: buildHeaders(serviceRoleKey)
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || "Failed to load request");
  }

  return Array.isArray(payload) ? payload[0] || null : null;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { supabaseUrl, serviceRoleKey, resendApiKey, mailFrom, appBaseUrl } = getConfig();

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Missing server configuration" });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch (_error) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const email = (body.email || "").toString().trim().toLowerCase();
  const name = (body.name || "").toString().trim() || "مقدم الطلب";
  const requestNumber = (body.requestNumber || "").toString().trim().toUpperCase();
  const trackingToken = (body.trackingToken || "").toString().trim().toLowerCase();
  const incomingTrackingUrl = (body.trackingUrl || "").toString().trim();

  if (!email || !requestNumber || !trackingToken) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const request = await fetchRequestByNumber({ supabaseUrl, serviceRoleKey, requestNumber });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    const dbToken = String(request.tracking_token || "").toLowerCase();
    const dbEmail = String(request.email || "").toLowerCase();

    if (!dbToken || dbToken !== trackingToken || (dbEmail && dbEmail !== email)) {
      return res.status(403).json({ error: "Email verification failed" });
    }

    const trackingUrl = incomingTrackingUrl || `${appBaseUrl || ""}/track.html?token=${encodeURIComponent(trackingToken)}`;

    if (!resendApiKey || !mailFrom) {
      return res.status(200).json({
        sent: false,
        message: "لم يتم إرسال البريد تلقائيًا (مزود البريد غير مهيأ)."
      });
    }

    const subject = `رابط متابعة طلبك - ${requestNumber}`;
    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.8; color: #1f2937;">
        <p>السلام عليكم ${escapeHtml(name)}،</p>
        <p>تم استلام طلبكم بنجاح، ويمكنكم متابعة الحالة عبر الرابط التالي:</p>
        <p><a href="${escapeHtml(trackingUrl)}" style="color: #9c604f; font-weight: bold;">متابعة الطلب</a></p>
        <p>رقم الطلب: <strong>${escapeHtml(requestNumber)}</strong></p>
        <p>نسأل الله أن يبارك في وقفكم.</p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: mailFrom,
        to: [email],
        subject,
        html
      })
    });

    const emailPayload = await emailResponse.json().catch(() => ({}));

    if (!emailResponse.ok) {
      return res.status(500).json({
        sent: false,
        error: emailPayload?.message || "Failed to send email"
      });
    }

    return res.status(200).json({ sent: true });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to process email" });
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
