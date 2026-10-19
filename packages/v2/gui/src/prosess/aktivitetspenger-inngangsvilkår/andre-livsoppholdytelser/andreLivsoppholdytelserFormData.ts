import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import type { AndreLivsoppholdsytelserVurderingDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/vurdering/AndreLivsoppholdsytelserVurderingerResponse.js';
import type { VilkårPeriodeVisning } from '../../aktivitetspenger-felles/utils/visningsperioder.js';

export type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

export interface AndreLivsoppholdytelserFormData {
  vurderinger: Record<
    string,
    {
      begrunnelse: string;
      andreLivsoppholdytelser: Vurdering;
      avslagsårsak?: AndreLivsoppholdsytelserIkkeOppfyltÅrsak;
      fritekst?: string;
      fom: string;
      tom: string;
      muligAvkortingPeriode?: MuligAvkortingPeriode;
      redigerMaksdato: boolean;
      begrunnelseKortereMaksdato?: string;
      ytelseNavn: string;
      harFritekstbrev: boolean;
    }
  >;
}

type Vurderingsverdier = Pick<
  AndreLivsoppholdytelserFormData['vurderinger'][string],
  'begrunnelse' | 'andreLivsoppholdytelser' | 'avslagsårsak' | 'fritekst' | 'ytelseNavn' | 'harFritekstbrev'
>;

const utfallTilVurdering = (utfall: string): Vurdering => {
  if (utfall === Utfall.OPPFYLT) return 'oppfylt';
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ikkeOppfylt';
  return '';
};

// Vilkåret returnerer Avslagsårsak-koder, mens skjemaet og backend bruker AndreLivsoppholdsytelserIkkeOppfyltÅrsak.
const avslagKodeTilÅrsak: Record<string, AndreLivsoppholdsytelserIkkeOppfyltÅrsak> = {
  [Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE]: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE,
  [Avslagsårsak.AVKORTET]: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
};

const fraVurdering = (vurdering: AndreLivsoppholdsytelserVurderingDto): Vurderingsverdier => ({
  begrunnelse: vurdering.begrunnelse ?? '',
  andreLivsoppholdytelser: vurdering.erVilkårOppfylt ? 'oppfylt' : 'ikkeOppfylt',
  avslagsårsak: vurdering.erVilkårOppfylt ? undefined : vurdering.avslagsårsak,
  fritekst: vurdering.fritekstVurderingBrev,
  ytelseNavn: vurdering.ytelseNavn ?? '',
  harFritekstbrev: !!vurdering.fritekstVurderingBrev,
});

// Endepunktet gir bare vurderinger for perioder som vurderes i behandlingen. Øvrige perioder vises fra vilkåret.
const fraVilkårsperiode = (periode: VilkårPeriodeVisning): Vurderingsverdier => ({
  begrunnelse: periode.begrunnelse ?? '',
  andreLivsoppholdytelser: utfallTilVurdering(periode.vilkarStatus),
  avslagsårsak: periode.avslagKode ? avslagKodeTilÅrsak[periode.avslagKode] : undefined,
  fritekst: periode.fritekstVurderingBrev,
  ytelseNavn: '',
  harFritekstbrev: !!periode.fritekstVurderingBrev,
});

const erAvkortet = (vurdering: AndreLivsoppholdsytelserVurderingDto) =>
  vurdering.avslagsårsak === AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET;

// Visningsperiodene styrer hvilke perioder skjemaet har, mens vurderingene fra backend gir verdiene.
// En avkortet vurdering hører til visningsperioden den er slått sammen med (se byggVisningsperioder).
export const buildInitialValues = (
  perioder: VilkårPeriodeVisning[],
  vurderinger: AndreLivsoppholdsytelserVurderingDto[],
): AndreLivsoppholdytelserFormData => ({
  vurderinger: Object.fromEntries(
    perioder.map(p => {
      const vurdering = vurderinger.find(v => v.periode.fom === p.periode.fom);
      const avkortetVurdering = p.avkortetPeriodeInfo
        ? vurderinger.find(v => v.periode.fom === p.avkortetPeriodeInfo?.periode.fom && erAvkortet(v))
        : undefined;
      return [
        p.periode.fom,
        {
          ...(vurdering ? fraVurdering(vurdering) : fraVilkårsperiode(p)),
          fom: p.periode.fom,
          tom: p.periode.tom,
          redigerMaksdato: !!p.avkortetPeriodeInfo,
          begrunnelseKortereMaksdato: avkortetVurdering?.begrunnelse ?? p.avkortetPeriodeInfo?.begrunnelse ?? '',
          muligAvkortingPeriode: p.muligAvkortingPeriode,
        },
      ];
    }),
  ),
});
