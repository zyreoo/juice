import Airtable from 'airtable';
import formidable from 'formidable';
import fs from 'fs';
import AWS from 'aws-sdk';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure AWS SDK v2
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(process.env.AIRTABLE_BASE_ID);

// Function to upload a file to S3
async function uploadToS3(buffer, key, contentType) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType
  };
  return s3.upload(params).promise();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Forward the request to the Express server
    const response = await fetch(`${process.env.EXPRESS_SERVER_URL}/api/video/upload`, {
      method: 'POST',
      body: req,
      headers: {
        ...req.headers,
        host: new URL(process.env.EXPRESS_SERVER_URL).host,
      },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error forwarding request to express server:', error);
    res.status(500).json({ message: 'Error processing video upload' });
  }
} 