import React, { useContext } from 'react';

import { BoardContext } from '../context/BoardContext';
import BoardList from './board-list.component';

const BoardListContainer = ({ listId, index }) => {
  const { boardState: { lists } } = useContext(BoardContext);
  const list = lists && lists[listId];

  return (
    list &&
    <BoardList list={list} index={index} />
  );
}

export default BoardListContainer;