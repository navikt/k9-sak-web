import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import type { VilkårPeriodeVisning } from '../../aktivitetspenger-felles/utils/visningsperioder.js';

export type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

export interface AktivitetFormData {
  vurderinger: Record<
    string,
    {
      begrunnelse: string;
      erSøkerIAktivitet: Vurdering;
      fritekst?: string;
      fom: string;
      tom: string;
      muligAvkortingPeriode?: MuligAvkortingPeriode;
      redigerTomDato: boolean;
      begrunnelseKortereMaksdato?: string;
    }
  >;
}

const utfallTilVurdering = (utfall: string): Vurdering => {
  if (utfall === Utfall.OPPFYLT) return 'oppfylt';
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ikkeOppfylt';
  return '';
};

// Backend returnerer Avslagsårsak-koder ved lesing, men avslagsårsak settes alltid til ANNET ved innsending
// siden Aktivitet-vilkåret kun har fritekst som avslagsgrunn (se AktivitetSkjema.tsx).
export const buildInitialValues = (vilkår: VilkårPeriodeVisning[]): AktivitetFormData => ({
  vurderinger: Object.fromEntries(
    vilkår.map(p => [
      p.periode.fom,
      {
        begrunnelse: p.begrunnelse ?? '',
        erSøkerIAktivitet: utfallTilVurdering(p.vilkarStatus),
        fritekst: p.fritekstVurderingBrev,
        fom: p.periode.fom,
        tom: p.periode.tom,
        redigerTomDato: p.avkortetPeriodeInfo ? true : false,
        begrunnelseKortereMaksdato: p.avkortetPeriodeInfo?.begrunnelse ?? '',
        muligAvkortingPeriode: p.muligAvkortingPeriode,
      },
    ]),
  ),
});
