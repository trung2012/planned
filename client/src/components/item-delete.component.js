import React from 'react';

import CustomButton from './custom-button.component';

import './item-delete.styles.scss';

const ItemDelete = ({ confirm, dismiss, type = 'item' }) => {
  return (
    <React.Fragment>
      <p className='item-delete__text'>
        {
          `Are you sure you want to delete this ${type}?`
        }
      </p>
      <div className='item-delete__buttons'>
        <CustomButton text='Delete' buttonType='danger' onClick={confirm} />
        <CustomButton text='Cancel' onClick={dismiss} />
      </div>
    </React.Fragment>
  );
}

export default ItemDelete;