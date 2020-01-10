import React, { useContext } from 'react';

import { BoardContext } from '../context/BoardContext';
import BoardTask from './board-task.component';

const BoardTaskContainer = ({ taskId, list, index }) => {
  const { boardState: { tasks } } = useContext(BoardContext);
  const task = tasks && tasks[taskId];

  return (
    task &&
    <BoardTask
      task={task}
      list={list}
      index={index}
    />
  );
}

export default BoardTaskContainer;