import React from 'react';

import './custom-input.styles.scss';

const CustomInput = ({ value, onChange, ...props }) => {
  return (
    <input
      className='custom-input'
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

export default CustomInput;