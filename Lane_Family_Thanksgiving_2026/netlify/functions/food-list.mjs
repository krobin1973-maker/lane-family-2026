import { getMenu } from '../lib/menu-data.mjs';

export default async function handler(request) {
  if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  try {
    const items = await getMenu();
    return Response.json(items, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=15' } });
  } catch (error) {
    console.error('Family food list error:', error.message);
    return Response.json({ error: 'Unable to load dish list' }, { status: 502 });
  }
}
