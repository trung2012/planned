import React from 'react';
import CustomButton from './custom-button.component';

import './modal.styles.scss';

const Modal = ({ modalConfirm, modalDismiss, modalTitle, children, confirmText, dismissText }) => {
  return (
    <>
      <div className='modal__overlay' onClick={modalDismiss}></div>
      <div className='modal'>
        <div className='modal__title'>
          <span className='modal__title-text'>{modalTitle}</span>
          <span className='modal__close' onClick={modalDismiss}>
            &times;
          </span>
        </div>
        <div className='modal__content'>
          {children}
        </div>
        <div className='modal__buttons'>
          <CustomButton text={confirmText || 'Yes'} onClick={modalConfirm} />
          <CustomButton text={dismissText || 'Cancel'} onClick={modalDismiss} />
        </div>
      </div>
    </>
  );
};

export default Modal;