import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
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
        årsakMedPerioder: [
          {
            årsak: 'REVURDERER_BERØRT_PERIODE',
            perioder: [
              { fom: '2022-01-05', tom: '2022-02-05' },
              { fom: '2022-02-06', tom: '2022-04-05' },
            ],
          },
          {
            årsak: 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON',
            perioder: [{ fom: '2022-02-06', tom: '2022-04-05' }],
          },
        ],
      },
      periodeMedUtfall: [
        {
          periode: { fom: '2022-01-05', tom: '2022-04-05' },
          utfall: 'OPPFYLT', // VILKAR_UTFALL_TYPE
        },
      ],
      forrigeVedtak: [
        {
          periode: { fom: '2022-01-05', tom: '2022-02-05' },
          utfall: 'OPPFYLT', // 'VILKAR_UTFALL_TYPE'
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
        årsakMedPerioder: [
          {
            årsak: 'FØRSTEGANGSVURDERING',
            perioder: [{ fom: '2022-01-05', tom: '2022-04-05' }],
          },
        ],
      },
      periodeMedUtfall: [
        {
          periode: { fom: '2022-01-05', tom: '2022-02-05' },
          utfall: 'OPPFYLT', // VILKAR_UTFALL_TYPE'
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
        årsakMedPerioder: [
          {
            årsak: 'FØRSTEGANGSVURDERING',
            perioder: [{ fom: '2022-01-05', tom: '2022-04-05' }],
          },
        ],
      },
      periodeMedUtfall: [
        {
          periode: { fom: '2022-01-05', tom: '2022-04-05' },
          utfall: 'IKKE_OPPFYLT', // VILKAR_UTFALL_TYPE
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
        årsakMedPerioder: [
          {
            årsak: 'REVURDERER_BERØRT_PERIODE',
            perioder: [
              { fom: '2022-01-11', tom: '2022-02-11' },
              { fom: '2022-02-12', tom: '2022-04-11' },
            ],
          },
          {
            årsak: 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON',
            perioder: [{ fom: '2022-02-12', tom: '2022-04-11' }],
          },
        ],
      },
      periodeMedUtfall: [
        {
          periode: { fom: '2022-01-11', tom: '2022-04-11' },
          utfall: 'IKKE_VURDERT', // VILKAR_UTFALL_TYPE
        },
      ],
      forrigeVedtak: [
        {
          periode: { fom: '2022-01-11', tom: '2022-02-11' },
          utfall: 'OPPFYLT', // VILKAR_UTFALL_TYPE
        },
        {
          periode: { fom: '2022-02-14', tom: '2022-04-11' },
          utfall: 'IKKE_OPPFYLT', // VILKAR_UTFALL_TYPE
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

    await userEvent.click(navigerBakoverKnapp);
    expect(navigerFremoverKnapp).not.toBeDisabled();
    const datoEtterNavigering6mnd = screen.getByText('11. april 2021 - 11. oktober 2021');
    expect(datoEtterNavigering6mnd).toBeInTheDocument();
  });
  it('skal ha knapper for zoom', async () => {
    const zoomInnKnapp = screen.getByRole('button', { name: 'Forstørre' });
    const zoomUtKnapp = screen.getByRole('button', { name: 'Forminske' });
    const datoFørNavigering = screen.getByText('11. oktober 2021 - 11. april 2022');
    expect(datoFørNavigering).toBeInTheDocument();

    await userEvent.click(zoomInnKnapp);
    const datoEtterZoomInn = screen.getByText('11. november 2021 - 11. april 2022');
    expect(datoEtterZoomInn).toBeInTheDocument();

    await userEvent.click(zoomUtKnapp);
    await userEvent.click(zoomUtKnapp);
    const datoEtterZoomUt = screen.getByText('11. september 2021 - 11. april 2022');
    expect(datoEtterZoomUt).toBeInTheDocument();
  });
});
