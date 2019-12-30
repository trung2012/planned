import React, { useState } from 'react';

import './board-list-add.styles.scss';
import CustomInput from './custom-input.component';

const BoardListAdd = ({ submit }) => {
  const [newListName, setNewListName] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    submit(newListName);
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={handleSubmit}></div>
      <form className='board-list-add' onSubmit={handleSubmit}>
        <CustomInput
          placeholder='Enter list name'
          value={newListName}
          onChange={(event) => setNewListName(event.target.value)}
          autoFocus
        />
      </form>
    </React.Fragment>
  );
}

export default BoardListAdd;