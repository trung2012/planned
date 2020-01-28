import React from 'react';

import TaskAttachment from './task-attachment.component';
import './task-attachment-list.styles.scss';

const TaskAttachmentList = ({ attachments, isViewingMyTasks }) => {
  return (
    <div className='attachment-list'>
      {
        attachments.map(file => (
          <TaskAttachment key={file._id} file={file} isViewingMyTasks={isViewingMyTasks}/>
        ))
      }
    </div>
  );
}

export default TaskAttachmentList;