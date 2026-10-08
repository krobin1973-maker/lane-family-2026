import { createHash, timingSafeEqual, randomUUID } from 'node:crypto';
import { categories, getMenu, readChanges, writeChanges } from '../lib/menu-data.mjs';

const headers = { 'Cache-Control': 'no-store', 'Pragma': 'no-cache' };
function json(data, status = 200) { return Response.json(data, { status, headers }); }

function authorized(request) {
  const expected = process.env.LANE_MENU_ADMIN_PASSWORD;
  if (!expected || expected.length < 16) return false;
  const supplied = (request.headers.get('Authorization') || '').replace(/^Bearer /i, '');
  const a = createHash('sha256').update(supplied).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

function cleanItem(item) {
  if (!item || typeof item !== 'object') return null;
  const dish = typeof item.dish === 'string' ? item.dish.trim() : '';
  const name = typeof item.name === 'string' ? item.name.trim() : '';
  if (!dish || !name || dish.length > 160 || name.length > 120) return null;
  const serves = typeof item.serves === 'string' ? item.serves.trim().slice(0, 100) : '';
  const category = categories.includes(item.category) ? item.category : 'Other';
  return { dish, name, category, serves };
}

export default async function handler(request) {
  if (!process.env.LANE_MENU_ADMIN_PASSWORD || process.env.LANE_MENU_ADMIN_PASSWORD.length < 16) {
    return json({ error: 'Organizer password has not been configured in Netlify.' }, 503);
  }
  if (!authorized(request)) return json({ error: 'Incorrect organizer password.' }, 401);
  try {
    if (request.method === 'GET') {
      return json({ items: await getMenu() });
    }
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    const raw = await request.text();
    if (raw.length > 8192) return json({ error: 'Request is too large' }, 413);
    let body;
    try { body = JSON.parse(raw); } catch { return json({ error: 'Invalid request' }, 400); }
    if (body.action !== 'save' && body.action !== 'remove') {
      return json({ error: 'Invalid action' }, 400);
    }
    const id = typeof body.id === 'string' ? body.id.trim() : '';
    if (id && (id.length > 128 || !/^[a-zA-Z0-9_-]+$/.test(id))) {
      return json({ error: 'Invalid entry identifier' }, 400);
    }
    if (body.action === 'remove' && !id) return json({ error: 'Choose an entry to remove' }, 400);
    const item = body.action === 'save' ? cleanItem(body.item) : null;
    if (body.action === 'save' && !item) return json({ error: 'Enter a name and a dish (under 120/160 characters)' }, 400);
    const changes = await readChanges();
    const targetId = id || `admin-${randomUUID()}`;
    if (body.action === 'remove') {
      changes[targetId] = { deleted: true, updatedAt: new Date().toISOString() };
    } else {
      changes[targetId] = {
        item,
        updatedAt: new Date().toISOString(),
        createdAt: changes[targetId]?.createdAt || new Date().toISOString(),
      };
    }
    await writeChanges(changes);
    return json({ ok: true, id: targetId });
  } catch (error) {
    console.error('Organizer menu action failed:', error.message);
    return json({ error: 'Unable to save menu changes. Please try again.' }, 502);
  }
}
