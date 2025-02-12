import Airtable from 'airtable';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);



function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
let cacheOfGames = {}
const cacheEvery = 1000 * 60 * 10
const cacheAirtable = 10_000 
let last_airtable_cache = -1
let last_cache = {}
async function getItchGameInfo(gameUrl, retries = 5, delayMs = 2000) {
  if ((last_cache[gameUrl] || -1) > -1 && Date.now() - (last_cache[gameUrl] || -1)  < cacheEvery) {
    return cacheOfGames[gameUrl];
  }
  last_cache[gameUrl] = Date.now()
  cacheOfGames[gameUrl] = null
  try {
    const response = await fetch(gameUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000, 
    });
    if (response.status === 429) {
      console.warn(`Rate limited (429) on ${gameUrl}. Waiting ${delayMs}ms`);
      await delay(delayMs);
      return getItchGameInfo(gameUrl, retries - 1, delayMs * 2); // Exponential backoff
    }
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const html = await response.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(" by itch.io", "").trim() : "Unknown Title";

    let thumbnail = null;
    const metaTags = [
      html.match(/<meta property="og:image" content="(.*?)"/),
      html.match(/<meta name="twitter:image" content="(.*?)"/),
      html.match(/<meta property="og:image:url" content="(.*?)"/),

    ];
    let di = 0;
    for (const match of metaTags) {
      if (match && match[1]) {
        console.log(di, match[0], match[1])
        thumbnail = match[1];
        break;
      }
    }

    if (!thumbnail) {
      const imgMatch = html.match(/<img.*?src=["'](https:\/\/.*?\.itch\.zone\/.*?)["']/);
      if (imgMatch && imgMatch[1] && !thumbnail) {
        thumbnail = imgMatch[1];
      }
    }
    console.log(title, thumbnail)
    cacheOfGames[gameUrl] = { title, thumbnail };
    return { title, thumbnail };

  } catch (error) {
    console.error(`Error fetching ${gameUrl}:`, error.message);

    if (retries > 0) {
      console.warn(`Retrying ${gameUrl} (${retries} attempts left) after ${delayMs}ms`);
      await delay(delayMs);
      return getItchGameInfo(gameUrl, retries - 1, delayMs * 2);
    }

    return { title: "Unknown Title", thumbnail: null };
  }
}

async function fetchGamesSequentially(records) {
  const games = [];
  for (const record of records) {
    const itchurl = record.fields.Link.startsWith("http") ? record.fields.Link : `https://${record.fields.Link}`;
    const itchinfo = await getItchGameInfo(itchurl);
    games.push({
      email: record.fields.user,
      itchurl,
      gamename: itchinfo.title,
      thumbnail: itchinfo.thumbnail
    });

    await delay(3000); // Wait 3 seconds between each request
  }
  return games;
}

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
if(last_airtable_cache > -1 && Date.now() - last_airtable_cache < cacheAirtable && last_cache) {
  return res.status(200).json(last_cache);
}
last_airtable_cache = Date.now()
  try {
    const juiceStart = new Date(Date.now() - 1000000 * 60 * 60 * 1000).toISOString();

    const records = await base('Ships')
      .select({
        filterByFormula: `IS_AFTER({created_at}, '${juiceStart}')`,
        sort: [{ field: 'created_at', direction: 'desc' }],
        fields: ['Link', 'created_at']
      })
      .all();
    function ensureValidUrl(gameUrl) {
      if (!gameUrl.startsWith("http://") && !gameUrl.startsWith("https://")) {
        gameUrl = "https://" + gameUrl;
      }
      
      return gameUrl;
    }

    async function processGamesInBatches(records, batchSize = 10) {
      const games = [];
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        const results = await Promise.allSettled(batch.map(async (record) => {
          const itchurl = ensureValidUrl(record.fields.Link);
          const itchinfo = await getItchGameInfo(itchurl);
          return {
            email: record.fields.user,
            itchurl,
            gamename: itchinfo.title,
            thumbnail: itchinfo.thumbnail
          };
        }));

        results.forEach((result) => {
          if (result.status === "fulfilled") {
            games.push(result.value);
          }
        });
      }
      last_cache = games;
      return games;
    }
    const games = await processGamesInBatches(records);

    res.status(201).json(games);
  } catch (error) {
    console.error('Error fetching gallery records:', error);
    res.status(500).json({ message: 'Error fetching gallery records' });
  }
}

export default handler;
