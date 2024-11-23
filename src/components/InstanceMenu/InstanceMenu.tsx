import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../redux/slices/dataSlice';
import './InstanceMenu.css';

const BUTTONS = [
  { label: 'Статистика 1', url: 'https://rcslabs.ru/ttrp1.json' },
  { label: 'Статистика 2', url: 'https://rcslabs.ru/ttrp2.json' },
  { label: 'Статистика 3', url: 'https://rcslabs.ru/ttrp3.json' },
  { label: 'Статистика 4', url: 'https://rcslabs.ru/ttrp4.json' },
  { label: 'Статистика 5', url: 'https://rcslabs.ru/ttrp5.json' }
];

const InstanceMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (url: string) => {
    dispatch(fetchData(url));
    setIsOpen(false); // Закрыть меню после выбора
  };

  const handleOutsideClick = (event: MouseEvent) => {
    // Проверяем, был ли клик вне области меню
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false); // Закрыть меню
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    // Чистим обработчик при размонтировании
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <nav className="instance-menu" ref={menuRef}>
      <div className="menu-trigger" onClick={handleMenuToggle}>
        <span className="menu-dots">...</span>
      </div>
      {isOpen && (
        <div className="menu-dropdown">
          {BUTTONS.map(button => (
            <div key={button.url} className="menu-item" onClick={() => handleItemClick(button.url)}>
              {button.label}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default InstanceMenu;
