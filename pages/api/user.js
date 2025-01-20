import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authToken = req.headers.authorization?.split(' ')[1];
  if (!authToken) {
    return res.status(401).json({ message: 'No auth token provided' });
  }

  try {
    // Search for user with matching token in the Signups table
    const records = await base(process.env.AIRTABLE_TABLE_NAME).select({
      filterByFormula: `{token} = '${authToken}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = records[0].fields;
    res.status(200).json({ userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
} 