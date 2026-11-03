import { todayStr } from '../../../core/utils/date';

export interface FormInput {
  date: string;
  steps: string;
  calories: string;
  water: string;
}

export type FormErrors = Partial<Record<keyof FormInput, string>>;

// Checks that the text is a real calendar date, like 2026-10-30
const isRealDate = (text: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  // If the day was invalid (like Feb 31), JavaScript rolls over to another month
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export function validateRecord(input: FormInput): FormErrors {
  const errors: FormErrors = {};

  if (!isRealDate(input.date)) {
    errors.date = 'Enter a real date as YYYY-MM-DD';
  } else if (input.date > todayStr()) {
    errors.date = 'The date cannot be in the future';
  }

  // Check a number field: required, whole number, not too big
  const checkNumber = (value: string, max: number, key: keyof FormInput, label: string) => {
    if (value.trim() === '') {
      errors[key] = `${label} is required`;
    } else if (!/^\d+$/.test(value.trim())) {
      errors[key] = `${label} must be a whole number`;
    } else if (Number(value) > max) {
      errors[key] = `${label} looks too high (max ${max})`;
    }
  };

  checkNumber(input.steps, 100000, 'steps', 'Steps');
  checkNumber(input.calories, 10000, 'calories', 'Calories');
  checkNumber(input.water, 10000, 'water', 'Water');

  return errors;
}