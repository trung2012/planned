import React, { useContext, useState } from 'react';
import axios from 'axios';

import Progress from './progress.component';
import { generateRequestConfig } from '../utils/helper';
import UserProfilePicture from './user-profile-picture.component';
import { AuthContext } from '../context/AuthContext';
import ErrorDisplay from './error-display.component';
import { BoardContext } from '../context/BoardContext';

import './user-account-details.styles.scss';

const UserAccountDetails = ({ setShowPasswordChange, setShowAccountDetails }) => {
  const { updateUserAvatar } = useContext(BoardContext);
  const { authState: { user, errorMessage }, setUserProfilePicture, addAuthError, } = useContext(AuthContext);
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const handleAvatarUpload = async (event) => {
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
          url: `/api/users/avatar/${fileName}`,
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
          setUserProfilePicture(response.data);
          updateUserAvatar(response.data);
        }

      } catch (err) {
        addAuthError(err.response.data);
      }
    }
  }

  return (
    user &&
    <div className='user-account-page'>
      {
        errorMessage &&
        <ErrorDisplay text={errorMessage} />
      }
      <div className='user-account-page__header'>
        <div className='user-account-page__user-name-container'>
          <UserProfilePicture
            initials={user.initials}
            name={user.name}
            avatarUrl={user.avatar && user.avatar.url}
            backgroundColor={user.color}
          />
          <div className='user-account-page__user-name'>{user.name}</div>
        </div>
        {
          uploadPercentage > 0 && <Progress percentage={uploadPercentage} />
        }
        <div className='user-account-page__header__buttons'>
          <div className='file-upload'>
            <input type='file' name='image' id='image' onChange={handleAvatarUpload} />
            <label htmlFor='image' className='add-task-attachment'>
              Change profile picture
          </label>
          </div>
          <button className='btn-light' onClick={() => {
            setShowPasswordChange(true);
            setShowAccountDetails(false);
          }}>
            Change password
          </button>
        </div>
      </div>
      <div className='user-account-page__info'>
        <div className='user-account-page__info-item'>
          <span className='user-account-page__info-item-title'>Full name</span>
          <span className='user-account-page__info-item-value'>{user.name}</span>
        </div>
        <div className='user-account-page__info-item'>
          <span className='user-account-page__info-item-title'>Email</span>
          <span className='user-account-page__info-item-value'>{user.email}</span>
        </div>
      </div>
    </div>
  );
}

export default UserAccountDetails;