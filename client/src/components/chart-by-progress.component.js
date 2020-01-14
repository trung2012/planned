import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Label, ResponsiveContainer } from 'recharts';

import './chart-by-progress.styles.scss';

const ChartByProgress = ({ data, tasksRemaining }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className='by-progress-container'>
      <ResponsiveContainer width="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey='value'
            cx={300}
            cy={150}
            innerRadius={60}
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={2}
          >
            <Label
              value={tasksRemaining} position="centerBottom" className='center-text-top' fontSize='30px'
            />
            <Label
              value="tasks left" position="centerTop" className='center-text-bottom'
            />
            {
              data.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartByProgress;