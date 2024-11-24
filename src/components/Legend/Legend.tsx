import React from 'react';
import './Legend.css';
import { LEGEND_ITEMS } from '../constants/constants';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const Legend: React.FC = () => {
  const isAllZero = useSelector((state: RootState) => state.data.isAllZero);

  if (isAllZero) return null;

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
