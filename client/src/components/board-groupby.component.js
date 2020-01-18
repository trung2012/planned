import React, { useState, useContext } from 'react';

import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import { BoardContext } from '../context/BoardContext';
import BoardGroupbyItem from './board-groupby-item.component';
import MoreOptions from './more-options.component';

import './board-groupby.styles.scss';

const BoardGroupBy = () => {
  const { boardState: { groupBy } } = useContext(BoardContext);
  const [showGroupbyDropdown, setShowGroupbyDropdown] = useState(false);

  return (
    <div className='project-filters__item project-filters__item--group'>
      <div className='board-group-by' onClick={() => setShowGroupbyDropdown(true)}>
        <span className='project-filters__item-title'>
          Group by {groupBy}
        </span>
        <DropdownIcon className='dropdown-icon' />
      </div>
      {
        showGroupbyDropdown &&
        <MoreOptions dismiss={() => setShowGroupbyDropdown(false)}>
          <BoardGroupbyItem text='List' setShowGroupbyDropdown={setShowGroupbyDropdown} />
          <BoardGroupbyItem text='Assigned to' setShowGroupbyDropdown={setShowGroupbyDropdown} />
          <BoardGroupbyItem text='Progress' setShowGroupbyDropdown={setShowGroupbyDropdown} />
          <BoardGroupbyItem text='Priority' setShowGroupbyDropdown={setShowGroupbyDropdown} />
          <BoardGroupbyItem text='Due date' setShowGroupbyDropdown={setShowGroupbyDropdown} />
        </MoreOptions>
      }
    </div>
  );
}

export default BoardGroupBy;