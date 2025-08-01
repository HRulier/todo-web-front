import React, { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { IoClose } from 'react-icons/io5';
import styles from './modal.module.scss';

export interface ModalRefProps {
  open: () => void;
  close: () => void;
}

const Modal = forwardRef<
  ModalRefProps,
  { maxWidth?: number; children: React.ReactNode; handleClose?: () => void }
>(({ maxWidth = 310, children, handleClose }, ref) => {
  const modalRoot = document.getElementById('modal');
  const [isOpened, setIsOpened] = useState(false);

  if (!modalRoot) {
    console.error(
      'Modal root element not found. Make sure to add <div id="modal"></div> to your HTML.'
    );
    return null;
  }

  useImperativeHandle(ref, () => ({
    open: () => setIsOpened(true),
    close: () => setIsOpened(false),
  }));

  const closeModal = useCallback(() => {
    setIsOpened(false);
    handleClose?.();
  }, [handleClose]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpened) closeModal();
    };

    if (isOpened) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpened, handleClose]);

  // Disabled scroll if isOpened
  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpened]);

  return (
    <AnimatePresence>
      {modalRoot && isOpened && (
        <>
          {createPortal(
            <>
              <motion.div
                role="button"
                className={styles['overlay-modal']}
                onClick={closeModal}
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
                style={{ maxWidth: `${maxWidth}px` }}
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
                <button
                  className={styles.close}
                  onClick={() => {
                    setIsOpened(false);
                    if (typeof handleClose === 'function') handleClose();
                  }}
                >
                  <IoClose size={24} />
                </button>
                {children}
              </motion.div>
            </>,
            modalRoot
          )}
        </>
      )}
    </AnimatePresence>
  );
});

export default Modal;
