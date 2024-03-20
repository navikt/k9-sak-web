import React from 'react';
import { NavLink } from 'react-router-dom';
import { Location } from 'history';
import { Element } from 'nav-frontend-typografi';
import { Kodeverk } from '@k9-sak-web/types';
import { scrollUp } from './historikkUtils';

interface SkjermlenkeProps {
  skjermlenke?: Kodeverk;
  behandlingLocation?: Location;
  getKodeverknavn?: (kodeverkObjekt: Kodeverk, undertype?: string) => string;
  scrollUpOnClick?: boolean;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeKode: string) => Location;
}

const Skjermlenke = ({
  skjermlenke,
  behandlingLocation,
  getKodeverknavn,
  scrollUpOnClick,
  createLocationForSkjermlenke,
}: SkjermlenkeProps) => {
  if (!skjermlenke) {
    return null;
  }
  return (
    <Element>
      <NavLink
        to={createLocationForSkjermlenke(behandlingLocation, skjermlenke.kode)}
        onClick={scrollUpOnClick && scrollUp}
      >
        {getKodeverknavn(skjermlenke)}
      </NavLink>
    </Element>
  );
};

export default Skjermlenke;
