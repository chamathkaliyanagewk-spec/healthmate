import { getDb } from '../../../core/database/db';
import { HealthRecord, NewRecord } from '../model/types';

// READ: get all records, newest first
export async function getAllRecords(): Promise<HealthRecord[]> {
  const db = await getDb();
  return db.getAllAsync<HealthRecord>(
    'SELECT * FROM health_records ORDER BY date DESC, id DESC'
  );
}

// CREATE: add a new record
export async function createRecord(record: NewRecord): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO health_records (date, steps, calories, water) VALUES (?, ?, ?, ?)',
    record.date, record.steps, record.calories, record.water
  );
}

// UPDATE: change an existing record
export async function updateRecord(record: HealthRecord): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE health_records SET date = ?, steps = ?, calories = ?, water = ? WHERE id = ?',
    record.date, record.steps, record.calories, record.water, record.id
  );
}

// DELETE: remove a record
export async function deleteRecord(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM health_records WHERE id = ?', id);
}