module.exports = (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabaseUrl =
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
  const supabaseAnonKey =
    (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    supabaseUrl,
    supabaseAnonKey
  });
};
