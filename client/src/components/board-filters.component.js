import React, { useState, useContext } from 'react';

import CustomInput from './custom-input.component';
import { priorityOptions, dueFilterOptions } from '../utils/dropdownOptions';
import BoardFiltersGroup from './board-filters-group.component';
import { BoardContext } from '../context/BoardContext';

import './board-filters.styles.scss';

const BoardFilters = ({ dismiss, allAssignees, allLists }) => {
  const [taskNameFilterKeyword, setTaskNameFilterKeyword] = useState('');
  const { boardState: {
    filterConditionPriority,
    filterConditionAssignee,
    filterConditionList,
    filterConditionDue
  }, changeBoardFilters } = useContext(BoardContext);

  const handleFilterTasksByName = event => {
    const { value } = event.target;
    setTaskNameFilterKeyword(value);
    changeBoardFilters('name', value);
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={dismiss}></div>
      <div className='board-filters'>
        <div className='board-filters__header'>
          <div className='board-filters__header-top'>
            <h3 className='board-filters__header-title'>Filter</h3>
            <button className='board-filters__clear-button'>Clear</button>
          </div>
          <CustomInput
            placeholder='Filter by task name'
            value={taskNameFilterKeyword}
            onChange={handleFilterTasksByName}
            autoFocus
            required
          />
        </div>
        <div className='board-filters__groups'>
          <BoardFiltersGroup groupName='Due' options={dueFilterOptions} filterList={filterConditionDue} />
          <BoardFiltersGroup groupName='Priority' options={priorityOptions} filterList={filterConditionPriority} />
          <BoardFiltersGroup groupName='Assignee' options={allAssignees} filterList={filterConditionAssignee} />
          <BoardFiltersGroup groupName='List' options={allLists} filterList={filterConditionList} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default BoardFilters;