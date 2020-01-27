import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { BoardProvider } from './context/BoardContext';
import { SocketProvider } from './context/SocketContext';
import { MyTasksProvider } from './context/MyTasksContext';
import { NavProvider } from './context/NavContext';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <SocketProvider>
    <BoardProvider>
      <AuthProvider>
        <ProjectProvider>
          <MyTasksProvider>
            <NavProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </NavProvider>
          </MyTasksProvider>
        </ProjectProvider>
      </AuthProvider>
    </BoardProvider>
  </SocketProvider>, document.getElementById('root'));

// serviceWorker.unregister();
