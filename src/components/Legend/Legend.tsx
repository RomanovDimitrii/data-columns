import React from 'react';
import './Legend.css';

const LEGEND_ITEMS = [
  { label: 'Клиентская часть', color: '#4AB6E8' },
  { label: 'Серверная часть', color: '#AA6FAC' },
  { label: 'База данных', color: '#E85498' }
];

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
