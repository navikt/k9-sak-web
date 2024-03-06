import React from 'react';
import sinon from 'sinon';
import { screen } from '@testing-library/react';

import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import alleKodeverk from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';

import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import { FagsakProfile } from './FagsakProfile';

describe('<FagsakProfile>', () => {
  it('skal vise en fagsak med tilhørende informasjon', () => {
    const fagsakYtelseType = 'ES';
    const status = 'OPPR';

    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);

    renderWithIntl(
      <FagsakProfile
        saksnummer="12345"
        fagsakYtelseType={fagsakYtelseType}
        fagsakStatus={status}
        renderBehandlingMeny={sinon.spy()}
        renderBehandlingVelger={sinon.spy()}
        dekningsgrad={100}
        intl={intlMock}
      />,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Engangsstønad' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
  });

  it('skal vise dekningsgrad for foreldrepenger om den eksisterer', () => {
    const fagsakYtelseType = 'FP';
    const status = 'OPPR';

    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);

    renderWithIntl(
      <FagsakProfile
        saksnummer="12345"
        fagsakYtelseType={fagsakYtelseType}
        fagsakStatus={status}
        renderBehandlingMeny={sinon.spy()}
        renderBehandlingVelger={sinon.spy()}
        dekningsgrad={100}
        intl={intlMock}
      />,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
    expect(screen.getByText('Dekningsgraden er 100%')).toBeInTheDocument();
  });

  it('skal ikke vise dekningsgrad for foreldrepenger om den ikke eksisterer', () => {
    const fagsakYtelseType = 'FP';
    const status = 'OPPR';

    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);

    renderWithIntl(
      <FagsakProfile
        saksnummer="12345"
        fagsakYtelseType={fagsakYtelseType}
        fagsakStatus={status}
        renderBehandlingMeny={sinon.spy()}
        renderBehandlingVelger={sinon.spy()}
        intl={intlMock}
      />,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
    expect(screen.queryByText(/dekningsgraden/i)).not.toBeInTheDocument();
  });

  it('skal ikke vise ugyldig dekningsgrad for foreldrepenger', () => {
    const fagsakYtelseType = 'FP';
    const status = 'OPPR';

    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);

    renderWithIntl(
      <FagsakProfile
        saksnummer="12345"
        fagsakYtelseType={fagsakYtelseType}
        fagsakStatus={status}
        renderBehandlingMeny={sinon.spy()}
        renderBehandlingVelger={sinon.spy()}
        dekningsgrad={73}
        intl={intlMock}
      />,
      { messages },
    );

    expect(screen.getByRole('heading', { name: 'Foreldrepenger' })).toBeInTheDocument();
    expect(screen.getByText('12345 - Opprettet')).toBeInTheDocument();
    expect(screen.queryByText(/dekningsgraden/i)).not.toBeInTheDocument();
  });
});
