import React from 'react';

import { ReactComponent as CheckmarkIcon } from '../assets/checkmark.svg';
import getSelectIcon from '../utils/getSelectIcon';

import './custom-select-dropdown.styles.scss';

const CustomSelectDropdown = ({ inputDefault, option, onClick }) => {
  if (inputDefault === option.name || inputDefault._id === option._id) {
    return <div className='custom-select__option custom-select__option--selected' onClick={onClick} title={option.name}>
      <span className='custom-select__option-value'>
        {getSelectIcon(option.name)}
        {option.name}
      </span>
      <CheckmarkIcon className='checkmark-icon' />
    </div>
  } else {
    return <div className='custom-select__option' onClick={onClick} title={option.name}>
      <span className='custom-select__option-value'>
        {getSelectIcon(option.name)}
        {option.name}
      </span>
    </div>
  }
}

export default CustomSelectDropdown;