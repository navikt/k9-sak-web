import React from 'react';

import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import AktorSakIndex from '@k9-sak-web/sak-aktor';
import { Fagsak } from '@k9-sak-web/types';
import alleKodeverk from '@k9-sak-web/gui/storybook/mocks/alleKodeverk.json';

const fagsak = {
  saksnummer: '35425245',
  sakstype: fagsakYtelsesType.FP,
  relasjonsRolleType: {
    kode: relasjonsRolleType.MOR,
    kodeverk: '',
  },
  status: {
    kode: fagsakStatus.UNDER_BEHANDLING,
    kodeverk: 'FAGSAK_STATUS',
  },
  barnFodt: '2020-01-01',
  opprettet: '2020-01-01',
  endret: '2020-01-01',
  antallBarn: 1,
  kanRevurderingOpprettes: false,
  skalBehandlesAvInfotrygd: false,
  dekningsgrad: 100,
} as Fagsak;

export default {
  title: 'sak/sak-aktor',
  component: AktorSakIndex,
};

export const visSakerOpprettetPaAktor = () => (
  <AktorSakIndex
    valgtAktorId="123"
    aktorInfo={{
      fagsaker: [
        fagsak,
        {
          saksnummer: '123',
          ...fagsak,
        },
      ],
      person: {
        erDod: false,
        navn: 'Espen Utvikler',
        alder: 41,
        personnummer: '123456233',
        erKvinne: false,
        personstatusType: {
          kode: personstatusType.BOSATT,
          kodeverk: '',
        },
      },
    }}
    alleKodeverk={alleKodeverk as any}
  />
);

export const visningAvUgyldigAktorId = () => <AktorSakIndex valgtAktorId="123" alleKodeverk={alleKodeverk as any} />;
