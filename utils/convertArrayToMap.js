const convertArrayToMap = (arr) => {
  return arr.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {})
}

module.exports = convertArrayToMap;