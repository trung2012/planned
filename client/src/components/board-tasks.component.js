import React, { useContext } from 'react';
import BoardTask from './board-task.component';

import { Droppable } from 'react-beautiful-dnd';
import BoardTasksComleted from './board-tasks-completed.component';
import { BoardContext } from '../context/BoardContext';
import './board-tasks.styles.scss';

const BoardTasks = ({ list, isGrouped }) => {
  const { boardState } = useContext(BoardContext);
  const listHasTasks = list && list.tasks && list.tasks.length > 0;
  const unfinishedTasks = listHasTasks && list.tasks.filter(task => task.progress !== 'Completed');
  const completedTasks = listHasTasks && list.tasks.filter(task => task.progress === 'Completed');

  if (boardState.groupBy === 'Assigned to') {
    return <Droppable droppableId={list._id}>
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
              listHasTasks &&
              list.tasks.map((task, index) => (
                task ?
                  <BoardTask key={task._id} task={task} index={index} isGrouped={isGrouped} />
                  : null
              ))
            }
            {provided.placeholder}
          </div>
        )
      }
    </Droppable>
  }

  return (
    <React.Fragment>
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
                unfinishedTasks.map((task, index) => (
                  task ?
                    <BoardTask key={task._id} task={task} index={index} isGrouped={isGrouped} />
                    : null
                ))
              }
              {provided.placeholder}
            </div>
          )
        }
      </Droppable>
      {
        completedTasks.length > 0 &&
        <BoardTasksComleted tasks={completedTasks} listId={list._id} />
      }
    </React.Fragment>
  );
}

export default BoardTasks;