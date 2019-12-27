const getRandomColor = () => {
  let color = '#';
  letters = '0123456789ABCDEF'.split('');
  for (let i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 12)];
  }

  return color;
}

module.exports = getRandomColor;