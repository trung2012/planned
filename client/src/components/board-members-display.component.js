import React, { useContext } from 'react';

import UserProfilePicture from './user-profile-picture.component';
import { BoardContext } from '../context/BoardContext';

import './board-members-display.styles.scss';

const BoardMembersDisplay = ({ members, showMembersDropdown }) => {
  const { highlightMemberTasks } = useContext(BoardContext);

  return (
    <div className='board-members-display'>
      {
        members.length > 0 &&
        members
          .filter((member, index) => index < 4)
          .map((member) => {
            return (
              <React.Fragment key={member._id}>
                <div
                  className='board-members-display__member'
                  onClick={() => highlightMemberTasks(member._id)}
                >
                  <UserProfilePicture
                    backgroundColor={member.color}
                    initials={member.initials}
                    name={member.name}
                  />
                </div>
              </React.Fragment>
            );
          })
      }
      <span className='remaining-members-count' onClick={showMembersDropdown}>
        {
          members.length > 4 && `+ ${members.length - 4}`
        }
      </span>
    </div>
  );
}

export default BoardMembersDisplay;