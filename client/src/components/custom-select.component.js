import React, { useState, useEffect } from 'react';

import { ReactComponent as CheckmarkIcon } from '../assets/checkmark.svg';
import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import './custom-select.styles.scss';
import MoreOptions from './more-options.component';
import getSelectIcon from '../utils/getSelectIcon';

const CustomSelect = ({ label, inputDefault, selectOptions, submit }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(typeof inputDefault === 'string' ? inputDefault : inputDefault.name);
  const [isInputActive, setIsInputActive] = useState(false);
  const inputClassname = isInputActive ? 'custom-select__input custom-select__input--active' : 'custom-select__input'

  useEffect(() => {
    setSelectedOption(typeof inputDefault === 'string' ? inputDefault : inputDefault.name);
  }, [inputDefault])

  const handleSelect = (option) => {
    if (selectedOption !== option.name) {
      setSelectedOption(option.name);
      if (label === 'List') {
        submit(option._id);
      } else {
        submit({ [label.toLowerCase()]: option.name });
      }
      setShowDropdown(false);
    }
  }

  return (
    <div className='custom-select' onClick={() => setShowDropdown(!showDropdown)}>
      <h4 className='custom-select__label'>{label}</h4>
      <div
        className={`${inputClassname}`}
        title={selectedOption}
        onClick={() => {
          if (!isInputActive) {
            setIsInputActive(true);
          }
        }}>
        <span className='custom-select__value'>
          {getSelectIcon(selectedOption)}
          {selectedOption}
        </span>
        <DropdownIcon className='dropdown-icon' />
      </div>
      {
        showDropdown &&
        <MoreOptions dismiss={() => {
          setShowDropdown(false);
          setIsInputActive(false);
        }}>
          {
            selectOptions.map(option => {
              if (inputDefault === option.name || inputDefault._id === option._id) {
                return <div className='custom-select__option custom-select__option--selected' key={option._id} onClick={() => handleSelect(option)}>
                  <span className='custom-select__value'>
                    {getSelectIcon(option.name)}
                    {option.name}
                  </span>
                  <CheckmarkIcon className='checkmark-icon' />
                </div>
              } else {
                return <div className='custom-select__option' key={option._id} onClick={() => handleSelect(option)}>
                  <span className='custom-select__value'>
                    {getSelectIcon(option.name)}
                    {option.name}
                  </span>
                </div>
              }
            })
          }
        </MoreOptions>
      }
    </div>

  );
}

export default CustomSelect;