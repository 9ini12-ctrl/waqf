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

function buildHeaders(serviceRoleKey, withPrefer = false) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    ...(withPrefer ? { Prefer: "return=representation" } : {})
  };
}

async function fetchSingleRequest({ supabaseUrl, serviceRoleKey, requestNumber }) {
  const params = new URLSearchParams();
  params.set(
    "select",
    "request_number,option_id,option_title,applicant_name,phone,city,preferred_contact,email,route_result,recommendation,status,required_actions,timeline,answers,created_at,updated_at"
  );
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
  if (!["GET", "PATCH"].includes(req.method || "")) {
    res.setHeader("Allow", "GET, PATCH");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { supabaseUrl, serviceRoleKey, adminToken } = getConfig();

  if (!supabaseUrl || !serviceRoleKey || !adminToken) {
    return res.status(500).json({ error: "Missing server configuration" });
  }

  if (!isAuthorized(req, adminToken)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const requestNumber = (req.query.requestNumber || "").toString().trim().toUpperCase();
    if (!requestNumber) {
      return res.status(400).json({ error: "requestNumber is required" });
    }

    try {
      const request = await fetchSingleRequest({ supabaseUrl, serviceRoleKey, requestNumber });
      if (!request) {
        return res.status(404).json({ error: "Request not found" });
      }

      return res.status(200).json({ request });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Failed to load request" });
    }
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  } catch (_error) {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const requestNumber = (body.requestNumber || "").toString().trim().toUpperCase();
  const status = (body.status || "").toString().trim();
  const recommendation = (body.recommendation || "").toString().trim();
  const updateNote = (body.updateNote || "").toString().trim();
  const requiredActions = Array.isArray(body.requiredActions)
    ? body.requiredActions.map((item) => String(item || "").trim()).filter(Boolean)
    : null;

  if (!requestNumber) {
    return res.status(400).json({ error: "requestNumber is required" });
  }

  if (!status) {
    return res.status(400).json({ error: "status is required" });
  }

  try {
    const existing = await fetchSingleRequest({ supabaseUrl, serviceRoleKey, requestNumber });
    if (!existing) {
      return res.status(404).json({ error: "Request not found" });
    }

    const timeline = Array.isArray(existing.timeline) ? [...existing.timeline] : [];
    const previousStatus = String(existing.status || "").trim();

    if (updateNote) {
      timeline.push({
        status,
        note: updateNote,
        at: new Date().toISOString()
      });
    } else if (previousStatus !== status) {
      timeline.push({
        status,
        note: `تم تحديث الحالة من "${previousStatus || "غير محدد"}" إلى "${status}"`,
        at: new Date().toISOString()
      });
    }

    const patchBody = {
      status,
      recommendation,
      timeline
    };

    if (requiredActions) {
      patchBody.required_actions = requiredActions;
    }

    const params = new URLSearchParams();
    params.set("request_number", `eq.${requestNumber}`);
    params.set(
      "select",
      "request_number,option_id,option_title,applicant_name,phone,city,preferred_contact,email,route_result,recommendation,status,required_actions,timeline,answers,created_at,updated_at"
    );

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/waqf_requests?${params.toString()}`, {
      method: "PATCH",
      headers: buildHeaders(serviceRoleKey, true),
      body: JSON.stringify(patchBody)
    });

    const updatePayload = await updateResponse.json().catch(() => ({}));

    if (!updateResponse.ok) {
      return res.status(updateResponse.status).json({ error: updatePayload?.message || "Failed to update request" });
    }

    const updated = Array.isArray(updatePayload) ? updatePayload[0] || null : null;
    if (!updated) {
      return res.status(500).json({ error: "Update succeeded but no data returned" });
    }

    return res.status(200).json({ request: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to update request" });
  }
};
