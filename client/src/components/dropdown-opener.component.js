import React from 'react';

import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';

import './dropdown-opener.styles.scss';

const DropdownOpener = ({ label, inputDefault, onClick, iconType = '' }) => {
  return (
    <div className='dropdown-opener' onClick={onClick}>
      <h4 className='dropdown-opener__label'>{label}</h4>
      <div className='dropdown-opener__input' title={inputDefault}>
        <span>{inputDefault}</span>
        {
          iconType === 'calendar' ?
            <CalendarIcon className='dropdown-icon' />
            : <DropdownIcon className='dropdown-icon' />
        }
      </div>
    </div>
  );
}

export default DropdownOpener;