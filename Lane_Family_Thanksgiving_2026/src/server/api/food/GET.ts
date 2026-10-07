import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { foodSignups } from '../../db/schema.js';
import { asc } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const items = await db.select().from(foodSignups).orderBy(asc(foodSignups.createdAt));
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch food signups', message: String(error) });
  }
}
