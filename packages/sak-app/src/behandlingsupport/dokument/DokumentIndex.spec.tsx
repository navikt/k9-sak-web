import { fagsakStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.js';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Fagsak } from '@k9-sak-web/types';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';
import { DokumentIndex } from './DokumentIndex';

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
    sakstype: fagsakYtelsesType.PSB,
    relasjonsRolleType: relasjonsRolleType.MOR,
    status: fagsakStatus.UNDER_BEHANDLING,
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

    render(
      <DokumentIndex behandlingId={1} behandlingVersjon={2} saksnummer={123} behandlingUuid="1" fagsak={fagsak} />,
    );
    expect(screen.getByRole('link', { name: 'dok' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'dok1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'dok2' })).toBeInTheDocument();
  });
});
