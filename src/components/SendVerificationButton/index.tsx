import React, { useState, useEffect } from 'react';
import Button from '../Button';
import styles from './send-verification-button.module.scss';
import { useResendValidationEmail } from '~/hooks/api/auth';

interface SendVerificationButtonProps {
  email: string;
}
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const cooldownDuration = 15;

const SendVerificationButton: React.FC<SendVerificationButtonProps> = ({ email }) => {
  const [countdown, setCountdown] = useState(0);
  const { mutate: resendVerificationEmail, isPending } = useResendValidationEmail();

  const isEmailValid = emailRegex.test(email);
  const isDisabled = !isEmailValid || countdown > 0;

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (countdown > 0) {
      timerId = setTimeout(() => {
        const newCountdown = countdown - 1;
        if (newCountdown === 0) clearInterval(timerId);
        setCountdown(newCountdown);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [countdown]);

  const handleSendEmail = async () => {
    try {
      await resendVerificationEmail(email);
      setCountdown(cooldownDuration);
    } catch (err) {
      console.log(err);
    }
  };

  const getButtonText = () => {
    if (isPending) {
      return 'Envoi en cours...';
    }

    if (countdown > 0) {
      return `Renvoyer dans ${countdown}s`;
    }

    return "Renvoyer l'email de vérification";
  };

  return (
    <div className={styles.container}>
      <Button
        onClick={handleSendEmail}
        isLoading={isPending}
        isDisabled={isDisabled}
        data-testid="send-verification-button"
      >
        {getButtonText()}
      </Button>

      {!isEmailValid && email && (
        <p className={styles.validation}>Veuillez entrer une adresse email valide</p>
      )}
    </div>
  );
};

export default SendVerificationButton;
