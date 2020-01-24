import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DragDropContext } from 'react-beautiful-dnd';
import BoardList from './board-list.component';
import { BoardContext } from '../context/BoardContext';
import { handleTaskAssignment, handleTaskUpdate } from '../utils/updateTasks';
import { getDueDate } from '../utils/helper';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';

import './board-lists-grouped.styles.scss';

const BoardListsGrouped = ({ lists, isViewingMyTasks }) => {
  const { socket } = useContext(SocketContext);
  const { authState } = useContext(AuthContext);
  const {
    boardState: {
      groupBy,
      members
    },
    assignUserToTask,
    unassignUserFromTask,
    updateTaskAttributes
  } = useContext(BoardContext);
  const { projectId } = useParams();

  const [disabledDroppableId, setDisabledDroppableId] = useState(null);

  const onDragStart = ({ source }) => {
    setDisabledDroppableId(source.droppableId);
  }

  const onDragEnd = ({ destination, source, draggableId }) => {
    setDisabledDroppableId(null);
    const { handleAssignTask, handleUnassignTask } = handleTaskAssignment(socket, draggableId, projectId, { assignUserToTask, unassignUserFromTask });
    const { handleAttributeUpdate, handleCompletionToggle } = handleTaskUpdate(socket, draggableId, projectId, { updateTaskAttributes });

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (source.droppableId.includes('-completed')) {
      source.droppableId = source.droppableId.replace('-completed', '');

      if (!destination.droppableId.includes('-completed')) {
        handleCompletionToggle('Completed');
        handleAttributeUpdate({ completedBy: null });
      } else {
        destination.droppableId = destination.droppableId.replace('-completed', '');
      }
    }

    if (destination.droppableId.includes('-completed')) {
      destination.droppableId = destination.droppableId.replace('-completed', '');

      if (!source.droppableId.includes('-completed')) {
        handleCompletionToggle('Not started');
        handleAttributeUpdate({ completedBy: authState.user });
      } else {
        source.droppableId = source.droppableId.replace('-completed', '');
      }
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
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <div className='board-lists'>
        {
          lists && lists.length > 0 &&
          lists.map((list, index) => {
            return (
              <BoardList 
                key={list._id} 
                list={list}
                index={index}
                isGrouped={true}
                isViewingMyTasks={isViewingMyTasks}
                disabledDroppableId={disabledDroppableId}
                />
            );
          })
        }
      </div>
    </DragDropContext>
  );
}

export default React.memo(BoardListsGrouped);