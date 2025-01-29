import Airtable from 'airtable';

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward the request to the Express server
    const response = await fetch('https://sww48o88cs88sg8k84g4s4kg.a.selfhosted.hackclub.com/api/video/upload', {
      method: 'POST',
      body: req,
      duplex: 'half',
      headers: {
        ...req.headers,
        host: new URL('https://sww48o88cs88sg8k84g4s4kg.a.selfhosted.hackclub.com').host,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    const responseText = await response.text();
    console.log('Response body:', responseText);

    try {
      const data = JSON.parse(responseText);
      res.status(response.status).json(data);
    } catch (parseError) {
      console.error('Error parsing response as JSON:', parseError);
      res.status(500).json({ 
        message: 'Invalid response from server',
        responseText: responseText.substring(0, 200) + '...' // Log first 200 chars in case it's very long
      });
    }
  } catch (error) {
    console.error('Error forwarding request to express server:', error);
    res.status(500).json({ message: 'Error processing video upload' });
  }
} 