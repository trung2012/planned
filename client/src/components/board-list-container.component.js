import React, { useContext } from 'react';

import { BoardContext } from '../context/BoardContext';
import BoardList from './board-list.component';

const BoardListContainer = ({ listId }) => {
  const { boardState: { lists } } = useContext(BoardContext);
  const list = lists ? lists[listId] : {};

  return (
    <BoardList list={list} />
  );
}

export default BoardListContainer;