import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import { BoardContext } from '../context/BoardContext';
import BoardHeader from './board-header.component';
import ChartContainer from './charts-container.component';
import BoardLists from './board-lists.component';
import getBoardLists from '../utils/getBoardLists';
import useListFilters from '../hooks/useListFilters';
import { calculateGroupsFromLists } from '../utils/helper';
import './board-container.styles.scss';

const BoardContainer = () => {
  const query = new URLSearchParams(useLocation().search);
  const { boardState } = useContext(BoardContext);
  const selectedView = query.get('view');
  const showChart = selectedView === 'chart';

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
    allLists,
    listsByProgressArray,
    listsByPriorityArray,
    listsByAssigneeArray,
    listsByDueDateArray
  } = calculateGroupsFromLists(lists);

  const filteredLists = useListFilters(lists);

  return (
    lists.length > 0 ?
      <React.Fragment>
        <BoardHeader showChart={showChart} allLists={allLists} allAssignees={allAssignees} />
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
              :
              boardState.groupBy === 'List'
                ? <BoardLists lists={filteredLists} />
                : getBoardLists({ groupBy: boardState.groupBy, listsByProgressArray, listsByPriorityArray, listsByAssigneeArray, listsByDueDateArray })
          }
        </div>
      </React.Fragment>
      : null
  );
}

export default BoardContainer;