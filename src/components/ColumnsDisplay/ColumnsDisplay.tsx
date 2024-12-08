import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import './ColumnsDisplay.css';
import { DevData } from '../../redux/slices/dataSlice';
import { CONFIG } from '../constants/constants';
import ArrowIcon from '../ArrowIcon';

const ColumnsDisplay: React.FC = () => {
  const currentData = useSelector((state: RootState) => state.data.currentData);
  const logData = useSelector((state: RootState) => state.data.logData);

  if (!currentData || !logData) return <p>Loading...</p>;

  const initialGroupSums = [
    Object.values(currentData.dev).reduce((sum, val) => sum + val, 0),
    Object.values(currentData.test).reduce((sum, val) => sum + val, 0),
    Object.values(currentData.prod).reduce((sum, val) => sum + val, 0),
    currentData.norm
  ];

  const initialMaxGroupHeight = Math.max(...initialGroupSums);
  const minGroupHeight = Math.min(...initialGroupSums.filter(value => value > 0));
  const useLogScale = initialMaxGroupHeight / minGroupHeight > 100;

  // Суммы значений для отображения
  const groupSums = useMemo(() => {
    const dataToUse = useLogScale ? logData : currentData;
    return [
      Object.values(dataToUse.dev).reduce((sum, val) => sum + val, 0),
      Object.values(dataToUse.test).reduce((sum, val) => sum + val, 0),
      Object.values(dataToUse.prod).reduce((sum, val) => sum + val, 0),
      dataToUse.norm
    ];
  }, [currentData, logData, useLogScale]);

  const maxGroupHeight = Math.max(...groupSums);

  if (!maxGroupHeight && maxGroupHeight !== 0) {
    return <p className="column__info-message">Нет данных для отображения</p>;
  }

  // Масштабирование высоты
  const scaleHeight = useCallback(
    (value: number) => (value / maxGroupHeight) * CONFIG.COLUMN_MAX_HEIGHT,
    [maxGroupHeight]
  );

  // Высота колонок
  const columnHeights = useMemo(() => {
    return groupSums.map(value => Math.max(scaleHeight(value), 2)); // Минимальная высота 2px
  }, [groupSums, scaleHeight]);

  const RenderColumn: React.FC<{
    label: string;
    value: number | DevData;
  }> = ({ label, value }) => {
    if (typeof value === 'number') {
      return (
        <div className="column">
          <div className="column__wrapper">
            <div
              className={`column__bar column__bar--norm`}
              style={{
                height: `${Math.max(value === 0 ? 2 : scaleHeight(value), 2)}px`,
                width: `${CONFIG.COLUMN_WIDTH}px`
              }}
            >
              {scaleHeight(value) >= 14 && (
                <span className="column__value column__value--norm">{value}</span>
              )}
            </div>
          </div>
          <p className="column__label">{label}</p>
          <div className="column__below-label">
            {(value === 0 || scaleHeight(value) < 14) && (
              <React.Fragment>
                <span>{label}</span>: <span>{value}</span>
              </React.Fragment>
            )}
          </div>
        </div>
      );
    }

    const parts = Object.entries(value).map(([key, val]) => ({
      label: key,
      value: val as number,
      color: key.toLowerCase()
    }));

    return (
      <div className="column">
        <div className="column__wrapper">
          {parts.map(part => (
            <div
              key={part.label}
              className={`column__bar column__bar--${part.color}`}
              style={{
                height: `${Math.max(part.value === 0 ? 2 : scaleHeight(part.value), 2)}px`,
                width: `${CONFIG.COLUMN_WIDTH}px`
              }}
            >
              {scaleHeight(part.value) >= 14 && <span className="column__value">{part.value}</span>}
            </div>
          ))}
        </div>
        <p className="column__label">{label}</p>
        <div className="column__below-label">
          {parts
            .filter(part => part.value === 0 || scaleHeight(part.value) < 14)
            .map(part => (
              <div key={part.label}>
                <span>{part.label}</span>: <span>{part.value}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const calculateArrowPath = (index: number, currentHeight: number, nextHeight: number) => {
    const x1 = index * (CONFIG.COLUMN_WIDTH + CONFIG.GAP) + CONFIG.COLUMN_WIDTH / 2;
    const y1 = CONFIG.CHART_HEIGHT - currentHeight;
    const x2 = (index + 1) * (CONFIG.COLUMN_WIDTH + CONFIG.GAP) + CONFIG.COLUMN_WIDTH / 2;
    const y2 = CONFIG.CHART_HEIGHT - nextHeight;

    const arrowY = CONFIG.CHART_HEIGHT - CONFIG.COLUMN_MAX_HEIGHT - CONFIG.ARROW_OFFSET;

    if (index === 0) {
      const x2Adjusted = x2 - 10;
      return `M${x1},${y1} L${x1},${arrowY} L${x2Adjusted},${arrowY} L${x2Adjusted},${y2}`;
    }

    if (index === 1) {
      const x1Adjusted = x1 + 10;
      const x2Centered = x2;
      return `M${x1Adjusted},${y1} L${x1Adjusted},${arrowY} L${x2Centered},${arrowY} L${x2Centered},${y2}`;
    }

    return `M${x1},${y1} L${x1},${arrowY} L${x2},${arrowY} L${x2},${y2}`;
  };

  const calculateRawDiff = (index1: number, index2: number) => {
    const rawData = [
      Object.values(currentData.dev).reduce((sum, val) => sum + val, 0),
      Object.values(currentData.test).reduce((sum, val) => sum + val, 0),
      Object.values(currentData.prod).reduce((sum, val) => sum + val, 0)
    ];
    return rawData[index2] - rawData[index1];
  };

  const rawDiff1 = calculateRawDiff(0, 1);
  const rawDiff2 = calculateRawDiff(1, 2);

  return (
    <div className="columns-container">
      <svg className="columns__lines" width="100%" height={CONFIG.CHART_HEIGHT}>
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
                fillRule="evenodd"
                clipRule="evenodd"
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
              strokeWidth="1"
              fill="none"
              markerEnd="url(#arrow)"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      {maxGroupHeight !== 0 && (
        <div className={`colums__diff ${rawDiff1 >= 0 ? 'colums__diff--green' : ''}`}>
          {rawDiff1 !== 0 && (
            <ArrowIcon
              className={`colums__arrow ${rawDiff1 >= 0 ? 'colums__arrow--rotated' : ''}`}
            />
          )}
          {rawDiff1 > 0 && <span>+</span>}
          {rawDiff1}
        </div>
      )}
      {maxGroupHeight !== 0 && (
        <div
          className={`colums__diff colums__diff--second ${
            rawDiff2 >= 0 ? 'colums__diff--green' : ''
          }`}
        >
          {rawDiff2 !== 0 && (
            <ArrowIcon
              className={`colums__arrow ${rawDiff2 >= 0 ? 'colums__arrow--rotated' : ''}`}
            />
          )}
          {rawDiff2 > 0 && <span>+</span>}
          {rawDiff2}
        </div>
      )}
      <div className="columns">
        <div className="columns">
          <RenderColumn label="dev" value={useLogScale ? logData.dev : currentData.dev} />
          <RenderColumn label="test" value={useLogScale ? logData.test : currentData.test} />
          <RenderColumn label="prod" value={useLogScale ? logData.prod : currentData.prod} />
          <RenderColumn label="норматив" value={useLogScale ? logData.norm : currentData.norm} />
        </div>
      </div>
    </div>
  );
};

export default ColumnsDisplay;
