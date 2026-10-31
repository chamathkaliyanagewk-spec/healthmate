import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../core/theme';
import { HealthRecord } from '../model/types';
import { useRecordStore } from '../store/useRecordStore';

// A small coloured label, like "6,400 steps"
function Chip({ text, color }: { text: string; color: string }) {
  return (
    <View style={[styles.chip, { backgroundColor: color }]}>
      <Text style={styles.chipText}>{text}</Text>
    </View>
  );
}

export default function RecordListScreen() {
  const records = useRecordStore((s) => s.records);
  const load = useRecordStore((s) => s.load);
  const remove = useRecordStore((s) => s.remove);
  const [query, setQuery] = useState('');

  useEffect(() => {
    load();
  }, []);

  // Search: keep only records whose date contains what you typed
  const shown = records.filter((r) => r.date.includes(query.trim()));

  // Ask "are you sure?" before deleting
  const confirmDelete = (record: HealthRecord) => {
    Alert.alert('Delete record', `Delete the record for ${record.date}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(record.id);
          } catch (e) {
            Alert.alert('Error', 'Could not delete the record.');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.heading}>Records</Text>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by date (e.g. 2026-10)"
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={shown}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No records found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.date}>{item.date}</Text>
              <View style={styles.chips}>
                <Chip text={`${item.steps.toLocaleString()} steps`} color={colors.stepsCard} />
                <Chip text={`${item.calories} kcal`} color={colors.caloriesCard} />
                <Chip text={`${item.water} ml`} color={colors.waterCard} />
              </View>
            </View>
            <Pressable onPress={() => confirmDelete(item)} hitSlop={10}>
              <Ionicons name="trash" size={22} color="#A32D2D" />
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
  heading: { fontFamily: serif, fontSize: 30, color: colors.text, marginTop: 8 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 15, color: colors.text },
  list: { paddingVertical: 14, gap: 10 },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 30 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
  },
  date: { fontSize: 15, fontWeight: '600', color: colors.text },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { fontSize: 12, color: colors.text },
});