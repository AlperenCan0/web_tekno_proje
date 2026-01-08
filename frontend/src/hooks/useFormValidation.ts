import { useState, useCallback } from 'react';

/**
 * useFormValidation Hook - Form validasyonu için reusable hook
 * Real-time validation ve error handling sağlar
 */
export const useFormValidation = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: {
    [K in keyof T]?: (value: T[K]) => string | null;
  },
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (name: keyof T, value: T[keyof T]): string | null => {
      const rule = validationRules[name];
      if (rule) {
        return rule(value);
      }
      return null;
    },
    [validationRules],
  );

  const validateAll = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const handleChange = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error || undefined,
        }));
      }
    },
    [touched, validateField],
  );

  const handleBlur = useCallback(
    (name: keyof T) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    },
    [values, validateField],
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const resetForm = useCallback((newValues: T) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    resetForm,
    setValues,
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  email: (value: string): string | null => {
    if (!value) return 'E-posta adresi gereklidir';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Geçerli bir e-posta adresi giriniz';
    return null;
  },
  password: (minLength: number = 6) => (value: string): string | null => {
    if (!value) return 'Şifre gereklidir';
    if (value.length < minLength) return `Şifre en az ${minLength} karakter olmalıdır`;
    return null;
  },
  username: (minLength: number = 3) => (value: string): string | null => {
    if (!value) return 'Kullanıcı adı gereklidir';
    if (value.length < minLength) return `Kullanıcı adı en az ${minLength} karakter olmalıdır`;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(value)) return 'Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir';
    return null;
  },
  required: (value: any): string | null => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'Bu alan gereklidir';
    }
    return null;
  },
  optional: (_value: any): string | null => {
    return null;
  },
};

