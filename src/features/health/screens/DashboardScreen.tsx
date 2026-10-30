import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../core/theme';

// Dummy data for now. replace it with database data later.
const weekSteps = [5500, 7000, 3500, 9500, 1000, 6000, 7850];
const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const GOAL = 10000;

// A small reusable card
function SummaryCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const maxSteps = Math.max(...weekSteps);
  const today = weekSteps[weekSteps.length - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Your health{'\n'}summary today</Text>

        <View style={styles.cardRow}>
          <SummaryCard label="Steps" value="7,850" color={colors.stepsCard} />
          <SummaryCard label="Calories" value="420" color={colors.caloriesCard} />
          <SummaryCard label="Water (ml)" value="2,000" color={colors.waterCard} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Steps this week</Text>
          <Text style={styles.big}>
            {today.toLocaleString()} <Text style={styles.small}>of {GOAL.toLocaleString()}</Text>
          </Text>

          <View style={styles.chart}>
            {weekSteps.map((value, index) => (
              <View key={index} style={styles.barColumn}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: (value / maxSteps) * 100,
                      backgroundColor: index === weekSteps.length - 1 ? colors.bar : colors.barLight,
                    },
                  ]}
                />
                <Text style={styles.day}>{days[index]}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16 },
  heading: { fontFamily: serif, fontSize: 30, color: colors.text, marginTop: 8 },
  cardRow: { flexDirection: 'row', gap: 10 },
  card: { flex: 1, borderRadius: 16, padding: 12, height: 110, justifyContent: 'space-between' },
  cardLabel: { fontSize: 13, fontWeight: '600', color: colors.text },
  cardValue: { fontFamily: serif, fontSize: 26, color: colors.text },
  panel: { backgroundColor: colors.white, borderRadius: 20, padding: 16 },
  panelTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  big: { fontFamily: serif, fontSize: 36, color: colors.text, marginTop: 4 },
  small: { fontSize: 14, color: colors.muted },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 130, marginTop: 16 },
  barColumn: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 6 },
  day: { fontSize: 12, color: colors.muted, marginTop: 6 },
});