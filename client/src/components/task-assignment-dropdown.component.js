import React, { useState, useRef, useLayoutEffect } from 'react';

import CustomInput from './custom-input.component';
import { ReactComponent as RemoveUserIcon } from '../assets/remove-user.svg';
import MemberProfileItem from './member-profile-item.component'
import MoreOptions from './more-options.component';

import './task-assignment-dropdown.styles.scss';

const TaskAssignmentDropdown = ({ dismiss, onMemberClick, assignee, removeMember, members }) => {
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [style, setStyle] = useState(null);
  const taskAssignmentDropdownRef = useRef();

  const filteredMembers = members.filter(user => {
    if (assignee) {
      return user.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) && assignee._id !== user._id
    }
    return user.name.toLowerCase().includes(memberSearchQuery.toLowerCase())
  });

  useLayoutEffect(() => {
    const { bottom } = taskAssignmentDropdownRef.current.getBoundingClientRect();
    if (bottom > (window.innerHeight || document.documentElement.clientHeight)) {
      setStyle({
        top: '-6rem',
        animation: 'fadeFromBottom .2s cubic-bezier(0.1, 0.9, 0.2, 1)'
      })
    }
  }, [])

  const handleMemberClick = (user) => {
    onMemberClick(user);
    setShowSearchResults(false);
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={dismiss}></div>
      <div 
        className='task-assignment-dropdown' 
        ref={taskAssignmentDropdownRef} 
        style={style}
        onKeyDown={event => {
        if (event.keyCode === 27) {
          dismiss();
        }
      }}
      >
        <div className='task-assignment-dropdown__header'>
          <h3>Assign</h3>
          <CustomInput
            placeholder='Enter name to add member'
            value={memberSearchQuery}
            onChange={(event) => {
              setMemberSearchQuery(event.target.value);
              if (!showSearchResults) {
                setShowSearchResults(true);
              }
            }}
            onFocus={() => {
              if (!showSearchResults) {
                setShowSearchResults(true);
              }
            }}
          />
          {
            showSearchResults &&
            <MoreOptions className='member-search-result' dismiss={() => setShowSearchResults(false)}>
              {
                filteredMembers.length > 0 ? filteredMembers.map(user => {
                  return (
                    <MemberProfileItem onClick={() => handleMemberClick(user)} key={user._id} member={user} />
                  );
                })
                  : <span className='no-results'>No results found</span>
              }
            </MoreOptions>
          }
        </div>
        {
          assignee ?
            <div className='board-members-dropdown-list'>
              <div className='board-members-dropdown-list__item' title={assignee.name} key={assignee._id} >
                <MemberProfileItem member={assignee} />
                <RemoveUserIcon className='remove-user-icon' title='Remove assignment' onClick={() => removeMember(assignee._id)} />
              </div>
            </div>
            : <span className='unassigned-text'>Unassigned</span>
        }
      </div>
    </React.Fragment>
  );
}

export default TaskAssignmentDropdown;