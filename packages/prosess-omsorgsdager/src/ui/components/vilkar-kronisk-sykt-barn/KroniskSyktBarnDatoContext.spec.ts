import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { finnDatoerForKroniskSyktBarn } from './KroniskSyktBarnDatoContext';
import type Vilkårresultat from '@k9-sak-web/types/src/opptjening/vilkårresultat';

type TidligereBehandling = Parameters<typeof finnDatoerForKroniskSyktBarn>[0][number];
const oppfyltPeriode = (fom: string, tom: string): Vilkårresultat => ({
  periode: { fom, tom },
  utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
  avslagsårsak: { kode: '-', kodeverk: 'AVSLAGSARSAK' },
});

const innvilgetBehandling = (
  id: number,
  resultater: Vilkårresultat[],
  overrides: Partial<TidligereBehandling> = {},
): TidligereBehandling => ({
  id,
  status: { kode: behandlingStatus.AVSLUTTET, kodeverk: 'BEHANDLING_STATUS' },
  sakstype: fagsakYtelsesType.OMSORGSPENGER_KS,
  behandlingHenlagt: false,
  behandlingsresultat: {
    type: { kode: 'INNVILGET', kodeverk: 'BEHANDLING_RESULTAT_TYPE' },
    vilkårResultat: { UTVIDETRETT: resultater },
  },
  ...overrides,
});

describe('finnDatoerForKroniskSyktBarn', () => {
  it.each([behandlingResultatType.AVSLATT, behandlingResultatType.IKKE_FASTSATT, behandlingResultatType.OPPHOR])(
    'ser bort fra oppfylt vilkår når behandlingsresultatet er %s',
    kode => {
      const behandling = innvilgetBehandling(2, [oppfyltPeriode('2025-01-01', '2025-12-31')], {
        behandlingsresultat: {
          type: { kode, kodeverk: 'BEHANDLING_RESULTAT_TYPE' },
          vilkårResultat: { UTVIDETRETT: [oppfyltPeriode('2025-01-01', '2025-12-31')] },
        },
      });

      expect(finnDatoerForKroniskSyktBarn([behandling], 1)).toEqual({
        innvilgedePerioder: [],
        foreslåttFraDato: undefined,
      });
    },
  );

  it('gir ingen begrensning uten tidligere innvilgede perioder', () => {
    expect(finnDatoerForKroniskSyktBarn([], 1)).toEqual({ innvilgedePerioder: [], foreslåttFraDato: undefined });
    expect(
      finnDatoerForKroniskSyktBarn(
        [
          innvilgetBehandling(2, []),
          innvilgetBehandling(3, [], { behandlingsresultat: undefined }),
          innvilgetBehandling(4, [
            {
              ...oppfyltPeriode('2025-01-01', '2030-12-31'),
              utfall: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
            },
          ]),
        ],
        1,
      ),
    ).toEqual({ innvilgedePerioder: [], foreslåttFraDato: undefined });
  });

  it('bruker dagen etter seneste sluttdato på tvers av behandlinger', () => {
    const behandlinger = [
      innvilgetBehandling(2, [oppfyltPeriode('2028-01-01', '2028-02-29')]),
      innvilgetBehandling(3, [oppfyltPeriode('2027-01-01', '2027-12-31')]),
      innvilgetBehandling(4, [
        {
          ...oppfyltPeriode('2029-01-01', '2030-12-31'),
          utfall: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
      ]),
    ];
    expect(finnDatoerForKroniskSyktBarn(behandlinger, 1)).toEqual({
      foreslåttFraDato: '2028-03-01',
      innvilgedePerioder: [
        { fom: '2028-01-01', tom: '2028-02-29' },
        { fom: '2027-01-01', tom: '2027-12-31' },
      ],
    });
  });

  it('håndterer vilkårsutfall som kodeverkobjekt', () => {
    expect(
      finnDatoerForKroniskSyktBarn(
        [
          innvilgetBehandling(2, [
            {
              ...oppfyltPeriode('2025-01-01', '2025-12-31'),
              utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
            },
          ]),
        ],
        1,
      ),
    ).toEqual({
      foreslåttFraDato: '2026-01-01',
      innvilgedePerioder: [{ fom: '2025-01-01', tom: '2025-12-31' }],
    });
  });

  it('ser bort fra aktuell behandling, uavsluttede, henlagte og andre sakstyper', () => {
    const periode = [oppfyltPeriode('2025-01-01', '2030-12-31')];
    expect(
      finnDatoerForKroniskSyktBarn(
        [
          innvilgetBehandling(1, periode),
          innvilgetBehandling(2, periode, {
            status: { kode: behandlingStatus.BEHANDLING_UTREDES, kodeverk: 'BEHANDLING_STATUS' },
          }),
          innvilgetBehandling(3, periode, { behandlingHenlagt: true }),
          innvilgetBehandling(4, periode, { sakstype: fagsakYtelsesType.OMSORGSPENGER_AO }),
        ],
        1,
      ),
    ).toEqual({ innvilgedePerioder: [], foreslåttFraDato: undefined });
  });
});
