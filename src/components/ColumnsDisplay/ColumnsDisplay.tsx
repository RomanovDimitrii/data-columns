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
    return <p>No data to display.</p>;
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
          <div className="column__wrapper">
            <div
              className="column__bar column__bar--norm"
              style={{ height: `${scaleHeight(value)}px`, width: `${COLUMN_WIDTH}px` }}
            >
              <span className="column__value column__value--norm">{value}</span>
            </div>
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
        <div className="column__wrapper">
          {parts.map(part => (
            <div
              key={part.label}
              className={`column__bar column__bar--${part.color}`}
              style={{ height: `${scaleHeight(part.value)}px`, width: `${COLUMN_WIDTH}px` }}
            >
              <span className="column__value">{part.value}</span>
            </div>
          ))}
        </div>
        <p className="column__label">{label}</p>
      </div>
    );
  };

  const calculateArrowPath = (index: number, currentHeight: number, nextHeight: number) => {
    const x1 = index * (COLUMN_WIDTH + GAP) + COLUMN_WIDTH / 2;
    const y1 = CHART_HEIGHT - currentHeight;
    const x2 = (index + 1) * (COLUMN_WIDTH + GAP) + COLUMN_WIDTH / 2;
    const y2 = CHART_HEIGHT - nextHeight - 2;

    const arrowY = CHART_HEIGHT - COLUMN_MAX_HEIGHT - ARROW_OFFSET; // Горизонтальная линия стрелки

    if (index === 0) {
      const x2Adjusted = (index + 1) * (COLUMN_WIDTH + GAP) + COLUMN_WIDTH / 2 - 10;
      return `M${x1},${y1} L${x1},${arrowY} L${x2Adjusted},${arrowY} L${x2Adjusted},${y2}`;
    }

    if (index === 1) {
      const x2Centered = (index + 1) * (COLUMN_WIDTH + GAP) + COLUMN_WIDTH / 2;
      return `M${x1},${y1} L${x1},${arrowY} L${x2Centered},${arrowY} L${x2Centered},${y2}`;
    }

    return `M${x1},${y1} L${x1},${arrowY} L${x2},${arrowY} L${x2},${y2}`;
  };

  return (
    <div className="columns-container">
      <svg className="columns__lines" width="100%" height={CHART_HEIGHT}>
        <defs>
          <marker id="arrow" markerWidth="7" markerHeight="4" refX="3.5" refY="2.5" orient="0">
            <svg
              width="7"
              height="4"
              viewBox="0 0 8 4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.52471 2.3672H4.47529L6.68863 0.140074C6.87424 -0.0466914 7.17518 -0.0466914 7.36079 0.140074C7.5464 0.32684 7.5464 0.629646 7.36079 0.816412L4.33608 3.85993C4.15047 4.04669 3.84953 4.04669 3.66392 3.85993L0.639209 0.816412C0.453597 0.629646 0.453597 0.32684 0.639209 0.140074C0.82482 -0.0466914 1.12575 -0.0466914 1.31137 0.140074L3.52471 2.3672Z"
                fill="#898290"
              />
            </svg>
          </marker>
        </defs>
        {columnHeights.map((_, index) => {
          if (index >= columnHeights.length - 2) return null;
          return (
            <path
              key={index}
              d={calculateArrowPath(index, columnHeights[index], columnHeights[index + 1])}
              stroke="#898290"
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
