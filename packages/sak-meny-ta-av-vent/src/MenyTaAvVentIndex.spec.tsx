import { act, renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import MenyTaAvVentIndex from './MenyTaAvVentIndex';

describe('<MenyTaAvVentIndex>', () => {
  it('skal vise modal og velge å åpne ta behandling av vent', async () => {
    const resumeBehandlingCallback = vi.fn();
    const lukkModalCallback = vi.fn();

    renderWithIntl(
      <MenyTaAvVentIndex
        behandlingId={3}
        behandlingVersjon={1}
        taBehandlingAvVent={resumeBehandlingCallback}
        lukkModal={lukkModalCallback}
      />,
      { messages },
    );

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    const kall = resumeBehandlingCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]).toHaveLength(1);
    expect(kall[0][0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
    });
  });
});
