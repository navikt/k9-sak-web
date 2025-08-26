import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import { BodyShort } from '@navikt/ds-react';
import {
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto,
  k9_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { FormattedMessage } from 'react-intl';

const finnUnikeAvslagskoder = (avslåttePerioder: VilkårPeriodeDto[]) => {
  const funnedeAvslagskoder = new Set();
  const unikeAvslagskoder = avslåttePerioder.filter(el => {
    const erDuplikat = funnedeAvslagskoder.has(el.avslagKode);
    funnedeAvslagskoder.add(el.avslagKode);
    return !erDuplikat;
  });
  return unikeAvslagskoder;
};

interface AvslagsårsakListeProps {
  vilkar: VilkårMedPerioderDto[];
}

const AvslagsårsakListe = ({ vilkar }: AvslagsårsakListeProps) => {
  const { kodeverkNavnFraKode, kodeverkNavnFraUndertypeKode } = useKodeverkContext();

  const visAvslåtteVilkårsperioder = (avslåttVilkår: VilkårMedPerioderDto) => {
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
