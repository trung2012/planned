import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { BoardContext } from '../context/BoardContext';
import { SocketContext } from '../context/SocketContext';
import CustomInput from './custom-input.component';
import MemberProfileItem from './member-profile-item.component';
import MoreOptions from './more-options.component';
import useDebounce from '../hooks/useDebounce';
import BoardMembersDropdownList from './board-members-dropdown-list.component';
import './board-members-dropdown.styles.scss';

const BoardMembersDropdown = ({ members, dismiss }) => {
  const { projectId } = useParams();
  const { socket } = useContext(SocketContext);
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
        <div className='board-members-dropdown__header'>
          <h3>Members</h3>
          <CustomInput
            placeholder='Enter name to add member'
            value={memberName}
            onChange={handleChange}
            autoFocus
          />
        </div>
        {
          showMemberSearchResults &&
          <MoreOptions dismiss={() => setShowMemberSearchResults(false)}>
            {
              boardState.users.length === 0 ? <span>No results found</span>
                : boardState.users.map(user => {
                  return (
                    <MemberProfileItem onClick={() => handleAddMember(user)} key={user._id} member={user} />
                  );
                })
            }
          </MoreOptions>
        }
        <BoardMembersDropdownList members={members} removeMember={handleDeleteMember} removeIconText='Remove member' />
      </div>
    </React.Fragment>
  );
}

export default BoardMembersDropdown;