import React from 'react';

import ChartByProgress from './chart-by-progress.component';
import ChartByPriority from './chart-by-priority.component';
import ChartByAssignee from './chart-by-assignee.component';
import ChartByList from './chart-by-list.component';

import './charts-container.styles.scss';

const ChartContainer = ({ tasksByProgressArray, tasksByPriorityArray, tasksByAssigneeArray, tasksByList, tasksRemaining, tasksCount }) => {

  return (
    <div className='charts'>
      <div className='charts-top'>
        <ChartByProgress data={tasksByProgressArray} tasksRemaining={tasksRemaining} />
        <ChartByPriority data={tasksByPriorityArray} tasksCount={tasksCount} />
      </div>
      <div className='charts-bottom'>
        <ChartByList data={tasksByList} />
        <ChartByAssignee data={tasksByAssigneeArray} />
      </div>
    </div>
  );
}

export default React.memo(ChartContainer);