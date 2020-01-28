import React, { useContext, useState } from 'react';
import axios from 'axios';

import Progress from './progress.component';
import { BoardContext } from '../context/BoardContext';
import { generateRequestConfig } from '../utils/helper';
import { MyTasksContext } from '../context/MyTasksContext';

import './file-upload.styles.scss';

const FileUpload = ({ text, url, isViewingMyTasks }) => {
  const { addBoardError } = useContext(BoardContext);
  const { addMyTasksError } = useContext(MyTasksContext);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleImageUpload = async (event) => {
    const requestConfig = generateRequestConfig();
    requestConfig.headers["Content-Type"] = 'multipart/form-data';
    const { files, value } = event.target;
    const fileName = value.replace('C:\\fakepath\\', '');
    const file = files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios({
          method: 'post',
          url: url + `/${fileName}`,
          data: formData,
          headers: requestConfig.headers,
          onUploadProgress: progressEvent => {
            setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 90) / progressEvent.total)
              )
            );
          }
        });

        if (response.data) {
          setUploadPercentage(0);
        }

      } catch (err) {
        setUploadPercentage(0);
        addBoardError(err.response.data);
        if (isViewingMyTasks) {
          addMyTasksError(err.response.data)
        }
      }
    }
  }

  return (
    <div className='file-upload'>
      <input type='file' name='image' id='image' onChange={handleImageUpload} />
      <label htmlFor='image' className='add-task-attachment'>
        {text}
      </label>
      {
        uploadPercentage > 0 && <Progress percentage={uploadPercentage} />
      }
    </div>
  );
}

export default FileUpload;