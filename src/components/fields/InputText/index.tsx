import React from 'react';
import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import styles from './input-text.module.scss';

// Définition du type générique pour les props du composant
interface InputTextProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>; // Le nom du champ dans le formulaire
  control: Control<TFieldValues>; // L'objet control de react-hook-form
  label?: string; // Label optionnel pour le champ
  type?: 'text' | 'email' | 'number' | 'tel' | 'url' | 'search'; // Type d'input
  placeholder?: string; // Placeholder optionnel
  required?: boolean; // Indique si le champ est requis
  error?: string; // Message d'erreur à afficher externe
  maxLength?: number; // Longueur maximale du texte
  autoComplete?: string; // Valeur pour l'attribut autocomplete
  icon?: React.ReactNode; // Icône optionnelle à afficher
}

/**
 * Composant de champ de texte réutilisable
 * Utilise useController de react-hook-form pour la gestion du formulaire
 */
const InputText = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  placeholder = '',
  required = false,
  error,
  maxLength,
  autoComplete,
  icon,
}: InputTextProps<TFieldValues>) => {
  // Utilisation de useController pour lier l'input au formulaire
  const { field, fieldState } = useController({
    name,
    control,
    rules: required ? { required: 'Ce champ est requis' } : undefined,
  });

  return (
    <div className={styles.textContainer}>
      {/* Affichage du label si fourni */}
      {label && (
        <label className={styles.label} htmlFor={field.name}>
          {label}
          {required && <span className={styles.requiredMark}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {/* Icône optionnelle à gauche de l'input */}
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

      {/* Compteur de caractères si maxLength est défini */}
      {maxLength && (
        <div className={styles.charCounter}>
          {field.value ? field.value.toString().length : 0}/{maxLength}
        </div>
      )}

      {/* Affichage du message d'erreur si existant */}
      {(error || fieldState.error?.message) && (
        <p className={styles.errorMessage}>{error || fieldState.error?.message}</p>
      )}
    </div>
  );
};

export default InputText;
