import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening-oms';
import opptjeningAktivitetKlassifisering from '@fpsak-frontend/prosess-vilkar-opptjening-oms/src/kodeverk/opptjeningAktivitetKlassifisering';
import { Aksjonspunkt, OpptjeningBehandling } from '@k9-sak-web/types';

import withReduxProvider from '../../decorators/withRedux';

const opptjening = {
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 2,
      dager: 3,
    },
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-01-01',
        tom: '2018-04-04',
        klasse: {
          kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
        },
      },
    ],
    opptjeningFom: '2018-01-01',
    opptjeningTom: '2018-10-01',
  },
};

const opptjening2 = {
  fastsattOpptjening: {
    opptjeningperiode: {
      måneder: 4,
      dager: 6,
    },
    fastsattOpptjeningAktivitetList: [
      {
        id: 1,
        fom: '2018-05-01',
        tom: '2018-09-04',
        klasse: {
          kode: opptjeningAktivitetKlassifisering.BEKREFTET_GODKJENT,
        },
      },
    ],
    opptjeningFom: '2018-02-01',
    opptjeningTom: '2018-12-01',
  },
};

const behandlingsresultat = {
  vilkårResultat: {
    OPPTJENINGSVILKÅRET: [
      {
        avslagsårsak: null,
        periode: { fom: '2018-01-01', tom: '2018-04-04' },
        fom: '2018-01-01',
        tom: '2018-10-01',
        utfall: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        kode: 'IKKE_VURDERT',
        kodeverk: 'VILKAR_UTFALL_TYPE',
      },
      {
        avslagsårsak: null,
        periode: { fom: '2018-05-01', tom: '2018-09-04' },
        fom: '2018-02-01',
        tom: '2018-12-01',
        utfall: { kode: 'IKKE_VURDERT', kodeverk: 'VILKAR_UTFALL_TYPE' },
        kode: 'IKKE_VURDERT',
        kodeverk: 'VILKAR_UTFALL_TYPE',
      },
    ],
  },
};

const opptjeninger = { opptjeninger: [opptjening, opptjening2] };

export default {
  title: 'prosess/prosess-vilkar-opptjening-oms',
  component: OpptjeningVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visPanelForÅpentAksjonspunkt = () => (
  <OpptjeningVilkarProsessIndex
    behandling={
      {
        id: 1,
        versjon: 1,
        behandlingsresultat,
      } as OpptjeningBehandling
    }
    // @ts-ignore Fiks!
    opptjening={opptjeninger}
    vilkar={[
      {
        vilkarType: {
          kode: 'FP_VK_23',
          kodeverk: 'VILKAR_TYPE',
        },
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: null,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: {
              kode: 'OPPFYLT',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
            periode: {
              fom: '2020-04-27',
              tom: '2020-04-27',
            },
            begrunnelse: null,
            vurderesIBehandlingen: true,
            merknad: {
              kode: '7847B',
              kodeverk: 'VILKAR_UTFALL_MERKNAD',
            },
          },
        ],
      },
    ]}
    aksjonspunkter={
      [
        {
          definisjon: {
            kode: aksjonspunktCodes.SVANGERSKAPSVILKARET,
          },
          status: {
            kode: aksjonspunktStatus.OPPRETTET,
          },
          begrunnelse: undefined,
        },
      ] as Aksjonspunkt[]
    }
    status={vilkarUtfallType.IKKE_VURDERT}
    lovReferanse="§§Dette er en lovreferanse"
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', false)}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
  />
);

export const visPanelForNårEnIkkeHarAksjonspunkt = () => (
  <OpptjeningVilkarProsessIndex
    behandling={
      {
        id: 1,
        versjon: 1,
        behandlingsresultat: {},
      } as OpptjeningBehandling
    }
    // @ts-ignore Fiks!
    opptjening={opptjening}
    vilkar={[
      {
        vilkarType: {
          kode: 'FP_VK_23',
          kodeverk: 'VILKAR_TYPE',
        },
        lovReferanse: '§ 9-2 jamfør 8-2',
        overstyrbar: true,
        perioder: [
          {
            avslagKode: null,
            merknadParametere: {
              antattGodkjentArbeid: 'P10D',
              antattOpptjeningAktivitetTidslinje:
                'LocalDateTimeline<2020-04-17, 2020-04-26 [1]> = [[2020-04-17, 2020-04-26]]',
            },
            vilkarStatus: {
              kode: 'OPPFYLT',
              kodeverk: 'VILKAR_UTFALL_TYPE',
            },
            periode: {
              fom: '2020-04-27',
              tom: '2020-04-27',
            },
            begrunnelse: null,
            vurderesIBehandlingen: true,
            merknad: {
              kode: '1035',
              kodeverk: 'VILKAR_UTFALL_MERKNAD',
            },
          },
        ],
      },
    ]}
    aksjonspunkter={[]}
    status={vilkarUtfallType.OPPFYLT}
    lovReferanse="§§Dette er en lovreferanse"
    submitCallback={action('button-click')}
    isReadOnly={boolean('isReadOnly', true)}
    isAksjonspunktOpen={boolean('isAksjonspunktOpen', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
  />
);
