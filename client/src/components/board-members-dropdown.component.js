import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import CustomInput from './custom-input.component';
import BoardMembersDropdownItem from './board-members-dropdown-item.component';
import MoreOptions from './more-options.component';
import useDebounce from '../utils/useDebounce';
import { ReactComponent as RemoveUserIcon } from '../assets/remove-user.svg';
import './board-members-dropdown.styles.scss';

const BoardMembersDropdown = ({ members, dismiss }) => {
  const { projectId } = useParams();
  const socket = useContext(SocketContext);
  const { boardState, fetchUsers } = useContext(BoardContext);
  const [memberName, setMemberName] = useState('');
  const [showMemberSearchResults, setShowMemberSearchResults] = useState(false);
  const debouncedSearchInput = useDebounce(memberName, 350);

  const handleChange = event => {
    setMemberName(event.target.value);
  }

  const handleAddMember = user => {
    socket.emit('add_member', { user, projectId });
    setShowMemberSearchResults(false);
    setMemberName('');
  }

  const handleDeleteMember = _id => {
    socket.emit('delete_member', { _id, projectId });
  }

  useEffect(() => {
    if (debouncedSearchInput) {
      fetchUsers(debouncedSearchInput, () => {
        setShowMemberSearchResults(true);
      });
    }
  }, [debouncedSearchInput, fetchUsers])

  return (
    <React.Fragment>
      <div className='overlay' onClick={dismiss}></div>
      <div className='board-members-dropdown'>
        <h3>Members</h3>
        <CustomInput
          placeholder='Search for a user'
          value={memberName}
          onChange={handleChange}
          autoFocus
        />
        {
          showMemberSearchResults &&
          <MoreOptions dismiss={() => setShowMemberSearchResults(false)}>
            {
              boardState.users.length === 0 ? <span>No results found</span>
                : boardState.users.map(user => {
                  return (
                    <BoardMembersDropdownItem onClick={() => handleAddMember(user)} key={user._id} member={user} />
                  );
                })
            }
          </MoreOptions>
        }
        <div className='board-members-dropdown__list'>
          {
            members.map(member => (
              <div className='board-members-dropdown__list-item' key={member._id}>
                <BoardMembersDropdownItem member={member} />
                <RemoveUserIcon className='remove-user-icon' onClick={() => handleDeleteMember(member._id)} />
              </div>
            ))
          }
        </div>
      </div>
    </React.Fragment>
  );
}

export default BoardMembersDropdown;