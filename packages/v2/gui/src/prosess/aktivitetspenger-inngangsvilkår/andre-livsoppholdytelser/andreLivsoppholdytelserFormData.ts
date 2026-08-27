import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import type { VilkårPeriodeVisning } from '../../aktivitetspenger-felles/utils/visningsperioder.js';

export type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

export interface AndreLivsoppholdytelserFormData {
  vurderinger: Record<
    string,
    {
      begrunnelse: string;
      andreLivsoppholdytelser: Vurdering;
      avslagsårsak?: AndreLivsoppholdsytelserIkkeOppfyltÅrsak | 'fritekst';
      fritekst?: string;
      fom: string;
      tom: string;
      muligAvkortingPeriode: MuligAvkortingPeriode;
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

// Backend returnerer Avslagsårsak-koder ved lesing, men forventer AndreLivsoppholdsytelserIkkeOppfyltÅrsak ved innsending.
const avslagKodeTilÅrsak: Record<string, AndreLivsoppholdsytelserIkkeOppfyltÅrsak> = {
  [Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE]:
    AndreLivsoppholdsytelserIkkeOppfyltÅrsak.HAR_ANNEN_LIVSOPPHOLDSYTELSE,
  [Avslagsårsak.AVKORTET]: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
};

export const buildInitialValues = (vilkår: VilkårPeriodeVisning[]): AndreLivsoppholdytelserFormData => ({
  vurderinger: Object.fromEntries(
    vilkår.map(p => [
      p.periode.fom,
      {
        begrunnelse: p.begrunnelse ?? '',
        andreLivsoppholdytelser: utfallTilVurdering(p.vilkarStatus),
        avslagsårsak: p.avslagKode ? avslagKodeTilÅrsak[p.avslagKode] : undefined,
        fritekst: p.fritekstVurderingBrev,
        fom: p.periode.fom,
        tom: p.periode.tom ?? p.muligAvkortingPeriode.tom,
        redigerMaksdato: p.avkortetPeriodeInfo ? true : false,
        begrunnelseKortereMaksdato: p.avkortetPeriodeInfo?.begrunnelse ?? '',
        muligAvkortingPeriode: p.muligAvkortingPeriode,
      },
    ]),
  ),
});
