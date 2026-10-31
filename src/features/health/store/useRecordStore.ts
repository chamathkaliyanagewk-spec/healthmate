import { create } from 'zustand';
import * as repo from '../data/recordRepository';
import { HealthRecord, NewRecord } from '../model/types';

interface RecordState {
  records: HealthRecord[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  add: (record: NewRecord) => Promise<void>;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  records: [],
  loading: false,
  error: null,

  // Read all records from the database into the store
  load: async () => {
    set({ loading: true, error: null });
    try {
      const records = await repo.getAllRecords();
      set({ records });
    } catch (e) {
      set({ error: 'Could not load records' });
    } finally {
      set({ loading: false });
    }
  },

  // Save a new record, then reload the list
  add: async (record) => {
    await repo.createRecord(record);
    await get().load();
  },
}));