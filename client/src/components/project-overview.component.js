import React, { useContext, useEffect, useState } from 'react';

import Snackbar from './snackbar.component';
import { ProjectContext } from '../context/ProjectContext';
import ProjectList from './project-list.component';
import Modal from './modal.component';
import Spinner from './spinner.component';
import ProjectAddForm from './project-add-form.component';
import CustomButton from './custom-button.component';

import './project-overview.styles.scss';

const ProjectOverview = () => {
  const { projectState, fetchProjects, clearProjectErrorMessage } = useContext(ProjectContext);
  const { projects, isLoading } = projectState;
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  useEffect(() => {
    if (projectState.errorMessage) {
      setTimeout(() => {
        clearProjectErrorMessage();
      }, 3000)
    }
  }, [projectState.errorMessage, clearProjectErrorMessage])

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])

  return (
    isLoading ? <Spinner />
      :
      <div className='project-overview'>
        {
          projectState.errorMessage &&
          <Snackbar text={projectState.errorMessage} />
        }
        {
          showCreateProjectModal &&
          <Modal
            modalTitle='Create project'
            dismiss={() => setShowCreateProjectModal(false)}
            confirmText='Create'
          >
            <ProjectAddForm dismiss={() => setShowCreateProjectModal(false)} />
          </Modal>
        }
        <div className='project-overview__header'>
          <h1 className='project-overview__heading'>Your projects</h1>
          <CustomButton text='New project' onClick={() => setShowCreateProjectModal(true)} />
        </div>
        <ProjectList projects={projects} />
      </div>
  );
}

export default ProjectOverview;