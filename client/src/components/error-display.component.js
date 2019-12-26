import React from 'react';

import './error-display.styles.scss';

const ErrorDisplay = ({ text }) => {
  return (
    <div className='error-display'>
      {text}
    </div>
  );
}

export default ErrorDisplay;