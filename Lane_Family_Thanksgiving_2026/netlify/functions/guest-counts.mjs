
export default async function handler() {
  const token = process.env.LANE_FORMS_API_TOKEN;
  const siteId = process.env.SITE_ID;

  if (!token || !siteId) {
    return Response.json(
      { error: "Guest counter is not configured" },
      { status: 500 }
    );
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  try {
    const api = "https://api.netlify.com/api/v1";

    const formsResponse = await fetch(
      `${api}/sites/${siteId}/forms`,
      { headers }
    );

    if (!formsResponse.ok) {
    throw new Error(`Unable to access forms (HTTP ${formsResponse.status})`);  
    }

    const forms = await formsResponse.json();
    const rsvpForm = forms.find(
      (form) => form.name === "lane-rsvp"
    );

    if (!rsvpForm) {
      throw new Error("RSVP form not found");
    }

    const totals = {
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
      totalRsvps: 0,
    };

    for (let page = 1; page <= 20; page++) {
      const response = await fetch(
        `${api}/forms/${rsvpForm.id}/submissions?page=${page}&per_page=100`,
        { headers }
      );

      if (!response.ok) {
       throw new Error(`Unable to read RSVPs (HTTP ${response.status})`);
      }

      const submissions = await response.json();

      for (const submission of submissions) {
        const data = submission.data || {};

        for (const day of [
          "Thursday", "Friday", "Saturday", "Sunday"
        ]) {
          const count = Number(data[`guests${day}`]);
          if (Number.isFinite(count) && count > 0) {
            const key = day.toLowerCase();
            totals[key] += Math.floor(count);
          }
        }

        totals.totalRsvps++;
      }

      if (submissions.length < 100) break;
    }

    return Response.json(totals, {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=30",
      },
    });
  } catch (error) {
    console.error("Guest counter failed:", error.message);

    return Response.json(
      { error: "Unable to load guest counts" },
      { status: 500 }
    );
  }
}
