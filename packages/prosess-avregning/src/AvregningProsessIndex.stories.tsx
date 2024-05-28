import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import AvregningProsessIndex from './AvregningProsessIndex';

const fagsak = {
  saksnummer: 123,
  fagsakYtelseType: {
    kode: fagsakYtelseType.FORELDREPENGER,
  },
};

const behandling = {
  id: 1,
  versjon: 1,
  sprakkode: {
    kode: 'NO',
  },
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
  slåttAvInntrekk: false,
};

const toggles = {
  'k9sak.simuler-oppdrag-varseltekst': true,
};

export default {
  title: 'prosess/prosess-avregning',
  component: AvregningProsessIndex,
};

export const visAksjonspunktVurderFeilutbetaling = args => (
  <AvregningProsessIndex
    behandling={behandling}
    submitCallback={action('button-click')}
    previewFptilbakeCallback={action('button-click')}
    featureToggles={toggles}
    {...args}
  />
);

visAksjonspunktVurderFeilutbetaling.args = {
  fagsak,
  aksjonspunkter: [
    {
      definisjon: {
        kode: aksjonspunktCodes.VURDER_FEILUTBETALING,
      },
      begrunnelse: undefined,
    },
  ],
  simuleringResultat,
  isReadOnly: false,
  isAksjonspunktOpen: true,
  readOnlySubmitButton: false,
};

export const visSimuleringspanelUtenAksjonspunkt = args => (
  <AvregningProsessIndex
    behandling={behandling}
    aksjonspunkter={[]}
    submitCallback={action('button-click')}
    previewFptilbakeCallback={action('button-click')}
    featureToggles={toggles}
    {...args}
  />
);

visSimuleringspanelUtenAksjonspunkt.args = {
  fagsak,
  simuleringResultat,
  tilbakekrevingvalg: {
    videreBehandling: {
      kode: tilbakekrevingVidereBehandling.TILBAKEKR_OPPDATER,
    },
    varseltekst: 'varsel-eksempel',
  },
  isReadOnly: false,
  isAksjonspunktOpen: true,
  readOnlySubmitButton: false,
  apCodes: [],
};
