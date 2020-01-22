import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { ProjectContext } from '../context/ProjectContext';
import Modal from './modal.component';
import MoreOptions from './more-options.component';
import ItemDelete from './item-delete.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { ReactComponent as NonFavoriteIcon } from '../assets/star-unfilled.svg';
import { ReactComponent as FavoriteIcon } from '../assets/star-filled.svg';

import './project-list-item.styles.scss';


const ProjectListItem = ({ project }) => {
  const { projectState, deleteProject, addProjectToFavorites, removeProjectFromFavorites } = useContext(ProjectContext);
  const [showProjectOptions, setShowProjectOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isProjectFavorite = projectState.favoriteProjectIds.includes(project._id);

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
          <div className='project-list-item__icons'>
            {
              isProjectFavorite
                ? <FavoriteIcon className='favorite-icon' title='Remove from favorites' onClick={() => removeProjectFromFavorites(project._id)} />
                : <NonFavoriteIcon className='non-favorite-icon' title='Add to favorites' onClick={() => addProjectToFavorites(project)} />
            }
            <OptionsIcon className='options-icon' onClick={event => {
              event.stopPropagation();
              setShowProjectOptions(!showProjectOptions);
            }} title='More options' />
          </div>
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
          <div className='more-options-item' onClick={() => {
            if (!projectState.favoriteProjectIds.includes(project._id)) {
              addProjectToFavorites(project);
            }
            setShowProjectOptions(false);
          }}>Add to favorite</div>
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