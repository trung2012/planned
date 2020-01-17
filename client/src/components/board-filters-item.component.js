import React from 'react';

import { ReactComponent as CheckmarkIcon } from '../assets/checkmark.svg';
import getSelectIcon from '../utils/getSelectIcon';
import './board-filters-item.styles.scss';

const BoardFiltersItem = ({ isSelected, text, onClick }) => {
  const selectedClassname = isSelected ? 'board-filters-item--selected' : 'board-filters-item';

  return (
    <div className={selectedClassname} onClick={onClick}>
      <div className={`${selectedClassname}__text-container`}>
        {
          getSelectIcon(text)
        }
        <div className={`${selectedClassname}__text`}>{text}</div>
      </div>
      <CheckmarkIcon className='checkmark-icon' />
    </div>
  );
}

export default BoardFiltersItem;