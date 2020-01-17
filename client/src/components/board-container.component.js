import React, { useContext, useState } from 'react';
import { BoardContext } from '../context/BoardContext';
import BoardHeader from './board-header.component';
import ChartContainer from './charts-container.component';
import BoardLists from './board-lists.component';

import { calculateGroupsFromLists } from '../utils/helper';
import useListFilters from '../hooks/useListFilters';
import './board-container.styles.scss';

const BoardContainer = () => {
  const { boardState } = useContext(BoardContext);
  const [showChart, setShowChart] = useState(true);

  const lists = boardState.currentProject.lists
    ? boardState.currentProject.lists.map(listId => {
      const list = { ...boardState.lists[listId] };
      list.tasks = list.tasks.map(taskId => boardState.tasks[taskId]);

      return list;
    })
    : [];
  const {
    tasksByProgressArray,
    tasksByPriorityArray,
    tasksByAssigneeArray,
    tasksByList,
    tasksRemaining,
    tasksCount,
    allAssignees,
    allLists
  } = calculateGroupsFromLists(lists);

  const filteredLists = useListFilters(lists);

  return (
    lists.length > 0 ?
      <React.Fragment>
        <BoardHeader showChart={showChart} setShowChart={setShowChart} allLists={allLists} allAssignees={allAssignees} />
        <div className='board-container'>
          {
            showChart
              ? <ChartContainer
                tasksByProgressArray={tasksByProgressArray}
                tasksByPriorityArray={tasksByPriorityArray}
                tasksByAssigneeArray={tasksByAssigneeArray}
                tasksByList={tasksByList}
                tasksRemaining={tasksRemaining}
                tasksCount={tasksCount}
              />
              : <BoardLists lists={filteredLists} />
          }
        </div>
      </React.Fragment>
      : null
  );
}

export default BoardContainer;