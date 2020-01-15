import React from 'react';

const CustomizedAxisTick = ({ x, y, payload }) => {

  return (
    <g transform={`translate(${x},${y + 10})`}>
      <text dy={12} textAnchor='middle' fill='#666'>{payload.value}</text>
    </g>
  );
}

export default CustomizedAxisTick;