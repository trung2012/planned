import React from 'react';

import './snackbar.styles.scss';

const Snackbar = ({ type, text, actionText, action }) => {
  const className = type ? type : 'default';

  return (
    <div className={`snackbar snackbar--${className}`}>
      <span className='snackbar__text'>{text}</span>
      {
        actionText &&
        <span className='snackbar__action' onClick={action}>{actionText}</span>
      }
    </div>
  );
}

export default Snackbar;