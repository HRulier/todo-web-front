import { useState } from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path, RegisterOptions } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './input-password.module.scss';

interface InputPasswordProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label?: string;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  placeholder?: string;
  required?: boolean;
}

const passwordValidationRules = {
  minLength: {
    value: 8,
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  validate: {
    hasSpecialOrNumber: (value: string) =>
      /[\d!@#$%^&*(),.?":{}|<>]/.test(value) ||
      'Le mot de passe doit contenir au moins un chiffre ou un caractère spécial',
    hasMixedCase: (value: string) =>
      (/[a-z]/.test(value) && /[A-Z]/.test(value)) ||
      'Le mot de passe doit contenir au moins une lettre majuscule et une minuscule',
    noSpaces: (value: string) =>
      !/\s/.test(value) || "Le mot de passe ne doit pas contenir d'espaces",
  },
};

const InputPassword = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Entrez votre mot de passe',
  rules = {},
  required = false,
}: InputPasswordProps<TFieldValues>) => {
  if (Object.keys(rules).length > 0 && required) {
    console.error(
      `InputPassword: Les propriétés 'rules' et 'required' ne peuvent pas être utilisées simultanément pour le champ "${name}". La propriété 'required' sera ignorée.`
    );
  }

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { field, fieldState } = useController({
    name,
    control,
    rules: required
      ? { required: 'Ce champ est requis', ...passwordValidationRules }
      : { ...passwordValidationRules, ...rules },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className={styles.textContainer}>
      {label && (
        <label className={styles.label} htmlFor={field.name}>
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          {...field}
          id={field.name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`${styles.input} ${fieldState.invalid ? styles.inputError : ''}`}
          data-testid={`password-input-${name}`}
        />

        <button
          type="button"
          className={styles.toggleButton}
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          data-testid="toggle-password-visibility"
        >
          {showPassword ? (
            <FaEyeSlash className={styles.icon} />
          ) : (
            <FaEye className={styles.icon} />
          )}
        </button>
      </div>

      {fieldState.error?.message && (
        <p className={styles.errorMessage}>{fieldState.error?.message}</p>
      )}
    </div>
  );
};

export default InputPassword;
