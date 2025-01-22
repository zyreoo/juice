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
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });
    
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Extract first value from array fields
    const token = Array.isArray(fields.token) ? fields.token[0] : fields.token;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    const stretchId = Array.isArray(fields.stretchId) ? fields.stretchId[0] : fields.stretchId;
    const stopTime = Array.isArray(fields.stopTime) ? fields.stopTime[0] : fields.stopTime;
    
    if (!files.video) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;

    // Get user's email from Signups table
    const signupRecords = await base('Signups').select({
      filterByFormula: `{token} = '${token}'`,
      maxRecords: 1
    }).firstPage();

    if (!signupRecords || signupRecords.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const signupRecord = signupRecords[0];

    // Upload video to S3
    const videoBuffer = fs.readFileSync(videoFile.filepath);
    const s3Key = `omg-moments/${Date.now()}-${videoFile.originalFilename}`;
    const s3Upload = await uploadToS3(videoBuffer, s3Key, videoFile.mimetype);

    // Create OMG moment record with video URL
    const omgMoments = await base('omgMoments').create([
      {
        fields: {
          description: description,
          email: signupRecord.fields.email,
          video: s3Upload.Location
        }
      }
    ]);

    const omgMoment = omgMoments[0];
    console.log('Created OMG moment:', omgMoment.id);
    console.log('Updating juice stretch:', stretchId);

    // First find the juice stretch record to verify it exists
    const stretchRecords = await base('juiceStretches').select({
      filterByFormula: `{ID} = '${stretchId}'`
    }).firstPage();

    if (!stretchRecords || stretchRecords.length === 0) {
      throw new Error(`Juice stretch not found with ID: ${stretchId}`);
    }

    const stretchRecord = stretchRecords[0];
    console.log('Found juice stretch record:', stretchRecord.id);

    // Update juice stretch with end time and link to OMG moment
    await base('juiceStretches').update([{
      id: stretchRecord.id,
      fields: {
        endTime: stopTime,
        omgMoments: [omgMoment.id]
      }
    }]);

    // Clean up the temporary file
    fs.unlinkSync(videoFile.filepath);

    res.status(200).json({ message: 'OMG moment created and juice stretch ended' });
  } catch (error) {
    console.error('Error creating OMG moment:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ message: 'Error creating OMG moment' });
  }
} 