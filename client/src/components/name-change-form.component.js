import React, { useState } from 'react';

import CustomInput from './custom-input.component';
import './name-change-form.styles.scss';

const NameChangeForm = ({ submit, dismiss, name = '', type }) => {
  const [newName, setNewName] = useState(name);

  const handleSubmit = event => {
    event.preventDefault();
    submit(newName);
  }

  return (
    <React.Fragment>
      <div className='overlay' onClick={handleSubmit}></div>
      <form className='name-change-form' onSubmit={handleSubmit}>
        <CustomInput
          placeholder={`Enter ${type} name`}
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
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

export default NameChangeForm;