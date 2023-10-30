import React from 'react';
import { shallow } from 'enzyme';

import DokumenterSakIndex from '@fpsak-frontend/sak-dokumenter';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import { Fagsak } from '@k9-sak-web/types';
import { DokumentIndex } from './DokumentIndex';
import { requestApi, K9sakApiKeys } from '../../data/k9sakApi';

describe('<DokumentIndex>', () => {
  const documents = [
    {
      journalpostId: '1',
      dokumentId: '1',
      tittel: 'dok',
      tidspunkt: '10.10.2017 10:23',
      kommunikasjonsretning: 'Inn',
    },
    {
      journalpostId: '2',
      dokumentId: '2',
      tittel: 'dok1',
      tidspunkt: '10.10.2019 10:23',
      kommunikasjonsretning: 'Inn',
    },
    {
      journalpostId: '3',
      dokumentId: '3',
      tittel: 'dok2',
      tidspunkt: '10.10.2018 10:23',
      kommunikasjonsretning: 'Inn',
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

  it('skal vise liste med sorterte dokumenter', () => {
    requestApi.mock(K9sakApiKeys.ALL_DOCUMENTS, documents);

    const wrapper = shallow(
      <DokumentIndex behandlingId={1} behandlingVersjon={2} saksnummer={123} behandlingUuid="1" fagsak={fagsak} />,
    );

    const index = wrapper.find(DokumenterSakIndex);
    expect(index).toHaveLength(1);

    const dokumenter = index.prop('documents');

    expect(dokumenter[0].journalpostId).toEqual('2');
    expect(dokumenter[1].journalpostId).toEqual('3');
    expect(dokumenter[2].journalpostId).toEqual('1');
  });
});
