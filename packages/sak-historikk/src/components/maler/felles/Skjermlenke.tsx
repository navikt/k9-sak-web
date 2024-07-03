import { Label } from '@navikt/ds-react';
import { Location } from 'history';
import React from 'react';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/kodeverk/types.js';
import SkjermlenkeTyper from '@k9-sak-web/types/src/totrinnskontroll/SkjermlenkeType';
import { NavLink } from 'react-router-dom';
import { scrollUp } from './historikkUtils';

interface SkjermlenkeProps {
  skjermlenke?: SkjermlenkeTyper; // Kodeverk: se notat ved SkjermlenkeTyper
  behandlingLocation?: Location;
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType;
  scrollUpOnClick?: boolean;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeKode: SkjermlenkeTyper) => Location;
}

const Skjermlenke = ({
  skjermlenke,
  behandlingLocation,
  kodeverkNavnFraKodeFn,
  scrollUpOnClick,
  createLocationForSkjermlenke,
}: SkjermlenkeProps) => {
  if (!skjermlenke) {
    return null;
  }
  return (
    <Label size="small" as="p">
      <NavLink to={createLocationForSkjermlenke(behandlingLocation, skjermlenke)} onClick={scrollUpOnClick && scrollUp}>
        {kodeverkNavnFraKodeFn(skjermlenke.kode, KodeverkType.SKJERMLENKE_TYPE)}
      </NavLink>
    </Label>
  );
};

export default Skjermlenke;
