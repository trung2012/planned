import React, { useEffect, useCallback, useState } from 'react';
import io from 'socket.io-client';
import { useParams } from 'react-router-dom';

import './project-details.styles.scss';
import BoardList from './board-list.component';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [lists, setLists] = useState([
    {
      _id: '1',
      name: 'Test',
      project: projectId,
      tasks: [
        {
          _id: '11',
          title: 'Test',
          description: 'Test',
          progress: 'Not Started',
          priority: 'Low',
          due: null
        },
        {
          _id: '12',
          title: 'Test 2',
          description: 'Test 2',
          progress: 'Not Started',
          priority: 'High',
          due: null
        }
      ]
    },
    {
      _id: '2',
      name: 'Test 2',
      project: projectId,
      tasks: [
        {
          _id: '21',
          title: 'Test',
          description: 'Test',
          progress: 'Not Started',
          priority: 'Low',
          due: null
        },
        {
          _id: '22',
          title: 'Test 2',
          description: 'Test 2',
          progress: 'Not Started',
          priority: 'High',
          due: null
        }
      ]
    },
    {
      _id: '3',
      name: 'Test 3',
      project: projectId,
      tasks: [
        {
          _id: '31',
          title: 'Test',
          description: 'Test',
          progress: 'Not Started',
          priority: 'Low',
          due: null
        },
        {
          _id: '32',
          title: 'Test 2',
          description: 'Test 2',
          progress: 'Not Started',
          priority: 'High',
          due: null
        }
      ]
    }
  ]);
  const token = localStorage.getItem('token');
  const socket = useCallback(io('http://localhost:5000/', {
    transports: ['websocket'],
    query: `token=${token}`
  }), []);

  useEffect(() => {
    socket.emit('join', projectId);
    const fetchData = () => {
      socket.emit('initial_data', projectId);
    }

    // fetchData();


    return () => {
      socket.emit('leave', projectId);
      socket.disconnect();
    }

  }, [socket, projectId])

  return (
    <div className='project-details'>
      <header className='project-details__header'>
        {/* <div className='project-list-item__picture' style={{ backgroundColor: `${project.color}` }}>{project.name.substring(0, 1).toUpperCase()}</div> */}
      </header>
      <div className='project-details__main-content'>
        <div className='project-details__lists'>
          {
            lists.length > 0 &&
            lists.map(list => {
              return (
                <BoardList key={list._id} list={list} />
              );
            })
          }
        </div>
        <div className='project-details__add'>
          <button className='add-list'>Add new list</button>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;