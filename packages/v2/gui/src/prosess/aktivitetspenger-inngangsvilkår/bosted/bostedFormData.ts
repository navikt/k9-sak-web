import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import type { VilkårPeriodeVisning } from '../../aktivitetspenger-felles/utils/visningsperioder.js';

export type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

export interface BostedFormData {
  vurderinger: Record<
    string,
    {
      begrunnelse: string;
      bosatt: Vurdering;
      avslagsårsak?: BostedsvilkårIkkeOppfyltÅrsak;
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

// Backend returnerer Avslagsårsak-koder ved lesing, men forventer BostedsvilkårIkkeOppfyltÅrsak ved innsending.
const avslagKodeTilÅrsak: Record<string, BostedsvilkårIkkeOppfyltÅrsak> = {
  [Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_BOSTED]: BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM,
  // Denne avslagsårsaken skal fjernes, men beholder håndtering i frontend til den er borte i stedet for å ekskludere den i alle typer
  [Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_FOLKEREGISTRERT_ELLER_BOSTEDSADRESSE]:
    BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSTEDSADRESSE_OG_IKKE_FOLKEREGISTRERT_I_TRONDHEIM,
  [Avslagsårsak.YTELSE_IKKE_PÅ_ARBEIDSSTED_STUDIESTED]:
    BostedsvilkårIkkeOppfyltÅrsak.STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM,
  [Avslagsårsak.AVKORTET]: BostedsvilkårIkkeOppfyltÅrsak.AVKORTET,
};

export const buildInitialValues = (vilkår: VilkårPeriodeVisning[]): BostedFormData => ({
  vurderinger: Object.fromEntries(
    vilkår.map(p => [
      p.periode.fom,
      {
        begrunnelse: p.begrunnelse ?? '',
        bosatt: utfallTilVurdering(p.vilkarStatus),
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
