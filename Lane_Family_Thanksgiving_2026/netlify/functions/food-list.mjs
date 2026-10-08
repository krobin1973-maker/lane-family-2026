// Read saved Netlify Forms submissions without exposing the access token.
export default async function handler() {
  const token = process.env.LANE_FORMS_API_TOKEN;
  const siteId = process.env.SITE_ID;
  if (!token || !siteId) {
    return Response.json({ error: "Dish list is not configured" }, { status: 503 });
  }
  try {
    const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
    const api = "https://api.netlify.com/api/v1";
    const formsRes = await fetch(`${api}/sites/${encodeURIComponent(siteId)}/forms`, { headers });
    if (!formsRes.ok) throw new Error(`Listing forms HTTP ${formsRes.status}`);
    const forms = await formsRes.json();
    const form = forms.find((f) => f.name === "lane-food");
    if (!form) return Response.json([], { headers: { "Cache-Control": "public, max-age=0, s-maxage=30" } });
    const result = [];
    for (let page = 1; page <= 20; page++) {
      const resp = await fetch(`${api}/forms/${encodeURIComponent(form.id)}/submissions?page=${page}&per_page=100`, { headers });
      if (!resp.ok) throw new Error(`Reading dishes HTTP ${resp.status}`);
      const submissions = await resp.json();
      for (const submission of submissions) {
        const d = submission.data || {};
        if (typeof d.dish !== "string" || typeof d.name !== "string") continue;
        result.push({
          id: String(submission.id),
          name: d.name.slice(0, 120),
          dish: d.dish.slice(0, 160),
          category: ["Main Dish", "Side Dish", "Dessert", "Appetizer", "Drinks", "Other"].includes(d.category) ? d.category : "Other",
          serves: typeof d.serves === "string" ? d.serves.slice(0, 100) : "",
          createdAt: submission.created_at || "",
        });
      }
      if (submissions.length < 100) break;
    }
    return Response.json(result.reverse(), { headers: { "Cache-Control": "public, max-age=0, s-maxage=30" } });
  } catch (error) {
    console.error("Food list failed:", error.message);
    return Response.json({ error: "Unable to load dish list" }, { status: 502 });
  }
}
