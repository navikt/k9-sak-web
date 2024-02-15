import { renderWithIntl } from '@fpsak-frontend/utils-test';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import MenyData from './MenyData';
import MenySakIndex from './MenySakIndex';

describe('<MenySakIndex>', () => {
  it('skal toggle menyvisning ved trykk på knapp', async () => {
    renderWithIntl(
      <MenySakIndex
        data={[
          new MenyData(true, 'Lag ny behandling').medModal(lukkModal => <button type="button" onClick={lukkModal} />),
        ]}
      />,
      { messages },
    );

    expect(screen.queryByRole('button', { name: 'Lag ny behandling' })).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Behandlingsmeny' }));
    });
    expect(screen.getByRole('button', { name: 'Lag ny behandling' })).toBeInTheDocument();
  });

  it('skal åpne modal ved trykk på menyinnslag og så lukke den ved å bruke funksjon for lukking', async () => {
    renderWithIntl(
      <MenySakIndex
        data={[
          new MenyData(true, 'Lag ny behandling').medModal(lukkModal => <button type="button" onClick={lukkModal} />),
        ]}
      />,
      { messages },
    );

    expect(screen.queryByRole('button', { name: 'Lag ny behandling' })).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Behandlingsmeny' }));
    });
    expect(screen.getByRole('button', { name: 'Lag ny behandling' })).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Behandlingsmeny' }));
    });
    expect(screen.queryByRole('button', { name: 'Lag ny behandling' })).not.toBeInTheDocument();
  });
});
