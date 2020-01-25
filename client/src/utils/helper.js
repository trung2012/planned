import { ObjectID } from 'bson';
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
  if (obj[val].value === undefined) {
    obj[val].value = 0;
  }

  obj[val].value++;
}

const updateKeyWithoutCount = (obj, val) => {
  if (obj[val] === undefined) {
    obj[val] = {
      name: val
    }
  }
}

const updateListKeyWithTask = (obj, key, task, type) => {
  if (obj[key] === undefined) {
    if (type === 'assignee') {
      obj[key] = {
        ...task.assignee,
        tasks: [task]
      }
    } else {
      obj[key] = {
        _id: key,
        name: key,
        tasks: [task]
      }
    }
  } else {
    if (obj[key].tasks === undefined) {
      obj[key] = {
        ...obj[key],
        tasks: [task]
      }
    } else {
      obj[key] = {
        ...obj[key],
        tasks: [...obj[key].tasks, task]
      }
    }
  }
}

export const getGroupedListsData = (lists, allTasks) => {

  const listsByProgress = {
    'Not started': {
      _id: 'Not started',
      name: 'Not started',
      tasks: []
    },
    'In progress': {
      _id: 'In progress',
      name: 'In progress',
      tasks: []
    },
    'Completed': {
      _id: 'Completed',
      name: 'Completed',
      tasks: []
    }
  };

  const listsByProgressArray = [];
  const listsByProgressIds = [];

  for (const task of allTasks) {
    updateListKeyWithTask(listsByProgress, task.progress, task);
  }

  for (const key in listsByProgress) {
    listsByProgressArray.push(listsByProgress[key]);
    listsByProgressIds.push(key);
  }

  const listsByPriority = {
    'Low': {
      _id: 'Low',
      name: 'Low',
      tasks: []
    },
    'Medium': {
      _id: 'Medium',
      name: 'Medium',
      tasks: []
    },
    'High': {
      _id: 'High',
      name: 'High',
      tasks: []
    },
    'Urgent': {
      _id: 'Urgent',
      name: 'Urgent',
      tasks: []
    }
  };
  const listsByPriorityArray = [];

  for (const task of allTasks) {
    updateListKeyWithTask(listsByPriority, task.priority, task);
  }

  for (const key in listsByPriority) {
    listsByPriorityArray.push(listsByPriority[key]);
  }

  const listsByAssignee = {
    'Unassigned': {
      _id: 'Unassigned',
      name: 'Unassigned',
      initials: 'U',
      color: '#666'
    }
  };

  const listsByAssigneeArray = [];

  for (const task of allTasks) {
    if (!task.assignee) {
      updateListKeyWithTask(listsByAssignee, 'Unassigned', task, 'assignee');
    } else {
      updateListKeyWithTask(listsByAssignee, task.assignee.name, task, 'assignee');
    }
  }

  for (const key in listsByAssignee) {
    listsByAssigneeArray.push(listsByAssignee[key]);
  }

  const listsByDueDate = {
    'No date': {
      _id: 'No date',
      name: 'No date',
      tasks: []
    },
    'Late': {
      _id: 'Late',
      name: 'Late',
      tasks: []
    },
    'Today': {
      _id: 'Today',
      name: 'Today',
      tasks: []
    },
    'This week': {
      _id: 'This week',
      name: 'This week',
      tasks: []
    },
    'Next week': {
      _id: 'Next week',
      name: 'Next week',
      tasks: []
    },
    'Future': {
      _id: 'Future',
      name: 'Future',
      tasks: []
    }
  };

  const listsByDueDateArray = [];

  for (const task of allTasks) {
    if (!task.due) {
      updateListKeyWithTask(listsByDueDate, 'No date', task);
    } else {
      updateListKeyWithTask(listsByDueDate, getDueCategory(task.due), task);
    }
  }

  for (const key in listsByDueDate) {
    if (listsByDueDate[key].tasks.length > 0) {
      listsByDueDateArray.push(listsByDueDate[key]);
    }
  }

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

  const allAssignees = listsByAssigneeArray.map(assignee => {
    const { tasks: _, ...rest } = assignee;
    return rest;
  });

  const allLists = lists.map(list => {
    const { tasks: _, ...rest } = list;
    return rest;
  });

  return {
    allAssignees,
    allLists,
    listsByProgressArray,
    listsByPriorityArray,
    listsByAssigneeArray,
    listsByDueDateArray,
    tasksByList,
    listsByProgress,
    listsByProgressIds
  }
}

export const getChartData = allTasks => {

  const tasksRemaining = allTasks.reduce((count, task) => {
    if (task.progress !== 'Completed') {
      count++;
    }
    return count;
  }, 0)

  // Group by progress
  const tasksByProgress = {
    'Not started': {
      _id: new ObjectID().toString(),
      name: 'Not started',
      value: 0
    },
    'In progress': {
      _id: new ObjectID().toString(),
      name: 'In progress',
      value: 0
    },
    'Completed': {
      _id: new ObjectID().toString(),
      name: 'Completed',
      value: 0
    },
    'Late': {
      _id: new ObjectID().toString(),
      name: 'Late',
      value: 0
    }
  };

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
  const tasksByPriority = {
    'Low': {
      _id: new ObjectID().toString(),
      name: 'Low',
      value: 0
    },
    'Medium': {
      _id: new ObjectID().toString(),
      name: 'Medium',
      value: 0
    },
    'High': {
      _id: new ObjectID().toString(),
      name: 'High',
      value: 0
    },
    'Urgent': {
      _id: new ObjectID().toString(),
      name: 'Urgent',
      value: 0
    }
  };
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
    tasksRemaining
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
      return '#2b71db';
    case 'Medium':
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

export const getDueDate = category => {
  switch (category.toLowerCase()) {
    case 'no date':
      return null;
    case 'late':
      return moment().subtract(1, 'days').format();
    case 'today':
      return moment().format();
    case 'tomorrow':
      return moment().add(1, 'days').format();
    case 'this week':
      return moment().endOf('week').format();
    case 'next week':
      return moment().endOf('week').add(1, 'weeks').format();
    case 'future':
      return moment().endOf('week').add(8, 'days').format();
    default:
      return null;
  }
}

const getDueCategory = date => {
  const todaysDate = new Date();

  if (moment(date).isBefore(todaysDate, 'day')) {
    return 'Late';
  }

  if (moment(date).isSame(todaysDate, 'day')) {
    return 'Today';
  }

  if (moment(date).subtract(1, 'days').isSame(todaysDate, 'day')) {
    return 'Tomorrow';
  }

  if (moment(date).isBetween(moment().startOf('week'), moment().endOf('week'))) {
    return 'This week';
  }

  if (moment(date).subtract(1, 'weeks').isBetween(moment().startOf('week'), moment().endOf('week'))) {
    return 'Next week';
  }

  if (moment(date).subtract(1, 'weeks').isAfter(moment().endOf('week'))) {
    return 'Future';
  }
}


export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  }
}