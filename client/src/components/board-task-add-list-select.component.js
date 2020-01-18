import React, { useState, useEffect } from 'react';

import { ReactComponent as ListIcon } from '../assets/list.svg';
import MoreOptions from './more-options.component';

import './board-task-add-list-select.styles.scss';

const BoardTaskAddListSelect = ({ inputDefault, selectOptions, setNewTaskList }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(inputDefault);

  useEffect(() => {
    setSelectedOption(inputDefault);
  }, [inputDefault])

  const handleSelect = option => {
    if (selectedOption._id !== option._id) {
      setSelectedOption(option);
      setNewTaskList(option);
      setShowDropdown(false);
    }
  }

  return (
    <div className='board-task-add-list-select'>
      <div className='board-task-add-list-select__header'>
        <ListIcon className='list-icon' onClick={() => setShowDropdown(!showDropdown)} />
        <span className='board-task-add-list-select__name' onClick={() => setShowDropdown(!showDropdown)}>
          {selectedOption.name}
        </span>
      </div>
      {
        showDropdown &&
        <MoreOptions dismiss={() => setShowDropdown(false)}>
          {
            selectOptions.map(option => (
              <div key={option._id} className='more-options-item' onClick={() => handleSelect(option)}>
                {option.name}
              </div>
            ))
          }
        </MoreOptions>
      }
    </div>
  );
}

export default BoardTaskAddListSelect;