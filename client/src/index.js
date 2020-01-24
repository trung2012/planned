import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
// import * as serviceWorker from './serviceWorker';
import { BoardProvider } from './context/BoardContext';
import { SocketProvider } from './context/SocketContext';
import { MyTasksProvider } from './context/MyTasksContext';

ReactDOM.render(
  <SocketProvider>
    <BoardProvider>
      <AuthProvider>
        <ProjectProvider>
          <MyTasksProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </MyTasksProvider>
        </ProjectProvider>
      </AuthProvider>
    </BoardProvider>
  </SocketProvider>, document.getElementById('root'));

// serviceWorker.unregister();
