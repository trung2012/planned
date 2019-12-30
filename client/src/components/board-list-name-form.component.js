import React, { useState } from 'react';

import './board-list-name-form.styles.scss';
import CustomInput from './custom-input.component';

const BoardListNameForm = ({ submit, dismiss, name = '' }) => {
  const [newListName, setNewListName] = useState(name);

  const handleSubmit = event => {
    event.preventDefault();
    submit(newListName);
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={handleSubmit}></div>
      <form className='board-list-name-form' onSubmit={handleSubmit}>
        <CustomInput
          placeholder='Enter list name'
          value={newListName}
          onChange={(event) => setNewListName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              dismiss()
            }
          }}
          autoFocus
        />
      </form>
    </React.Fragment>
  );
}

export default BoardListNameForm;