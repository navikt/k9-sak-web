import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import messages from '../i18n/nb_NO.json';
import Uttak from './components/Uttak';
import BehandlingPersonMap from './components/types/BehandlingPersonMap';
import UttaksplanerDto from './components/dto/UttaksplanerDto';
import Uttaksplan from './components/types/Uttaksplan';
import Uttaksperiode from './components/types/Uttaksperiode';
import UttaksperiodeDto from './components/dto/UttaksperiodeDto';
import InnvilgetÅrsakType from './components/dto/InnvilgetÅrsakType';
import AvslåttÅrsakType from './components/dto/AvslåttÅrsakType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface UttakProsessIndexProps {
  uttaksplaner: UttaksplanerDto;
  behandlingPersonMap: BehandlingPersonMap;
}

const mapÅrsaker: (periode: UttaksperiodeDto) => Årsak<InnvilgetÅrsakType | AvslåttÅrsakType>[] = periode => {
  const årsaker: Årsak<InnvilgetÅrsakType | AvslåttÅrsakType>[] =
    periode.årsaker?.map(({ årsak }) => ({
      årsakstype: årsak,
    })) || [];
  if (periode.årsak) {
    årsaker.push({ årsakstype: periode.årsak });
  }

  return årsaker;
};

const mapUttaksplanerDtoTilInternformat: (
  uttaksplaner: UttaksplanerDto,
  behandlingPersonMap: BehandlingPersonMap,
) => Uttaksplan[] = (uttaksplaner, behandlingPersonMap) => {
  return Object.entries(uttaksplaner).map(([behandlingId, behandling]) => {
    const person = behandlingPersonMap[behandlingId];
    const perioder: Uttaksperiode[] = Object.entries(behandling.perioder).map(([fomTom, periode]) => {
      const [fom, tom] = fomTom.split('/');
      const uttaksperiode: Uttaksperiode = {
        fom,
        tom,
        utfall: periode.utfall,
        årsaker: mapÅrsaker(periode),
        behandlingId,
        grad: periode.grad,
      };
      return uttaksperiode;
    });

    const uttaksplan: Uttaksplan = {
      perioder,
      behandlingId,
      person,
    };

    return uttaksplan;
  });
};

const UttakProsessIndex: FunctionComponent<UttakProsessIndexProps> = ({ uttaksplaner, behandlingPersonMap }) => {
  return (
    <RawIntlProvider value={intl}>
      <Uttak uttaksplaner={mapUttaksplanerDtoTilInternformat(uttaksplaner, behandlingPersonMap)} />
    </RawIntlProvider>
  );
};

export default UttakProsessIndex;
