import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { ReactComponent as PaperClipIcon } from '../assets/paper_clip.svg';
import { ReactComponent as CommentIcon } from '../assets/comment.svg';
import { progressOptions, priorityOptions } from '../utils/dropdownOptions';
import CustomDatePicker from './custom-date-picker.component';
import ActionIcon from './action-icon.component';
import CustomDatePickerIcon from './custom-date-picker-icon.component';

import './board-task-icons.styles.scss';

const BoardTaskIcons = ({ task, taskClassName, updateTask }) => {
  const [newDueDate, setNewDueDate] = useState(task.due);

  const todaysDate = new Date();
  const isTaskLate = moment(task.due).isBefore(todaysDate, 'day') && task.progress !== 'Completed';

  useEffect(() => {
    setNewDueDate(task.due);
  }, [task.due])

  const handleSetNewDueDate = date => {
    setNewDueDate(date);
    updateTask({ due: date });
  }

  return (
    <div className={`${taskClassName}__icons`}>
      {
        (task.priority === 'Urgent' || task.priority === 'High')
        && <ActionIcon
          defaultValue={task.priority}
          attributeName='priority'
          submit={updateTask}
          selectOptions={priorityOptions}
        />
      }
      {
        task.progress === 'In progress'
        && <ActionIcon
          defaultValue={task.progress}
          attributeName='progress'
          submit={updateTask}
          selectOptions={progressOptions}
        />
      }
      {
        task.due
        &&
        <div className='date-picker-container' onClick={event => event.stopPropagation()}>
          <CustomDatePicker date={Date.parse(newDueDate)} setDate={handleSetNewDueDate}>
            <CustomDatePickerIcon isTaskLate={isTaskLate} />
          </CustomDatePicker>
        </div>
      }
      {
        task.comments.length > 0 &&
        <div className='icon-container' title='Has comments'>
          <CommentIcon className='select-option-icon select-option-icon--comment' />
        </div>
      }
      {
        task.attachments.length > 0 &&
        <div className='icon-container' title={`${task.attachments.length} attachments`}>
          <PaperClipIcon className='select-option-icon select-option-icon--attachment' />
          <span className='icon-text'>{task.attachments.length}</span>
        </div>
      }
    </div>
  );
}

export default BoardTaskIcons;