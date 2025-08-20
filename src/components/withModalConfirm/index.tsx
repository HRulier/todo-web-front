import React, { useState, useEffect, useMemo } from 'react';
import type { Attributes } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { IoClose } from 'react-icons/io5';

import Button from '../Button';
import styles from './modal.module.scss';

interface ConfirmProps {
  message?: string | null;
  action?: (() => void) | null;
  cancel?: (() => void) | null;
}

const Modal = ({ children }: { children: React.ReactNode }) => {
  const modalRoot = document.getElementById('modal');
  const [pendingFunction, setPendingFunction] = useState<ConfirmProps>({
    action: null,
    cancel: null,
    message: null,
  });

  if (!modalRoot) {
    console.error(
      'Modal root element not found. Make sure to add <div id="modal"></div> to your HTML.'
    );
    return null;
  }

  const isOpened = useMemo(
    () => modalRoot && pendingFunction.action && pendingFunction.message,
    [modalRoot, pendingFunction.action, pendingFunction.message]
  );

  function confirmAction(bool: boolean) {
    if (bool && pendingFunction.action) pendingFunction.action();
    else if (!bool && pendingFunction.cancel) pendingFunction.cancel();
    setPendingFunction({
      action: null,
      message: null,
    });
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpened) confirmAction(false);
    };

    if (isOpened) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpened]);

  // Disabled scroll if isOpened
  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpened]);

  function childrenWithProps() {
    return React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          confirm: (
            message: string | null,
            action?: (() => void) | null,
            cancel?: (() => void) | null
          ) => {
            setPendingFunction({ message, action, cancel });
          },
        } as Attributes);
      }
      return child;
    });
  }

  return (
    <>
      <AnimatePresence>
        {isOpened && (
          <>
            {createPortal(
              <>
                <motion.div
                  role="button"
                  className={styles['overlay-modal']}
                  onClick={() => confirmAction(false)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                  }}
                />
                <motion.div
                  className={styles.modal}
                  role="dialog"
                  aria-modal="true"
                  initial={{
                    opacity: 0,
                    scale: 0.95,
                    y: '-47%',
                    x: '-50%',
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: '-50%',
                    x: '-50%',
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.95,
                    y: '-49%',
                    x: '-50%',
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.16, 1, 0.3, 1], // Custom spring-like ease
                    opacity: { duration: 0.2 }, // Faster opacity
                    scale: {
                      type: 'spring',
                      damping: 25,
                      stiffness: 300,
                    },
                  }}
                >
                  <button className={styles.close} onClick={() => confirmAction(false)}>
                    <IoClose size={24} />
                  </button>
                  <p>{pendingFunction.message}</p>
                  <div className={styles.actions}>
                    <Button onClick={() => confirmAction(true)}>
                      <span>Confirmer</span>
                    </Button>{' '}
                    <Button variant="outline" onClick={() => confirmAction(false)}>
                      <span>Annuler</span>
                    </Button>
                  </div>
                </motion.div>
              </>,
              modalRoot
            )}
          </>
        )}
      </AnimatePresence>
      {childrenWithProps()}
    </>
  );
};

const withModalConfirm = (Component: React.ComponentType<any>) =>
  function wrap({ ...props }) {
    return (
      <Modal>
        <Component {...props} />
      </Modal>
    );
  };

export default withModalConfirm;
