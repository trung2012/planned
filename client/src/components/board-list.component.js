import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Draggable } from 'react-beautiful-dnd';

import { SocketContext } from '../context/SocketContext';
import Modal from './modal.component';
import BoardTasks from './board-tasks.component';
import MoreOptions from './more-options.component';
import NameChangeForm from './name-change-form.component';
import ItemDelete from './item-delete.component';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { BoardContext } from '../context/BoardContext';
import BoardTaskAdd from './board-task-add.component';
import { ReactComponent as AddIcon } from '../assets/add.svg';
import './board-list.styles.scss';

const BoardList = ({ list, index }) => {
  const { projectId } = useParams();
  const { socket } = useContext(SocketContext);
  const { deleteList, addTask, updateListName } = useContext(BoardContext);
  const [showListOptions, setShowListOptions] = useState(false);
  const [showListNameEdit, setShowListNameEdit] = useState(false);
  const [showListDeleteConfirm, setShowListDeleteConfirm] = useState(false);
  const [showTaskAdd, setShowTaskAdd] = useState(false);

  const handleDeleteClick = () => {
    deleteList({ _id: list._id });
    socket.emit('delete_list', { listId: list._id, projectId });
    setShowListDeleteConfirm(false);
  }

  const handleListEditName = (listName) => {
    if (listName !== list.name) {
      socket.emit('edit_list_name', { listId: list._id, listName, projectId });
      updateListName({ _id: list._id, name: listName });
    }
    setShowListNameEdit(false);
  }

  const handleAddSubmit = (taskData) => {
    if (taskData) {
      addTask(taskData);
      socket.emit('add_task', {
        taskData,
        projectId
      });

      setShowTaskAdd(false);
    }
  }

  return (
    <Draggable draggableId={list._id} index={index}>
      {
        (provided, snapshot) => (
          <div
            className='board-list'
            {...provided.draggableProps}
            ref={provided.innerRef}
            style={
              {
                ...provided.draggableProps.style,
                backgroundColor: snapshot.isDragging && '#e0e0e0'
              }
            }
          >
            <div className='board-list__top'>
              <div className='board-list__header' {...provided.dragHandleProps}>
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
                    <NameChangeForm name={list.name} submit={handleListEditName} dismiss={() => setShowListNameEdit(false)} type='list' />
                    :
                    <React.Fragment>
                      <h4
                        className='board-list__name'
                        onClick={() => setShowListNameEdit(true)}
                        style={{ cursor: 'pointer' }}
                      >
                        {list.name}
                      </h4>
                      <OptionsIcon className='options-icon' onClick={() => setShowListOptions(true)} title='More options' />
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
              <div className='board-task-add-button' onClick={() => setShowTaskAdd(!showTaskAdd)}>
                <AddIcon className='add-icon' />
                Add task
              </div>
              {
                showTaskAdd &&
                <BoardTaskAdd submit={handleAddSubmit} listId={list._id} dismiss={() => setShowTaskAdd(false)} />
              }
            </div>
            <div
              className='board-list__bottom'
            >
              <BoardTasks list={list} />
            </div>
          </div>
        )
      }
    </Draggable>
  );
}

export default React.memo(BoardList);