import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { SocketContext } from '../context/SocketContext';
import BoardTasks from './board-tasks.component';
import MoreOptions from './more-options.component';
import BoardListNameForm from './board-list-name-form.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import './board-list.styles.scss';

const BoardList = ({ list }) => {
  const { projectId } = useParams();
  const socket = useContext(SocketContext);
  const [showListOptions, setShowListOptions] = useState(false);
  const [showListNameEdit, setShowListNameEdit] = useState(false);

  const handleDeleteClick = () => {
    socket.emit('delete_list', { listId: list._id, projectId });
    setShowListOptions(false);
  }

  const handleEditName = (listName) => {
    if (listName !== list.name) {
      socket.emit('edit_list_name', { listId: list._id, listName, projectId });
    }
    setShowListNameEdit(false);
  }

  return (
    <div className='board-list'>
      <div className='board-list__header'>
        {
          showListOptions &&
          <MoreOptions dismiss={() => setShowListOptions(false)}>
            <div className='more-options'>
              <div className='more-options-item' onClick={handleDeleteClick}>Delete</div>
            </div>
          </MoreOptions>
        }
        {
          showListNameEdit ?
            <BoardListNameForm name={list.name} submit={handleEditName} dismiss={() => setShowListNameEdit(false)} />
            :
            <React.Fragment>
              <h4 className='board-list__name' onClick={() => setShowListNameEdit(true)}>{list.name}</h4>
              <OptionsIcon className='options-icon' onClick={() => setShowListOptions(true)} />
            </React.Fragment>
        }
      </div>
      <BoardTasks list={list} />
    </div>
  );
}

export default BoardList;