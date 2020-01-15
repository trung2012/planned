import React, { useContext, useState } from 'react';
import { BoardContext } from '../context/BoardContext';
import BoardHeader from './board-header.component';
import ChartContainer from './charts-container.component';
import BoardLists from './board-lists.component';

import './board-container.styles.scss';

const BoardContainer = () => {
  const { boardState } = useContext(BoardContext);
  const [showChart, setShowChart] = useState(true);

  const lists = boardState.currentProject.lists && boardState.currentProject.lists.map(listId => {
    const list = { ...boardState.lists[listId] };
    list.tasks = list.tasks.map(taskId => boardState.tasks[taskId]);

    return list;
  })

  return (
    lists ?
      <React.Fragment>
        <BoardHeader showChart={showChart} setShowChart={setShowChart} />
        <div className='board-container'>
          {
            showChart
              ? <ChartContainer lists={lists} />
              : <BoardLists lists={lists} />
          }
        </div>
      </React.Fragment>
      : null
  );
}

export default BoardContainer;