import React from 'react';

import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';

import './dropdown-opener.styles.scss';

const DropdownOpener = ({ label, inputDefault, onClick, iconType = '' }) => {
  return (
    <div className='dropdown-opener' onClick={onClick}>
      <div className='dropdown-opener__item'>
        <div className='dropdown-opener__item__label'>{label}</div>
        <div className='dropdown-opener__item__input'>
          <span>{inputDefault}</span>
          {
            iconType === 'calendar' ?
              <CalendarIcon className='dropdown-icon' />
              : <DropdownIcon className='dropdown-icon' />
          }
        </div>
      </div>
    </div>

  );
}

export default DropdownOpener;