import React from 'react';

import './custom-chart-legends.styles.scss';
import { getLegendColor } from '../utils/helper';

const CustomChartLegends = ({ data }) => {
  return (
    <div className='custom-chart-legends'>
      {
        data.map(item => {
          return (
            <div key={item.name} className='legend-item'>
              <div className='legend-item__icon' style={{ backgroundColor: getLegendColor(item.name) }}></div>
              <div className='legend-item__text'>{item.name}</div>
              <div className='legend-item__count'>{item.value}</div>
            </div>
          );
        })
      }
    </div>
  );
}

export default CustomChartLegends;