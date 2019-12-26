import React from 'react';

import './custom-button.styles.scss';


const CustomButton = ({ buttonType, text, ...props }) => {
  const className = buttonType ? `custom-button ${buttonType}` : 'custom-button'

  return (
    <button className={className} {...props}>
      {text}
    </button>
  );
}

export default CustomButton;