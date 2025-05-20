import React from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import styles from './input-email.module.scss';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface InputEmailProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  icon?: React.ReactNode;
}

const InputEmail = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Adresse email',
  required = false,
  autoComplete = 'email',
  icon,
}: InputEmailProps<TFieldValues>) => {
  const buildValidationRules = () => {
    const validationRules: any = {};

    if (required) {
      validationRules.required = 'Ce champ est requis';
    }

    validationRules.validate = {
      emailFormat: (value: string) => {
        if (!value && !required) return true;

        return EMAIL_REGEX.test(value) || 'Veuillez entrer une adresse email valide';
      },
    };

    return validationRules;
  };

  const validationRules = buildValidationRules();

  const { field, fieldState } = useController({
    name,
    control,
    rules: validationRules,
  });

  return (
    <div className={styles.textContainer}>
      {label && (
        <label className={styles.label} htmlFor={field.name}>
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {icon && <div className={styles.iconContainer}>{icon}</div>}

        <input
          {...field}
          id={field.name}
          type="email"
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            ${styles.input} 
            ${fieldState.invalid ? styles.inputError : ''} 
            ${icon ? styles.withIcon : ''}
          `}
          data-testid={`email-input-${name}`}
        />
      </div>

      {fieldState.error?.message && (
        <p className={styles.errorMessage}>{fieldState.error.message}</p>
      )}
    </div>
  );
};

export default InputEmail;
