import { getAirtableBase } from '../utils/airtable.js';

export async function getUserData(req, res) {
  console.log('getUserData called');
  const base = getAirtableBase();
  
  if (req.method !== 'GET') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authToken = req.headers.authorization?.split(' ')[1];
  if (!authToken) {
    console.log('No auth token provided');
    return res.status(401).json({ message: 'No auth token provided' });
  }

  try {
    // Escape single quotes in authToken to prevent injection
    const safeAuthToken = authToken.replace(/'/g, "\\'");
    
    // Get user data
    const records = await base(process.env.AIRTABLE_TABLE_NAME).select({
      filterByFormula: `{token} = '${safeAuthToken}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = records[0].fields;
    const safeEmail = userData.email.replace(/'/g, "\\'");

    // Run all main queries in parallel
    const [
      // juiceStretches,
      // jungleStretches,
      omgMoments,
      tokenFruitConversionRecords
    ] = await Promise.all([
      // base('juiceStretches').select({
      //   filterByFormula: `AND({email (from Signups)} = '${safeEmail}', NOT({omgMoments} = ''))`,
      //   fields: ['ID', 'startTime', 'endTime', 'timeWorkedHours', 'timeWorkedSeconds', 'totalPauseTimeSeconds', 'Review', 'omgMoments']
      // }).firstPage(),
      
      // base('jungleStretches').select({
      //   filterByFormula: `AND({email (from Signups)} = '${safeEmail}', {endtime}, NOT({isCanceled}))`,
      //   fields: ['timeWorkedSeconds', 'countsForBoss', 'isRedeemed', 
      //           'kiwisCollected', 'lemonsCollected', 'orangesCollected', 
      //           'applesCollected', 'blueberriesCollected']
      // }).firstPage(),
      
      base('omgMoments').select({
        filterByFormula: `{email} = '${safeEmail}'`,
        fields: ['kudos']
      }).all(),
      
      base("fruitPricesProbabilities - Do not modify").select({
        fields: ['fruit', 'tokens']
      }).firstPage()
    ]);

    // Set empty arrays/values for juice and jungle data
    userData.juiceStretches = [];
    userData.totalJuiceHours = 0;
    userData.totalJungleHours = 0;
    userData.totalTokens = 0;
    userData.totalRedeemableTokens = 0;

    // Calculate total kudos (keeping this functionality)
    //userData.totalKudos = omgMoments.reduce((sum, moment) => sum + (moment.fields.kudos || 0), 0);
    userData.totalKudos = 0;

    res.status(200).json({ userData });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
} 