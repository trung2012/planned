import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { DragDropContext } from 'react-beautiful-dnd';
import BoardList from './board-list.component';
import { BoardContext } from '../context/BoardContext';
import { handleTaskAssignment, handleTaskUpdate } from '../utils/updateTasks';
import { getDueDate } from '../utils/helper';
import { SocketContext } from '../context/SocketContext';

import './board-lists-grouped.styles.scss';

const BoardListsGrouped = ({ lists }) => {
  const { socket } = useContext(SocketContext);
  const { boardState: { groupBy, members }, assignUserToTask, unassignUserFromTask, updateTaskAttributes } = useContext(BoardContext);
  const { projectId } = useParams();

  const onDragEnd = ({ destination, source, draggableId }) => {
    const { handleAssignTask, handleUnassignTask } = handleTaskAssignment(socket, draggableId, projectId, { assignUserToTask, unassignUserFromTask });
    const { handleAttributeUpdate } = handleTaskUpdate(socket, draggableId, projectId, { updateTaskAttributes });

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    switch (groupBy) {
      case 'Assigned to':
        if (destination.droppableId === 'Unassigned') {
          return handleUnassignTask();
        } else {
          const user = members.find(member => member._id === destination.droppableId);
          return handleAssignTask(user);
        }
      case 'Progress':
        return handleAttributeUpdate({ progress: destination.droppableId });
      case 'Priority':
        return handleAttributeUpdate({ priority: destination.droppableId });
      case 'Due date':
        return handleAttributeUpdate({ due: getDueDate(destination.droppableId) });
      default:
        return;
    }
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