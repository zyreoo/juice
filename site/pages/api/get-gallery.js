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

    const records = await base('gallery')
    .select({
      filterByFormula: `IS_AFTER({created_at}, '${juiceStart}')`,
      sort: [{ field: 'created_at', direction: 'desc' }]
    })
    .all();

   

    const games = records.map(record => ({
      email: record.fields.email,
      itchurl: record.fields.itchurl,
      gamename: record.fields.gamename,
      thumbnail: record.fields.thumbnail[0].url
    }));

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching gallery records:', error);
    res.status(500).json({ message: 'Error fetching gallery records' });
  }
} 
