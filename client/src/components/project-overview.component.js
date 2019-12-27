import React, { useContext, useEffect, useState } from 'react';

import { ProjectContext } from '../context/ProjectContext';
import ProjectList from './project-list.component';
import Modal from './modal.component';

import './project-overview.styles.scss';
import Spinner from './spinner.component';
import CustomButton from './custom-button.component';

const ProjectOverview = () => {
  const { state: projectState, fetchProjects } = useContext(ProjectContext);
  const { projects } = projectState;
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])

  return (
    projects ?
      <div className='project-overview'>
        {
          showCreateProjectModal &&
          <Modal
            modalTitle='Create project'
            modalDismiss={() => setShowCreateProjectModal(false)}
            confirmText='Create'
          >
            <form className='project-add-form'>
              <input type='text' className='project-add-form__name' placeholder='Project Name' />
              <textarea type='text' className='project-add-form__description' placeholder='Description' />
            </form>
          </Modal>
        }
        <div className='project-overview__header'>
          <h1 className='project-overview__heading'>Your projects</h1>
          <CustomButton text='New project' onClick={() => setShowCreateProjectModal(true)} />
        </div>
        <ProjectList projects={projects} />
      </div>
      : <Spinner />
  );
}

export default ProjectOverview;