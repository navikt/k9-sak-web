import { NavLink } from 'react-router';
import { type Location } from 'history';
import { Heading } from '@navikt/ds-react';

import type { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/kodeverk/types/GetKodeverkNavnFraKodeFnType.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import type { HistorikkinnslagV2 } from '../historikkinnslagTsTypeV2.ts';

interface Props {
  skjermlenke?: HistorikkinnslagV2['skjermlenke'];
  behandlingLocation: Location;
  getKodeverknavn: KodeverkNavnFraKodeFnType;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeKode: string) => Location | undefined;
}

export const scrollUp = (): void => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
};

export const Skjermlenke = ({
  skjermlenke,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}: Props) => {
  if (!skjermlenke) {
    return null;
  }

  const location = createLocationForSkjermlenke(behandlingLocation, skjermlenke.kode);
  if (!location) {
    return null;
  }

  return (
    <>
      <Heading size="xsmall">
        <NavLink to={location} onClick={scrollUp}>
          {getKodeverknavn(skjermlenke.kode, KodeverkType.SKJERMLENKE_TYPE)}
        </NavLink>
      </Heading>
    </>
  );
};
