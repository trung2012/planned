import React from 'react';

import './more-options.styles.scss';

const MoreOptions = ({ children, dismiss }) => {
  return (
    <React.Fragment>
      <div className='overlay' onClick={() => dismiss()}></div>
      {children}
    </React.Fragment>
  );
}

export default MoreOptions;