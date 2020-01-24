import React, { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

import { ReactComponent as ChevronLeftIcon } from '../assets/chevron-left.svg';
import { ReactComponent as ChevronRightIcon } from '../assets/chevron-right.svg';
import { ReactComponent as AddHeavyIcon } from '../assets/add_heavy.svg';
import { ReactComponent as OrganizeIcon } from '../assets/organize.svg';
import { ReactComponent as UserIcon } from '../assets/user.svg';
import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import Modal from './modal.component';
import ProjectAddForm from './project-add-form.component';
import SideNavbarFavorites from './side-navbar-favorites.component';
import { ProjectContext } from '../context/ProjectContext';

import './side-navbar.styles.scss';

const SideNavbar = () => {
  const { fetchProjects } = useContext(ProjectContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showFavoriteProjects, setShowFavoriteProjects] = useState(true);
  const sideNavClassname = isCollapsed ? 'side-navbar--collapsed' : 'side-navbar'

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects])

  return (
    <React.Fragment>
      <div className={sideNavClassname}>
        <div className={`${sideNavClassname}__nav`}>
          <div className={`${sideNavClassname}__nav-item`} onClick={() => {
            if (!showCreateProjectModal) {
              setShowCreateProjectModal(true);
            }
          }}>
            <AddHeavyIcon className={`${sideNavClassname}__nav-item__icon`} title='Create a new project' />
            <span className={`${sideNavClassname}__nav-item__text`}>New project</span>
          </div>
          <NavLink to='/home' activeClassName={`${sideNavClassname}__nav-item--active`} className={`${sideNavClassname}__nav-item`} title='View your projects'>
            <OrganizeIcon className={`${sideNavClassname}__nav-item__icon`} />
            <span className={`${sideNavClassname}__nav-item__text`}>My projects</span>
          </NavLink>
          <NavLink to='/mytasks' activeClassName={`${sideNavClassname}__nav-item--active`} className={`${sideNavClassname}__nav-item`} title='View tasks assigned to you'>
            <UserIcon className={`${sideNavClassname}__nav-item__icon`} />
            <span className={`${sideNavClassname}__nav-item__text`}>My tasks</span>
          </NavLink>
        </div>
        <div className={`${sideNavClassname}__favorite-projects`}>
          <div className={`${sideNavClassname}__favorite-projects__header`} onClick={() => setShowFavoriteProjects(!showFavoriteProjects)}>
            <span>Favorite projects</span>
            <DropdownIcon className='dropdown-icon' />
          </div>
          {
            showFavoriteProjects &&
            <SideNavbarFavorites />
          }
        </div>
        <footer className='collapse-button' onClick={() => setIsCollapsed(!isCollapsed)}>
          {
            isCollapsed
              ? <ChevronRightIcon className='chevron-right-icon' />
              : <ChevronLeftIcon className='chevron-left-icon' />
          }
        </footer>
      </div>
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
    </React.Fragment>
  );
}

export default SideNavbar;