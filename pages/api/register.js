import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Create record in Airtable - using just the email field
    const record = await base(process.env.AIRTABLE_TABLE_NAME).create([
      {
        fields: {
          Email: email,
          // Remove SignupDate since it doesn't exist in the table
        }
      }
    ]);

    return res.status(200).json({ success: true, record });
  } catch (error) {
    console.error('Registration error:', error);
    // Send more specific error message back to client
    return res.status(500).json({ 
      message: error.message || 'Error processing registration',
      error: error.error || 'UNKNOWN_ERROR'
    });
  }
} 