import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BehandlingStatus as behandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingStatus.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { FagOmrådeKode } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/oppdrag/FagOmrådeKode.js';
import { MottakerType } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/oppdrag/MottakerType.js';
import { RadId } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/oppdrag/RadId.js';
import { AvregningProsessIndex, type AvregningProsessIndexProps } from './AvregningProsessIndex';
import FakeAvregningBackendClient from './FakeAvregningClient';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { TilbakekrevingVidereBehandling } from '@k9-sak-web/backend/k9sak/kodeverk/økonomi/tilbakekreving/TilbakekrevingVidereBehandling.js';

const fagsak = {
  saksnummer: '123',
  fagsakYtelseType: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
};

const behandling = {
  id: 1,
  versjon: 1,
  språkkode: {
    kode: 'NO',
  },
  status: behandlingStatus.UTREDES,
  uuid: '123',
  opprettet: '2019-01-01',
  sakstype: fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
  type: behandlingType.FØRSTEGANGSSØKNAD,
};

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
        mottakerType: MottakerType.BRUKER,
        mottakerNummer: '',
        mottakerNavn: '',
        resultatPerFagområde: [
          {
            fagOmrådeKode: FagOmrådeKode.FORELDREPENGER,
            rader: [
              {
                feltnavn: RadId.NYTT_BELØP,
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
                feltnavn: RadId.TIDLIGERE_UTBETALT,
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
                feltnavn: RadId.DIFFERANSE,
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
            feltnavn: RadId.INNTREKK_NESTE_MÅNED,
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
            feltnavn: RadId.RESULTAT,
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
  simuleringResultatUtenInntrekk: {
    periode: {
      fom: '2019-01-01',
      tom: '2019-02-28',
    },
  },
  slåttAvInntrekk: false,
};

const fakeAvregningBackendClient = new FakeAvregningBackendClient();

export default {
  title: 'prosess/prosess-avregning',
  component: AvregningProsessIndex,
};

export const VisAksjonspunktVurderFeilutbetaling = (args: AvregningProsessIndexProps) => (
  <AvregningProsessIndex
    fagsak={fagsak}
    behandling={behandling}
    aksjonspunkter={args.aksjonspunkter}
    simuleringResultat={simuleringResultat}
    tilbakekrevingvalg={{
      videreBehandling: TilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
      varseltekst: 'varsel-eksempel',
      erTilbakekrevingVilkårOppfylt: true,
    }}
    isReadOnly={false}
    client={fakeAvregningBackendClient}
  />
);

VisAksjonspunktVurderFeilutbetaling.args = {
  aksjonspunkter: [
    {
      definisjon: AksjonspunktDefinisjon.VURDER_FEILUTBETALING,
      begrunnelse: undefined,
    },
    {
      definisjon: AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
      begrunnelse: undefined,
      erAktivt: true,
      status: aksjonspunktStatus.OPPRETTET,
    },
  ],
  simuleringResultat,
  isReadOnly: false,
} satisfies Partial<AvregningProsessIndexProps>;

export const VisAksjonspunktHøyEtterbetaling = (args: AvregningProsessIndexProps) => (
  <AvregningProsessIndex
    fagsak={fagsak}
    behandling={behandling}
    aksjonspunkter={args.aksjonspunkter}
    simuleringResultat={simuleringResultat}
    tilbakekrevingvalg={{
      videreBehandling: TilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
      varseltekst: 'varsel-eksempel',
      erTilbakekrevingVilkårOppfylt: true,
    }}
    isReadOnly={false}
    client={fakeAvregningBackendClient}
  />
);

VisAksjonspunktHøyEtterbetaling.args = {
  fagsak,
  aksjonspunkter: [
    {
      definisjon: AksjonspunktDefinisjon.SJEKK_HØY_ETTERBETALING,
      begrunnelse: undefined,
      erAktivt: true,
      status: aksjonspunktStatus.OPPRETTET,
    },
  ],
  simuleringResultat,
  isReadOnly: false,
} satisfies Partial<AvregningProsessIndexProps>;
export const VisSimuleringspanelUtenAksjonspunkt = (args: AvregningProsessIndexProps) => (
  <AvregningProsessIndex
    fagsak={fagsak}
    behandling={behandling}
    aksjonspunkter={args.aksjonspunkter}
    simuleringResultat={simuleringResultat}
    tilbakekrevingvalg={{
      videreBehandling: TilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
      varseltekst: 'varsel-eksempel',
      erTilbakekrevingVilkårOppfylt: true,
    }}
    isReadOnly={false}
    client={fakeAvregningBackendClient}
  />
);

VisSimuleringspanelUtenAksjonspunkt.args = {
  fagsak,
  behandling,
  aksjonspunkter: [],
  simuleringResultat,
  tilbakekrevingvalg: {
    videreBehandling: TilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
    varseltekst: 'varsel-eksempel',
    erTilbakekrevingVilkårOppfylt: true,
  },
  isReadOnly: false,
} satisfies Partial<AvregningProsessIndexProps>;
