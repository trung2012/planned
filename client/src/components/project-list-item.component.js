import React, { useState, useContext } from 'react';

import Modal from './modal.component';
import MoreOptions from './more-options.component';
import { ProjectContext } from '../context/ProjectContext';
import './project-list-item.styles.scss';
import ProjectDelete from './project-delete.component';


const ProjectListItem = ({ project }) => {
  const { deleteProject } = useContext(ProjectContext);
  const [showProjectOptions, setShowProjectOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteClick = event => {
    setShowProjectOptions(false);
    setShowDeleteModal(true);
  }

  const handleDeleteProject = () => {
    deleteProject(project._id);
    setShowDeleteModal(false);
  }

  return (
    <div className='project-list-item'>
      <div className='project-list-item__picture' style={{ backgroundColor: `${project.color}` }}>{project.name.substring(0, 1).toUpperCase()}</div>
      <div className='project-list-item__content'>
        <div className='project-list-item__content--top'>
          <div className='project-list-item__name'>{project.name}</div>
          <span className='project-list-item__options' onClick={() => setShowProjectOptions(!showProjectOptions)}>
            ...
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
      {
        showProjectOptions &&
        <MoreOptions dismiss={() => setShowProjectOptions(false)}>
          <div className='more-options'>
            <div className='more-options-item' onClick={handleDeleteClick}>Delete</div>
            <div className='more-options-item'>Add to favorite</div>
          </div>
        </MoreOptions>
      }
      {
        showDeleteModal &&
        <Modal
          modalTitle='Delete project'
          dismiss={() => setShowDeleteModal(false)}
        >
          <ProjectDelete confirm={handleDeleteProject} dismiss={() => setShowDeleteModal(false)} />
        </Modal>
      }
    </div >
  );
}

export default ProjectListItem;