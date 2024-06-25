import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { add, format } from 'date-fns';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { combineReducers, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import { BehandlingType } from '@k9-sak-web/lib/types/index.js';

import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import MenySettPaVentIndex from './MenySettPaVentIndex';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual('react-router-dom')) as Record<string, unknown>;
  return {
    ...actual,
    useHistory: () => ({
      push: vi.fn(),
    }),
  };
});

const testDato = add(new Date(), { months: 2, days: 1 });

describe('<MenySettPaVentIndex>', () => {
  it('skal vise modal og velge å åpne ta behandling av vent', async () => {
    const lukkModalCallback = vi.fn();
    const settBehandlingPaVent = vi.fn(() => Promise.resolve());

    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <KodeverkProvider
          behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
          kodeverk={alleKodeverkV2}
          klageKodeverk={{}}
          tilbakeKodeverk={{}}
        >
          <MemoryRouter>
            <MenySettPaVentIndex
              behandlingId={3}
              behandlingVersjon={1}
              settBehandlingPaVent={settBehandlingPaVent}
              lukkModal={lukkModalCallback}
              erTilbakekreving={false}
            />
          </MemoryRouter>
        </KodeverkProvider>
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
