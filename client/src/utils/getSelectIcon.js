import React from 'react';

import { ReactComponent as ProgressNotStartedIcon } from '../assets/progress-not-started.svg';
import { ReactComponent as ProgressInProgressIcon } from '../assets/progress-in-progress.svg';
import { ReactComponent as ProgressCompletedIcon } from '../assets/progress-completed.svg';
import { ReactComponent as PriorityLowIcon } from '../assets/priority-low.svg';
import { ReactComponent as PriorityMediumIcon } from '../assets/priority-medium.svg';
import { ReactComponent as PriorityHighIcon } from '../assets/priority-high.svg';
import { ReactComponent as PriorityImportantIcon } from '../assets/priority-important.svg';

export default (value) => {
  switch (value) {
    case 'Not started':
      return <ProgressNotStartedIcon className='select-option-icon' />
    case 'In progress':
      return <ProgressInProgressIcon className='select-option-icon' />
    case 'Completed':
      return <ProgressCompletedIcon className='select-option-icon' />
    case 'Low':
      return <PriorityLowIcon className='select-option-icon' />
    case 'Medium':
      return <PriorityMediumIcon className='select-option-icon' />
    case 'High':
      return <PriorityHighIcon className='select-option-icon' />
    case 'Important':
      return <PriorityImportantIcon className='select-option-icon' />
    default:
      return null;
  }
}