import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenyData from './MenyData';
import MenySakIndex from './MenySakIndex';

describe('<MenySakIndex>', () => {
  it('skal toggle menyvisning ved trykk på knapp', async () => {
    render(
      <MenySakIndex
        data={[
          new MenyData(true, 'Lag ny behandling').medModal(lukkModal => <button type="button" onClick={lukkModal} />),
        ]}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Lag ny behandling' })).not.toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Behandlingsmeny' }));
    });
    expect(screen.getByRole('button', { name: 'Lag ny behandling' })).toBeInTheDocument();
  });

  it('skal åpne modal ved trykk på menyinnslag og så lukke den ved å bruke funksjon for lukking', async () => {
    render(
      <MenySakIndex
        data={[
          new MenyData(true, 'Lag ny behandling').medModal(lukkModal => <button type="button" onClick={lukkModal} />),
        ]}
      />,
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
