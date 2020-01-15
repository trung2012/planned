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

const updateKeyWithCount = (obj, val) => {
  if (obj[val] === undefined) {
    obj[val] = {
      name: val,
      value: 1
    }
  } else {
    obj[val].value++;
  }
}

const updateKeyWithoutCount = (obj, val) => {
  if (obj[val] === undefined) {
    obj[val] = {
      name: val
    }
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
  const tasksByList = lists.map(list => {
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
  const tasksByProgress = {};
  const tasksByProgressArray = [];

  for (const task of allTasks) {
    if (moment(task.due).isBefore(Date.now(), 'day') && task.progress !== 'Completed') {
      updateKeyWithCount(tasksByProgress, 'Late');
    } else {
      updateKeyWithCount(tasksByProgress, task.progress);
    }
  }

  for (const key in tasksByProgress) {
    tasksByProgress[key]['color'] = getLegendColor(key);
    tasksByProgressArray.push(tasksByProgress[key]);
  }

  // Group by priority  
  const tasksByPriority = {};
  const tasksByPriorityArray = [];

  for (const task of allTasks) {
    updateKeyWithCount(tasksByPriority, task.priority);
  }

  for (const key in tasksByPriority) {
    tasksByPriority[key]['color'] = getLegendColor(key);
    tasksByPriorityArray.push(tasksByPriority[key]);
  }

  // Group by assignee
  const tasksByAssignee = {};
  const tasksByAssigneeArray = [];

  for (const task of allTasks) {
    if (!task.assignee) {
      updateKeyWithoutCount(tasksByAssignee, 'Unassigned');

      if (moment(task.due).isBefore(Date.now(), 'day') && task.progress !== 'Completed') {
        if (tasksByAssignee['Unassigned']['Late'] === undefined) {
          tasksByAssignee['Unassigned']['Late'] = 1;
        } else {
          tasksByAssignee['Unassigned']['Late']++;
        }
      } else {
        if (tasksByAssignee['Unassigned'][task.progress] === undefined) {
          tasksByAssignee['Unassigned'][task.progress] = 1;
        } else {
          tasksByAssignee['Unassigned'][task.progress]++;
        }
      }
    } else {
      updateKeyWithoutCount(tasksByAssignee, task.assignee.name);

      if (moment(task.due).isBefore(Date.now(), 'day') && task.progress !== 'Completed') {
        if (tasksByAssignee[task.assignee.name]['Late'] === undefined) {
          tasksByAssignee[task.assignee.name]['Late'] = 1;
        } else {
          tasksByAssignee[task.assignee.name]['Late']++;
        }
      } else {
        if (tasksByAssignee[task.assignee.name][task.progress] === undefined) {
          tasksByAssignee[task.assignee.name][task.progress] = 1;
        } else {
          tasksByAssignee[task.assignee.name][task.progress]++;
        }
      }
    }
  }

  for (const key in tasksByAssignee) {
    tasksByAssigneeArray.push(tasksByAssignee[key]);
  }

  return {
    tasksByProgressArray,
    tasksByPriorityArray,
    tasksByAssigneeArray,
    tasksByList,
    tasksRemaining,
    tasksCount: allTasks.length
  }
}

export const getLegendColor = (textValue) => {
  switch (textValue) {
    case 'Late':
    case 'Urgent':
      return '#db0033';
    case 'Not started':
      return '#5f5f5f';
    case 'In progress':
    case 'Medium':
      return '#2b71db';
    case 'Completed':
      return '#418040';
    case 'Low':
      return '#0088FE';
    case 'High':
      return '#FF8042';
    default:
      return '#5f5f5f';
  }
}