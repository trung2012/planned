import React, { useState, useContext } from 'react';

import CustomButton from './custom-button.component';
import ErrorDisplay from './error-display.component';
import { ProjectContext } from '../context/ProjectContext';
import './project-add-form.styles.scss';

const ProjectAddForm = ({ dismiss }) => {
  const { projectState, createProject } = useContext(ProjectContext);
  const [projectInfo, setProjectInfo] = useState({ projectName: '', projectDescription: '' });
  const { projectName, projectDescription } = projectInfo;

  const handleChange = event => {
    const { value, name } = event.target;
    setProjectInfo({ ...projectInfo, [name]: value })
  }

  const handleSubmit = async event => {
    event.preventDefault();

    createProject({ projectName, projectDescription });
    dismiss();
  }

  return (
    <form className='project-add-form' onSubmit={handleSubmit}>
      {
        projectState.errorMessage && <ErrorDisplay text={projectState.errorMessage} />
      }
      <input
        name='projectName'
        type='text'
        className='project-add-form__name'
        placeholder='Project Name'
        value={projectName}
        onChange={handleChange}
        onKeyDown={event => {
          if (event.keyCode === 13) {
            event.preventDefault();
          }
        }}
      />
      <textarea
        name='projectDescription'
        type='text'
        className='project-add-form__description'
        placeholder='Description'
        value={projectDescription}
        onChange={handleChange}
      />
      <div className='project-add-form__buttons'>
        <CustomButton text='Create' onClick={handleSubmit} />
        <CustomButton text='Cancel' onClick={dismiss} />
      </div>
    </form>
  );
}

export default ProjectAddForm;