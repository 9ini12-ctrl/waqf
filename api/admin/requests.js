function getConfig() {
  return {
    supabaseUrl: (process.env.SUPABASE_URL || "").trim().replace(/\/$/, ""),
    serviceRoleKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim(),
    adminToken: (process.env.ADMIN_DASHBOARD_TOKEN || "").trim()
  };
}

function isAuthorized(req, adminToken) {
  const incomingToken = (req.headers["x-admin-token"] || "").toString().trim();
  return Boolean(adminToken) && incomingToken === adminToken;
}

function buildHeaders(serviceRoleKey) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json"
  };
}

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { supabaseUrl, serviceRoleKey, adminToken } = getConfig();

  if (!supabaseUrl || !serviceRoleKey || !adminToken) {
    return res.status(500).json({ error: "Missing server configuration" });
  }

  if (!isAuthorized(req, adminToken)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const q = (req.query.q || "").toString().trim();
  const status = (req.query.status || "all").toString().trim();
  const rawLimit = Number(req.query.limit || 120);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 120;

  const params = new URLSearchParams();
  params.set(
    "select",
    "request_number,option_id,option_title,applicant_name,phone,city,preferred_contact,email,route_result,recommendation,status,required_actions,timeline,answers,created_at,updated_at"
  );
  params.set("order", "created_at.desc");
  params.set("limit", String(limit));

  if (status && status !== "all") {
    params.set("status", `eq.${status}`);
  }

  if (q) {
    params.set("or", `(request_number.ilike.*${q}*,applicant_name.ilike.*${q}*,phone.ilike.*${q}*)`);
  }

  const url = `${supabaseUrl}/rest/v1/waqf_requests?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: buildHeaders(serviceRoleKey)
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({ error: payload?.message || "Failed to load requests" });
    }

    return res.status(200).json({ requests: Array.isArray(payload) ? payload : [] });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to reach Supabase" });
  }
};
