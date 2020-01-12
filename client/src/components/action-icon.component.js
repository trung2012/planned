import React, { useState } from 'react';

import getSelectIcon from '../utils/getSelectIcon';
import MoreOptions from './more-options.component';
import CustomSelectDropdown from './custom-select-dropdown.component';

import './action-icon.styles.scss';

const ActionIcon = ({ defaultValue, attributeName, submit, selectOptions }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = option => {
    submit({ [attributeName.toLowerCase()]: option.name });
    setShowDropdown(false);
  }

  const handleClick = event => {
    event.stopPropagation();
    setShowDropdown(true);
  }

  return (
    <div className='action-icon-container' onClick={handleClick}>
      <div className='action-icon' title={defaultValue} >
        {getSelectIcon(defaultValue)}
      </div>
      {
        showDropdown &&
        <MoreOptions dismiss={() => {
          setShowDropdown(false);
        }}>
          {
            selectOptions.map(option => {
              return <CustomSelectDropdown
                key={option._id}
                option={option}
                inputDefault={defaultValue}
                onClick={event => {
                  event.stopPropagation();
                  handleSelect(option);
                }} />
            })
          }
        </MoreOptions>
      }
    </div>
  );
}

export default ActionIcon;