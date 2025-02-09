import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { thumbnail, token, itchurl, gamename } = req.body;

    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];

    if (thumbnail && token && itchurl && gamename) {
      const image = [{ url: thumbnail }]; 

      const galleryMoment = await base('gallery').create([
        {
          fields: {
            email: signupRecord.fields.email,
            thumbnail: image, 
            itchurl,
            gamename,
            created_at: new Date().toISOString()
          }
        }
      ]);

      return res.status(200).json({ message: 'Gallery record created.', data: galleryMoment });
    } else {
      return res.status(400).json({ message: 'Missing required information' });
    }
  } catch (error) {
    console.error('Error creating gallery record:', error);
    return res.status(500).json({ message: 'Error creating gallery record', error: error.message });
  }
}
