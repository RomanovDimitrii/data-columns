import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import './ColumnsDisplay.css';
import { DevData } from '../../redux/slices/dataSlice';
import { CONFIG } from '../constants/constants';
import arrowIcon from '../../images/arrow.svg';

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
    return Math.max(...groupSums);
  }, [currentData]);

  if (!maxGroupHeight) {
    return <p className="column__info-message">Нет данных для отображения</p>;
  }

  const scaleHeight = useCallback(
    (value: number) => (value / maxGroupHeight) * CONFIG.COLUMN_MAX_HEIGHT,
    [maxGroupHeight]
  );

  const columnHeights = useMemo(() => {
    return [
      Object.values(currentData.dev).reduce((sum, val) => sum + val, 0),
      Object.values(currentData.test).reduce((sum, val) => sum + val, 0),
      Object.values(currentData.prod).reduce((sum, val) => sum + val, 0),
      currentData.norm
    ].map(scaleHeight);
  }, [currentData, scaleHeight]);

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
                height: `${scaleHeight(value)}px`,
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
            {scaleHeight(value) < 14 && (
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
                height: `${scaleHeight(part.value)}px`,
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
            .filter(part => scaleHeight(part.value) < 14)
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
    const y2 = CONFIG.CHART_HEIGHT - nextHeight - 1;

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

  const calculateRawDiff = (index1: number, index2: number, rawData: number[]) => {
    return Math.round(rawData[index2] - rawData[index1]);
  };

  const rawValues = [
    Object.values(currentData.dev).reduce((sum, val) => sum + val, 0),
    Object.values(currentData.test).reduce((sum, val) => sum + val, 0),
    Object.values(currentData.prod).reduce((sum, val) => sum + val, 0)
  ];

  const rawDiff1 = calculateRawDiff(0, 1, rawValues);
  const rawDiff2 = calculateRawDiff(1, 2, rawValues);

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
      <div className={`colums__diff ${rawDiff1 >= 0 ? 'colums__diff--green' : ''}`}>
        {rawDiff1 !== 0 && (
          <img
            className={`colums__arrow ${rawDiff1 >= 0 ? 'colums__arrow--rotated' : ''}`}
            src={arrowIcon}
            alt="arrow icon"
          />
        )}
        {rawDiff1 > 0 && <span>+</span>}
        {rawDiff1}
      </div>
      <div
        className={`colums__diff colums__diff--second ${
          rawDiff2 >= 0 ? 'colums__diff--green' : ''
        }`}
      >
        {rawDiff2 !== 0 && (
          <img
            className={`colums__arrow ${rawDiff2 >= 0 ? 'colums__arrow--rotated' : ''}`}
            src={arrowIcon}
            alt="arrow icon"
          />
        )}
        {rawDiff2 > 0 && <span>+</span>}
        {rawDiff2}
      </div>
      <div className="columns">
        <div className="columns">
          <RenderColumn label="dev" value={currentData.dev} />
          <RenderColumn label="test" value={currentData.test} />
          <RenderColumn label="prod" value={currentData.prod} />
          <RenderColumn label="норматив" value={currentData.norm} />
        </div>
      </div>
    </div>
  );
};

export default ColumnsDisplay;
