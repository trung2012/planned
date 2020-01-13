import React, { useState, useContext } from 'react';
import { ObjectID } from 'bson';

import ErrorDisplay from './error-display.component';
import CustomButton from './custom-button.component';
import CustomDatePicker from './custom-date-picker.component';
import CustomInput from './custom-input.component';
import TaskAssignment from './task-assignment.component';
import { BoardContext } from '../context/BoardContext';
import { AuthContext } from '../context/AuthContext';

import './board-task-add.styles.scss';

const BoardTaskAdd = ({ submit, listId, dismiss }) => {
  const { authState } = useContext(AuthContext);
  const { boardState } = useContext(BoardContext);
  const [newTaskName, setNewTaskName] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [taskAssignee, setTaskAssignee] = useState(null);
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
        assignee: taskAssignee,
        comments: [],
        attachments: [],
        createdBy: authState.user
      });
    }
  }

  return (
    <React.Fragment>
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
            <TaskAssignment
              assignee={taskAssignee}
              members={boardState.members}
              handleAssignTask={setTaskAssignee}
              handleUnassignTask={() => setTaskAssignee(null)}
            />
          </div>
          <CustomButton text='Add Task' buttonType='submit-task' onClick={handleSubmit} />
        </form>
      </div>
    </React.Fragment>
  );
}

export default BoardTaskAdd;