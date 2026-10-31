import * as SQLite from 'expo-sqlite';
import { daysAgoStr } from '../utils/date';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

// Everyone who needs the database calls this.
// It opens the database only once and reuses it.
export function getDb() {
  if (!dbPromise) {
    dbPromise = setupDatabase();
  }
  return dbPromise;
}

async function setupDatabase() {
  const db = await SQLite.openDatabaseAsync('healthmate.db');

  // Create the table if it doesn't exist yet
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS health_records (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      date     TEXT    NOT NULL,
      steps    INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      water    INTEGER NOT NULL
    );
  `);

  // Add dummy data, but only the first time (when the table is empty)
  const row = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) AS count FROM health_records'
  );

  if (row && row.count === 0) {
    const dummy = [
      { daysAgo: 6, steps: 5500, calories: 310, water: 1500 },
      { daysAgo: 5, steps: 7000, calories: 380, water: 1800 },
      { daysAgo: 4, steps: 3500, calories: 220, water: 1200 },
      { daysAgo: 3, steps: 9500, calories: 510, water: 2400 },
      { daysAgo: 2, steps: 6000, calories: 340, water: 1700 },
      { daysAgo: 1, steps: 7850, calories: 420, water: 2000 },
    ];
    for (const d of dummy) {
      await db.runAsync(
        'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
        daysAgoStr(d.daysAgo), d.steps, d.calories, d.water
      );
    }
  }

  return db;
}