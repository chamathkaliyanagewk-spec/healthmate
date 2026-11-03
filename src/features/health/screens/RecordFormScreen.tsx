import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../core/theme';
import { todayStr } from '../../../core/utils/date';
import { useRecordStore } from '../store/useRecordStore';
import { FormErrors, FormInput, validateRecord } from '../validation/validateRecord';

// One reusable input box with a label, icon and error message
function Field({
  label, icon, value, onChangeText, error, numeric,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  numeric?: boolean;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Ionicons name={icon} size={16} color={colors.muted} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={numeric ? 'numeric' : 'default'}
        style={[styles.input, error ? styles.inputError : null]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const emptyForm = (): FormInput => ({ date: todayStr(), steps: '', calories: '', water: '' });

export default function RecordFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>(); // set when we press Edit
  const records = useRecordStore((s) => s.records);
  const add = useRecordStore((s) => s.add);
  const update = useRecordStore((s) => s.update);

  const editing = id ? records.find((r) => r.id === Number(id)) : undefined;

  const [form, setForm] = useState<FormInput>(emptyForm());
  const [errors, setErrors] = useState<FormErrors>({});

  // When we arrive with an id, fill the form. Without an id, show a blank form.
  useEffect(() => {
    if (editing) {
      setForm({
        date: editing.date,
        steps: String(editing.steps),
        calories: String(editing.calories),
        water: String(editing.water),
      });
    } else {
      setForm(emptyForm());
    }
    setErrors({});
  }, [id]);

  const onSave = async () => {
    const found = validateRecord(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // stop if there are errors

    const values = {
      date: form.date,
      steps: Number(form.steps),
      calories: Number(form.calories),
      water: Number(form.water),
    };

    try {
      if (editing) {
        await update({ id: editing.id, ...values });
      } else {
        await add(values);
      }
      Alert.alert('Saved', editing ? 'Your record was updated.' : 'Your record was added.');
      setForm(emptyForm());
      router.setParams({ id: '' }); // leave edit mode
      router.navigate('/records');
    } catch (e) {
      Alert.alert('Error', 'Could not save the record. Please try again.');
    }
  };

  const onCancel = () => {
    setForm(emptyForm());
    setErrors({});
    router.setParams({ id: '' });
    router.navigate('/records');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>{editing ? 'Edit record' : 'Add a record'}</Text>

        <Field
          label="Date (YYYY-MM-DD)"
          icon="calendar"
          value={form.date}
          onChangeText={(t) => setForm({ ...form, date: t })}
          error={errors.date}
        />
        <Field
          label="Steps"
          icon="footsteps"
          value={form.steps}
          onChangeText={(t) => setForm({ ...form, steps: t })}
          error={errors.steps}
          numeric
        />
        <Field
          label="Calories burned (kcal)"
          icon="flame"
          value={form.calories}
          onChangeText={(t) => setForm({ ...form, calories: t })}
          error={errors.calories}
          numeric
        />
        <Field
          label="Water intake (ml)"
          icon="water"
          value={form.water}
          onChangeText={(t) => setForm({ ...form, water: t })}
          error={errors.water}
          numeric
        />

        <Pressable style={styles.button} onPress={onSave}>
          <Text style={styles.buttonText}>{editing ? 'Update record' : 'Save record'}</Text>
        </Pressable>

        {editing ? (
          <Pressable style={styles.cancel} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const serif = Platform.select({ ios: 'Georgia', android: 'serif' });

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14 },
  heading: { fontFamily: serif, fontSize: 30, color: colors.text, marginTop: 8 },
  field: { gap: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: 13, color: colors.muted },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: { borderColor: '#A32D2D' },
  error: { color: '#A32D2D', fontSize: 12 },
  button: {
    backgroundColor: colors.text,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: colors.background, fontSize: 16, fontWeight: '600' },
  cancel: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: colors.muted, fontSize: 15 },
});