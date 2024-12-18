import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { add, format } from 'date-fns';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { combineReducers, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';

import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import MenySettPaVentIndex from './MenySettPaVentIndex';

vi.mock('react-router', async () => {
  const actual = (await vi.importActual('react-router')) as Record<string, unknown>;
  return {
    ...actual,
    useHistory: () => ({
      push: vi.fn(),
    }),
  };
});

const ventearsaker = [
  {
    kode: venteArsakType.UTV_FRIST,
    kodeverk: 'VENT_ARSAK_TYPE',
    navn: 'Utvid frist',
    kanVelges: 'true',
  },
];

const testDato = add(new Date(), { months: 2, days: 1 });

describe('<MenySettPaVentIndex>', () => {
  it('skal vise modal og velge å åpne ta behandling av vent', async () => {
    const lukkModalCallback = vi.fn();
    const settBehandlingPaVent = vi.fn(() => Promise.resolve());

    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MemoryRouter>
          <MenySettPaVentIndex
            behandlingId={3}
            behandlingVersjon={1}
            settBehandlingPaVent={settBehandlingPaVent}
            ventearsaker={ventearsaker}
            lukkModal={lukkModalCallback}
            erTilbakekreving={false}
          />
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.getByTestId('ventModalForm')).toBeInTheDocument();
    expect(screen.getAllByText('Behandlingen settes på vent med frist')).toHaveLength(2);

    /**
     * Velg en dato
     */
    const datoFelt = screen.getByRole('textbox', { name: 'Behandlingen settes på vent med frist' });
    const datoStreng = format(testDato, 'dd.MM.yyyy');
    await userEvent.clear(datoFelt);
    await userEvent.type(datoFelt, datoStreng);
    fireEvent.blur(datoFelt);

    /**
     * Velg en venteårsak
     */
    const venteArsakFelt = screen.getByLabelText('Hva venter vi på?');
    await userEvent.selectOptions(venteArsakFelt, venteArsakType.UTV_FRIST);

    /**
     * Ssubmit
     */
    await userEvent.click(screen.getByText(/Sett på vent/i));

    expect(settBehandlingPaVent).toHaveBeenCalledWith({
      behandlingVersjon: 1,
      behandlingId: 3,
      frist: format(testDato, 'yyyy-MM-dd'),
      ventearsak: venteArsakType.UTV_FRIST,
    });
  });
});
