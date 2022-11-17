import React from 'react';
import { NavLink } from 'react-router-dom';
import { Location } from 'history';
import { Element } from 'nav-frontend-typografi';
import { Kodeverk } from '@k9-sak-web/types';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { scrollUp } from './historikkUtils';

interface SkjermlenkeProps {
  skjermlenke?: string;
  behandlingLocation?: Location;
  getKodeverknavn?: (kode: string, kodeverk: KodeverkType, undertype?: string) => string;
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
      <NavLink to={createLocationForSkjermlenke(behandlingLocation, skjermlenke)} onClick={scrollUpOnClick && scrollUp}>
        {getKodeverknavn(skjermlenke, KodeverkType.SKJERMLENKE_TYPE)}
      </NavLink>
    </Element>
  );
};

export default Skjermlenke;
