import { action } from '@storybook/addon-actions';
import { boolean, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import avslagsarsakCodes from '@k9-sak-web/kodeverk/src/avslagsarsakCodes';
import dokumentTypeId from '@k9-sak-web/kodeverk/src/dokumentTypeId';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import SokersOpplysningspliktVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-sokers-opplysningsplikt';
import { Aksjonspunkt, Behandling, Soknad } from '@k9-sak-web/types';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const soknad = {
  manglendeVedlegg: [
    {
      dokumentType: {
        kode: dokumentTypeId.INNTEKTSMELDING,
        kodeverk: '',
      },
      arbeidsgiver: {
        organisasjonsnummer: '1234',
        navn: 'Statoil',
      },
    },
  ],
} as Soknad;

export default {
  title: 'prosess/prosess-vilkar-sokers-opplysningsplikt',
  component: SokersOpplysningspliktVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visÅpentAksjonspunkt = () => (
  <SokersOpplysningspliktVilkarProsessIndex
    behandling={
      {
        id: 1,
        versjon: 1,
      } as Behandling
    }
    soknad={soknad}
    aksjonspunkter={
      [
        {
          definisjon: {
            kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
          },
          status: {
            kode: aksjonspunktStatus.OPPRETTET,
          },
          begrunnelse: undefined,
        },
      ] as Aksjonspunkt[]
    }
    alleKodeverk={alleKodeverk as any}
    submitCallback={action('button-click') as () => Promise<any>}
    isReadOnly={boolean('isReadOnly', false)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', false)}
    status={vilkarUtfallType.IKKE_VURDERT}
    isAksjonspunktOpen
    vilkar={[]}
  />
);

export const visOppfyltVilkår = () => (
  <SokersOpplysningspliktVilkarProsessIndex
    behandling={
      {
        id: 1,
        versjon: 1,
        behandlingsresultat: {},
      } as Behandling
    }
    soknad={soknad}
    aksjonspunkter={
      [
        {
          definisjon: {
            kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
          },
          status: {
            kode: aksjonspunktStatus.UTFORT,
          },
          begrunnelse: 'Dette vilkåret er godkjent',
        },
      ] as Aksjonspunkt[]
    }
    alleKodeverk={alleKodeverk as any}
    submitCallback={action('button-click') as () => Promise<any>}
    isReadOnly={boolean('isReadOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    status={vilkarUtfallType.OPPFYLT}
    isAksjonspunktOpen={false}
    vilkar={[]}
  />
);

export const visAvslåttVilkår = () => (
  <SokersOpplysningspliktVilkarProsessIndex
    behandling={
      {
        id: 1,
        versjon: 1,
        behandlingsresultat: {
          avslagsarsak: {
            kode: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
          },
        },
      } as Behandling
    }
    soknad={soknad}
    aksjonspunkter={
      [
        {
          definisjon: {
            kode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
          },
          status: {
            kode: aksjonspunktStatus.UTFORT,
          },
          begrunnelse: 'Dette vilkåret er avslått',
        },
      ] as Aksjonspunkt[]
    }
    alleKodeverk={alleKodeverk as any}
    submitCallback={action('button-click') as () => Promise<any>}
    isReadOnly={boolean('isReadOnly', true)}
    readOnlySubmitButton={boolean('readOnlySubmitButton', true)}
    status={vilkarUtfallType.IKKE_OPPFYLT}
    isAksjonspunktOpen={false}
    vilkar={[]}
  />
);
