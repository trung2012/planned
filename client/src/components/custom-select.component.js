import React, { useState, useEffect, useContext } from 'react';

import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import './custom-select.styles.scss';
import MoreOptions from './more-options.component';
import getSelectIcon from '../utils/getSelectIcon';
import CustomSelectDropdown from './custom-select-dropdown.component';
import { AuthContext } from '../context/AuthContext';

const CustomSelect = ({ label, inputDefault, selectOptions, submit }) => {
  const { authState } = useContext(AuthContext);
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
        if (option.name === 'Completed') {
          submit({ [label.toLowerCase()]: option.name, completedBy: authState.user });
        } else {
          submit({ [label.toLowerCase()]: option.name });
        }
      }
      setShowDropdown(false);
    }
  }

  return (
    <div className='custom-select' onClick={() => setShowDropdown(!showDropdown)} title={selectedOption.name}>
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
              return <CustomSelectDropdown key={option._id} option={option} inputDefault={inputDefault} onClick={() => handleSelect(option)} />
            })
          }
        </MoreOptions>
      }
    </div>

  );
}

export default CustomSelect;