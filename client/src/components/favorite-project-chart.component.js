import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { PieChart, Pie, Cell, Label, ResponsiveContainer } from 'recharts';

import { ProjectContext } from '../context/ProjectContext';
import { ReactComponent as OptionsIcon } from '../assets/options.svg';
import { ReactComponent as FavoriteIcon } from '../assets/star-filled.svg';
import CustomChartLegends from './custom-chart-legends.component';
import MoreOptions from './more-options.component';

import './favorite-project-chart.styles.scss';

const FavoriteProjectChart = ({ data, tasksRemaining, project }) => {
  const history = useHistory();
  const { removeProjectFromFavorites } = useContext(ProjectContext);
  const [showProjectOptions, setShowProjectOptions] = useState(false);

  const filteredData = data.every(entry => entry.value === 0)
    ? data.map(entry => entry.name === 'Not started' ? ({ ...entry, value: 1 }) : ({ ...entry, value: 0 })).filter(entry => entry.value !== 0)
    : data.filter(entry => entry.value !== 0);

  return (
    <div className='favorite-project-chart' onClick={() => history.push(`projects/${project._id}`)}>
      <header className='favorite-project-chart__header'>
        <div className='project-list-item'>
          <div
            to={`/projects/${project._id}?view=chart`}
            className='project-picture-container'
          >
            <div
              className='project-picture'
              style={{ backgroundColor: `${project.color}` }}>
              {project.name.substring(0, 1).toUpperCase()}
            </div>
          </div>
          <div className='project-list-item__content'>
            <div className='project-list-item__content--top'>
              <div to={`/projects/${project._id}?view=chart`} className='project-list-item__name'>{project.name}</div>
              <div className='project-list-item__icons'>
                <FavoriteIcon className='favorite-icon' title='Remove from favorites' onClick={event => {
                  event.stopPropagation();
                  removeProjectFromFavorites(project._id);
                }} />
                <OptionsIcon className='options-icon' onClick={event => {
                  event.stopPropagation();
                  setShowProjectOptions(!showProjectOptions);
                }} title='More options' />
              </div>
            </div>
            <div to={`/projects/${project._id}?view=chart`} className='project-list-item__description'>
              {
                project.description.length > 32 ?
                  project.description.substring(0, 32) + '...'
                  : project.description
              }
            </div>
          </div>
          {
            showProjectOptions &&
            <MoreOptions dismiss={() => setShowProjectOptions(false)}>
              <div className='more-options-item' onClick={event => {
                event.stopPropagation();
                removeProjectFromFavorites(project._id)
              }}
              >
                Remove from favorites
              </div>
              <div className='more-options-item' onClick={() => history.push(`projects/${project._id}`)}>Go to project</div>
            </MoreOptions>
          }
        </div>
      </header>
      <div className='chart-content'>
        <div className='chart-chart'>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey='value'
                innerRadius={70}
                outerRadius={80}
                paddingAngle={tasksRemaining > 0 ? 2 : 0}
                animationDuration={1000}
                blendStroke={true}
              >
                <Label
                  value={tasksRemaining} position="centerBottom" className='center-text-top' fontSize='24px'
                />
                <Label
                  value="tasks left" position="centerTop" className='center-text-bottom' fontSize='14px'
                />
                {
                  filteredData.map(entry => <Cell key={entry.name} fill={entry.color} />)
                }
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomChartLegends data={data} />
      </div>
    </div>
  );
}

export default FavoriteProjectChart;