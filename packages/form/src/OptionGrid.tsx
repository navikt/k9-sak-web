import { EditedIcon, FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { range } from '@fpsak-frontend/utils';
import React from 'react';
import styles from './optionGrid.module.css';

interface OptionGridProps {
  columns?: number;
  options: React.ReactNode[];
  spaceBetween?: boolean;
  isEdited?: boolean;
  direction?: string;
  rows?: number;
}

export const OptionGrid = ({ columns, rows, options, spaceBetween, isEdited, direction }: OptionGridProps) => {
  if (direction === 'vertical') {
    const numRows = rows || options.length;
    return (
      <FlexContainer>
        <FlexColumn className={styles.fullBreddeIE}>
          {range(numRows).map(rowIndex => (
            <FlexRow key={`row${rowIndex}`} spaceBetween={spaceBetween}>
              {options.filter((option, optionIndex) => optionIndex % numRows === rowIndex)}
              {isEdited && <EditedIcon className="radioEdited" />}
            </FlexRow>
          ))}
        </FlexColumn>
      </FlexContainer>
    );
  }
  const numColumns = columns || options.length;
  return (
    <FlexContainer>
      <FlexRow spaceBetween={spaceBetween}>
        {range(numColumns).map(columnIndex => (
          <FlexColumn key={`column${columnIndex}`}>
            {options.filter((option, optionIndex) => optionIndex % numColumns === columnIndex)}
          </FlexColumn>
        ))}
        {isEdited && <EditedIcon className="radioEdited" />}
      </FlexRow>
    </FlexContainer>
  );
};

OptionGrid.defaultProps = {
  columns: 0,
  rows: 0,
  spaceBetween: false,
  isEdited: false,
  direction: 'horizontal',
};

export default OptionGrid;
