import Airtable from "airtable";

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  try {
    // Fetch records for the given user
    const records = await base("omgMoments")
      .select({
        filterByFormula: `{email} = '${email}'`,
        sort: [{ field: "created_at", direction: "desc" }],
      })
      .all();

    const moments = records.map((record) => ({
      id: record.id,
      description: record.fields.description,
      video: record.fields.video,
      created_at: record.fields.created_at,
      status: record.fields.Review,
      comments: record.fields.notes,
      timeHr: Math.round((record.fields.juiceStretches / 3600) * 100) / 100,
    }));

    res.status(200).json(moments);
  } catch (error) {
    console.error("Error fetching OMG moments:", error);
    res.status(500).json({ message: "Error fetching OMG moments" });
  }
}
