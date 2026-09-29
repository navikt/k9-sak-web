import React from 'react';

// Kompileringsfeil her betyr at BRUK_V2_OM_PLEIETRENGENDE er fjernet fra FeatureToggles.
// Slett denne fila og fjern v1-grenen i OmPleietrengendeFaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_OM_PLEIETRENGENDE'];
import { useIntl } from 'react-intl';

interface OwnProps {
  omPleietrengende: {
    navn: string;
    fnr: string;
  };
}

const OmPleietrengende: React.FunctionComponent<OwnProps> = ({ omPleietrengende }) => {
  const intl = useIntl();

  if (!omPleietrengende) {
    return <p>Ikke hentet inn data.</p>;
  }

  return (
    <>
      <h3>{intl.formatMessage({ id: 'OmPleietrengende.Titel' })}</h3>
      <p>
        Navn: <b>{omPleietrengende.navn}</b> Fødselsnummer: <b>{omPleietrengende.fnr}</b>
      </p>
    </>
  );
};

export default OmPleietrengende;
