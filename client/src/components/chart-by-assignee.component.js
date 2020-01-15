import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomizedAxisTick from './custom-axis-tick.component';

import './chart-by-assignee.styles.scss';

const ChartByAssignee = ({ data }) => {
  return (
    <div className='chart-container chart-right by-assignee'>
      <header className='chart__header'>
        <h3 className='chart-heading'>Assignee</h3>
      </header>
      <div className='chart-content'>
        <ResponsiveContainer>
          <BarChart
            data={data}
          >
            <YAxis type='number' allowDecimals={false} />
            <XAxis
              dataKey='name'
              type='category'
              tick={
                <CustomizedAxisTick />
              } />
            <CartesianGrid vertical={true} horizontal={false} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey='Late' stackId='status' fill='#db0033' barSize={10} />
            <Bar dataKey='Not started' stackId='status' fill='#5f5f5f' barSize={10} />
            <Bar dataKey='In progress' stackId='status' fill='#2b71db' barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartByAssignee;