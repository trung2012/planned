import React, { forwardRef } from 'react';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';
import moment from 'moment';

const CustomDatePickerIcon = ({ onClick, value, isTaskLate }, ref) => {
  const dateValue = Date.parse(value);

  const handleClick = event => {
    event.stopPropagation();
    onClick();
  }

  return (
    <div
      onClick={handleClick} value={value} onChange={handleClick} ref={ref}
      className={isTaskLate ? 'due-icon-container--late' : 'due-icon-container'}
      title={`Due ${moment(dateValue).format('MMMM Do YYYY')}`}
    >
      <CalendarIcon className='select-option-icon select-option-icon--calendar' />
      <span
        className='icon-text'
      >
        {
          moment(dateValue).year() === moment().year()
            ? moment(dateValue).format('MM/DD')
            : moment(dateValue).format('MM/DD/YYYY')
        }
      </span>
    </div>
  );
}

export default forwardRef(CustomDatePickerIcon);