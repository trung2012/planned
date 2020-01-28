import React, { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import BoardList from './board-list.component';
import { SocketContext } from '../context/SocketContext';
import { MyTasksContext } from '../context/MyTasksContext';
import { AuthContext } from '../context/AuthContext';

import './my-tasks-lists.styles.scss';

const MyTaskLists = () => {
  const { socket } = useContext(SocketContext);
  const { authState } = useContext(AuthContext);
  const {
    myTasksState: { lists, listsOrder, tasks },
    updateSingleList,
    updateMultipleLists,
    updateTaskInMyTasks
  } = useContext(MyTasksContext);

  const renderedLists = listsOrder.length > 0
    && listsOrder.map(listId => {
      const list = { ...lists[listId] };
      list.tasks = list.tasks.map(taskId => tasks[taskId]);
      return list;
    })

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
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, draggableId);

      const newList = {
        ...startList,
        tasks: newTasks
      };

      updateSingleList(newList);
      return;

    } else {

      const newStartTasks = [...startList.tasks];
      newStartTasks.splice(source.index, 1);

      const newStartList = {
        ...startList,
        tasks: newStartTasks
      }

      const newEndTasks = [...endList.tasks];
      newEndTasks.splice(destination.index, 0, draggableId);

      const newEndList = {
        ...endList,
        tasks: newEndTasks
      }

      const taskData = {
        progress: destination.droppableId,
        updatedAt: Date.now()
      }

      if (source.droppableId !== 'Completed'
        && destination.droppableId !== 'Completed') {
        updateTaskInMyTasks({
          taskId: draggableId,
          listId: source.droppableId,
          data: {
            ...taskData
          }
        })
        socket.emit('update_task_attributes', {
          taskId: draggableId,
          data: {
            ...taskData
          },
          projectId: tasks[draggableId].project
        });
      }

      if (source.droppableId === 'Completed') {
        updateTaskInMyTasks({
          taskId: draggableId,
          listId: source.droppableId,
          data: {
            ...taskData,
            completedBy: null
          }
        })
        socket.emit('update_task_attributes', {
          taskId: draggableId,
          data: {
            ...taskData,
            completedBy: null
          },
          projectId: tasks[draggableId].project
        });
      }

      if (destination.droppableId === 'Completed') {
        updateTaskInMyTasks({
          taskId: draggableId,
          listId: source.droppableId,
          data: {
            ...taskData,
            completedBy: authState.user
          }
        });
        socket.emit('update_task_attributes', {
          taskId: draggableId,
          data: {
            ...taskData,
            completedBy: authState.user
          },
          projectId: tasks[draggableId].project
        });
      }

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