import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { SocketContext } from '../context/SocketContext';
import Modal from './modal.component';
import BoardTasks from './board-tasks.component';
import MoreOptions from './more-options.component';
import BoardListNameForm from './board-list-name-form.component';
import ItemDelete from './item-delete.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { BoardContext } from '../context/BoardContext';
import './board-list.styles.scss';

const BoardList = ({ list, updateListName }) => {
  const { projectId } = useParams();
  const socket = useContext(SocketContext);
  const { deleteList } = useContext(BoardContext);
  const [showListOptions, setShowListOptions] = useState(false);
  const [showListNameEdit, setShowListNameEdit] = useState(false);
  const [showListDeleteConfirm, setShowListDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    deleteList({ _id: list._id });
    socket.emit('delete_list', { listId: list._id, projectId });
    setShowListDeleteConfirm(false);
  }

  const handleEditName = (listName) => {
    if (listName !== list.name) {
      socket.emit('edit_list_name', { listId: list._id, listName, projectId });
      updateListName({ _id: list._id, name: listName });
    }
    setShowListNameEdit(false);
  }

  return (
    <div className='board-list'>
      <div className='board-list__header'>
        {
          showListOptions &&
          <MoreOptions dismiss={() => setShowListOptions(false)}>
            <div className='more-options-item' onClick={() => {
              setShowListOptions(false);
              setShowListNameEdit(true);
            }}>
              Rename
              </div>
            <div className='more-options-item' onClick={() => {
              setShowListDeleteConfirm(true)
              setShowListOptions(false);
            }}
            >
              Delete
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
        {
          showListDeleteConfirm &&
          <Modal
            modalTitle='Delete project'
            dismiss={() => setShowListDeleteConfirm(false)}
          >
            <ItemDelete
              confirm={handleDeleteClick}
              dismiss={() => setShowListDeleteConfirm(false)}
              type='list'
            />
          </Modal>
        }
      </div>
      <BoardTasks list={list} />
    </div>
  );
}

export default BoardList;