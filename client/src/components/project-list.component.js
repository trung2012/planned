import React from 'react';

import ProjectListItem from './project-list-item.component';

import './project-list.styles.scss';

const ProjectList = ({ projects }) => {
  return (
    <div className='project-list'>
      {
        projects.length ?
          projects.map(project => (
            <ProjectListItem key={project._id} project={project} />
          ))
          : <h2 className='no-project'>No projects</h2>
      }
    </div>
  );
}

export default ProjectList;