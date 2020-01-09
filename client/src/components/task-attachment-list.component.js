import React from 'react';

import TaskAttachment from './task-attachment.component';
import './task-attachment-list.styles.scss';

const TaskAttachmentList = ({ attachments }) => {
  return (
    <div className='attachment-list'>
      {
        attachments.map(file => (
          <TaskAttachment key={file._id} file={file} />
        ))
      }
    </div>
  );
}

export default TaskAttachmentList;