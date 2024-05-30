import { action } from '@storybook/addon-actions';
import React from 'react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';
import VarselOmRevurderingProsessIndex from './VarselOmRevurderingProsessIndex';

const behandling = {
  id: 1,
  versjon: 1,
  behandlingÅrsaker: [
    {
      erAutomatiskRevurdering: true,
    },
  ],
  sprakkode: {
    kode: 'NN',
  },
  type: {
    kode: behandlingType.FORSTEGANGSSOKNAD,
  },
};

const familieHendelse = {
  register: {
    avklartBarn: [
      {
        fodselsdato: '2019-01-10',
        dodsdato: undefined,
      },
    ],
  },
  gjeldende: {
    termindato: '2019-01-01',
    vedtaksDatoSomSvangerskapsuke: '2019-01-01',
  },
};

const soknad = {
  fodselsdatoer: { 1: '2019-01-10' },
  termindato: '2019-01-01',
  utstedtdato: '2019-01-02',
  antallBarn: 1,
};

const soknadOriginalBehandling = {
  ...soknad,
};
const familiehendelseOriginalBehandling = {
  termindato: '2019-01-01',
  fodselsdato: '2019-01-10',
  antallBarnTermin: 1,
  antallBarnFodsel: 1,
};

const aksjonspunkter = [
  {
    definisjon: {
      kode: aksjonspunktCodes.VARSEL_REVURDERING_MANUELL,
    },
    status: {
      kode: aksjonspunktStatus.OPPRETTET,
    },
    begrunnelse: undefined,
  },
];

export default {
  title: 'prosess/prosess-varsel-om-revurdering',
  component: VarselOmRevurderingProsessIndex,
};

export const visForFørstegangsbehandling = args => (
  <VarselOmRevurderingProsessIndex
    behandling={behandling}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    dispatchSubmitFailed={action('button-click')}
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visForFørstegangsbehandling.args = {
  familieHendelse,
  soknad,
  soknadOriginalBehandling,
  familiehendelseOriginalBehandling,
  isReadOnly: false,
};

export const visForRevurdering = args => (
  <VarselOmRevurderingProsessIndex
    behandling={{
      ...behandling,
      behandlingType: {
        kode: behandlingType.REVURDERING,
      },
    }}
    aksjonspunkter={aksjonspunkter}
    submitCallback={action('button-click')}
    previewCallback={action('button-click')}
    dispatchSubmitFailed={action('button-click')}
    alleKodeverk={alleKodeverk}
    {...args}
  />
);

visForRevurdering.args = {
  familieHendelse,
  soknad,
  soknadOriginalBehandling,
  familiehendelseOriginalBehandling,
  isReadOnly: false,
};
