import Airtable from 'airtable';
import { ReplaceStencilOp } from 'three';
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

    const fruitCollected = {
      kiwis: records[0].fields.kiwisCollected == undefined ? 0 : records[0].fields.kiwisCollected,
      lemons: records[0].fields.lemonsCollected == undefined ? 0 : records[0].fields.lemonsCollected,
      oranges: records[0].fields.orangesCollected == undefined ? 0 : records[0].fields.orangesCollected,
      apples: records[0].fields.applesCollected == undefined ? 0 : records[0].fields.applesCollected,
      blueberries: records[0].fields.blueberriesCollected == undefined ? 0 : records[0].fields.blueberriesCollected,
    }
    res.status(200).json({ fruitCollected });
  } catch (error) {
    console.error('Error resuming jungle stretch:', error);
    res.status(500).json({ message: 'Error resuming jungle stretch' });
  }
} 