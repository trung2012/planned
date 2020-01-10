import React, { useContext, useState } from 'react';
import { ObjectID } from 'bson';
import { useParams } from 'react-router-dom';
import { DragDropContext } from 'react-beautiful-dnd';

import { SocketContext } from '../context/SocketContext';
import { BoardContext } from '../context/BoardContext';
import NameChangeForm from './name-change-form.component';
import BoardListContainer from './board-list-container.component';
import './board-lists.styles.scss';

const BoardLists = () => {
  const { socket } = useContext(SocketContext)
  const { projectId } = useParams();
  const { boardState, addList, replaceSingleList, replaceMultipleListsAfterDragAndDrop } = useContext(BoardContext);
  const { currentProject } = boardState;
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

      replaceSingleList(newList);
      socket.emit('replace_single_list', newList);
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

      replaceMultipleListsAfterDragAndDrop([newStartList, newEndList]);
      // socket.emit('replace_multiple_lists', [newStartList, newEndList]);
    }

  }

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='board-lists'>
          {
            currentProject && currentProject.lists && currentProject.lists.length > 0 &&
            currentProject.lists.map(listId => {
              return (
                <BoardListContainer key={listId} listId={listId} />
              );
            })
          }
        </div>
      </DragDropContext>
      {
        showListAdd ?
          <NameChangeForm submit={handleAddSubmit} dismiss={() => setShowListAdd(false)} />
          :
          <button className='add-list' onClick={() => setShowListAdd(true)}>
            Add new list
          </button>
      }
    </React.Fragment>
  );
}

export default BoardLists;