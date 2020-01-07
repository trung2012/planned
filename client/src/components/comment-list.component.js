import React from 'react';

import Comment from './comment.component';
import './comment-list.styles.scss';

const CommentList = ({ comments }) => {
  return (
    <div className='comment-list'>
      {
        comments.map(comment => (
          <Comment key={comment._id} comment={comment} />
        ))
      }
    </div>
  );
}

export default CommentList;