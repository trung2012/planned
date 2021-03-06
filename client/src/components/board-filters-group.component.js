import React, { useContext } from 'react';

import { ReactComponent as CheckmarkIcon } from '../assets/checkmark.svg';
import MemberProfileItem from './member-profile-item.component';
import BoardFiltersItem from './board-filters-item.component';
import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import { BoardContext } from '../context/BoardContext';

import './board-filters-group.styles.scss';

const BoardFiltersGroup = ({ groupName, options, filterList }) => {
  const { boardState: { expandedFilters }, changeBoardFilters, expandBoardFilter } = useContext(BoardContext);
  const isActive = expandedFilters.includes(groupName);
  const groupClassname = isActive ? 'board-filters__group--active' : 'board-filters__group';

  const handleFilterClick = (value) => {
    switch (groupName.toLowerCase()) {
      case 'assignee':
        return changeBoardFilters('assignee', value);
      case 'due':
        return changeBoardFilters('due', value);
      case 'list':
        return changeBoardFilters('list', value);
      case 'priority':
        return changeBoardFilters('priority', value);
      default:
        return;
    }
  }

  if (groupName === 'Assignee') {
    return (
      <div className={`${groupClassname}`}>
        <div className={`${groupClassname}__header`} onClick={() => expandBoardFilter(groupName)}>
          <h3 className={`${groupClassname}__title`}>
            Assignee
            </h3>
          <DropdownIcon className='dropdown-icon' />
        </div>
        <div className={`${groupClassname}__items`}>
          {
            options &&
            options.map(assignee => (
              <div
                key={assignee._id}
                className={filterList.includes(assignee._id) ? 'board-filters-item--selected' : 'board-filters-item'}
                onClick={() => handleFilterClick(assignee._id)}
              >
                <MemberProfileItem member={assignee} />
                <CheckmarkIcon className='checkmark-icon' />
              </div>
            ))
          }
        </div>
      </div>
    );
  } else if (groupName === 'List') {
    return (
      <div className={`${groupClassname}`}>
        <div className={`${groupClassname}__header`} onClick={() => expandBoardFilter(groupName)}>
          <h3 className={`${groupClassname}__title`}>
            {groupName}
          </h3>
          <DropdownIcon className='dropdown-icon' />
        </div>
        <div className={`${groupClassname}__items`}>
          {
            options &&
            options.map(option => (
              <BoardFiltersItem
                key={option._id}
                text={option.name}
                onClick={() => handleFilterClick(option._id)}
                isSelected={filterList.includes(option._id)}
              />
            ))
          }
        </div>
      </div>
    );
  }

  return (
    <div className={`${groupClassname}`}>
      <div className={`${groupClassname}__header`} onClick={() => expandBoardFilter(groupName)}>
        <h3 className={`${groupClassname}__title`}>
          {groupName}
        </h3>
        <DropdownIcon className='dropdown-icon' />
      </div>
      <div className={`${groupClassname}__items`}>
        {
          options &&
          options.map(option => (
            <BoardFiltersItem
              key={option._id}
              text={option.name}
              onClick={() => handleFilterClick(option.name)}
              isSelected={filterList.includes(option.name)}
            />
          ))
        }
      </div>
    </div>
  );
}

export default BoardFiltersGroup;