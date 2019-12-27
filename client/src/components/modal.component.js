import React from 'react';

import './modal.styles.scss';

const Modal = ({ dismiss, modalTitle, children }) => {
  return (
    <>
      <div className='modal__overlay' onClick={dismiss}></div>
      <div className='modal'>
        <div className='modal__title'>
          <span className='modal__title-text'>{modalTitle}</span>
          <span className='modal__close' onClick={dismiss}>
            &times;
          </span>
        </div>
        <div className='modal__content'>
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;