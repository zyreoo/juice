import { table } from '@/utils/Airtable';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const records = await table('omgMoments')
      .select({
        filterByFormula: `{email} = '${email}'`,
        sort: [{ field: 'createdTime', direction: 'desc' }]
      })
      .all();

    const moments = records.map(record => ({
      id: record.id,
      ...record.fields
    }));

    return res.status(200).json({ moments });
  } catch (error) {
    console.error('Error fetching moments:', error);
    return res.status(500).json({ message: 'Error fetching moments' });
  }
}
