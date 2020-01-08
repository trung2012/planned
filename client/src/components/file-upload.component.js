import React, { useContext } from 'react';

import { BoardContext } from '../context/BoardContext';

import './file-upload.styles.scss';

const FileUpload = ({ text }) => {
  const { boardState, addBoardError } = useContext(BoardContext);

  const handleImageUpload = async (event) => {
    const { files } = event.target;
    if (files) {
      const formData = new FormData();
      for (let file of files) {
        formData.append('image', file);
      }

      try {
        await axios({
          method: 'post',
          url: `/api/lists/images/upload/${match.params.listId}`,
          data: formData,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          },
          onUploadProgress: progressEvent => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 90) / progressEvent.total)
              )
            );
          }
        });

        setUploadPercentage(100);
      } catch (err) {

      }
    }
  }

  return (
    <div className='file-upload'>
      <input type='file' name='image' id='image' onChange={handleImageUpload} multiple />
      <label htmlFor='image'>
        {text}
      </label>
      {/* {
        uploadPercentage > 0 && <Progress percentage={uploadPercentage} />
      } */}
    </div>
  );
}

export default FileUpload;