import React, { useContext, useEffect } from 'react';

import Snackbar from './snackbar.component';
import { ProjectContext } from '../context/ProjectContext';
import ProjectList from './project-list.component';
import FavoriteProjectsList from './favorite-projects-list.component';
import Spinner from './spinner.component';

import './project-overview.styles.scss';

const ProjectOverview = () => {
  const { projectState, clearProjectErrorMessage } = useContext(ProjectContext);
  const { projects, favoriteProjects, isLoading } = projectState;

  useEffect(() => {
    if (projectState.errorMessage) {
      setTimeout(() => {
        clearProjectErrorMessage();
      }, 3000)
    }
  }, [projectState.errorMessage, clearProjectErrorMessage])

  return (
    isLoading ? <Spinner />
      :
      <div className='project-overview'>
        {
          projectState.errorMessage &&
          <Snackbar text={projectState.errorMessage} />
        }
        <div className='project-overview__header'>
          <h1 className='project-overview__heading'>Your projects</h1>
        </div>
        {
          favoriteProjects.length > 0 &&
          <div className='project-overview__list'>
            <h3 className='project-overview__list-header'>Favorite projects</h3>
            <FavoriteProjectsList projects={favoriteProjects} />
          </div>
        }
        <div className='project-overview__list'>
          <h3 className='project-overview__list-header'>All projects</h3>
          <ProjectList projects={projects} />
        </div>
      </div>
  );
}

export default ProjectOverview;