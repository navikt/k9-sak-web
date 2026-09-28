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

// Kompileringsfeil her betyr at BRUK_V2_DELING_AV_DAGER er fjernet fra FeatureToggles.
// Slett denne fila (med tilhørende spec/css) og fjern v1-grenen i UttakFaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_DELING_AV_DAGER'];
