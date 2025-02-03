import Airtable from 'airtable';
import { v4 as uuidv4 } from 'uuid';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, githubLink, itchLink } = req.body;
    
    // Get user's email from Signups table
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];
    const stretchId = uuidv4();
    // console.log("singup " + signupRecord.id)

    // Create new record in jungleStretches with a reference to the Signups record
    const bossFought = (await base('jungleBossesFought').create([
      {
        fields: {
          ID: stretchId,
          githubLink,
          itchLink,
          user: [signupRecord.id], // Link to the Signups record
          timeFought: new Date().toISOString()
        }
      }
    ]))[0];

    // Retrieve the current jungleStretches record
    const jungleStretchesRecords = await base('jungleStretches').select({
      filterByFormula: `
            AND(
            {email (from Signups)} = '${signupRecord.fields.email}',
            ({endtime}),
            NOT({isCanceled})
            )
        `,
      maxRecords: 1
    }).all();

    if (!jungleStretchesRecords || jungleStretchesRecords.length === 0) {
      return res.status(404).json({ message: 'Jungle stretch not found' });
    }

    console.log(jungleStretchesRecords)

    jungleStretchesRecords.forEach(async (jungleStretchesRecord) => {
      const currentBossesFought = jungleStretchesRecord.fields.jungleBossesFought || [];

      // Update the jungleStretches record by appending the new bossFought.id
      const jungleStretch = await base("jungleStretches").update([
        {
          id: jungleStretchesRecord.id,
          fields: {
            jungleBossesFought: [...currentBossesFought, bossFought.id]
          }
        }
      ]);
    })
    
    res.status(200).json({ stretchId });
  } catch (error) {
    console.error('Error starting jungle stretch:', error);
    res.status(500).json({ message: 'Error starting jungle stretch' });
  }
} 