import { renderWithIntl } from '@fpsak-frontend/utils-test/src/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import Soknadsperiodestripe, { formaterPerioder } from './Soknadsperiodestripe';

describe('Soknadsperiodestripe skal formatere perioder', () => {
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
        className: 'advarsel aktivPeriode',
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

  it('skal formatere avslåtte perioder', () => {
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
          periode: { fom: '2022-01-05', tom: '2022-04-05' },
          utfall: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
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
        className: 'feil aktivPeriode',
        status: 'feil',
      },
    ];
    expect(formatertePerioder).toEqual(expectedResult);
  });
});

describe('Soknadsperiodestripe skal ha navigasjon', () => {
  beforeEach(() => {
    const data = {
      perioderMedÅrsak: {
        perioderTilVurdering: [{ fom: '2022-01-11', tom: '2022-04-11' }],
        perioderMedÅrsak: [
          { periode: { fom: '2022-01-11', tom: '2022-02-11' }, årsaker: ['REVURDERER_BERØRT_PERIODE'] },
          {
            periode: { fom: '2022-02-12', tom: '2022-04-11' },
            årsaker: ['REVURDERER_BERØRT_PERIODE', 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON'],
          },
        ],
        dokumenterTilBehandling: [],
      },
      periodeMedUtfall: [
        {
          periode: { fom: '2022-01-11', tom: '2022-04-11' },
          utfall: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
      ],
      forrigeVedtak: [
        {
          periode: { fom: '2022-01-11', tom: '2022-02-11' },
          utfall: { kode: 'OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
        {
          periode: { fom: '2022-02-14', tom: '2022-04-11' },
          utfall: { kode: 'IKKE_OPPFYLT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        },
      ],
    };
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'visittkort-portal');
    document.body.appendChild(portalRoot);
    renderWithIntl(<Soknadsperiodestripe behandlingPerioderMedVilkår={data} />, { messages });
  });

  it('skal ha knapper for horisontal navigering', async () => {
    const navigerFremoverKnapp = screen.getByLabelText('Naviger tidslinje fremover i tid');
    const navigerBakoverKnapp = screen.getByLabelText('Naviger tidslinje bakover i tid');
    const datoFørNavigering = screen.getByText('11. oktober 2021 - 11. april 2022');
    expect(navigerFremoverKnapp).toBeDisabled();
    expect(datoFørNavigering).toBeInTheDocument();

    userEvent.click(navigerBakoverKnapp);
    expect(navigerFremoverKnapp).not.toBeDisabled();
    const datoEtterNavigering6mnd = screen.getByText('11. april 2021 - 11. oktober 2021');
    expect(datoEtterNavigering6mnd).toBeInTheDocument();
  });
  it('skal ha knapper for å endre skala', async () => {
    const datoFørNavigering = screen.getByText('11. oktober 2021 - 11. april 2022');
    const navigerBakoverKnapp = screen.getByLabelText('Naviger tidslinje bakover i tid');

    const skala1år = screen.getByLabelText('1 år');
    userEvent.click(skala1år);
    expect(datoFørNavigering).toBeInTheDocument();
    userEvent.click(navigerBakoverKnapp);
    const datoEtterNavigering1år = screen.getByText('11. oktober 2020 - 11. oktober 2021');
    expect(datoEtterNavigering1år).toBeInTheDocument();

    const skala2år = screen.getByLabelText('2 år');
    userEvent.click(skala2år);
    expect(datoFørNavigering).toBeInTheDocument();
    userEvent.click(navigerBakoverKnapp);
    const datoEtterNavigering2år = screen.getByText('11. oktober 2019 - 11. oktober 2021');
    expect(datoEtterNavigering2år).toBeInTheDocument();
  });
});
