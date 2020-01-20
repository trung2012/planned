import React, { useContext, useState } from 'react';
import { ObjectID } from 'bson';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { SocketContext } from '../context/SocketContext';
import { BoardContext } from '../context/BoardContext';
import NameChangeForm from './name-change-form.component';
import BoardList from './board-list.component';
import { handleTaskUpdate } from '../utils/updateTasks';

import './board-lists.styles.scss';

const BoardLists = ({ lists }) => {
  const { socket } = useContext(SocketContext);
  const { projectId } = useParams();
  const {
    boardState,
    addList,
    replaceSingleList,
    replaceMultipleListsAfterDragAndDrop,
    reorderLists,
    updateTaskAttributes
  } = useContext(BoardContext);
  const [showListAdd, setShowListAdd] = useState(false);

  const handleAddSubmit = (listName = '') => {
    if (listName.length > 0) {
      const newList = {
        _id: new ObjectID().toString(),
        name: listName,
        project: projectId,
        tasks: [],
      };
      socket.emit('add_list', newList);
      addList(newList);
    }

    setShowListAdd(false);
  }

  const onDragEnd = ({ destination, source, draggableId, type }) => {
    const { handleCompletionToggle } = handleTaskUpdate(socket, draggableId, projectId, { updateTaskAttributes });

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (source.droppableId.includes('-completed')) {
      source.droppableId = source.droppableId.replace('-completed', '');

      if (source.droppableId !== destination.droppableId) {
        if (!destination.droppableId.includes('-completed')) {
          handleCompletionToggle('Completed');
        } else {
          destination.droppableId = destination.droppableId.replace('-completed', '');
        }

      } else {
        handleCompletionToggle('Completed');
      }
    }

    if (destination.droppableId.includes('-completed')) {
      destination.droppableId = destination.droppableId.replace('-completed', '');
      handleCompletionToggle('Not started');
    }

    if (type === 'list') {
      const newLists = [...boardState.currentProject.lists];
      newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, draggableId);

      reorderLists(newLists);
      socket.emit('reorder_lists', { lists: newLists, projectId });
      return;
    }

    const startList = boardState.lists[source.droppableId];
    const endList = boardState.lists[destination.droppableId];

    if (startList === endList) {
      const newTasks = [...startList.tasks];
      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, draggableId);

      const newList = {
        ...startList,
        tasks: newTasks
      };

      const updatedData = {
        list: newList,
        taskId: draggableId
      }

      replaceSingleList(updatedData);
      socket.emit('replace_single_list', updatedData);
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

      const updatedData = {
        lists: [newStartList, newEndList],
        taskId: draggableId
      }

      replaceMultipleListsAfterDragAndDrop(updatedData);
      socket.emit('replace_multiple_lists', updatedData);
      return;
    }

  }

  return (
    <div className='project-details__main-content'>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-lists' direction='horizontal' type='list'>
          {
            (provided, snapshot) => (
              <div
                className='board-lists'
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  ...provided.droppableProps.style,
                  backgroundColor: snapshot.isDraggingOver && '#f3f3f3'
                }}
              >
                {
                  lists && lists.length > 0 &&
                  lists.map((list, index) => {
                    return (
                      <BoardList key={list._id} list={list} index={index} />
                    );
                  })
                }
                {provided.placeholder}
              </div>
            )
          }

        </Droppable>
      </DragDropContext>
      {
        showListAdd ?
          <NameChangeForm submit={handleAddSubmit} dismiss={() => setShowListAdd(false)} type='list' />
          :
          <button className='add-list' onClick={() => setShowListAdd(true)}>
            Add new list
          </button>
      }
    </div>
  );
}

export default React.memo(BoardLists);