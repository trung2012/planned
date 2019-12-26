import React, { useContext, useEffect } from 'react';

import { ProjectContext } from '../context/ProjectContext';
import ProjectList from './project-list.component';

import './project-overview.styles.scss';
import Spinner from './spinner.component';
import CustomButton from './custom-button.component';

const ProjectOverview = () => {
  const { state: projectState, fetchProjects } = useContext(ProjectContext);
  const { projects } = projectState;

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])

  return (
    projects ?
      <div className='project-overview'>
        <div className='project-overview__header'>
          <h1 className='project-overview__heading'>Your projects</h1>
          <CustomButton text='Create new project' />
        </div>
        <ProjectList projects={projects} />
      </div>
      : <Spinner />
  );
}

export default ProjectOverview;