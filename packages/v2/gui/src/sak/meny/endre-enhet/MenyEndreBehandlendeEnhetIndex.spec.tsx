import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MenyEndreBehandlendeEnhetIndexV2 from './MenyEndreBehandlendeEnhetIndex';

describe('<MenyEndreBehandlendeEnhetIndex>', () => {
  it('skal vise modal og så lagre ny enhet', async () => {
    const nyBehandlendeEnhetCallback = vi.fn();
    const lukkModalCallback = vi.fn();

    render(
      <MenyEndreBehandlendeEnhetIndexV2
        behandlingId={3}
        behandlingVersjon={1}
        behandlendeEnhetId="NAVV"
        behandlendeEnhetNavn="NAV Viken"
        nyBehandlendeEnhet={nyBehandlendeEnhetCallback}
        behandlendeEnheter={[
          {
            enhetId: 'NAVV',
            enhetNavn: 'NAV Viken',
          },
          {
            enhetId: 'TEST',
            enhetNavn: 'TEST ENHET',
          },
        ]}
        lukkModal={lukkModalCallback}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Endre behandlende enhet' })).toBeInTheDocument();

    await act(async () => {
      await userEvent.selectOptions(screen.getByRole('combobox'), '0');
      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunnelse' }), 'Dette er en begrunnelse');
      await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    });

    const kall = nyBehandlendeEnhetCallback.mock.calls;
    expect(kall).toHaveLength(1);
    expect(kall[0]).toHaveLength(1);
    expect(kall[0]?.[0]).toEqual({
      behandlingId: 3,
      behandlingVersjon: 1,
      enhetNavn: 'TEST ENHET',
      enhetId: 'TEST',
      begrunnelse: 'Dette er en begrunnelse',
    });

    const lukkKall = lukkModalCallback.mock.calls;
    expect(lukkKall).toHaveLength(1);
  });
});
