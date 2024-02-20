import { act, renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import sinon from 'sinon';
import messages from '../i18n/nb_NO.json';
import MenyTaAvVentIndex from './MenyTaAvVentIndex';

describe('<MenyTaAvVentIndex>', () => {
  it('skal vise modal og velge å åpne ta behandling av vent', async () => {
    const resumeBehandlingCallback = sinon.spy();
    const lukkModalCallback = sinon.spy();

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

    const kall = resumeBehandlingCallback.getCalls();
    expect(kall).toHaveLength(1);
    expect(kall[0].args).toHaveLength(1);
    expect(kall[0].args[0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
    });
  });
});
