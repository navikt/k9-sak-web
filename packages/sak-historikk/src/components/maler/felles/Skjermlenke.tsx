import { Label } from '@navikt/ds-react';
import { Location } from 'history';
import React from 'react';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/types/index.js';
import { NavLink } from 'react-router-dom';
import { scrollUp } from './historikkUtils';

interface SkjermlenkeProps {
  skjermlenke?: string;
  behandlingLocation?: Location;
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType;
  scrollUpOnClick?: boolean;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeKode: string) => Location;
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
        {kodeverkNavnFraKodeFn(skjermlenke, KodeverkType.SKJERMLENKE_TYPE)}
      </NavLink>
    </Label>
  );
};

export default Skjermlenke;
