import React from 'react';

import { getChartData } from '../utils/helper';

import './favorite-projects-list.styles.scss';
import ChartByProgress from './chart-by-progress.component';

const FavoriteProjectsList = ({ projects }) => {
  return (
    <div className='favorite-projects-list'>
      {
        projects.map(project => {
          const { tasksByProgressArray, tasksRemaining } = getChartData(project.tasks);

          return <ChartByProgress key={project._id} data={tasksByProgressArray} tasksRemaining={tasksRemaining} />
        })
      }
    </div>
  );
}

export default FavoriteProjectsList;