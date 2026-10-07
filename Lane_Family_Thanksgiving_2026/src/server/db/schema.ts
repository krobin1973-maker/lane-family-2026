import { mysqlTable, int, varchar, timestamp, text } from 'drizzle-orm/mysql-core';

export const rsvps = mysqlTable('rsvps', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  guestsThursday: int('guests_thursday').notNull().default(0),
  guestsFriday: int('guests_friday').notNull().default(0),
  guestsSaturday: int('guests_saturday').notNull().default(0),
  guestsSunday: int('guests_sunday').notNull().default(0),
  notes: text('notes'),
  dietaryRestrictions: text('dietary_restrictions'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const foodSignups = mysqlTable('food_signups', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  dish: varchar('dish', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull().default('Other'),
  serves: varchar('serves', { length: 50 }).notNull().default(''),
  createdAt: timestamp('created_at').defaultNow(),
});
