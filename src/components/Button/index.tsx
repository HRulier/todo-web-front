import React from 'react';
import styles from './button.module.scss';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  className?: string;
  'data-testid'?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  isLoading = false,
  isDisabled = false,
  type = 'button',
  variant = 'primary',
  className = '',
  'data-testid': dataTestId,
}) => {
  const disabled = isDisabled || isLoading;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const buttonClasses = [
    styles.button,
    styles[variant],
    disabled ? styles.disabled : '',
    isLoading ? styles.loading : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      data-testid={dataTestId}
    >
      {isLoading && (
        <span className={styles.loadingSpinner} aria-hidden="true">
          <svg
            className={styles.spinner}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className={styles.spinnerCircle}
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className={styles.spinnerPath}
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </span>
      )}

      <span className={isLoading ? styles.contentHidden : styles.content}>{children}</span>
    </button>
  );
};

export default Button;
