import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import './ColumnsDisplay.css';

const CHART_HEIGHT = 336;
const COLUMN_MAX_HEIGHT = 265; // Максимальная высота столбца
const GAP = 60; // Расстояние между столбцами
const COLUMN_WIDTH = 80; // Ширина столбца
const ARROW_OFFSET = 62; // Высота подъема стрелки над самым высоким столбцом

const ColumnsDisplay: React.FC = () => {
  const currentData = useSelector((state: RootState) => state.data.currentData);

  if (!currentData) return <p>Loading...</p>;

  const maxGroupHeight = useMemo(() => {
    const groupSums = [
      Object.values(currentData.dev).reduce((sum, val) => sum + val, 0),
      Object.values(currentData.test).reduce((sum, val) => sum + val, 0),
      Object.values(currentData.prod).reduce((sum, val) => sum + val, 0),
      currentData.norm
    ];
    const max = Math.max(...groupSums);
    return max > 0 ? max : null; // Если max <= 0, вернем null
  }, [currentData]);

  if (!maxGroupHeight) {
    return <p>No data to display.</p>; // Если все значения равны нулю
  }

  const scaleHeight = (value: number) => (value / maxGroupHeight) * COLUMN_MAX_HEIGHT;

  const columnHeights = [
    Object.values(currentData.dev).reduce((sum, val) => sum + val, 0),
    Object.values(currentData.test).reduce((sum, val) => sum + val, 0),
    Object.values(currentData.prod).reduce((sum, val) => sum + val, 0),
    currentData.norm
  ].map(scaleHeight);

  const renderColumn = (label: string, value: number | { [key: string]: number }) => {
    if (typeof value === 'number') {
      return (
        <div className="column">
          <div
            className="column__bar column__bar--norm"
            style={{ height: `${scaleHeight(value)}px`, width: `${COLUMN_WIDTH}px` }}
          >
            <span className="column__value">{value}</span>
          </div>
          <p className="column__label">{label}</p>
        </div>
      );
    }

    const parts = Object.entries(value).map(([key, val]) => ({
      label: key,
      value: val,
      color: key.toLowerCase()
    }));

    return (
      <div className="column">
        {parts.map(part => (
          <div
            key={part.label}
            className={`column__bar column__bar--${part.color}`}
            style={{ height: `${scaleHeight(part.value)}px`, width: `${COLUMN_WIDTH}px` }}
          >
            <span className="column__value">{part.value}</span>
          </div>
        ))}
        <p className="column__label">{label}</p>
      </div>
    );
  };

  const calculateArrowPath = (index: number, currentHeight: number, nextHeight: number) => {
    const x1 = index * (COLUMN_WIDTH + GAP) + COLUMN_WIDTH / 2; // Середина текущего столбца
    const y1 = CHART_HEIGHT - currentHeight - 9; // Верх текущего столбца
    const x2 = (index + 1) * (COLUMN_WIDTH + GAP) + COLUMN_WIDTH / 2 - 10; // Горизонтальная линия к следующему столбцу (чуть левее)
    const y2 = CHART_HEIGHT - nextHeight; // Нижняя точка следующего столбца

    const arrowY = CHART_HEIGHT - COLUMN_MAX_HEIGHT - ARROW_OFFSET - 9; // Горизонтальная линия стрелки

    if (index === 1) {
      // Стрелка из второго столбца выходит с координаты (COLUMN_WIDTH / 2 + 10)
      const x2Adjusted = (index + 1) * (COLUMN_WIDTH + GAP) + COLUMN_WIDTH / 2 + 10;
      return `M${x1},${y1} L${x1},${arrowY} L${x2Adjusted},${arrowY} L${x2Adjusted},${y2}`;
    }

    if (index === 2) {
      // В третьем столбце стрелка входит в середину (COLUMN_WIDTH / 2)
      const x2Centered = (index + 1) * (COLUMN_WIDTH + GAP) + COLUMN_WIDTH / 2;
      return `M${x1},${y1} L${x1},${arrowY} L${x2Centered},${arrowY} L${x2Centered},${y2}`;
    }

    // Для всех остальных случаев
    return `M${x1},${y1} L${x1},${arrowY} L${x2},${arrowY} L${x2},${y2}`;
  };

  return (
    <div className="columns-container">
      <svg className="columns__lines" width="100%" height={CHART_HEIGHT}>
        <defs>
          {/* Обновленный стиль стрелки */}
          <marker
            id="arrow"
            markerWidth="7"
            markerHeight="4"
            refX="3.5" /* Центрируем стрелку */
            refY="2"
            orient="auto"
          >
            <path
              d="M3.02471 2.3672H3.97529L6.18863 0.140074C6.37424 -0.0466915 6.67518 -0.0466915 6.86079 0.140074C7.0464 0.32684 7.0464 0.629646 6.86079 0.816412L3.83608 3.85993C3.65047 4.04669 3.34953 4.04669 3.16392 3.85993L0.139209 0.816412C-0.0464029 0.629646 -0.0464029 0.32684 0.139209 0.140074C0.32482 -0.0466915 0.625755 -0.0466915 0.811367 0.140074L3.02471 2.3672Z"
              fill="#898290" /* Цвет стрелки */
              transform="rotate(-90 3.5 2)" /* Поворачиваем стрелку */
            />
          </marker>
        </defs>
        {columnHeights.map((_, index) => {
          if (index >= columnHeights.length - 1) return null; // Убираем стрелку из третьего в `Norm`
          return (
            <path
              key={index}
              d={calculateArrowPath(index, columnHeights[index], columnHeights[index + 1])}
              stroke="black"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrow)"
            />
          );
        })}
      </svg>
      <div className="columns">
        {renderColumn('Dev', currentData.dev)}
        {renderColumn('Test', currentData.test)}
        {renderColumn('Prod', currentData.prod)}
        {renderColumn('Norm', currentData.norm)}
      </div>
    </div>
  );
};

export default ColumnsDisplay;
