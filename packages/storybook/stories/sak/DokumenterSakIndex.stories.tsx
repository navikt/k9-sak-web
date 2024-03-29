import { object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';

import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { Fagsak } from '@k9-sak-web/types';
import withReduxProvider from '../../decorators/withRedux';

const behandlingId = 1;

const dokumenter = [
  {
    journalpostId: '1',
    dokumentId: '1',
    behandlinger: [behandlingId],
    tittel: 'Dette er et dokument',
    tidspunkt: '2017-08-02T00:54:25.455',
    kommunikasjonsretning: kommunikasjonsretning.INN,
    gjelderFor: 'test',
  },
  {
    journalpostId: '2',
    dokumentId: '2',
    behandlinger: [],
    tittel: 'Dette er et nytt dokument',
    tidspunkt: '2017-02-02T01:54:25.455',
    kommunikasjonsretning: kommunikasjonsretning.UT,
    gjelderFor: 'test',
  },
  {
    journalpostId: '3',
    dokumentId: '3',
    behandlinger: [],
    tittel: 'Dette er et tredje dokument',
    tidspunkt: '2017-01-02T10:54:25.455',
    kommunikasjonsretning: kommunikasjonsretning.NOTAT,
    gjelderFor: 'Dette er en lang tekst som skal kuttes',
  },
];

const fagsak = {
  saksnummer: '35425245',
  sakstype: {
    kode: fagsakYtelseType.PLEIEPENGER,
    kodeverk: '',
  },
  relasjonsRolleType: {
    kode: relasjonsRolleType.MOR,
    kodeverk: '',
  },
  status: {
    kode: fagsakStatus.UNDER_BEHANDLING,
    kodeverk: '',
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
  title: 'sak/sak-dokumenter',
  component: DokumenterSakIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visMeldingerPanel = () => (
  <div
    style={{
      width: '700px',
      margin: '50px',
      padding: '20px',
      backgroundColor: 'white',
    }}
  >
    <DokumenterSakIndex
      documents={object('documents', dokumenter)}
      saksnummer={1}
      behandlingId={behandlingId}
      behandlingUuid="1"
      fagsak={fagsak}
    />
  </div>
);
