import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomizedAxisTick from './custom-axis-tick.component';

import './chart-by-list.styles.scss';

const ChartByList = ({ data }) => {
  return (
    <div className='chart-container chart-right by-list'>
      <header className='chart__header'>
        <h3 className='chart-heading'>List</h3>
      </header>
      <div className='chart-content'>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout='vertical'
          >
            <XAxis type='number' allowDecimals={false} tick={<CustomizedAxisTick />} />
            <YAxis
              dataKey='name'
              type='category'
              tick={{
                fontSize: 14,
                transform: 'translate(-10, 0)'
              }} />
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

export default ChartByList;