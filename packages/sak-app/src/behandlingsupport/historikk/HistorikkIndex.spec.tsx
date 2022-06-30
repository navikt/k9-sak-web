import React from 'react';
import { shallow } from 'enzyme';

import HistorikkSakIndex from '@fpsak-frontend/sak-historikk';

import { requestApi, K9sakApiKeys } from '../../data/k9sakApi';
import HistorikkIndex from './HistorikkIndex';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useLocation: () => ({
    pathname: 'test',
    search: 'test',
    state: {},
    hash: 'test',
  }),
}));

describe('<HistorikkIndex>', () => {
  it('skal slå sammen og sortere historikk for k9sak, tilbake og klage', () => {
    requestApi.mock(K9sakApiKeys.INIT_FETCH_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.INIT_FETCH_KLAGE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_TILBAKE, {});
    requestApi.mock(K9sakApiKeys.KODEVERK_KLAGE, {});
    requestApi.mock(K9sakApiKeys.HISTORY_K9SAK, [
      {
        opprettetTidspunkt: '2019-01-01',
        historikkinnslagDeler: [],
        type: 'Test fpsak 1',
      },
      {
        opprettetTidspunkt: '2019-01-06',
        historikkinnslagDeler: [],
        type: 'Test fpsak 2',
      },
    ]);
    requestApi.mock(K9sakApiKeys.HISTORY_TILBAKE, [
      {
        opprettetTidspunkt: '2019-01-04',
        historikkinnslagDeler: [],
        type: 'Test fptilbake',
      },
    ]);
    requestApi.mock(K9sakApiKeys.HISTORY_KLAGE, [
      {
        opprettetTidspunkt: '2018-01-04',
        historikkinnslagDeler: [],
        type: 'Test fptilbake',
      },
    ]);

    const wrapper = shallow(<HistorikkIndex saksnummer="12345" behandlingId={1} behandlingVersjon={2} />);

    const index = wrapper.find(HistorikkSakIndex);
    expect(index).toHaveLength(4);
    expect((index.at(0).prop('historikkinnslag') as { opprettetTidspunkt: string }).opprettetTidspunkt).toEqual(
      '2019-01-06',
    );
    expect((index.at(1).prop('historikkinnslag') as { opprettetTidspunkt: string }).opprettetTidspunkt).toEqual(
      '2019-01-04',
    );
    expect((index.at(2).prop('historikkinnslag') as { opprettetTidspunkt: string }).opprettetTidspunkt).toEqual(
      '2019-01-01',
    );
    expect((index.at(3).prop('historikkinnslag') as { opprettetTidspunkt: string }).opprettetTidspunkt).toEqual(
      '2018-01-04',
    );
  });
});
