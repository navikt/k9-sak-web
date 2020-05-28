import React, { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

const Rad = styled.div<{ padding?: string; margin?: string }>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: ${({ padding }) => padding};
  margin: ${({ margin }) => margin};
`;

export const Kolonne = styled.span<{ width: string; padding?: string }>`
  width: ${({ width }) => width};
  padding: ${({ padding }) => padding};
`;

interface FastBreddeAlignerProps {
  kolonner: {
    width: string;
    id: string;
    content?: ReactNode;
    padding?: string;
  }[];
  rad?: {
    padding?: string;
    margin?: string;
  };
}

const FastBreddeAligner: FunctionComponent<FastBreddeAlignerProps> = ({ kolonner, rad }) => (
  <Rad padding={rad?.padding} margin={rad?.margin}>
    {kolonner.map(({ width, id, content, padding }) => (
      <Kolonne width={width} key={id} padding={padding}>
        {content}
      </Kolonne>
    ))}
  </Rad>
);

export default FastBreddeAligner;
