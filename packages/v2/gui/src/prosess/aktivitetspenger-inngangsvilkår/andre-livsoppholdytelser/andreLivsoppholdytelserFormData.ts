import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
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

const tilVurdering = (vurdering: AndreLivsoppholdsytelserVurderingDto | undefined): Vurdering => {
  if (!vurdering) return '';
  return vurdering.erVilkårOppfylt ? 'oppfylt' : 'ikkeOppfylt';
};

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
          begrunnelse: vurdering?.begrunnelse ?? '',
          andreLivsoppholdytelser: tilVurdering(vurdering),
          avslagsårsak: vurdering && !vurdering.erVilkårOppfylt ? vurdering.avslagsårsak : undefined,
          fritekst: vurdering?.fritekstVurderingBrev,
          fom: p.periode.fom,
          tom: p.periode.tom,
          redigerMaksdato: !!p.avkortetPeriodeInfo,
          begrunnelseKortereMaksdato: avkortetVurdering?.begrunnelse ?? '',
          muligAvkortingPeriode: p.muligAvkortingPeriode,
          ytelseNavn: vurdering?.ytelseNavn ?? '',
          harFritekstbrev: !!vurdering?.fritekstVurderingBrev,
        },
      ];
    }),
  ),
});
