import React from 'react';

import './project-list-item.styles.scss';

const ProjectListItem = ({ project }) => {
  return (
    <div className='project-list-item'>
      <div className='project-list-item__picture' style={{ backgroundColor: `${project.color}` }}>{project.name.substring(0, 1).toUpperCase()}</div>
      <div className='project-list-item__content'>
        <div className='project-list-item__content--top'>
          <div className='project-list-item__name'>{project.name}</div>
          <span className='project-list-item__options'>
            <i className="fas fa-ellipsis-h"></i>
          </span>
        </div>
        <div className='project-list-item__description'>
          {
            project.description.length > 30 ?
              project.description.substring(0, 30) + '...'
              : project.description
          }
        </div>
      </div>
    </div>
  );
}

export default ProjectListItem;