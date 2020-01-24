import React, { useContext } from 'react';

import { ProjectContext } from '../context/ProjectContext';
import SideNavbarFavoritesItem from './side-navbar-favorites-item.component';

import './side-navbar-favorites.styles.scss';

const SideNavbarFavorites = () => {
  const { projectState: { favoriteProjects } } = useContext(ProjectContext);

  return (
    <div className='side-navbar-favorites'>
      {
        favoriteProjects.map(project => (
          <SideNavbarFavoritesItem key={project._id} project={project} />
        ))
      }
    </div>
  );
}

export default SideNavbarFavorites;