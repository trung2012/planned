import React from 'react';

import UserProfilePicture from './user-profile-picture.component';

import './board-members-display.styles.scss';

const BoardMembersDisplay = ({ members }) => {
  return (
    <div className='board-members-display'>
      {
        members.length > 0 &&
        members
          .filter((member, index) => index < 4)
          .map((member) => {
            return (
              <React.Fragment key={member._id}>
                <div className='board-members-display__member'>
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
      <span className='remaining-members-count'>
        {members.length > 4 && `+ ${members.length - 4}`}
      </span>
    </div>
  );
}

export default BoardMembersDisplay;