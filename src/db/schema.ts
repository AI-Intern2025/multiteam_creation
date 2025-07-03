import { pgTable, serial, varchar, real, integer, timestamp, boolean } from 'drizzle-orm/pg-core'

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  fullName: varchar('full_name', { length: 150 }),
  team: varchar('team', { length: 50 }).notNull(), // WI, AUS, etc.
  role: varchar('role', { length: 10 }).notNull(), // BAT, BOWL, WK, ALL
  credits: real('credits').notNull(),
  
  // Performance metrics
  selectionPercentage: real('selection_percentage').default(0),
  points: integer('points').default(0),
  
  // Match context
  isPlayingToday: boolean('is_playing_today').default(true),
  matchTeam: varchar('match_team', { length: 10 }).notNull(), // team1 or team2
  
  // Additional metadata
  country: varchar('country', { length: 3 }),
  battingStyle: varchar('batting_style', { length: 20 }),
  bowlingStyle: varchar('bowling_style', { length: 30 }),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  team1: varchar('team1', { length: 50 }).notNull(),
  team2: varchar('team2', { length: 50 }).notNull(),
  format: varchar('format', { length: 10 }).notNull(), // T20, ODI, TEST
  venue: varchar('venue', { length: 100 }),
  matchDate: timestamp('match_date'),
  startTime: timestamp('start_time'), // When team creation opens
  endTime: timestamp('end_time'), // When team creation closes
  isActive: boolean('is_active').default(true),
  isUpcoming: boolean('is_upcoming').default(true),
  status: varchar('status', { length: 20 }).default('scheduled'), // scheduled, live, completed, cancelled
  createdBy: integer('created_by').references(() => users.id),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { length: 10 }).notNull().default('user'), // 'user' or 'admin'
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
})

export const uploadedScreenshots = pgTable('uploaded_screenshots', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }),
  filePath: varchar('file_path', { length: 500 }),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  processedData: varchar('processed_data', { length: 5000 }), // JSON string
  confidence: real('confidence'),
  status: varchar('status', { length: 20 }).default('pending'), // 'pending', 'processed', 'failed'
  
  createdAt: timestamp('created_at').defaultNow()
})

export type Player = typeof players.$inferSelect
export type NewPlayer = typeof players.$inferInsert
export type Match = typeof matches.$inferSelect
export type NewMatch = typeof matches.$inferInsert
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UploadedScreenshot = typeof uploadedScreenshots.$inferSelect
export type NewUploadedScreenshot = typeof uploadedScreenshots.$inferInsert
