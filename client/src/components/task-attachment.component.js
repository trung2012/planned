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

import './task-attachment.styles.scss';

const TaskAttachment = ({ file }) => {
  const { projectId } = useParams();
  const { socket } = useContext(SocketContext);
  const { deleteTaskAttachment, renameTaskAttachment } = useContext(BoardContext);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showAttachmentRename, setShowAttachmentRename] = useState(false);
  const [showAttachmentDeleteConfirm, setShowAttachmentDeleteConfirm] = useState(false);

  const handleAttachmentDelete = () => {
    socket.emit('delete_attachment', { file, projectId })
    deleteTaskAttachment(file);
  }

  const handleAttachmentRename = newName => {
    if (file.name !== newName) {
      socket.emit('change_filename', { file, newName, projectId });
      renameTaskAttachment({ file, newName });
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
            : <a className='task-attachment__name' href={file.url}>{file.name}</a>
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