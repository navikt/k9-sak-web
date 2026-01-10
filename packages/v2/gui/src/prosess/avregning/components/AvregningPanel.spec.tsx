import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import {
  k9_kodeverk_behandling_BehandlingStatus,
  k9_kodeverk_behandling_BehandlingType,
  k9_kodeverk_behandling_FagsakYtelseType,
  k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling,
  k9_oppdrag_kontrakt_kodeverk_FagOmrådeKode,
  k9_oppdrag_kontrakt_kodeverk_MottakerType,
  k9_oppdrag_kontrakt_simulering_v1_RadId,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { foreldrepenger_tilbakekreving_behandlingslager_tilbakekrevingsvalg_VidereBehandling } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvregningPanel, transformValues } from './AvregningPanel';

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
        mottakerType: k9_oppdrag_kontrakt_kodeverk_MottakerType.BRUKER,
        mottakerNummer: '',
        mottakerNavn: '',
        resultatPerFagområde: [
          {
            fagOmrådeKode: k9_oppdrag_kontrakt_kodeverk_FagOmrådeKode.FORELDREPENGER,
            rader: [
              {
                feltnavn: k9_oppdrag_kontrakt_simulering_v1_RadId.NYTT_BELØP,
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
                feltnavn: k9_oppdrag_kontrakt_simulering_v1_RadId.TIDLIGERE_UTBETALT,
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
                feltnavn: k9_oppdrag_kontrakt_simulering_v1_RadId.DIFFERANSE,
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
            feltnavn: k9_oppdrag_kontrakt_simulering_v1_RadId.INNTREKK_NESTE_MÅNED,
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
            feltnavn: k9_oppdrag_kontrakt_simulering_v1_RadId.RESULTAT,
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
  simuleringResultatUtenInntrekk: { periode: { fom: '', tom: '' } },
  slåttAvInntrekk: false,
};

const mockProps = {
  simuleringResultat,
  isApOpen: false,
  apCodes: [],
  readOnly: false,
  erTilbakekrevingVilkårOppfylt: false,
  grunnerTilReduksjon: false,
  previewCallback: vi.fn(),
  hasOpenTilbakekrevingsbehandling: false,
  submitCallback: vi.fn(),
  behandling: {
    sakstype: k9_kodeverk_behandling_FagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    versjon: 1,
    uuid: '',
    type: k9_kodeverk_behandling_BehandlingType.FØRSTEGANGSSØKNAD,
    status: k9_kodeverk_behandling_BehandlingStatus.OPPRETTET,
    opprettet: '',
  },
  fagsak: {
    saksnummer: '',
    sakstype: k9_kodeverk_behandling_FagsakYtelseType.PLEIEPENGER_SYKT_BARN,
  },
  aksjonspunkter: [],
  tilbakekrevingvalg: {
    erTilbakekrevingVilkårOppfylt: false,
  },
};

describe('<AvregningPanelImpl>', () => {
  it('skal rendre AvregningPanel', () => {
    render(<AvregningPanel {...mockProps} />);

    expect(screen.getByRole('heading', { name: 'Simulering' })).toBeInTheDocument();
    expect(screen.getByText('Bruker')).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('skal rendre form med RadioGroup med to valg når aksjonspunkt 5084 er aktivt', () => {
    const props = {
      ...mockProps,
      harVurderFeilutbetalingAP: true,
      harSjekkHøyEtterbetalingAP: false,
      apCodes: [AksjonspunktDefinisjon.VURDER_FEILUTBETALING],
    };
    render(<AvregningPanel {...props} />);

    expect(screen.getByRole('radio', { name: 'Opprett tilbakekreving, ikke send varsel' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Avvent samordning, ingen tilbakekreving' })).toBeInTheDocument();
  });

  it('method toggleDetails skal oppdatere og toggle tabeler med showDetails state', async () => {
    render(<AvregningPanel {...mockProps} />);

    expect(screen.queryByText('Foreldrepenger nytt beløp')).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Vis flere detaljer Lukket' }));
    });
    expect(screen.getByRole('button', { name: 'Vis færre detaljer Ekspandert' })).toBeInTheDocument();
    expect(screen.getByText('Foreldrepenger nytt beløp')).toBeInTheDocument();
  });

  it('skal vise tekst for åpen tilbakekrevingsbehandling', () => {
    const props = {
      ...mockProps,
      apCodes: [AksjonspunktDefinisjon.VURDER_FEILUTBETALING],
      hasOpenTilbakekrevingsbehandling: true,
      tilbakekrevingvalg: {
        videreBehandling: k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
        erTilbakekrevingVilkårOppfylt: false,
      },
    };
    render(<AvregningPanel {...props} />);
    expect(
      screen.getByText(
        'Det foreligger en åpen tilbakekrevingsbehandling, endringer i vedtaket vil automatisk oppdatere eksisterende feilutbetalte perioder og beløp.',
      ),
    ).toBeInTheDocument();
  });

  it('skal ikke vise tekst for åpen tilbakekrevingsbehandling', () => {
    const props = {
      ...mockProps,
      apCodes: [AksjonspunktDefinisjon.VURDER_FEILUTBETALING],
      erTilbakekrevingVilkårOppfylt: undefined,
      hasOpenTilbakekrevingsbehandling: false,
    };
    render(<AvregningPanel {...props} />);
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
      videreBehandling:
        foreldrepenger_tilbakekreving_behandlingslager_tilbakekrevingsvalg_VidereBehandling.TILBAKEKR_OPPRETT,
      aksjonspunkter: [],
      begrunnelse: '',
      varseltekst: '',
    };
    const apCode = '5084';

    const transformedValues = transformValues(values, apCode);
    expect(transformedValues.kode).toBe(apCode);
    expect(transformedValues.videreBehandling).toBe(
      foreldrepenger_tilbakekreving_behandlingslager_tilbakekrevingsvalg_VidereBehandling.TILBAKEKR_OPPRETT,
    );
  });

  it('transform values skal returnere verdi av videre behandling gitt at vilkår er oppfylt og grunnerTilReduksjon er true', () => {
    const values = {
      erTilbakekrevingVilkårOppfylt: true,
      grunnerTilReduksjon: true,
    };
    const apCode = '5084';

    const transformedValuesInfotrygd = transformValues(
      {
        ...values,
        videreBehandling: k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING,
        aksjonspunkter: [],
        begrunnelse: '',
        varseltekst: 'varseltekst',
      },
      apCode,
    );
    expect(transformedValuesInfotrygd.kode).toBe(apCode);
    expect(transformedValuesInfotrygd.videreBehandling).toBe(
      k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING,
    );
    expect(transformedValuesInfotrygd.varseltekst).toBe('varseltekst');
    const transformedValuesIgnorer = transformValues(
      {
        ...values,
        videreBehandling: k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.IGNORER_TILBAKEKREVING,
        aksjonspunkter: [],
        begrunnelse: '',
        varseltekst: 'varseltekst',
      },
      apCode,
    );
    expect(transformedValuesIgnorer.videreBehandling).toBe(
      k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.IGNORER_TILBAKEKREVING,
    );
    expect(transformedValuesIgnorer.varseltekst).toBe('varseltekst');
    const transformedValuesIkkeSend = transformValues(
      {
        ...values,
        videreBehandling: 'IKKE_SEND',
        aksjonspunkter: [],
        begrunnelse: '',
        varseltekst: 'varseltekst',
      },
      apCode,
    );
    expect(transformedValuesIkkeSend.videreBehandling).toBe(
      k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.OPPRETT_TILBAKEKREVING,
    );
    expect(transformedValuesIkkeSend.varseltekst).toBe(undefined);
  });
});
