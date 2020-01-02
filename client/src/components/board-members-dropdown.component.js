import React, { useState, useContext, useEffect } from 'react';

import useDebounce from '../utils/useDebounce';
import CustomInput from './custom-input.component';
import { ReactComponent as SearchIcon } from '../assets/search.svg';
import BoardMembersDropdownItem from './board-members-dropdown-item.component';
import { BoardContext } from '../context/BoardContext';
import MoreOptions from './more-options.component';
import './board-members-dropdown.styles.scss';

const BoardMembersDropdown = ({ members, dismiss }) => {
  const { boardState, fetchUsers } = useContext(BoardContext);
  const [memberName, setMemberName] = useState('');
  const [showMemberSearchResults, setShowMemberSearchResults] = useState(false);
  const debouncedSearchInput = useDebounce(memberName, 350);

  const handleChange = (event) => {
    setMemberName(event.target.value);
  }

  useEffect(() => {
    if (debouncedSearchInput) {
      fetchUsers(debouncedSearchInput, () => {
        setShowMemberSearchResults(true);
      });
    }
  }, [debouncedSearchInput, fetchUsers])

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={dismiss}></div>
      <div className='board-members-dropdown'>
        <h3>Members</h3>
        <form onSubmit={handleSubmit}>
          <CustomInput
            placeholder='Search for a user'
            value={memberName}
            onChange={handleChange}
            autoFocus
          />
          <SearchIcon className='search-icon' onClick={handleSubmit}>Search</SearchIcon>
        </form>
        {
          showMemberSearchResults &&
          <MoreOptions dismiss={() => setShowMemberSearchResults(false)}>
            {
              boardState.users.length === 0 ? <span>No results found</span>
                : boardState.users.map(user => {
                  return (
                    <BoardMembersDropdownItem onClick={() => console.log(user._id)} key={user._id} member={user} />
                  );
                })
            }
          </MoreOptions>
        }
        <div className='board-members-dropdown__list'>
          {
            members.map(member => (
              <BoardMembersDropdownItem key={member._id} member={member} />
            ))
          }
        </div>
      </div>
    </React.Fragment >
  );
}

export default BoardMembersDropdown;