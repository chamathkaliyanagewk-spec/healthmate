export interface HealthRecord {
  id: number;
  date: string;      // "YYYY-MM-DD"
  steps: number;
  calories: number;
  water: number;     // in ml
}

// A record before the database gives it an id
export type NewRecord = Omit<HealthRecord, 'id'>;