import React from 'react';

import './form-input.styles.scss';

const FormInput = ({ handleChange, label, ...otherProps }) => {
  return (
    <div className='form-input-component'>
      <input className='form-input' onChange={handleChange} {...otherProps} />
      {
        label ?
          <label className={`${otherProps.value ? 'shrink' : ''} form-input-label`}>{label}</label>
          : null
      }
    </div>
  );
}

export default FormInput;