import { k9_sak_kontrakt_omsorg_BarnRelasjon } from '@k9-sak-web/backend/k9sak/generated/types.js';
import Vurderingsresultat from '../../fakta/omsorgen-for/src/types/Vurderingsresultat';
import { ignoreUnusedDeclared } from './ignoreUnusedDeclared';

const omsorgsperioder = [
  {
    begrunnelse: '',
    periode: { fom: '2021-03-20', tom: '2021-03-25' } as any,
    relasjon: k9_sak_kontrakt_omsorg_BarnRelasjon.ANNET,
    relasjonsbeskrivelse: 'Nabo',
    resultat: Vurderingsresultat.IKKE_VURDERT,
    resultatEtterAutomatikk: Vurderingsresultat.IKKE_VURDERT,
  },
  {
    begrunnelse: 'Fordi foo og bar',
    periode: { fom: '2021-03-16', tom: '2021-03-20' } as any,
    relasjon: k9_sak_kontrakt_omsorg_BarnRelasjon.ANNET,
    relasjonsbeskrivelse: 'Nabo',
    resultat: Vurderingsresultat.IKKE_OPPFYLT,
    resultatEtterAutomatikk: Vurderingsresultat.IKKE_VURDERT,
  },
  {
    periode: { fom: '2021-03-09', tom: '2021-03-15' } as any,
    resultat: Vurderingsresultat.IKKE_VURDERT,
    resultatEtterAutomatikk: Vurderingsresultat.OPPFYLT,
  },
  {
    begrunnelse: 'Fordi ditt og datt',
    periode: { fom: '2021-03-01', tom: '2021-03-05' } as any,
    relasjon: k9_sak_kontrakt_omsorg_BarnRelasjon.FAR,
    relasjonsbeskrivelse: '',
    resultat: Vurderingsresultat.OPPFYLT,
    resultatEtterAutomatikk: Vurderingsresultat.OPPFYLT,
  },
  {
    begrunnelse: 'Fordi sånn og sånn',
    periode: { fom: '2021-02-01', tom: '2021-02-05' } as any,
    relasjon: k9_sak_kontrakt_omsorg_BarnRelasjon.FAR,
    relasjonsbeskrivelse: '',
    resultat: Vurderingsresultat.OPPFYLT,
    resultatEtterAutomatikk: Vurderingsresultat.OPPFYLT,
  },
];

export class FakeOmsorgenForBackendApi {
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
