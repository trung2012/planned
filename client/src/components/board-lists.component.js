import React, { useContext, useState } from 'react';

import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { BoardContext } from '../context/BoardContext';
import BoardListAdd from './board-list-add.component';
import BoardList from './board-list.component';
import './board-lists.styles.scss';

const BoardLists = () => {
  const socket = useContext(SocketContext)
  const { projectId } = useParams();
  const { boardState } = useContext(BoardContext);
  const { lists } = boardState;
  const [showListAdd, setShowListAdd] = useState(false);

  const handleAddDismiss = (listName = '') => {
    if (listName.length > 0) {
      socket.emit('add_list', {
        name: listName,
        projectId
      })
    }

    setShowListAdd(false);
  }

  return (
    <React.Fragment>
      <div className='board-lists'>
        {
          lists.length > 0 &&
          lists.map(list => {
            return (
              <BoardList key={list._id} list={list} />
            );
          })
        }
      </div>

      {
        showListAdd ?
          <BoardListAdd submit={handleAddDismiss} />
          :
          <button className='add-list' onClick={() => setShowListAdd(true)}>
            Add new list
          </button>
      }
    </React.Fragment>
  );
}

export default BoardLists;