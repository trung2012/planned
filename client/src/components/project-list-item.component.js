import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { ProjectContext } from '../context/ProjectContext';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import Modal from './modal.component';
import MoreOptions from './more-options.component';
import ItemDelete from './item-delete.component';
import './project-list-item.styles.scss';


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
      <Link
        to={`/projects/${project._id}?view=chart`}
        className='project-picture-container'
      >
        <div
          className='project-picture'
          style={{ backgroundColor: `${project.color}` }}>
          {project.name.substring(0, 1).toUpperCase()}
        </div>
      </Link>
      <div className='project-list-item__content'>
        <div className='project-list-item__content--top'>
          <Link to={`/projects/${project._id}?view=chart`} className='project-list-item__name'>{project.name}</Link>
          <OptionsIcon className='options-icon' onClick={() => setShowProjectOptions(!showProjectOptions)} title='More options' />
        </div>
        <Link to={`/projects/${project._id}?view=chart`} className='project-list-item__description'>
          {
            project.description.length > 32 ?
              project.description.substring(0, 32) + '...'
              : project.description
          }
        </Link>
      </div>
      {
        showProjectOptions &&
        <MoreOptions dismiss={() => setShowProjectOptions(false)}>
          <div className='more-options-item' onClick={handleDeleteClick}>Delete</div>
          <div className='more-options-item'>Add to favorite</div>
        </MoreOptions>
      }
      {
        showDeleteModal &&
        <Modal
          modalTitle='Delete project'
          dismiss={() => setShowDeleteModal(false)}
        >
          <ItemDelete
            confirm={handleDeleteProject}
            dismiss={() => setShowDeleteModal(false)}
            type='project'
          />
        </Modal>
      }
    </div>
  );
}

export default ProjectListItem;