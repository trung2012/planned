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
      showPopperArrow={false}
      popperPlacement='bottom'
      popperModifiers={{
        flip: {
          behavior: ["bottom"] // don't allow it to flip to be above
        },
        preventOverflow: {
          enabled: false // tell it not to try to stay within the view (this prevents the popper from covering the element you clicked)
        },
        hide: {
          enabled: false // turn off since needs preventOverflow to be enabled
        }
      }}
      todayButton='Today'
      selected={date}
      onChange={date => setDate(date)}
      customInput={children ? children : <CustomDateSelector />}
    />
  );
};

export default CustomDatePicker;