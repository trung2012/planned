import React, { useState, useContext } from 'react';
import { Droppable } from 'react-beautiful-dnd';

import BoardTask from './board-task.component';
import { ReactComponent as DropdownIcon } from '../assets/dropdown.svg';
import { BoardContext } from '../context/BoardContext';
import './board-tasks-completed.styles.scss';

const BoardTasksCompleted = ({ tasks, listId, isGrouped }) => {
  const { boardState } = useContext(BoardContext);
  const [showCompleted, setShowCompleted] = useState(false);
  const activeClassname = showCompleted ? 'board-tasks-completed--active' : 'board-tasks-completed'

  return (
    <Droppable droppableId={`${listId}-completed`} isDropDisabled={`${listId}-completed` === boardState.disabledDroppableId}>
      {
        (provided, snapshot) => (
          <div className={activeClassname}>
            <div className={`${activeClassname}__header`} onClick={() => setShowCompleted(!showCompleted)}>
              <div className={`${activeClassname}__title`}>
                {
                  showCompleted
                    ? <span className={`${activeClassname}__show-button`}>Hide completed</span>
                    : <span className={`${activeClassname}__show-button`}>Show completed</span>
                }
                <span className={`${activeClassname}__tasks-count`}>{tasks.length}</span>
              </div>
              <DropdownIcon className='dropdown-icon' />
            </div>
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
                showCompleted &&
                tasks.map((task, index) => (
                  <BoardTask key={task._id} task={task} index={isGrouped ? index : task.realIndex} />
                ))
              }
              {provided.placeholder}
            </div>
          </div>
        )
      }
    </Droppable>
  );
}

export default BoardTasksCompleted;