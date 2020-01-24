import React, { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import BoardList from './board-list.component';
import { SocketContext } from '../context/SocketContext';

import './my-tasks-lists.styles.scss';

const MyTaskLists = ({ lists, listsOrder, updateSingleList, updateMultipleLists }) => {
  const { socket } = useContext(SocketContext);

  const renderedLists = listsOrder.length > 0
    && listsOrder.map(listId => lists[listId]);

  const onDragEnd = ({ destination, source, draggableId }) => {
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startList = lists[source.droppableId];
    const endList = lists[destination.droppableId];

    if (startList === endList) {
      const newTasks = [...startList.tasks];
      const task = newTasks.splice(source.index, 1)[0];
      const movedTask = {
        ...task,
        progress: destination.droppableId
      }

      newTasks.splice(destination.index, 0, movedTask);

      const newList = {
        ...startList,
        tasks: newTasks
      };

      socket.emit('update_task_attributes', {
        taskId: movedTask._id,
        data: {
          progress: destination.droppableId,
          updatedAt: Date.now()
        },
        projectId: movedTask.project
      });

      updateSingleList(newList);
      return;

    } else {

      const newStartTasks = [...startList.tasks];
      const task = newStartTasks.splice(source.index, 1)[0];

      const movedTask = {
        ...task,
        progress: destination.droppableId
      }

      const newStartList = {
        ...startList,
        tasks: newStartTasks
      }

      const newEndTasks = [...endList.tasks];
      newEndTasks.splice(destination.index, 0, movedTask);

      const newEndList = {
        ...endList,
        tasks: newEndTasks
      }

      socket.emit('update_task_attributes', {
        taskId: movedTask._id,
        data: {
          progress: destination.droppableId,
          updatedAt: Date.now()
        },
        projectId: movedTask.project
      });

      updateMultipleLists([newStartList, newEndList]);
      return;
    }
  }

  return (
    <div className='my-tasks-lists'>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='board-lists'>
          {
            renderedLists && renderedLists.length > 0 &&
            renderedLists.map((list, index) => {
              return (
                <BoardList key={list._id} list={list} index={index} isGrouped={true} isViewingMyTasks={true} />
              );
            })
          }
        </div>
      </DragDropContext>
    </div>
  );
}

export default React.memo(MyTaskLists);