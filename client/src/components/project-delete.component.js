import React from 'react';

import CustomButton from './/custom-button.component';

import './project-delete.styles.scss';

const ProjectDelete = ({ confirm, dismiss }) => {
  return (
    <React.Fragment>
      <p className='project-delete__text'>
        Are you sure you want to delete this project?
            </p>
      <div className='project-delete__buttons'>
        <CustomButton text='Delete' onClick={confirm} />
        <CustomButton text='Cancel' onClick={dismiss} />
      </div>
    </React.Fragment>
  );
}

export default ProjectDelete;