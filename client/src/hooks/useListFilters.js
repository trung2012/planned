import { useContext } from 'react';
import { BoardContext } from '../context/BoardContext';
import moment from 'moment';

const useListFilters = (lists) => {
  const {
    boardState: {
      filterConditionName,
      filterConditionPriority,
      filterConditionAssignee,
      filterConditionList,
      filterConditionDue
    }
  } = useContext(BoardContext);

  const includeName = keyword => item => item.name.toLowerCase().includes(keyword);

  const includePriority = filtersArray => item => filtersArray.includes(item.priority);

  const includeAssignee = filtersArray => item => filtersArray.includes(item.assignee ? item.assignee._id : 'Unassigned');

  const includeList = filtersArray => item => filtersArray.includes(item.list);

  const includeDate = includedDates => item => {
    return includedDates.some(category => {
      const todaysDate = new Date();
      switch (category.toLowerCase()) {
        case 'late':
          return moment(item.due).isBefore(todaysDate, 'day');
        case 'today':
          return moment(item.due).isSame(todaysDate, 'day');
        case 'tomorrow':
          return moment(item.due).subtract(1, 'days').isSame(todaysDate, 'day');
        case 'this week':
          return moment(item.due).isBetween(moment().startOf('week'), moment().endOf('week'));
        case 'next week':
          return moment(item.due).subtract(1, 'weeks').isBetween(moment().startOf('week'), moment().endOf('week'));
        case 'future':
          return moment(item.due).subtract(1, 'weeks').isAfter(moment().endOf('week'));
        case 'no date':
          return !item.due;
        default:
          return false
      }
    })
  };

  const nameFilter = includeName(filterConditionName);

  const dateFilter = filterConditionDue.length ? includeDate(filterConditionDue) : () => true

  const priorityFilter = filterConditionPriority.length ? includePriority(filterConditionPriority) : () => true

  const assigneeFilter = filterConditionAssignee.length ? includeAssignee(filterConditionAssignee) : () => true

  const listFilter = filterConditionList.length ? includeList(filterConditionList) : () => true

  const executeAllFilters = (...filterFunctions) => item => filterFunctions.every(func => func(item));

  return lists.map(list => {
    return {
      ...list,
      tasks: list.tasks.filter(
        executeAllFilters(
          nameFilter,
          dateFilter,
          priorityFilter,
          assigneeFilter,
          listFilter
        ))
    }
  })
}

export default useListFilters;