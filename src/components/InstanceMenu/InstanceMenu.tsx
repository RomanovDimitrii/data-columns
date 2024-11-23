import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchData } from '../../redux/slices/dataSlice';
import './InstanceMenu.css';
import { BUTTONS } from '../constants/constants';

const InstanceMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
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
