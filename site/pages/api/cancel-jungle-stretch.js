import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, stretchId } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];

    const records = await base('jungleStretches').select({
      filterByFormula: `{ID} = '${stretchId}'`,
      maxRecords: 1
    }).firstPage();

    if (!records || records.length === 0) {
      return res.status(404).json({ message: 'jungle stretch not found' });
    }

    await base('jungleStretches').update([
      {
        id: records[0].id,
        fields: {
          isCanceled: true
        }
      }
    ]);

    res.status(200).json({});
  } catch (error) {
    console.error('Error canceling jungle stretch:', error);
    res.status(500).json({ message: 'Error canceling jungle stretch' });
  }
} 