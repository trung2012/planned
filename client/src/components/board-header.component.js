import React, { useContext } from 'react';

import { BoardContext } from '../context/BoardContext';
import './board-header.styles.scss';

const BoardHeader = () => {
  const { boardState } = useContext(BoardContext);
  const { currentProject: project } = boardState;


  return (
    <div className='board-header'>
      <div className='board-header__project-info'>
        <div
          className='project-picture'
          style={{ backgroundColor: `${project.color}` }}
        >
          {project.name && project.name.substring(0, 1).toUpperCase()}
        </div>
        <span className='project-description'>
          {project.description}
        </span>
      </div>
      <div className='board-header__project-options'>
        <div className='board-header__project-options--nav'>
          Nav
        </div>
        <div className='board-header__project-options--filters'>
          Filters
        </div>
      </div>
    </div>
  );
}

export default BoardHeader;