import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { fetchData } from '../../redux/slices/dataSlice';
import './InstanceMenu.css';
import { MENU_ITEMS } from '../constants/constants';

const InstanceMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (url: string) => {
    dispatch(fetchData(url));
    setIsOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  return (
    <div className="instance-menu" ref={menuRef}>
      <div className="menu-trigger" onClick={handleMenuToggle}>
        <span className="menu-dots">...</span>
      </div>
      {isOpen && (
        <div className="menu-dropdown">
          {MENU_ITEMS.map(item => (
            <div key={item.url} className="menu-item" onClick={() => handleItemClick(item.url)}>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstanceMenu;
