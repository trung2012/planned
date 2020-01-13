import React from 'react';
import BoardTask from './board-task.component';

import './board-tasks.styles.scss';
import { Droppable } from 'react-beautiful-dnd';

const BoardTasks = ({ list }) => {
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
                    <BoardTask key={task._id} task={task} list={list} index={index} />
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