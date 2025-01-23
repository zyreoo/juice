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

    // Get juiceStretches for this user
    const stretches = await base('juiceStretches').select({
      filterByFormula: `{email (from Signups)} = '${userData.email}'`,
    }).firstPage();

    // Calculate total duration in hours
    let totalHours = 0;
    stretches.forEach(record => {
      const startTime = record.fields.startTime;
      const endTime = record.fields.endTime;
      
      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationHours = (end - start) / (1000 * 60 * 60); // Convert ms to hours
        totalHours += durationHours;
      }
    });

    userData.totalStretchHours = Math.round(totalHours * 100) / 100; // Round to 2 decimal places

    // Get all OMG moments for this user and sum up kudos
    const omgMoments = await base('omgMoments').select({
      filterByFormula: `{email} = '${userData.email}'`
    }).all();

    let totalKudos = 0;
    omgMoments.forEach(moment => {
      totalKudos += moment.fields.kudos || 0;
    });

    userData.totalKudos = totalKudos;
    
    res.status(200).json({ userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
} 