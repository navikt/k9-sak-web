import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { Vilkar } from '@k9-sak-web/types';
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

interface AvslagsårsakListeProps {
  vilkar: Vilkar[];
}

const AvslagsårsakListe = ({ vilkar }: AvslagsårsakListeProps) => {
  const { kodeverkNavnFraKode, kodeverkNavnFraUndertypeKode } = useKodeverkContext();

  const visAvslåtteVilkårsperioder = (avslåttVilkår: Vilkar) => {
    const avslåttePerioder = avslåttVilkår.perioder.filter(
      periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT,
    );
    const avslåttePerioderMedUnikeAvslagskoder = finnUnikeAvslagskoder(avslåttePerioder);

    return avslåttePerioderMedUnikeAvslagskoder.map(avslåttPeriode => (
      <BodyShort size="small" key={avslåttPeriode.avslagKode}>
        {[
          kodeverkNavnFraKode(avslåttVilkår.vilkarType, KodeverkType.VILKAR_TYPE),
          ': ',
          kodeverkNavnFraUndertypeKode(
            avslåttVilkår.vilkarType,
            avslåttPeriode.avslagKode || '',
            KodeverkType.AVSLAGSARSAK,
          ),
        ].join('')}
      </BodyShort>
    ));
  };

  const avslatteVilkar = vilkar.filter(
    v =>
      Array.isArray(v.perioder) && v.perioder.some(periode => periode.vilkarStatus === vilkarUtfallType.IKKE_OPPFYLT),
  );
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return <>{avslatteVilkar.map(avslåttVilkår => visAvslåtteVilkårsperioder(avslåttVilkår))}</>;
};

export default AvslagsårsakListe;
