/**
 * Composable para validación de formularios
 */
import { ref } from 'vue';

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const values = ref<T>(initialValues);
  const errors = ref<Partial<Record<keyof T, string>>>({});
  const touched = ref<Partial<Record<keyof T, boolean>>>({});

  const setFieldValue = (field: keyof T, value: any) => {
    values.value[field] = value;
  };

  const setFieldError = (field: keyof T, error: string) => {
    errors.value[field] = error;
  };

  const setFieldTouched = (field: keyof T, isTouched = true) => {
    touched.value[field] = isTouched;
  };

  const resetForm = () => {
    values.value = { ...initialValues };
    errors.value = {};
    touched.value = {};
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateRequired = (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  };

  const validateMinLength = (value: string, min: number): boolean => {
    return value.length >= min;
  };

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    validateEmail,
    validateRequired,
    validateMinLength,
  };
}
