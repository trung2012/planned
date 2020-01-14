import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Label, ResponsiveContainer } from 'recharts';

import './chart-by-priority.styles.scss';

const ChartByProgress = ({ data, tasksCount }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className='by-priority-container'>
      <ResponsiveContainer>
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
              value={tasksCount} position="centerBottom" className='center-text-top' fontSize='30px'
            />
            <Label
              value="tasks total" position="centerTop" className='center-text-bottom'
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