import React from 'react';
import './Legend.css';
import { LEGEND_ITEMS } from '../constants/constants';

const Legend: React.FC = () => {
  return (
    <div className="legend">
      {LEGEND_ITEMS.map(item => (
        <div key={item.label} className="legend-item">
          <div className="legend-color" style={{ backgroundColor: item.color }}></div>
          <span className="legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
