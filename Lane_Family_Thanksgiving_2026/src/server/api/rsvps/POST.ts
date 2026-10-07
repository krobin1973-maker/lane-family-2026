import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { rsvps } from '../../db/schema.js';

export default async function handler(req: Request, res: Response) {
  try {
    const { name, email, guestsThursday, guestsFriday, guestsSaturday, guestsSunday, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    await db.insert(rsvps).values({
      name: String(name).trim(),
      email: String(email).trim(),
      guestsThursday: Math.max(0, Number(guestsThursday) || 0),
      guestsFriday: Math.max(0, Number(guestsFriday) || 0),
      guestsSaturday: Math.max(0, Number(guestsSaturday) || 0),
      guestsSunday: Math.max(0, Number(guestsSunday) || 0),
      notes: notes ? String(notes).trim() : null,
    });

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save RSVP', message: String(error) });
  }
}
