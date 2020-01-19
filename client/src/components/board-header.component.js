import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import { BoardContext } from '../context/BoardContext';
import BoardMembersDisplay from './board-members-display.component';
import BoardMembersDropdown from './board-members-dropdown.component';
import BoardFilters from './board-filters.component';

import BoardGroupBy from './board-groupby.component';
import './board-header.styles.scss';

const BoardHeader = ({ showChart, allAssignees, allLists }) => {
  const { boardState: { currentProject: project, members } } = useContext(BoardContext);
  const [showMembersListDropdown, setShowMembersListDropdown] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);

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
          <Link to={`/projects/${project._id}?view=chart`}
            className={showChart ? 'board-header__project-options__nav__item--active' : 'board-header__project-options__nav__item'}
          >
            Charts
          </Link>
          <Link to={`/projects/${project._id}`}
            className={showChart ? 'board-header__project-options__nav__item' : 'board-header__project-options__nav__item--active'}
          >
            Board
          </Link>
        </div>
        <div className='board-header__project-options--filters'>
          <BoardMembersDisplay members={members} showMembersDropdown={() => setShowMembersListDropdown(!showMembersListDropdown)} />
          <div className='project-filters'>
            <div className='project-filters__item project-filters__item--members' onClick={() => {
              if (!showMembersListDropdown) {
                setShowMembersListDropdown(true);
              }
            }}>
              <span className='project-filters__item-title'>Members</span>
              <DropdownIcon className='dropdown-icon' />
              {
                showMembersListDropdown &&
                <BoardMembersDropdown members={members} dismiss={() => setShowMembersListDropdown(false)} />
              }
            </div>
            <div className='project-filters__item project-filters__item--filter' onClick={() => {
              if (!showFiltersDropdown) {
                setShowFiltersDropdown(true);
              }
            }}>
              <span className='project-filters__item-title'>Filter</span>
              <DropdownIcon className='dropdown-icon' />
              {
                showFiltersDropdown &&
                <BoardFilters dismiss={() => setShowFiltersDropdown(false)} allAssignees={allAssignees} allLists={allLists} />
              }
            </div>
            <BoardGroupBy />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoardHeader;