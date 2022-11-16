import React from 'react';
import { FormattedMessage } from 'react-intl';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Vilkar } from '@k9-sak-web/types';
import { Normaltekst } from 'nav-frontend-typografi';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';

const finnUnikeAvslagskoder = (avslåttePerioder: Vilkarperiode[]) => {
  const funnedeAvslagskoder = new Set();
  const unikeAvslagskoder = avslåttePerioder.filter(el => {
    const erDuplikat = funnedeAvslagskoder.has(el.avslagKode);
    funnedeAvslagskoder.add(el.avslagKode);
    return !erDuplikat;
  });
  return unikeAvslagskoder;
};

const visAvslåtteVilkårsperioder = (
  avslåttVilkår: Vilkar,
  getKodeverknavn: (kode: string, kodeverk: KodeverkType, undertype?: string) => void,
) => {
  const avslåttePerioder = avslåttVilkår.perioder.filter(
    periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT,
  );
  const avslåttePerioderMedUnikeAvslagskoder = finnUnikeAvslagskoder(avslåttePerioder);

  return avslåttePerioderMedUnikeAvslagskoder.map(avslåttPeriode => (
    <Normaltekst key={avslåttPeriode.avslagKode}>
      {getKodeverknavn(avslåttVilkår.vilkarType, KodeverkType.VILKAR_TYPE)}:{' '}
      {avslåttPeriode.avslagKode ? getKodeverknavn(avslåttPeriode.avslagKode, KodeverkType.AVSLAGSARSAK) : ''}
    </Normaltekst>
  ));
};

interface AvslagsårsakListeProps {
  vilkar: Vilkar[];
  getKodeverknavn: (kode: string, kodeverk: KodeverkType, undertype?: string) => void;
}

const AvslagsårsakListe = ({ vilkar, getKodeverknavn }: AvslagsårsakListeProps) => {
  const avslatteVilkar = vilkar.filter(
    v =>
      Array.isArray(v.perioder) && v.perioder.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT),
  );
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return <>{avslatteVilkar.map(avslåttVilkår => visAvslåtteVilkårsperioder(avslåttVilkår, getKodeverknavn))}</>;
};

export default AvslagsårsakListe;
