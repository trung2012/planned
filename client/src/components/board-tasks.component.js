import React from 'react';
import BoardTask from './board-task.component';

import { Droppable } from 'react-beautiful-dnd';
import './board-tasks.styles.scss';

const BoardTasks = ({ list, isGrouped }) => {
  return (
    <Droppable droppableId={list._id}>
      {
        (provided, snapshot) => (
          <div
            className='board-tasks'
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={
              {
                ...provided.droppableProps.style,
                backgroundColor: snapshot.isDraggingOver && '#f3f3f3'
              }
            }
          >
            {
              list &&
              (
                list.tasks && list.tasks.length > 0 &&
                list.tasks.map((task, index) => (
                  task ?
                    <BoardTask key={task._id} task={task} list={list} index={index} isGrouped={isGrouped} />
                    : null
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