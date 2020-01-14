import moment from 'moment';

export const generateRequestConfig = () => {
  const token = localStorage.getItem('token');

  if (token) {
    const requestConfig = {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    }

    return requestConfig;
  }

  return null;
}

export const removeObjectProperty = (obj, property) => {
  let { [property]: deleted, ...remaining } = obj;
  return remaining;
}

const updateKey = (obj, val) => {
  if (obj[val] === undefined) {
    obj[val] = {
      name: val,
      value: 1
    }
  } else {
    obj[val].value++;
  }
}

export const calculateGroupsFromLists = lists => {
  let allTasks = [];
  for (const list of lists) {
    allTasks = [...allTasks, ...list.tasks];
  }

  const tasksRemaining = allTasks.reduce((count, task) => {
    if (task.progress !== 'Completed') {
      count++;
    }
    return count;
  }, 0)

  //Group by list
  const byList = lists.map(list => {
    const listObject = {};
    listObject.name = list.name;

    for (const task of list.tasks) {
      if (moment(task.due).isBefore(Date.now(), 'day') && task.progress !== 'Completed') {
        if (listObject['Late'] === undefined) {
          listObject['Late'] = 1;
        } else {
          listObject['Late']++;
        }
      } else {
        if (listObject[task.progress] === undefined) {
          listObject[task.progress] = 1;
        } else {
          listObject[task.progress]++;
        }
      }
    }

    return listObject;
  });

  // Group by progress
  const byProgress = {};
  const byProgressArray = [];

  for (const task of allTasks) {
    if (moment(task.due).isBefore(Date.now(), 'day') && task.progress !== 'Completed') {
      updateKey(byProgress, 'Late');
    } else {
      updateKey(byProgress, task.progress);
    }
  }

  for (const key in byProgress) {
    byProgressArray.push(byProgress[key]);
  }

  // Group by priority  
  const byPriority = {};
  const byPriorityArray = [];

  for (const task of allTasks) {
    updateKey(byPriority, task.priority);
  }

  for (const key in byPriority) {
    byPriorityArray.push(byPriority[key]);
  }

  // Group by assignee
  const byAssignee = {};
  const byAssigneeArray = [];


  for (const task of allTasks) {
    if (!task.assignee) {
      updateKey(byAssignee, 'Unassigned');
    } else {
      updateKey(byAssignee, task.assignee.name);
    }
  }

  for (const key in byAssignee) {
    byAssigneeArray.push(byAssignee[key]);
  }

  return {
    byProgressArray,
    byPriorityArray,
    byAssigneeArray,
    byList,
    tasksRemaining,
    tasksCount: allTasks.length
  }
}