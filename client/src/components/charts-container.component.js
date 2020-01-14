import React from 'react';
import { calculateGroupsFromLists } from '../utils/helper';
import ChartByProgress from './chart-by-progress.component';
import ChartByPriority from './chart-by-priority.component';

import './charts-container.styles.scss';

const ChartContainer = ({ lists }) => {
  const { byProgressArray, byPriorityArray, byAssigneeArray, byList, tasksRemaining, tasksCount } = calculateGroupsFromLists(lists);
  console.log(byProgressArray)
  console.log(byPriorityArray)
  console.log(byAssigneeArray)
  console.log(byList)

  return (
    <div className='charts-container'>
      <ChartByProgress data={byProgressArray} tasksRemaining={tasksRemaining} />
      <ChartByPriority data={byPriorityArray} tasksCount={tasksCount} />
    </div>
  );
}

export default React.memo(ChartContainer);