import React, { useContext } from 'react';

import { ReactComponent as CheckmarkIcon } from '../assets/checkmark.svg';
import { BoardContext } from '../context/BoardContext';

import './board-groupby-item.styles.scss';

const BoardGroupbyItem = ({ text, setShowGroupbyDropdown }) => {
  const { boardState: { groupBy }, setBoardGroupby } = useContext(BoardContext);
  const selectedClassname = groupBy.toLowerCase() === text.toLowerCase() ? 'board-groupby-item--selected' : 'board-groupby-item'

  const handleSelect = () => {
    setBoardGroupby(text);
    setShowGroupbyDropdown(false);
  }

  return (
    <div className={selectedClassname} onClick={handleSelect}>
      <CheckmarkIcon className='checkmark-icon' />
      <span className={`${selectedClassname}__text`}>{text}</span>
    </div>
  );
}

export default BoardGroupbyItem;