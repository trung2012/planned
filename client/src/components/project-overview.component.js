import React, { useContext, useEffect, useState } from 'react';

import { ProjectContext } from '../context/ProjectContext';
import ProjectList from './project-list.component';
import Modal from './modal.component';

import './project-overview.styles.scss';
import Spinner from './spinner.component';
import CustomButton from './custom-button.component';
import ProjectAddForm from './project-add-form.component';

const ProjectOverview = () => {
  const { projectState, fetchProjects } = useContext(ProjectContext);
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
      : <Spinner />
  );
}

export default ProjectOverview;