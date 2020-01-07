import React, { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';

const CommentContainer = ({ commentId }) => {
  const { boardState } = useContext(BoardContext);
  const comment = boardState.comments && boardState.comments[commentId];

  return (
    comment &&
    <Comment comment={comment} />
  );
}

export default CommentContainer;