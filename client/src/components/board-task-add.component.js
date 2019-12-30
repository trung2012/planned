import React, { useState, useContext } from 'react';

import ErrorDisplay from './error-display.component';
import CustomButton from './custom-button.component';
import CustomDatePicker from './custom-date-picker.component';
import CustomInput from './custom-input.component';
import { BoardContext } from '../context/BoardContext';
import './board-task-add.styles.scss';

const BoardTaskAdd = ({ submit, listId, dismiss }) => {
  const { boardState, addBoardError } = useContext(BoardContext);
  const [newTaskName, setNewTaskName] = useState('');
  const [dueDate, setDueDate] = useState(null)

  const handleSubmit = event => {
    event.preventDefault();
    if (newTaskName === '') {
      addBoardError('Please enter task name');
    } else {
      submit({
        name: newTaskName,
        dueDate,
        list: listId
      });
    }
  }

  return (
    <>
      <div className='board-task-add'>
        <div className='overlay' onClick={dismiss}></div>
        <form className='board-task-add__form' onSubmit={handleSubmit}>
          {
            boardState.errorMessage &&
            <ErrorDisplay text={boardState.errorMessage} />
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