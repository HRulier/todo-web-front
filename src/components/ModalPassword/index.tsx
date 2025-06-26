import { useRef, forwardRef, useImperativeHandle, type ForwardRefRenderFunction } from 'react';
import styles from './modal-password.module.scss';

import Modal, { type ModalRefProps } from '~/components/Modal';

const ModalPassword: ForwardRefRenderFunction<ModalRefProps> = (_, ref) => {
  const modalRef = useRef<ModalRefProps>(null);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        modalRef.current?.open();
      },
      close: () => {
        modalRef.current?.close();
      },
    }),
    []
  );

  return (
    <Modal maxWidth={450} ref={modalRef}>
      <div className={styles.content}>
        <h1>Test</h1>
      </div>
    </Modal>
  );
};

export default forwardRef(ModalPassword);
