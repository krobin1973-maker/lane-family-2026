import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { foodSignups } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    const { name, dish, category, serves } = req.body;
    if (!name || !dish) {
      return res.status(400).json({ error: 'Name and dish are required' });
    }
    const result = await db.insert(foodSignups).values({
      name: String(name).trim(),
      dish: String(dish).trim(),
      category: String(category || 'Other').trim(),
      serves: String(serves || '').trim(),
    });
    const insertId = Number(result[0].insertId);
    const [newItem] = await db.select().from(foodSignups).where(eq(foodSignups.id, insertId));
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add food signup', message: String(error) });
  }
}
