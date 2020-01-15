import React from 'react';

import { calculateGroupsFromLists } from '../utils/helper';
import ChartByProgress from './chart-by-progress.component';
import ChartByPriority from './chart-by-priority.component';
import ChartByAssignee from './chart-by-assignee.component';
import ChartByList from './chart-by-list.component';

import './charts-container.styles.scss';

const ChartContainer = ({ lists }) => {
  const {
    tasksByProgressArray,
    tasksByPriorityArray,
    tasksByAssigneeArray,
    tasksByList,
    tasksRemaining,
    tasksCount
  } = calculateGroupsFromLists(lists);

  return (
    tasksCount > 0
      ?
      <div className='charts'>
        <div className='charts-top'>
          <ChartByProgress data={tasksByProgressArray} tasksRemaining={tasksRemaining} />
          <ChartByList data={tasksByList} />
        </div>
        <div className='charts-bottom'>
          <ChartByPriority data={tasksByPriorityArray} tasksCount={tasksCount} />
          <ChartByAssignee data={tasksByAssigneeArray} />
        </div>
      </div>
      : <h2 className='no-task-message'>No Tasks</h2>
  );
}

export default React.memo(ChartContainer);