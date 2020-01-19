import React, { useState, useContext } from 'react';
import { ObjectID } from 'bson';

import { BoardContext } from '../context/BoardContext';
import { AuthContext } from '../context/AuthContext';
import ErrorDisplay from './error-display.component';
import CustomButton from './custom-button.component';
import CustomDatePicker from './custom-date-picker.component';
import CustomInput from './custom-input.component';
import TaskAssignment from './task-assignment.component';
import BoardTaskAddListSelect from './board-task-add-list-select.component';
import { getDueDate } from '../utils/helper';

import './board-task-add.styles.scss';

const BoardTaskAdd = ({ submit, list, dismiss, isGrouped }) => {
  const { authState } = useContext(AuthContext);
  const { boardState } = useContext(BoardContext);
  const [newTaskName, setNewTaskName] = useState('');
  const [dueDate, setDueDate] = useState(boardState.groupBy === 'Due date' ? getDueDate(list.name) : null);
  const [taskAssignee, setTaskAssignee] = useState(null);
  const [inputError, setInputError] = useState(null);
  const listSelectOptions = boardState.currentProject.lists.map(listId => {
    return boardState.lists[listId];
  })

  const [newTaskList, setNewTaskList] = useState(listSelectOptions[0]);

  const handleSubmitGrouped = () => {
    const taskData = {
      _id: new ObjectID().toString(),
      name: newTaskName,
      due: dueDate,
      list: newTaskList._id,
      description: '',
      progress: 'Not started',
      priority: 'Low',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      assignee: taskAssignee,
      comments: [],
      attachments: [],
      createdBy: authState.user,
      updatedBy: authState.user
    }

    switch (boardState.groupBy) {
      case 'Assigned to':
        const { tasks: _, ...taskAssignee } = list;
        if (taskAssignee._id === 'Unassigned') {
          taskData.assignee = null;
        } else {
          taskData.assignee = taskAssignee;
        }
        break;
      case 'Progress':
        taskData.progress = list.name;
        break;
      case 'Priority':
        taskData.priority = list.name;
        break;
      default:
        break;
    }

    submit(taskData);
  }

  const handleSubmit = event => {
    event.preventDefault();

    if (newTaskName === '') {
      return setInputError('Please enter task name');
    }

    if (isGrouped) {
      handleSubmitGrouped();
    } else {
      submit({
        _id: new ObjectID().toString(),
        name: newTaskName,
        due: dueDate,
        list: list._id,
        description: '',
        progress: 'Not started',
        priority: 'Low',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        assignee: taskAssignee,
        comments: [],
        attachments: [],
        createdBy: authState.user,
        updatedBy: authState.user
      });
    }
  }

  return (
    <div
      className='board-task-add'
      onKeyDown={event => {
        if (event.keyCode === 27) {
          dismiss();
        }
      }}
    >
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
          {
            isGrouped &&
            <BoardTaskAddListSelect
              inputDefault={newTaskList}
              selectOptions={listSelectOptions}
              setNewTaskList={setNewTaskList}
            />
          }
          <CustomDatePicker date={dueDate} setDate={setDueDate} />
          {
            boardState.groupBy === 'Assigned to'
              ? null
              : <TaskAssignment
                assignee={taskAssignee}
                members={boardState.members}
                handleAssignTask={setTaskAssignee}
                handleUnassignTask={() => setTaskAssignee(null)}
              />
          }
        </div>
        <CustomButton text='Add Task' buttonType='submit-task' onClick={handleSubmit} />
      </form>
    </div>
  );
}

export default BoardTaskAdd;