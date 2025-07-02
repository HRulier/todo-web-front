import React from 'react';
import { useController } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { fr } from 'date-fns/locale';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './input-date.module.scss';

interface InputDateProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  icon?: React.ReactNode;
}

const InputDate = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Sélectionner une date',
  required = false,
  rules,
  icon,
}: InputDateProps<TFieldValues>) => {
  if (rules && required) {
    console.error(
      `InputDate: Les propriétés 'rules' et 'required' ne peuvent pas être utilisées simultanément pour le champ "${name}". La propriété 'required' sera ignorée.`
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

        <DatePicker
          id={field.name}
          selected={field.value}
          onChange={(date: Date | null) => field.onChange(date)}
          onBlur={field.onBlur}
          name={field.name}
          ref={field.ref}
          placeholderText={placeholder}
          dateFormat="dd/MM/yyyy"
          locale={fr}
          isClearable={true}
          showYearDropdown={false}
          showMonthDropdown={false}
          autoComplete="off"
          className={`
            ${styles.input} 
            ${fieldState.invalid ? styles.inputError : ''} 
            ${icon ? styles.withIcon : ''}
          `}
          wrapperClassName={styles.datePickerWrapper}
          calendarClassName={styles.datePickerCalendar}
          data-testid={`date-input-${name}`}
          aria-label={label || `Sélectionner une date pour ${name}`}
          aria-describedby={fieldState.error ? `${field.name}-error` : undefined}
          aria-invalid={fieldState.invalid}
        />
      </div>

      {fieldState.error?.message && (
        <p id={`${field.name}-error`} className={styles.errorMessage} role="alert">
          {fieldState.error?.message}
        </p>
      )}
    </div>
  );
};

export default InputDate;
