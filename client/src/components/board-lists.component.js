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
  const { boardState, addList } = useContext(BoardContext);
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