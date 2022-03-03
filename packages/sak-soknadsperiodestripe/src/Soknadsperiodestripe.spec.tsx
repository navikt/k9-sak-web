import { formaterPerioder } from './Soknadsperiodestripe';

describe('<Soknadsperiodestripe>', () => {
  it('skal formatere perioder med revurdering', () => {
    const data = {
      perioderMedÅrsak: {
        perioderTilVurdering: [{ fom: '2022-01-05', tom: '2022-04-05' }],
        perioderMedÅrsak: [
          { periode: { fom: '2022-01-05', tom: '2022-02-05' }, årsaker: ['REVURDERER_BERØRT_PERIODE'] },
          {
            periode: { fom: '2022-02-06', tom: '2022-04-05' },
            årsaker: ['REVURDERER_BERØRT_PERIODE', 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON'],
          },
        ],
        dokumenterTilBehandling: [],
      },
      periodeMedUtfall: [
        {
          periode: { fom: '2022-01-05', tom: '2022-04-05' },
          utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
      ],
      forrigeVedtak: [
        {
          periode: { fom: '2022-01-05', tom: '2022-02-05' },
          utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
      ],
    };
    const formatertePerioder = formaterPerioder(data);
    const expectedResult = [
      {
        id: '2022-01-05-2022-02-05',
        fom: new Date('2022-01-05T00:00:00.000Z'),
        tom: new Date('2022-02-05T00:00:00.000Z'),
        className: 'advarsel',
        status: 'suksessRevurder',
      },
      {
        id: '2022-01-05-2022-04-05',
        fom: new Date('2022-01-05T00:00:00.000Z'),
        tom: new Date('2022-04-05T00:00:00.000Z'),
        status: 'suksess',
        className: 'suksess aktivPeriode',
      },
    ];
    expect(formatertePerioder).toEqual(expectedResult);
  });

  it('skal formatere delvis innvilgede perioder', () => {
    const data = {
      perioderMedÅrsak: {
        perioderTilVurdering: [{ fom: '2022-01-05', tom: '2022-04-05' }],
        perioderMedÅrsak: [{ periode: { fom: '2022-01-05', tom: '2022-04-05' }, årsaker: ['FØRSTEGANGSVURDERING'] }],
        dokumenterTilBehandling: [
          {
            journalpostId: '3295403',
            innsendingsTidspunkt: '2022-03-02T09:57:39.405',
            type: 'SØKNAD',
            søktePerioder: [
              {
                periode: { fom: '2022-01-05', tom: '2022-04-05' },
                type: null,
                arbeidsgiver: null,
                arbeidsforholdRef: null,
              },
            ],
          },
        ],
      },
      periodeMedUtfall: [
        {
          periode: { fom: '2022-01-05', tom: '2022-02-05' },
          utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
      ],
      forrigeVedtak: [],
    };
    const formatertePerioder = formaterPerioder(data);
    const expectedResult = [
      {
        id: '2022-01-05-2022-04-05',
        fom: new Date('2022-01-05T00:00:00.000Z'),
        tom: new Date('2022-04-05T00:00:00.000Z'),
        className: 'suksess aktivPeriode',
        status: 'suksessDelvis',
      },
    ];
    expect(formatertePerioder).toEqual(expectedResult);
  });
});
