import React from 'react';

import { getChartData } from '../utils/helper';

import './favorite-projects-list.styles.scss';
import FavoriteProjectChart from './favorite-project-chart.component';

const FavoriteProjectsList = ({ projects }) => {
  return (
    <div className='favorite-projects-list'>
      {
        projects.map(project => {
          const { tasksByProgressArray, tasksRemaining } = getChartData(project.tasks);

          return <FavoriteProjectChart key={project._id} project={project} data={tasksByProgressArray} tasksRemaining={tasksRemaining} />
        })
      }
    </div>
  );
}

export default FavoriteProjectsList;