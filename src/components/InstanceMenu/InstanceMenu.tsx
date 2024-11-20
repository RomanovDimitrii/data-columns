import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../redux/slices/dataSlice';
import './InstanceMenu.css';

const BUTTONS = [
  { label: 'Button 1', url: 'https://rcslabs.ru/ttrp1.json' },
  { label: 'Button 2', url: 'https://rcslabs.ru/ttrp2.json' },
  { label: 'Button 3', url: 'https://rcslabs.ru/ttrp3.json' },
  { label: 'Button 4', url: 'https://rcslabs.ru/ttrp4.json' },
  { label: 'Button 5', url: 'https://rcslabs.ru/ttrp5.json' }
];

const InstanceMenu: React.FC = () => {
  const dispatch = useDispatch();

  const handleClick = (url: string) => {
    dispatch(fetchData(url));
  };

  return (
    <div className="button-block">
      {BUTTONS.map(button => (
        <button key={button.url} onClick={() => handleClick(button.url)}>
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default InstanceMenu;
