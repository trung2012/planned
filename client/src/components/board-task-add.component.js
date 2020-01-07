import React, { useState } from 'react';
import { ObjectID } from 'bson';

import ErrorDisplay from './error-display.component';
import CustomButton from './custom-button.component';
import CustomDatePicker from './custom-date-picker.component';
import CustomInput from './custom-input.component';
import './board-task-add.styles.scss';

const BoardTaskAdd = ({ submit, listId, dismiss }) => {
  const [newTaskName, setNewTaskName] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [inputError, setInputError] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();
    if (newTaskName === '') {
      setInputError('Please enter task name');
    } else {
      submit({
        _id: new ObjectID().toString(),
        name: newTaskName,
        due: dueDate,
        list: listId,
        description: '',
        progress: 'Not started',
        priority: 'Low',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        comments: []
      });
    }
  }

  return (
    <>
      <div className='board-task-add'>
        <div className='overlay' onClick={() => {
          if (newTaskName === '') {
            dismiss();
          }
        }}></div>
        <form className='board-task-add__form' onSubmit={handleSubmit}>
          {
            inputError &&
            <ErrorDisplay text={inputError} />
          }
          <div className='board-task-add__form--top'>
            <CustomInput
              placeholder='Enter task name'
              value={newTaskName}
              onChange={(event) => setNewTaskName(event.target.value)}
              autoFocus
              required
            />
            <CustomDatePicker date={dueDate} setDate={setDueDate} />
          </div>
          <CustomButton text='Add Task' buttonType='submit-task' onClick={handleSubmit} />
        </form>
      </div>
    </>
  );
}

export default BoardTaskAdd;