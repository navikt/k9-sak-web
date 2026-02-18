import React, { ReactNode, CSSProperties } from 'react';

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

const FastBreddeAligner = ({ kolonner, rad }: FastBreddeAlignerProps) => {
  const radStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: rad?.padding,
    margin: rad?.margin,
  };

  return (
    <div style={radStyle}>
      {kolonner.map(({ width, id, content, padding }) => {
        const kolonneStyle: CSSProperties = {
          width,
          padding,
        };

        return (
          <span style={kolonneStyle} key={id}>
            {content}
          </span>
        );
      })}
    </div>
  );
};

export default FastBreddeAligner;
