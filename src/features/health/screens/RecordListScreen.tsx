import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../core/theme';
import { useRecordStore } from '../store/useRecordStore';

export default function RecordListScreen() {
  const records = useRecordStore((s) => s.records);
  const load = useRecordStore((s) => s.load);

  useEffect(() => {
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Records</Text>
        {records.map((r) => (
          <Text key={r.id} style={styles.row}>
            {r.date} | {r.steps} steps | {r.calories} kcal | {r.water} ml
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 10 },
  heading: { fontSize: 30, color: colors.text, marginTop: 8 },
  row: { fontSize: 14, color: colors.text },
});