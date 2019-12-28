import React, { useState } from 'react';

import './board-list-add.styles.scss';

const BoardListAdd = ({ dismiss }) => {
  const [newListName, setNewListName] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    dismiss(newListName);
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={handleSubmit}></div>
      <form className='board-list-add' onSubmit={handleSubmit}>
        <input
          className='board-list-add__input'
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