import React from 'react';

import { ReactComponent as ProgressNotStartedIcon } from '../assets/progress-not-started.svg';
import { ReactComponent as ProgressInProgressIcon } from '../assets/progress-in-progress.svg';
import { ReactComponent as ProgressCompletedIcon } from '../assets/progress-completed.svg';
import { ReactComponent as PriorityLowIcon } from '../assets/priority-low.svg';
import { ReactComponent as PriorityMediumIcon } from '../assets/priority-medium.svg';
import { ReactComponent as PriorityHighIcon } from '../assets/priority-high.svg';
import { ReactComponent as PriorityurgentIcon } from '../assets/priority-urgent.svg';

export default (value) => {
  switch (value) {
    case 'Not started':
      return <ProgressNotStartedIcon className='select-option-icon progress-not-started' />
    case 'In progress':
      return <ProgressInProgressIcon className='select-option-icon progress-in-progress' />
    case 'Completed':
      return <ProgressCompletedIcon className='select-option-icon progress-completed' />
    case 'Low':
      return <PriorityLowIcon className='select-option-icon priority-low' />
    case 'Medium':
      return <PriorityMediumIcon className='select-option-icon priority-medium' />
    case 'High':
      return <PriorityHighIcon className='select-option-icon priority-high' />
    case 'Urgent':
      return <PriorityurgentIcon className='select-option-icon priority-urgent' />
    default:
      return null;
  }
}