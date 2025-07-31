import { useController } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import styles from './checkbox.module.scss';

interface CheckboxProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  required?: boolean;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
}

const Checkbox = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  required = false,
  rules,
}: CheckboxProps<TFieldValues>) => {
  if (rules && required) {
    console.error(
      `Checkbox: Les propriétés 'rules' et 'required' ne peuvent pas être utilisées simultanément pour le champ "${name}". La propriété 'required' sera ignorée.`
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

  const checkboxId = `checkbox-${field.name}`;

  return (
    <div className={styles.checkboxContainer}>
      <div className={styles.checkboxWrapper}>
        <input
          {...field}
          id={checkboxId}
          type="checkbox"
          checked={!!field.value}
          onChange={e => field.onChange(e.target.checked)}
          className={`
            ${styles.checkbox}
            ${fieldState.invalid ? styles.checkboxError : ''}
          `}
          data-testid={`checkbox-${name}`}
          aria-describedby={fieldState.error ? `${checkboxId}-error` : undefined}
          aria-invalid={fieldState.invalid}
        />

        {/* Custom checkbox visual */}
        <div
          role="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            field.onChange(!field.value);
          }}
          className={`
            ${styles.checkboxCustom}
            ${field.value ? styles.checked : ''}
            ${fieldState.invalid ? styles.checkboxCustomError : ''}
          `}
        >
          {field.value && <FaCheck className={styles.checkmark} />}
        </div>

        {label && (
          <label
            htmlFor={checkboxId}
            className={`
              ${styles.label}
              ${fieldState.invalid ? styles.labelError : ''}
            `}
          >
            {label}
            {required && !rules && <span className={styles.requiredMark}>*</span>}
          </label>
        )}
      </div>

      {fieldState.error?.message && (
        <p id={`${checkboxId}-error`} className={styles.errorMessage}>
          {fieldState.error.message}
        </p>
      )}
    </div>
  );
};

export default Checkbox;
