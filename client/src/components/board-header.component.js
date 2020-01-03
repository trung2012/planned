import React, { useContext, useState } from 'react';

import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import { BoardContext } from '../context/BoardContext';
import BoardMembersDisplay from './board-members-display.component';
import './board-header.styles.scss';
import BoardMembersDropdown from './board-members-dropdown.component';

const BoardHeader = () => {
  const { boardState } = useContext(BoardContext);
  const { currentProject: project, members } = boardState;
  const [showMembersListDropdown, setShowMembersListDropdown] = useState(false);

  return (
    <div className='board-header'>
      <div className='board-header__project-info'>
        <div className='project-picture-container'>
          <div
            className='project-picture'
            style={{ backgroundColor: `${project.color}` }}
            title={project.name || null}
          >
            {project.name && project.name.substring(0, 1).toUpperCase()}
          </div>
        </div>
        <div className='board-header__project-info--details'>
          <h3 className='board-header__project-info--details__name'>{project.name || ''}</h3>
          <span className='board-header__project-info--details__description'>{project.description || ''}</span>
        </div>
      </div>
      <div className='board-header__project-options'>
        <div className='board-header__project-options__nav'>
          <div className='board-header__project-options__nav__item board-header__project-options__nav__item--active'>Board</div>
          <div className='board-header__project-options__nav__item'>Chart</div>
        </div>
        <div className='board-header__project-options--filters'>
          <BoardMembersDisplay members={members} showMembersDropdown={() => setShowMembersListDropdown(!showMembersListDropdown)} />
          <div className='project-filters'>
            <div className='project-filters__item project-filters__item--members' onClick={() => setShowMembersListDropdown(!showMembersListDropdown)}>
              <span>Members</span>
              <DropdownIcon className='dropdown-icon' />
            </div>
            {
              showMembersListDropdown &&
              <BoardMembersDropdown members={members} dismiss={() => setShowMembersListDropdown(false)} />
            }
            <div className='project-filters__item project-filters__item--filter'>
              <span>Filter</span>
              <DropdownIcon className='dropdown-icon' />
            </div>
            <div className='project-filters__item project-filters__item--group'>
              <span>Group by</span>
              <DropdownIcon className='dropdown-icon' />
            </div>
          </div>
          <div className=''></div>
        </div>
      </div>
    </div>
  );
}

export default BoardHeader;