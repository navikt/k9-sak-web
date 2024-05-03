import fagsakStatus from '@k9-sak-web/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@k9-sak-web/kodeverk/src/fagsakYtelseType';
import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import { Fagsak, KodeverkMedNavn } from '@k9-sak-web/types';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import FagsakList, { sortFagsaker } from './FagsakList';

const FAGSAK_STATUS_KODEVERK = 'FAGSAK_STATUS';
const FAGSAK_YTELSE_KODEVERK = 'FAGSAK_YTELSE';

const alleKodeverk = {
  [kodeverkTyper.FAGSAK_STATUS]: [
    {
      kode: fagsakStatus.UNDER_BEHANDLING,
      navn: 'Under behandling',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
    {
      kode: fagsakStatus.AVSLUTTET,
      navn: 'Avsluttet',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
  ],
  [kodeverkTyper.FAGSAK_YTELSE]: [
    {
      kode: fagsakYtelseType.ENGANGSSTONAD,
      navn: 'Engangsstønad',
      kodeverk: FAGSAK_YTELSE_KODEVERK,
    },
  ],
};

describe('<FagsakList>', () => {
  const fagsak = {
    saksnummer: '12345',
    sakstype: {
      kode: 'ES',
      kodeverk: FAGSAK_YTELSE_KODEVERK,
    },
    relasjonsRolleType: {
      kode: 'TEST',
      kodeverk: '',
    },
    status: {
      kode: 'UBEH',
      kodeverk: FAGSAK_STATUS_KODEVERK,
    },
    barnFodt: null,
    opprettet: '2019-02-17T13:49:18.645',
    endret: '2019-02-17T13:49:18.645',
    antallBarn: 1,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    dekningsgrad: 100,
  } as Fagsak;

  it('skal vise en tabell med en rad og tilhørende kolonnedata', () => {
    const clickFunction = vi.fn();
    renderWithIntl(
      <FagsakList
        fagsaker={[fagsak]}
        selectFagsakCallback={clickFunction}
        alleKodeverk={alleKodeverk as { [key: string]: [KodeverkMedNavn] }}
      />,
      { messages },
    );
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('Engangsstønad')).toBeInTheDocument();
    expect(screen.getByText('Under behandling')).toBeInTheDocument();
  });

  it('skal sortere søkeresultat der avsluttede skal vises sist, mens sist endrede skal vises først', () => {
    const fagsak2 = {
      saksnummer: '23456',
      sakstype: {
        kode: 'ES',
        kodeverk: FAGSAK_YTELSE_KODEVERK,
      },
      relasjonsRolleType: {
        kode: 'TEST',
        kodeverk: '',
      },
      status: {
        kode: 'UBEH',
        kodeverk: FAGSAK_STATUS_KODEVERK,
      },
      barnFodt: null,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
      dekningsgrad: 100,
    } as Fagsak;

    const fagsak3 = {
      saksnummer: '34567',
      sakstype: {
        kode: 'ES',
        kodeverk: FAGSAK_YTELSE_KODEVERK,
      },
      status: {
        kode: 'AVSLU',
        kodeverk: FAGSAK_STATUS_KODEVERK,
      },
      barnFodt: null,
      opprettet: '2019-02-18T13:49:18.645',
      endret: '2019-02-18T13:49:18.645',
      dekningsgrad: 100,
    } as Fagsak;

    const fagsaker = [fagsak, fagsak2, fagsak3];
    const sorterteFagsaker = sortFagsaker(fagsaker);
    expect(sorterteFagsaker[0]).toEqual(fagsaker[1]);
    expect(sorterteFagsaker[1]).toEqual(fagsaker[0]);
    expect(sorterteFagsaker[2]).toEqual(fagsaker[2]);
  });
});
