import React from 'react';
import BoardListsGrouped from '../components/board-lists-grouped.component';

export default ({ groupBy, listsByProgressArray, listsByPriorityArray, listsByAssigneeArray, listsByDueDateArray }) => {

  switch (groupBy) {
    case 'Assigned to':
      return <BoardListsGrouped lists={listsByAssigneeArray} />
    case 'Progress':
      return <BoardListsGrouped lists={listsByProgressArray} />
    case 'Priority':
      return <BoardListsGrouped lists={listsByPriorityArray} />
    case 'Due date':
      return <BoardListsGrouped lists={listsByDueDateArray} />
    default:
      return null;
  }
}