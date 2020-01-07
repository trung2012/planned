import React from 'react';

import MemberProfileItem from './member-profile-item.component';
import './comment.styles.scss';
import moment from 'moment';

const Comment = ({ comment }) => {
  return (
    <div className='comment'>
      <div className='comment__header'>
        <MemberProfileItem member={comment.author} />
        <span className='comment__created-at'>{moment(comment.createdAt).format('MMMM Do YYYY, h:mm a')}</span>
      </div>
      <div className='comment__content'>
        {comment.text}
      </div>
    </div>
  );
}

export default Comment;