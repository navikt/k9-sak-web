import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import MenyVergeIndex from './MenyVergeIndex';

describe('<MenyVergeIndex>', () => {
  it('skal vise modal for opprett og så velge å opprette verge', async () => {
    const opprettVergeCallback = vi.fn();
    const lukkModalCallback = vi.fn();

    renderWithIntl(<MenyVergeIndex opprettVerge={opprettVergeCallback} lukkModal={lukkModalCallback} />, { messages });
    expect(screen.getByText('Opprett verge/fullmektig?')).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    const kall = opprettVergeCallback.mock.calls;
    expect(kall).toHaveLength(1);

    const lukkKall = lukkModalCallback.mock.calls;
    expect(lukkKall).toHaveLength(1);
  });

  it('skal vise modal for fjerne og så velge å fjerne verge', async () => {
    const fjernVergeCallback = vi.fn();
    const lukkModalCallback = vi.fn();

    renderWithIntl(<MenyVergeIndex fjernVerge={fjernVergeCallback} lukkModal={lukkModalCallback} />, { messages });
    expect(screen.getByText('Fjern verge/fullmektig?')).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    const kall = fjernVergeCallback.mock.calls;
    expect(kall).toHaveLength(1);

    const lukkKall = lukkModalCallback.mock.calls;
    expect(lukkKall).toHaveLength(1);
  });
});
