import React, { useState, useContext } from 'react';

import CustomButton from './custom-button.component';
import ErrorDisplay from './error-display.component';
import { ProjectContext } from '../context/ProjectContext';
import './project-add-form.styles.scss';

const ProjectAddForm = ({ dismiss }) => {
  const { projectState, createProject } = useContext(ProjectContext);
  const [projectInfo, setProjectInfo] = useState({ projectName: '', projectDescription: '' });
  const { projectName, projectDescription } = projectInfo;
  const [isPublic, setIsPublic] = useState(false);

  const handleChange = event => {
    const { value, name } = event.target;
    setProjectInfo({ ...projectInfo, [name]: value })
  }

  const handleSubmit = async event => {
    event.preventDefault();

    createProject({ projectName, projectDescription, isPublic });
    dismiss();
  }

  return (
    <form
      className='project-add-form'
      onSubmit={handleSubmit}
      onKeyDown={event => {
        if (event.keyCode === 27) {
          dismiss();
        }
      }}
    >
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
        maxLength={27}
        autoFocus
      />
      <textarea
        name='projectDescription'
        type='text'
        className='project-add-form__description'
        placeholder='Description'
        value={projectDescription}
        onChange={handleChange}
        maxLength={60}
      />
      <div className='project-add-form__privacy'>
        <input
          className='radio-button'
          type='radio'
          id='isPublicTrue'
          name='isPublic'
          value={true}
          checked={isPublic}
          onChange={() => setIsPublic(true)}
        />
        <label htmlFor='isPublicTrue' className='project-add-form__radio-input'>
          <span className='project-add-form__radio-text'>Public (Anyone can see project contents)</span>
        </label>
        <input
          className='radio-button'
          type='radio'
          id='isPublicFalse'
          name='isPublic'
          value={false}
          checked={!isPublic}
          onChange={() => setIsPublic(false)}
        />
        <label htmlFor='isPublicFalse' className='project-add-form__radio-input'>
          <span className='project-add-form__radio-text'>Private (Only members can see project contents)</span>
        </label>
      </div>
      <div className='project-add-form__buttons'>
        <CustomButton text='Create' onClick={handleSubmit} />
        <CustomButton type='button' text='Cancel' onClick={dismiss} />
      </div>
    </form>
  );
}

export default ProjectAddForm;