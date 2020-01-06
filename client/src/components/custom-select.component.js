import React, { useState } from 'react';

import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import { ReactComponent as CalendarIcon } from '../assets/calendar.svg';
import './custom-select.styles.scss';

const CustomSelect = ({ label, inputDefault, selectOptions, iconType = '', submit }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(inputDefault);

  const handleSelect = event => {
    setSelectedOption(event.target.value);
    if (label === 'List') {
      submit({ _id: selectedOption._id });
    } else {
      submit({ _id: selectedOption._id });
    }
    setShowDropdown(false);
  }

  return (
    <div className='custom-select' onClick={() => setShowDropdown(!showDropdown)}>
      <h4 className='custom-select__label'>{label}</h4>
      <div className='custom-select__input' title={inputDefault}>
        <span>{label === 'List' ? selectedOption.name : selectedOption}</span>
        {
          iconType === 'calendar' ?
            <CalendarIcon className='dropdown-icon' />
            : <DropdownIcon className='dropdown-icon' />
        }
      </div>
      {
        label !== 'Due date' &&
        showDropdown &&
        selectOptions.map(option => {
          if (inputDefault._id === option._id) {
            return <div className='custom-select__option custom-select__option--selected' key={option._id} onClick={handleSelect}>
              {option.value}
            </div>
          } else {
            return <div className='custom-select__option' key={option._id} onClick={handleSelect}>
              {option.value}
            </div>
          }
        })
      }
    </div>

  );
}

export default CustomSelect;