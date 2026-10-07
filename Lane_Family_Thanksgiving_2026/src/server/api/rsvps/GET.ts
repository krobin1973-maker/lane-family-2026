import type { Request, Response } from 'express';
import { db } from '../../db/client.js';
import { rsvps } from '../../db/schema.js';
import { sum } from 'drizzle-orm';

export default async function handler(_req: Request, res: Response) {
  try {
    const [totals] = await db
      .select({
        totalThursday: sum(rsvps.guestsThursday),
        totalFriday: sum(rsvps.guestsFriday),
        totalSaturday: sum(rsvps.guestsSaturday),
        totalSunday: sum(rsvps.guestsSunday),
      })
      .from(rsvps);

    const [countRow] = await db
      .select({ count: sum(rsvps.id) })
      .from(rsvps);

    res.json({
      headcount: {
        thursday: Number(totals?.totalThursday ?? 0),
        friday: Number(totals?.totalFriday ?? 0),
        saturday: Number(totals?.totalSaturday ?? 0),
        sunday: Number(totals?.totalSunday ?? 0),
      },
      totalRsvps: Number(countRow?.count ?? 0),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch headcount', message: String(error) });
  }
}
