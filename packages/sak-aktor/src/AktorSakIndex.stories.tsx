import React from 'react';

import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import AktorSakIndex from '@k9-sak-web/sak-aktor';
import { Fagsak } from '@k9-sak-web/types';

const fagsak = {
  saksnummer: '35425245',
  sakstype: fagsakYtelsesType.FP, // FAGSAK_YTELSE
  relasjonsRolleType: relasjonsRolleType.MOR,
  status: fagsakStatus.UNDER_BEHANDLING, // FAGSAK_STATUS
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
        personstatusType: personstatusType.BOSATT,
      },
    }}
    finnPathToFagsak={() => 'path'}
  />
);

export const visningAvUgyldigAktorId = () => <AktorSakIndex valgtAktorId="123" finnPathToFagsak={() => 'path'} />;
