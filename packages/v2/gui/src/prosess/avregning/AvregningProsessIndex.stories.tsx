import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_kodeverk_behandling_BehandlingStatus,
  k9_kodeverk_behandling_BehandlingType,
  k9_kodeverk_behandling_FagsakYtelseType,
  k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling,
  k9_oppdrag_kontrakt_kodeverk_FagOmrådeKode,
  k9_oppdrag_kontrakt_kodeverk_MottakerType,
  k9_oppdrag_kontrakt_simulering_v1_RadId,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { asyncAction } from '../../storybook/asyncAction';
import { AvregningPanel } from './components/AvregningPanel';

const simuleringResultat = {
  simuleringResultat: {
    periode: {
      fom: '2019-01-01',
      tom: '2019-03-31',
    },
    sumEtterbetaling: 0,
    sumFeilutbetaling: -49863,
    sumInntrekk: -10899,
    ingenPerioderMedAvvik: false,
    perioderPerMottaker: [
      {
        mottakerType: k9_oppdrag_kontrakt_kodeverk_MottakerType.BRUKER,
        mottakerNummer: undefined,
        mottakerNavn: undefined,
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
  simuleringResultatUtenInntrekk: { periode: { fom: '2019-01-01', tom: '2019-03-31' } },
  slåttAvInntrekk: false,
};

const meta = {
  title: 'gui/prosess/avregning',
  component: AvregningPanel,
  args: {
    fagsak: {
      saksnummer: '123',
      sakstype: k9_kodeverk_behandling_FagsakYtelseType.PLEIEPENGER_SYKT_BARN,
    },
    behandling: {
      opprettet: '2019-01-01',
      sakstype: k9_kodeverk_behandling_FagsakYtelseType.PLEIEPENGER_SYKT_BARN,
      status: k9_kodeverk_behandling_BehandlingStatus.UTREDES,
      type: k9_kodeverk_behandling_BehandlingType.FØRSTEGANGSSØKNAD,
      uuid: '123',
      versjon: 1,
    },
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
        begrunnelse: undefined,
        erAktivt: true,
        status: aksjonspunktStatus.OPPRETTET,
      },
      {
        definisjon: AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
        begrunnelse: undefined,
        erAktivt: true,
        status: aksjonspunktStatus.OPPRETTET,
      },
    ],
    submitCallback: asyncAction('submitCallback'),
    previewCallback: asyncAction('previewCallback'),
    readOnly: false,
    simuleringResultat,
    tilbakekrevingvalg: {
      erTilbakekrevingVilkårOppfylt: false,
    },
  },
} satisfies Meta<typeof AvregningPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const VisAksjonspunktVurderFeilutbetaling: Story = {
  args: {
    apCodes: [AksjonspunktDefinisjon.VURDER_FEILUTBETALING, AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING],
  },
};

export const VisAksjonspunktHøyEtterbetaling: Story = {
  args: {
    aksjonspunkter: [
      {
        definisjon: AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
        begrunnelse: undefined,
        erAktivt: true,
        status: aksjonspunktStatus.OPPRETTET,
      },
    ],
    apCodes: [AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING],
  },
};

export const VisSimuleringspanelUtenAksjonspunkt: Story = {
  args: {
    aksjonspunkter: [],
    apCodes: [],
    tilbakekrevingvalg: {
      videreBehandling: k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
      varseltekst: 'varsel-eksempel',
      erTilbakekrevingVilkårOppfylt: false,
    },
  },
};
