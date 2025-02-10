import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const juiceStart = new Date(Date.now() - 1000000 * 60 * 60 * 1000).toISOString();

    const records = await base('Ships')
      .select({
        filterByFormula: `IS_AFTER({created_at}, '${juiceStart}')`,
        sort: [{ field: 'created_at', direction: 'desc' }]
      })
      .all();

    function ensureValidUrl(gameUrl) {
      if (!gameUrl.startsWith("http://") && !gameUrl.startsWith("https://")) {
        gameUrl = "https://" + gameUrl;
      }
      return gameUrl;
    }

    async function getItchGameInfo(gameUrl) {
      try {
        if (!gameUrl.startsWith("http://") && !gameUrl.startsWith("https://")) {
          gameUrl = "https://" + gameUrl;
        }

        const response = await fetch(gameUrl);
        if (!response.ok) throw new Error("Failed to fetch game page");

        const html = await response.text();

        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].replace(" by itch.io", "").trim() : "Unknown Title";

        let thumbnail = null;
        const metaTags = [
          html.match(/<meta property="og:image" content="(.*?)"/),
          html.match(/<meta name="twitter:image" content="(.*?)"/),
          html.match(/<meta property="og:image:url" content="(.*?)"/)
        ];

        for (const match of metaTags) {
          if (match && match[1]) {
            thumbnail = match[1];
            break;
          }
        }

        if (!thumbnail) {
          const imgMatch = html.match(/<img.*?src=["'](https:\/\/.*?\.itch\.zone\/.*?)["']/);
          if (imgMatch && imgMatch[1]) {
            thumbnail = imgMatch[1];
          }
        }

        return { title, thumbnail };

      } catch (error) {
        console.error("Error fetching Itch.io game info:", error);
        return { title: "Unknown Title", thumbnail: null };
      }
    }

    const games = await Promise.all(
      records.map(async (record) => {
        const itchurl = ensureValidUrl(record.fields.Link);
        const itchinfo = await getItchGameInfo(itchurl);
        return {
          email: record.fields.user,
          itchurl,
          gamename: itchinfo.title,
          thumbnail: itchinfo.thumbnail
        };
      })
    );

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching gallery records:', error);
    res.status(500).json({ message: 'Error fetching gallery records' });
  }
}
