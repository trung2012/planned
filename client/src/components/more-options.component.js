import React from 'react';

import './more-options.styles.scss';

const MoreOptions = ({ children, dismiss, className }) => {
  const classNames = className ? `${className} more-options` : 'more-options'

  return (
    <React.Fragment>
      <div className='overlay' onClick={() => dismiss()}></div>
      <div className={classNames}>
        {children}
      </div>
    </React.Fragment>
  );
}

export default MoreOptions;