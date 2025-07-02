import React from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './input-text.module.scss';

interface InputTextProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  type?: 'text' | 'email' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  maxLength?: number;
  autoComplete?: string;
  icon?: React.ReactNode;
}

const InputText = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  rules,
  maxLength,
  autoComplete,
  icon,
}: InputTextProps<TFieldValues>) => {
  if (rules && required) {
    console.error(
      `InputText: Les propriétés 'rules' et 'required' ne peuvent pas être utilisées simultanément pour le champ "${name}". La propriété 'required' sera ignorée.`
    );
  }

  // eslint-disable-next-line no-nested-ternary
  const validationRules = rules
    ? rules
    : required
      ? { required: 'Ce champ est requis' }
      : undefined;

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
          {required && !rules && <span className={styles.requiredMark}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {icon && <div className={styles.iconContainer}>{icon}</div>}

        <input
          {...field}
          id={field.name}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`
            ${styles.input} 
            ${fieldState.invalid ? styles.inputError : ''} 
            ${icon ? styles.withIcon : ''}
          `}
          data-testid={`text-input-${name}`}
        />
      </div>

      {maxLength && (
        <div className={styles.charCounter}>
          {field.value ? field.value.toString().length : 0}/{maxLength}
        </div>
      )}

      {fieldState.error?.message && (
        <p className={styles.errorMessage}>{fieldState.error?.message}</p>
      )}
    </div>
  );
};

export default InputText;
