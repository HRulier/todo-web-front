import { useState } from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './input-password.module.scss';

// Définition du type générique pour les props du composant
interface InputPasswordProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>; // Le nom du champ dans le formulaire
  control: Control<TFieldValues>; // L'objet control de react-hook-form
  label?: string; // Label optionnel pour le champ
  placeholder?: string; // Placeholder optionnel
  required?: boolean; // Indique si le champ est requis
}

/**
 * Composant de champ de mot de passe avec fonctionnalité de toggle pour afficher/masquer le contenu
 * Utilise useController de react-hook-form pour la gestion du formulaire et react-icons pour les icônes
 */
const InputPassword = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder = 'Entrez votre mot de passe',
  required = false,
}: InputPasswordProps<TFieldValues>) => {
  // État local pour gérer la visibilité du mot de passe
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Utilisation de useController au lieu de Controller
  const { field, fieldState } = useController({
    name,
    control,
    rules: required ? { required: 'Ce champ est requis' } : undefined,
  });

  // Fonction pour basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className={styles.passwordContainer}>
      {/* Affichage du label si fourni */}
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

        {/* Bouton de toggle pour la visibilité du mot de passe */}
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

      {/* Affichage du message d'erreur si existant */}
      {fieldState.error?.message && (
        <p className={styles.errorMessage}>{fieldState.error?.message}</p>
      )}
    </div>
  );
};

export default InputPassword;
