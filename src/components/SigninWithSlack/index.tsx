import React from 'react';
import { FaSlack } from 'react-icons/fa';
import styles from './signin-with-slack.module.scss';

interface SigninWithSlackProps {
  href: string;
  buttonText?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const SigninWithSlack: React.FC<SigninWithSlackProps> = ({
  href,
  buttonText = 'Connexion / Inscription avec Google',
}) => (
  <a
    href={href}
    className={styles.slackButton}
    data-testid="signin-with-slack-link"
    rel="noopener noreferrer"
  >
    <span className={styles.iconContainer}>
      <FaSlack className={styles.slackIcon} aria-hidden="true" />
    </span>
    <span className={styles.buttonText}>{buttonText}</span>
  </a>
);

export default SigninWithSlack;
