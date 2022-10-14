import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import dokumentTypeId from '@fpsak-frontend/kodeverk/src/dokumentTypeId';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import SokersOpplysningspliktVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-sokers-opplysningsplikt';
import { Aksjonspunkt, Behandling, Soknad } from '@k9-sak-web/types';

import withReduxProvider from '../../decorators/withRedux';

import alleKodeverk from '../mocks/alleKodeverk.json';

const soknad = {
  manglendeVedlegg: [
    {
      dokumentType: dokumentTypeId.INNTEKTSMELDING,
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
          definisjon: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
          status: aksjonspunktStatus.OPPRETTET,
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
          definisjon: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
          status: aksjonspunktStatus.UTFORT,
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
          avslagsarsak: avslagsarsakCodes.INGEN_BEREGNINGSREGLER,
        },
      } as Behandling
    }
    soknad={soknad}
    aksjonspunkter={
      [
        {
          definisjon: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_MANU,
          status: aksjonspunktStatus.UTFORT,
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
