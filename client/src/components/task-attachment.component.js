import React from 'react';

import './task-attachment.styles.scss';

const TaskAttachment = ({ file }) => {
  return (
    <div className='task-attachment'>
      {file.name}
    </div>
  );
}

export default TaskAttachment;