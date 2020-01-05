import React, { useContext } from 'react';

import { BoardContext } from '../context/BoardContext';
import BoardTask from './board-task.component';

const BoardTaskContainer = ({ taskId, list }) => {
  const { boardState: { tasks } } = useContext(BoardContext);
  const task = tasks ? tasks[taskId] : {};

  return (
    <BoardTask task={task} list={list} />
  );
}

export default BoardTaskContainer;