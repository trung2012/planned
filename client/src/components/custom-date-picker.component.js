import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';

import { ReactComponent as DueIcon } from '../assets/alarm.svg';
import "react-datepicker/dist/react-datepicker.css";
import './custom-date-picker.styles.scss';


const CustomDateSelector = forwardRef(({ onClick, value }, ref) => (
  <div className='custom-date-selector' onClick={onClick} value={value} onChange={onClick} ref={ref}>
    <DueIcon className='due-icon' />
    {
      value ?
        `Due ${value}`
        : 'Set due date'
    }
  </div>
))

const CustomDatePicker = ({ date, setDate, children }) => {

  return (
    <DatePicker
      todayButton='Today'
      selected={date}
      onChange={date => setDate(date)}
      customInput={children ? children : <CustomDateSelector />}
    />
  );
};

export default CustomDatePicker;