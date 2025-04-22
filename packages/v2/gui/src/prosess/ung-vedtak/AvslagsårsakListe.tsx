import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
import { BodyShort } from '@navikt/ds-react';
import type { UngVedtakVilkårDto, UngVedtakVilkårPeriodeDto } from './UngVedtakVilkårDto';

const finnUnikeAvslagskoder = (avslåttePerioder: UngVedtakVilkårPeriodeDto[] = []) => {
  const funnedeAvslagskoder = new Set();
  const unikeAvslagskoder = avslåttePerioder.filter(el => {
    const erDuplikat = funnedeAvslagskoder.has(el.avslagKode);
    funnedeAvslagskoder.add(el.avslagKode);
    return !erDuplikat;
  });
  return unikeAvslagskoder;
};

interface AvslagsårsakListeProps {
  vilkår: UngVedtakVilkårDto[];
}

const AvslagsårsakListe = ({ vilkår }: AvslagsårsakListeProps) => {
  const { kodeverkNavnFraKode, kodeverkNavnFraUndertypeKode } = useKodeverkContext();

  const visAvslåtteVilkårsperioder = (avslåttVilkår: UngVedtakVilkårDto) => {
    const avslåttePerioder = avslåttVilkår?.perioder?.filter(
      periode => periode.vilkarStatus === vilkårStatus.IKKE_OPPFYLT,
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

  const avslatteVilkar = vilkår.filter(
    v => Array.isArray(v.perioder) && v.perioder.some(periode => periode.vilkarStatus === vilkårStatus.IKKE_OPPFYLT),
  );
  if (avslatteVilkar.length === 0) {
    return <BodyShort>Søker har ikke noen gyldig uttaksperiode</BodyShort>;
  }

  return <>{avslatteVilkar.map(avslåttVilkår => visAvslåtteVilkårsperioder(avslåttVilkår))}</>;
};

export default AvslagsårsakListe;
