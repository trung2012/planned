import React from 'react';
import moment from 'moment';

import { ReactComponent as PaperClipIcon } from '../assets/paper_clip.svg';
import { ReactComponent as CommentIcon } from '../assets/comment.svg';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';
import { progressOptions, priorityOptions } from '../utils/dropdownOptions';

import './board-task-icons.styles.scss';
import ActionIcon from './action-icon.component';

const BoardTaskIcons = ({ task, taskClassName, handleAttributeUpdate }) => {
  const todaysDate = new Date();
  const isTaskLate = moment(task.due) < todaysDate && moment(task.due).dayOfYear() < moment(todaysDate).dayOfYear();

  return (
    <div className={`${taskClassName}__icons`}>
      {
        (task.priority === 'Urgent' || task.priority === 'High')
        && <ActionIcon
          defaultValue={task.priority}
          attributeName='priority'
          submit={handleAttributeUpdate}
          selectOptions={priorityOptions}
        />
      }
      {
        task.progress === 'In progress'
        && <ActionIcon
          defaultValue={task.progress}
          attributeName='progress'
          submit={handleAttributeUpdate}
          selectOptions={progressOptions}
        />
      }
      {
        task.due
        &&
        <div
          className={isTaskLate ? 'due-icon-container due-icon-container--late' : 'due-icon-container'}
          title={`Due ${moment(task.due).format('MMMM Do YYYY')}`}
        >
          <CalendarIcon className='select-option-icon select-option-icon--calendar' />
          <span
            className='icon-text'
          >
            {
              moment(task.due).year() === moment().year()
                ? moment(task.due).format('MM/DD')
                : moment(task.due).format('MM/DD/YYYY')
            }
          </span>
        </div>
      }
      {
        task.comments.length > 1 &&
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