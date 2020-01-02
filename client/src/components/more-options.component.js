import React from 'react';

import './more-options.styles.scss';

const MoreOptions = ({ children, dismiss }) => {
  return (
    <React.Fragment>
      <div className='overlay' onClick={() => dismiss()}></div>
      <div className='more-options'>
        {children}
      </div>
    </React.Fragment>
  );
}

export default MoreOptions;