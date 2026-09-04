import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { BistandsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import type { VilkårPeriodeVisning } from '../../aktivitetspenger-felles/utils/visningsperioder.js';

export type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

export interface BehovForBistandFormData {
  vurderinger: Record<
    string,
    {
      begrunnelse: string;
      behovForBistand: Vurdering;
      avslagsårsak?: BistandsvilkårIkkeOppfyltÅrsak | 'fritekst';
      fritekst?: string;
      fom: string;
      tom: string;
      muligAvkortingPeriode?: MuligAvkortingPeriode;
      redigerMaksdato: boolean;
      begrunnelseKortereMaksdato?: string;
    }
  >;
}

const utfallTilVurdering = (utfall: string): Vurdering => {
  if (utfall === Utfall.OPPFYLT) return 'oppfylt';
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ikkeOppfylt';
  return '';
};

// Backend returnerer Avslagsårsak-koder ved lesing, men forventer BistandsvilkårIkkeOppfyltÅrsak ved innsending.
const avslagKodeTilÅrsak: Record<string, BistandsvilkårIkkeOppfyltÅrsak> = {
  [Avslagsårsak.IKKE_14A_VEDTAK]: BistandsvilkårIkkeOppfyltÅrsak.IKKE_14A_VEDTAK,
  [Avslagsårsak.AVKORTET]: BistandsvilkårIkkeOppfyltÅrsak.AVKORTET,
};

export const buildInitialValues = (vilkår: VilkårPeriodeVisning[]): BehovForBistandFormData => ({
  vurderinger: Object.fromEntries(
    vilkår.map(p => [
      p.periode.fom,
      {
        begrunnelse: p.begrunnelse ?? '',
        behovForBistand: utfallTilVurdering(p.vilkarStatus),
        avslagsårsak: p.avslagKode ? avslagKodeTilÅrsak[p.avslagKode] : undefined,
        fritekst: p.fritekstVurderingBrev,
        fom: p.periode.fom,
        tom: p.periode.tom,
        redigerMaksdato: p.avkortetPeriodeInfo ? true : false,
        begrunnelseKortereMaksdato: p.avkortetPeriodeInfo?.begrunnelse ?? '',
        muligAvkortingPeriode: p.muligAvkortingPeriode,
      },
    ]),
  ),
});
