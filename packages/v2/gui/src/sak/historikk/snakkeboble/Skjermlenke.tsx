import { NavLink } from 'react-router';
import { type Location } from 'history';

import type { KodeverkNavnFraKodeFnType } from '@k9-sak-web/lib/kodeverk/types/GetKodeverkNavnFraKodeFnType.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import type { HistorikkinnslagV2 } from '../tilbake/historikkinnslagTsTypeV2.ts';
import { Tittel } from './Tittel.js';
import { scrollUp } from './snakkebobleUtils.jsx';

interface Props {
  skjermlenke?: HistorikkinnslagV2['skjermlenke'];
  behandlingLocation: Location;
  getKodeverknavn: KodeverkNavnFraKodeFnType;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeKode: string) => Location | undefined;
}

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
      <Tittel>
        <NavLink to={location} onClick={scrollUp}>
          {getKodeverknavn(skjermlenke.kode, KodeverkType.SKJERMLENKE_TYPE)}
        </NavLink>
      </Tittel>
    </>
  );
};
