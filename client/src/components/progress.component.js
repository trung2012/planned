import React from 'react';

import './progress.styles.scss';

const Progress = ({ percentage }) => {
  return (
    <div className='progress'>
      <progress
        className='progress-bar'
        max='100'
        value={percentage}
      >
      </progress>
    </div>
  );
};

export default Progress;