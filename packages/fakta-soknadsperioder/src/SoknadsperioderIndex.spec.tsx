import * as React from 'react';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import messages from '../i18n/nb_NO.json';
import SoknadsperioderIndex from './SoknadsperioderIndex';

describe('<SøknadsperioderIndex>', () => {
  beforeEach(() => {
    const data = {
      perioderMedÅrsak: {
        perioderTilVurdering: [{ fom: '2022-01-11', tom: '2022-04-11' }],
        perioderMedÅrsak: [
          { periode: { fom: '2022-01-11', tom: '2022-02-11' }, årsaker: ['FØRSTEGANGSVURDERING'] },
          {
            periode: { fom: '2022-02-12', tom: '2022-04-11' },
            årsaker: ['REVURDERER_BERØRT_PERIODE', 'REVURDERER_ETABLERT_TILSYN_ENDRING_FRA_ANNEN_OMSORGSPERSON'],
          },
        ],
        dokumenterTilBehandling: [
          {
            journalpostId: '22295004',
            innsendingsTidspunkt: '2022-02-22T09:51:10.637',
            type: 'SØKNAD',
            søktePerioder: [
              {
                periode: { fom: '2022-01-11', tom: '2022-02-11' },
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
            perioder: [{ fom: '2022-01-11', tom: '2022-02-11' }],
          },
          {
            årsak: 'REVURDERER_BERØRT_PERIODE',
            perioder: [{ fom: '2022-02-12', tom: '2022-04-11' }],
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
          utfall: 'IKKE_VURDERT', // , kodeverk: 'VILKAR_UTFALL_TYPE'
        },
      ],
      forrigeVedtak: [
        {
          periode: { fom: '2022-01-11', tom: '2022-02-11' },
          utfall: 'OPPFYLT', // , kodeverk: 'VILKAR_UTFALL_TYPE'
        },
        {
          periode: { fom: '2022-02-14', tom: '2022-04-11' },
          utfall: 'IKKE_OPPFYLT', // , kodeverk: 'VILKAR_UTFALL_TYPE' }
        },
      ],
    };
    renderWithIntl(
      <KodeverkProvider kodeverk={alleKodeverkV2} klageKodeverk={{}} tilbakeKodeverk={{}}>
        <SoknadsperioderIndex behandlingPerioderårsakMedVilkår={data} />
      </KodeverkProvider>,
      {
        messages,
      },
    );
  });

  it('skal vise ekspanderknapper for søknader knyttet til perioder', async () => {
    expect(await screen.findByRole('button', { name: 'Ny periode' })).toBeInTheDocument();
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
