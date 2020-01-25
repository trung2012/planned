import React, { useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BoardContext } from '../context/BoardContext';
import BoardTaskDetails from './board-task-details.component';
import Modal from './modal.component';

import './board-task-details-container.styles.scss';

const BoardTaskDetailsContainer = () => {
  const history = useHistory();
  const { projectId, taskId } = useParams();
  const { boardState, setShowTaskDetails, setIsCurrentlyOpenedTaskDeleted, setCurrentlyOpenedTask } = useContext(BoardContext);
  const task = boardState.tasks && boardState.tasks[taskId];
  const list = task && boardState.lists && boardState.lists[task.list];

  const listSelectOptions = boardState.currentProject.lists
    ? boardState.currentProject.lists.map(listId => {
      return boardState.lists[listId];
    })
    : [];

  return (
    boardState.isCurrentlyOpenedTaskDeleted ?
      <Modal
        dismiss={() => {
          setIsCurrentlyOpenedTaskDeleted(false);
          setShowTaskDetails(false);
          history.push(`/projects/${projectId}`);
        }}
        modalTitle='Error: Task deleted'
      >
        <span className='deleted-task-message'>This task has recently been deleted. Please return to the project board or reload the page</span>
      </Modal>
      :
      boardState.showTaskDetails &&
      <BoardTaskDetails
        task={task}
        list={list}
        listSelectOptions={listSelectOptions}
        dismiss={() => {
          setCurrentlyOpenedTask(null);
          setShowTaskDetails(false);
          history.push(`/projects/${projectId}`)
        }} />
  );
}

export default BoardTaskDetailsContainer;