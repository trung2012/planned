import React from 'react';
import BoardTaskContainer from './board-task-container.component';

import './board-tasks.styles.scss';
import { Droppable } from 'react-beautiful-dnd';

const BoardTasks = ({ list }) => {
  return (
    <Droppable droppableId={list._id}>
      {
        provided => (
          <div className='board-tasks' ref={provided.innerRef} {...provided.droppableProps}>
            {
              list &&
              (
                list.tasks.length > 0 &&
                list.tasks.map((taskId, index) => (
                  <BoardTaskContainer key={taskId} taskId={taskId} list={list} index={index} />
                ))
              )
            }
            {provided.placeholder}
          </div>
        )
      }
    </Droppable>
  );
}

export default BoardTasks;