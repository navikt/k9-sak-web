import { k9_sak_kontrakt_omsorg_BarnRelasjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Resultat } from '@k9-sak-web/backend/k9sak/kodeverk/sykdom/Resultat.js';
import type { OmsorgenForApi } from '../../fakta/omsorgen-for/api/OmsorgenForApi.js';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared.js';

const omsorgsperioder = [
  {
    begrunnelse: '',
    periode: { fom: '2021-03-20', tom: '2021-03-25' } as any,
    relasjon: k9_sak_kontrakt_omsorg_BarnRelasjon.ANNET,
    relasjonsbeskrivelse: 'Nabo',
    resultat: Resultat.IKKE_VURDERT,
    resultatEtterAutomatikk: Resultat.IKKE_VURDERT,
  },
  {
    begrunnelse: 'Fordi foo og bar',
    periode: { fom: '2021-03-16', tom: '2021-03-20' } as any,
    relasjon: k9_sak_kontrakt_omsorg_BarnRelasjon.ANNET,
    relasjonsbeskrivelse: 'Nabo',
    resultat: Resultat.IKKE_OPPFYLT,
    resultatEtterAutomatikk: Resultat.IKKE_VURDERT,
  },
  {
    periode: { fom: '2021-03-09', tom: '2021-03-15' } as any,
    resultat: Resultat.IKKE_VURDERT,
    resultatEtterAutomatikk: Resultat.OPPFYLT,
  },
  {
    begrunnelse: 'Fordi ditt og datt',
    periode: { fom: '2021-03-01', tom: '2021-03-05' } as any,
    relasjon: k9_sak_kontrakt_omsorg_BarnRelasjon.FAR,
    relasjonsbeskrivelse: '',
    resultat: Resultat.OPPFYLT,
    resultatEtterAutomatikk: Resultat.OPPFYLT,
  },
  {
    begrunnelse: 'Fordi sånn og sånn',
    periode: { fom: '2021-02-01', tom: '2021-02-05' } as any,
    relasjon: k9_sak_kontrakt_omsorg_BarnRelasjon.FAR,
    relasjonsbeskrivelse: '',
    resultat: Resultat.OPPFYLT,
    resultatEtterAutomatikk: Resultat.OPPFYLT,
  },
];

export class FakeOmsorgenForBackendApi implements OmsorgenForApi {
  async getOmsorgsperioder(behandlingUuid: string) {
    ignoreUnusedDeclared(behandlingUuid);
    return {
      omsorgsperioder,
      registrertSammeBosted: true,
      registrertForeldrerelasjon: true,
      tvingManuellVurdering: false,
    };
  }
}
