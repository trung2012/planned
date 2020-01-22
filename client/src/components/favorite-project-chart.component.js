import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Label, ResponsiveContainer } from 'recharts';

import CustomChartLegends from './custom-chart-legends.component';

import './chart-by-progress.styles.scss';

const ChartByProgress = ({ data, tasksRemaining }) => {
  const filteredData = data.every(entry => entry.value === 0)
    ? data.map(entry => entry.name === 'Not started' ? ({ ...entry, value: 1 }) : ({ ...entry, value: 0 })).filter(entry => entry.value !== 0)
    : data.filter(entry => entry.value !== 0);

  return (
    <div className='chart-container chart-left'>
      <header className='chart__header'>
        <h3 className='chart-heading'>Status</h3>
      </header>
      <div className='chart-content'>
        <div className='chart-chart'>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={filteredData}
                dataKey='value'
                innerRadius={70}
                outerRadius={80}
                paddingAngle={2}
                animationDuration={1000}
              >
                <Label
                  value={tasksRemaining} position="centerBottom" className='center-text-top' fontSize='24px'
                />
                <Label
                  value="tasks left" position="centerTop" className='center-text-bottom' fontSize='14px'
                />
                {
                  filteredData.map(entry => <Cell key={entry.name} fill={entry.color} />)
                }
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <CustomChartLegends data={data} />
      </div>
    </div>
  );
}

export default ChartByProgress;