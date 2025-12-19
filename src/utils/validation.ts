export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (formData: FormData, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.entries(rules).forEach(([field, rule]) => {
    const value = (formData.get(field) as string)?.trim() || '';

    if (rule.required && !value) {
      errors[field] = `${field.replace('_', ' ')} is required`;
      return;
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `Must be at least ${rule.minLength} characters`;
      return;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `Must not exceed ${rule.maxLength} characters`;
      return;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = getPatternErrorMessage(rule.pattern);
      return;
    }

    if (value && rule.custom) {
      const customError = rule.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
};

const getPatternErrorMessage = (pattern: RegExp): string => {
  if (pattern.source.includes('@')) return 'Please enter a valid email address';
  if (pattern.source.includes('[0-9]')) return 'Please enter a valid phone number';
  return 'Invalid format';
};

// Common validation rules
export const commonRules = {
  email: {
    required: true,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  password: {
    required: true,
    minLength: 8,
    maxLength: 30,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    custom: (value: string) => {
      if (!/(?=.*[A-Z])/.test(value)) return 'Must contain at least 1 uppercase letter';
      if (!/(?=.*[a-z])/.test(value)) return 'Must contain at least 1 lowercase letter';
      if (!/(?=.*\d)/.test(value)) return 'Must contain at least 1 number';
      if (!/(?=.*[@$!%*?&#])/.test(value)) return 'Must contain at least 1 special character (@$!%*?&#)';
      return null;
    }
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  phone: {
    required: true,
    minLength: 10,
    maxLength: 15,
    pattern: /^[0-9+\-\s()]+$/
  },
  city: {
    required: true,
    minLength: 2,
    maxLength: 50
  },
  amount: {
    required: true,
    pattern: /^\d+(\.\d{1,2})?$/,
    custom: (value: string) => {
      const num = parseFloat(value);
      if (num <= 0) return 'Amount must be greater than 0';
      if (num > 1000000) return 'Amount cannot exceed 10,00,000';
      return null;
    }
  }
};