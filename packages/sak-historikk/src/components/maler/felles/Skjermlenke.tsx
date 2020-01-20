import React from 'react';
import { NavLink } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';
import { createLocationForHistorikkItems } from '@fpsak-frontend/fp-felles/src/skjermlenkeCodes';
import { scrollUp } from './historikkUtils';

interface Kodeverk {
  kode: string;
  kodeverk: string;
}

interface SkjermlenkeProps {
  skjermlenke?: Kodeverk;
  behandlingLocation?: {
    pathname: string,
  };
  getKodeverknavn?: (kodeverkObjekt: Kodeverk, undertype?: string) => string;
  scrollUpOnClick?: boolean;
}

const Skjermlenke: React.FunctionComponent<SkjermlenkeProps> = ({
  skjermlenke,
  behandlingLocation,
  getKodeverknavn,
  scrollUpOnClick,
}) => {
  if (!skjermlenke) {
    return null;
  }
  return (
    <Element>
      <NavLink
        to={createLocationForHistorikkItems(behandlingLocation, skjermlenke.kode)}
        onClick={scrollUpOnClick && scrollUp}
      >
        {getKodeverknavn(skjermlenke)}
      </NavLink>
    </Element>
  );
};

export default Skjermlenke;
