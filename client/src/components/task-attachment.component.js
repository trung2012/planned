import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import MoreOptions from './more-options.component';
import Modal from './modal.component';
import ItemDelete from './item-delete.component';
import getTaskAttachmentIcon from '../utils/getTaskAttachmentIcon';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import NameChangeForm from './name-change-form.component';
import { MyTasksContext } from '../context/MyTasksContext';

import './task-attachment.styles.scss';

const TaskAttachment = ({ file, isViewingMyTasks }) => {
  const { projectId } = useParams();
  const { socket } = useContext(SocketContext);
  const { deleteTaskAttachment, renameTaskAttachment } = useContext(BoardContext);
  const { deleteTaskAttachmentMyTasks, renameTaskAttachmentMyTasks } = useContext(MyTasksContext);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showAttachmentRename, setShowAttachmentRename] = useState(false);
  const [showAttachmentDeleteConfirm, setShowAttachmentDeleteConfirm] = useState(false);

  const handleAttachmentDelete = () => {
    socket.emit('delete_attachment', { file, projectId })
    if (isViewingMyTasks) {
      deleteTaskAttachmentMyTasks(file);
    } else {
      deleteTaskAttachment(file);
    }
    setShowAttachmentDeleteConfirm(false);
  }

  const handleAttachmentRename = newName => {
    if (file.name !== newName) {
      socket.emit('change_filename', { file, newName, projectId });
      if (isViewingMyTasks) {
        renameTaskAttachmentMyTasks({ file, newName });
      } else {
        renameTaskAttachment({ file, newName });
      }
    }
    setShowAttachmentRename(false);
  }

  return (
    <div className='task-attachment'>
      <div className='task-attachment__info'>
        {
          getTaskAttachmentIcon(file.name)
        }
        {
          showAttachmentRename ?
            <NameChangeForm name={file.name} submit={handleAttachmentRename} dismiss={() => setShowAttachmentRename(false)} type='file' />
            : <span className='task-attachment__name' onClick={() => window.open(file.url)}>{file.name}</span>
        }
      </div>
      <OptionsIcon className='options-icon' onClick={() => setShowAttachmentOptions(true)} title='More options' />
      {
        showAttachmentOptions &&
        <MoreOptions dismiss={() => setShowAttachmentOptions(false)}>
          <div className='more-options-item' onClick={() => {
            setShowAttachmentOptions(false);
            setShowAttachmentRename(true);
          }}>
            Rename
            </div>
          <div className='more-options-item' onClick={() => {
            setShowAttachmentDeleteConfirm(true)
            setShowAttachmentOptions(false);
          }}
          >
            Delete
            </div>
        </MoreOptions>
      }
      {
        showAttachmentDeleteConfirm &&
        <Modal
          modalTitle='Delete attachment'
          dismiss={() => setShowAttachmentDeleteConfirm(false)}
        >
          <ItemDelete
            confirm={handleAttachmentDelete}
            dismiss={() => setShowAttachmentDeleteConfirm(false)}
            type='attachment'
          />
        </Modal>
      }
    </div>
  );
}

export default TaskAttachment;