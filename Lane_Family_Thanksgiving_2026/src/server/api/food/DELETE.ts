import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { foodSignups } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    await db.delete(foodSignups).where(eq(foodSignups.id, id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete', message: String(error) });
  }
}
