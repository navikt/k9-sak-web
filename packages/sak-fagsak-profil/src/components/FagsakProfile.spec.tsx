import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import sinon from 'sinon';
import { intlMock } from '../../i18n/index';
import messages from '../../i18n/nb_NO.json';
import { FagsakProfile } from './FagsakProfile';

describe('<FagsakProfile>', () => {
  it('skal vise en fagsak med tilhørende informasjon', () => {
    const fagsakYtelseType = {
      kode: 'ES',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Engangsstønad',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
      navn: 'Opprettet',
    };
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
    const fagsakYtelseType = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Foreldrepenger',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
      navn: 'Opprettet',
    };
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
    const fagsakYtelseType = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Foreldrepenger',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
      navn: 'Opprettet',
    };
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
    const fagsakYtelseType = {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Foreldrepenger',
    };
    const status = {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
      navn: 'Opprettet',
    };
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
