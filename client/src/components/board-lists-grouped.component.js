import React from 'react';

import { DragDropContext } from 'react-beautiful-dnd';
import BoardList from './board-list.component';
import './board-lists-grouped.styles.scss';

const BoardListsGrouped = ({ lists }) => {
  const onDragEnd = () => {

  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='board-lists'>
        {
          lists && lists.length > 0 &&
          lists.map((list, index) => {
            return (
              <BoardList key={list._id} list={list} index={index} isGrouped={true} />
            );
          })
        }
      </div>
    </DragDropContext>
  );
}

export default BoardListsGrouped;