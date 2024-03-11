import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { AvregningPanelImpl, transformValues } from './AvregningPanel';

const simuleringResultat = {
  simuleringResultat: {
    periode: {
      fom: '2018-09-01',
      tom: '2018-12-31',
    },
    sumFeilutbetaling: 0,
    sumEtterbetaling: 0,
    sumInntrekk: 0,
    ingenPerioderMedAvvik: false,
    perioderPerMottaker: [
      {
        mottakerType: {
          kode: 'BRUKER',
          navn: null,
          kodeverk: 'MOTTAKER_TYPE',
        },
        mottakerNummer: null,
        mottakerNavn: null,
        resultatPerFagområde: [
          {
            fagOmrådeKode: {
              kode: 'FP',
              navn: 'Foreldrepenger',
              kodeverk: 'FAG_OMRAADE_KODE',
            },
            rader: [
              {
                feltnavn: 'nyttBeløp',
                resultaterPerMåned: [
                  {
                    periode: {
                      fom: '2019-01-01',
                      tom: '2019-01-31',
                    },
                    beløp: 52619,
                  },
                  {
                    periode: {
                      fom: '2019-02-01',
                      tom: '2019-02-28',
                    },
                    beløp: 52619,
                  },
                ],
              },
              {
                feltnavn: 'tidligereUtbetalt',
                resultaterPerMåned: [
                  {
                    periode: {
                      fom: '2019-01-01',
                      tom: '2019-01-31',
                    },
                    beløp: 61795,
                  },
                  {
                    periode: {
                      fom: '2019-02-01',
                      tom: '2019-02-28',
                    },
                    beløp: 61795,
                  },
                ],
              },
              {
                feltnavn: 'differanse',
                resultaterPerMåned: [
                  {
                    periode: {
                      fom: '2019-01-01',
                      tom: '2019-01-31',
                    },
                    beløp: -9176,
                  },
                  {
                    periode: {
                      fom: '2019-02-01',
                      tom: '2019-02-28',
                    },
                    beløp: -9176,
                  },
                ],
              },
            ],
          },
        ],
        resultatOgMotregningRader: [
          {
            feltnavn: 'inntrekkNesteMåned',
            resultaterPerMåned: [
              {
                periode: {
                  fom: '2019-01-01',
                  tom: '2019-01-31',
                },
                beløp: 0,
              },
              {
                periode: {
                  fom: '2019-02-01',
                  tom: '2019-02-28',
                },
                beløp: 0,
              },
            ],
          },
          {
            feltnavn: 'resultat',
            resultaterPerMåned: [
              {
                periode: {
                  fom: '2019-01-01',
                  tom: '2019-01-31',
                },
                beløp: -26486,
              },
              {
                periode: {
                  fom: '2019-02-01',
                  tom: '2019-02-28',
                },
                beløp: -26486,
              },
            ],
          },
        ],
        nesteUtbPeriode: {
          fom: '2019-10-01',
          tom: '2019-10-31',
        },
      },
    ],
  },
  simuleringResultatUtenInntrekk: null,
};

const mockProps = {
  ...reduxFormPropsMock,
  simuleringResultat,
  isApOpen: false,
  intl: intlMock,
  apCodes: [],
  readOnly: false,
  erTilbakekrevingVilkårOppfylt: false,
  grunnerTilReduksjon: false,
  previewCallback: vi.fn(),
  hasOpenTilbakekrevingsbehandling: false,
};

describe('<AvregningPanelImpl>', () => {
  it('skal rendre AvregningPanel', () => {
    renderWithIntlAndReduxForm(<AvregningPanelImpl {...mockProps} />, { messages });

    expect(screen.getByRole('heading', { name: 'Simulering' })).toBeInTheDocument();
    expect(screen.getByText('Bruker')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('skal rendre form med RadioGroup med to valg når aksjonspunkt 5084 er aktivt', () => {
    const props = {
      ...mockProps,
      apCodes: ['5084'],
    };
    renderWithIntlAndReduxForm(<AvregningPanelImpl {...props} />, { messages });

    expect(screen.getByRole('radio', { name: 'Opprett tilbakekreving' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Avvent samordning, ingen tilbakekreving' })).toBeInTheDocument();
  });

  it('method toggleDetails skal oppdatere og toggle tabeler med showDetails state', async () => {
    renderWithIntlAndReduxForm(<AvregningPanelImpl {...mockProps} />, { messages });

    expect(screen.queryByText('Foreldrepenger nytt beløp')).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Vis flere detaljer' }));
    });
    expect(screen.getByRole('button', { name: 'Vis færre detaljer' })).toBeInTheDocument();
    expect(screen.getByText('Foreldrepenger nytt beløp')).toBeInTheDocument();
  });

  it('skal vise tekst for åpen tilbakekrevingsbehandling', () => {
    const props = {
      ...mockProps,
      apCodes: ['5084'],
      erTilbakekrevingVilkårOppfylt: undefined,
      hasOpenTilbakekrevingsbehandling: true,
    };
    renderWithIntlAndReduxForm(<AvregningPanelImpl {...props} />, { messages });

    expect(
      screen.getByText(
        'Det foreligger en åpen tilbakekrevingsbehandling, endringer i vedtaket vil automatisk oppdatere eksisterende feilutbetalte perioder og beløp.',
      ),
    ).toBeInTheDocument();
  });

  it('skal ikke vise tekst for åpen tilbakekrevingsbehandling', () => {
    const props = {
      ...mockProps,
      apCodes: ['5084'],
      erTilbakekrevingVilkårOppfylt: undefined,
      hasOpenTilbakekrevingsbehandling: false,
    };
    renderWithIntlAndReduxForm(<AvregningPanelImpl {...props} />, { messages });
    expect(
      screen.queryByText(
        'Det foreligger en åpen tilbakekrevingsbehandling, endringer i vedtaket vil automatisk oppdatere eksisterende feilutbetalte perioder og beløp.',
      ),
    ).not.toBeInTheDocument();
  });

  it('transform values skal returnere inntrekk som videre behandling gitt at vilkår er oppfylt og grunnerTilReduksjon er false', () => {
    const values = {
      erTilbakekrevingVilkårOppfylt: true,
      grunnerTilReduksjon: false,
      videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT,
    };
    const apCode = '5084';

    const transformedValues = transformValues(values, apCode);
    expect(transformedValues.kode).toBe(apCode);
    expect(transformedValues.videreBehandling).toBe(tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT);
  });

  it('transform values skal returnere verdi av videre behandling gitt at vilkår er oppfylt og grunnerTilReduksjon er true', () => {
    const values = {
      erTilbakekrevingVilkårOppfylt: true,
      grunnerTilReduksjon: true,
    };
    const apCode = '5084';

    const transformedValuesInfotrygd = transformValues(
      { ...values, videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT },
      apCode,
    );
    expect(transformedValuesInfotrygd.kode).toBe(apCode);
    expect(transformedValuesInfotrygd.videreBehandling).toBe(tilbakekrevingVidereBehandling.TILBAKEKR_OPPRETT);
    const transformedValuesIgnorer = transformValues(
      { ...values, videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_IGNORER },
      apCode,
    );
    expect(transformedValuesIgnorer.videreBehandling).toBe(tilbakekrevingVidereBehandling.TILBAKEKR_IGNORER);
  });
});
