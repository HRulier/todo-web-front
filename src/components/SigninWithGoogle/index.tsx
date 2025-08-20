import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import styles from './signin-with-google.module.scss';

interface SigninWithGoogleProps {
  href: string;
  buttonText?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SigninWithGoogle: React.FC<SigninWithGoogleProps> = ({
  href,
  buttonText = 'Connexion / Inscription avec Google',
}) => (
  <a
    href={href}
    className={styles.googleButton}
    data-testid="signin-with-google-link"
    rel="noopener noreferrer"
  >
    <span className={styles.iconContainer}>
      <FcGoogle className={styles.googleIcon} aria-hidden="true" />
    </span>
    <span className={styles.buttonText}>{buttonText}</span>
  </a>
);

export default SigninWithGoogle;
