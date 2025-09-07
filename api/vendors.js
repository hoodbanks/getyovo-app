import { sql } from './_db.js';
import { withCors } from './_cors.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, message: 'GET only' });
    return;
  }
  try {
    const rows = await sql`
      SELECT id, name, type, logo_url, opening_time, closing_time,
             contact_address, location_lat, location_lng
      FROM vendors
      ORDER BY created_at DESC
    `;
    res.status(200).json({ ok: true, vendors: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e) });
  }
}

export default withCors(handler);
