function getConfig() {
  return {
    supabaseUrl: (process.env.SUPABASE_URL || "").trim().replace(/\/$/, ""),
    serviceRoleKey: (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()
  };
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

  const { supabaseUrl, serviceRoleKey } = getConfig();
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Missing server configuration" });
  }

  const token = (req.query.token || "").toString().trim().toLowerCase();
  if (!token || token.length < 20) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const params = new URLSearchParams();
  params.set(
    "select",
    "request_number,option_id,option_title,applicant_name,status,route_result,recommendation,required_actions,timeline,created_at,updated_at"
  );
  params.set("tracking_token", `eq.${token}`);
  params.set("limit", "1");

  const url = `${supabaseUrl}/rest/v1/waqf_requests?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: buildHeaders(serviceRoleKey)
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return res.status(response.status).json({ error: payload?.message || "Failed to fetch request" });
    }

    const request = Array.isArray(payload) ? payload[0] || null : null;
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    return res.status(200).json({ request });
  } catch (_error) {
    return res.status(500).json({ error: "Failed to reach Supabase" });
  }
};
