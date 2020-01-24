import React from 'react';

import { NavLink } from 'react-router-dom';

import './side-navbar-favorites-item.styles.scss';

const SideNavbarFavoritesItem = ({ project }) => {
  return (
    <NavLink to={`/projects/${project._id}`} activeClassName='side-navbar-favorites-item--active' className='side-navbar-favorites-item'>
      <div className='project-picture-container'>
        <div
          className='project-picture'
          style={{ backgroundColor: `${project.color}` }}>
          {project.name.substring(0, 1).toUpperCase()}
        </div>
      </div>
      <span className='favorite-project-name'>{project.name}</span>
    </NavLink>
  );
}

export default SideNavbarFavoritesItem;