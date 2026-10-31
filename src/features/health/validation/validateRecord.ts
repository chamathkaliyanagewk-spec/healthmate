export interface FormInput {
  date: string;
  steps: string;
  calories: string;
  water: string;
}

export type FormErrors = Partial<Record<keyof FormInput, string>>;

export function validateRecord(input: FormInput): FormErrors {
  const errors: FormErrors = {};

  // Date must look like 2026-10-30 and be a real date
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || isNaN(Date.parse(input.date))) {
    errors.date = 'Use the format YYYY-MM-DD';
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