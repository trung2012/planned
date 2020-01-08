import React, { useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BoardContext } from '../context/BoardContext';
import BoardTaskDetails from './board-task-details.component';
import Modal from './modal.component';

const BoardTaskDetailsContainer = () => {
  const history = useHistory();
  const { projectId } = useParams();
  const { taskId } = useParams();
  const { boardState, setShowTaskDetails, setIsCurrentlyOpenedTaskDeleted } = useContext(BoardContext);
  const task = boardState.tasks && boardState.tasks[taskId];
  const list = task && boardState.lists && boardState.lists[task.list];

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
        <span>This task has recently been deleted. Please return to the project board or reload the page</span>
      </Modal>
      :
      boardState.showTaskDetails &&
      <BoardTaskDetails
        task={task}
        list={list}
        dismiss={() => {
          setShowTaskDetails(false);
          history.push(`/projects/${projectId}`)
        }} />
  );
}

export default BoardTaskDetailsContainer;