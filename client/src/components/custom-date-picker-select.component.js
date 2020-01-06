import React, { forwardRef } from 'react';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';

const CustomDatePickerSelect = ({ onClick, value }, ref) => {
  return (
    <div onClick={onClick} value={value} onChange={onClick} ref={ref}>
      <h4 className='custom-select__label'>Due date</h4>
      <div className='custom-select__input' title={value}>
        <span>{value}</span>
        {
          <CalendarIcon className='dropdown-icon' />
        }
      </div>
    </div>
  );
}

export default forwardRef(CustomDatePickerSelect);