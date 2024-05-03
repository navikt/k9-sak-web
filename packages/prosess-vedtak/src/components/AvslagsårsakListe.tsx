import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { Kodeverk, Vilkar } from '@k9-sak-web/types';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

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
  getKodeverknavn: (kodeverkOjekt: Kodeverk, undertype?: string) => string,
) => {
  const avslåttePerioder = avslåttVilkår.perioder.filter(
    periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT,
  );
  const avslåttePerioderMedUnikeAvslagskoder = finnUnikeAvslagskoder(avslåttePerioder);

  return avslåttePerioderMedUnikeAvslagskoder.map(avslåttPeriode => (
    <BodyShort size="small" key={avslåttPeriode.avslagKode}>
      {getKodeverknavn(avslåttVilkår.vilkarType)}:{' '}
      {getKodeverknavn({ kode: avslåttPeriode.avslagKode, kodeverk: 'AVSLAGSARSAK' }, avslåttVilkår.vilkarType.kode)}
    </BodyShort>
  ));
};

interface AvslagsårsakListeProps {
  vilkar: Vilkar[];
  getKodeverknavn: (kodeverkOjekt: Kodeverk, undertype?: string) => string;
}

const AvslagsårsakListe = ({ vilkar, getKodeverknavn }: AvslagsårsakListeProps) => {
  const avslatteVilkar = vilkar.filter(
    v =>
      Array.isArray(v.perioder) &&
      v.perioder.some(periode => periode.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT),
  );
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return <>{avslatteVilkar.map(avslåttVilkår => visAvslåtteVilkårsperioder(avslåttVilkår, getKodeverknavn))}</>;
};

export default AvslagsårsakListe;
