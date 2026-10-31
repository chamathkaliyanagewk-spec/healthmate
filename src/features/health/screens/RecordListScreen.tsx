import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../core/theme';

export default function RecordListScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.heading}>Records</Text>
      <Text style={styles.sub}>Your saved records will appear here.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: 16 },
  heading: { fontSize: 30, color: colors.text, marginTop: 8 },
  sub: { fontSize: 14, color: colors.muted, marginTop: 8 },
});