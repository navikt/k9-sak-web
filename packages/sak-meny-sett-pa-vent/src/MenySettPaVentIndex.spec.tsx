import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { reducer as formReducer, reduxForm } from 'redux-form';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { format, add } from 'date-fns';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import MenySettPaVentIndex from './MenySettPaVentIndex';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

const MockForm = reduxForm({ form: 'mock' })(({ children }) => {
  const handleSubmit = jest.fn();
  return <form onSubmit={handleSubmit}>{children}</form>;
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
    const lukkModalCallback = jest.fn();
    const settBehandlingPaVent = jest.fn(() => Promise.resolve());
    const mockResponse = jest.fn();
    Object.defineProperty(window, 'location', {
      value: {
        hash: {
          endsWith: mockResponse,
          includes: mockResponse,
        },
        assign: mockResponse,
      },
      writable: true,
    });

    render(
      <Provider store={createStore(combineReducers({ form: formReducer }))}>
        <MemoryRouter>
          <MockForm>
            <MenySettPaVentIndex
              behandlingId={3}
              behandlingVersjon={1}
              settBehandlingPaVent={settBehandlingPaVent}
              ventearsaker={ventearsaker}
              lukkModal={lukkModalCallback}
              erTilbakekreving={false}
            />
          </MockForm>
        </MemoryRouter>
      </Provider>,
    );

    expect(await screen.getByTestId('ventModalForm')).toBeInTheDocument();
    expect(screen.queryByText('Behandlingen settes på vent med frist')).toBeInTheDocument();

    /**
     * Velg en dato
     */
    const datoFelt = screen.getByPlaceholderText('dd.mm.åååå');
    const datoStreng = format(testDato, 'dd.MM.yyyy');
    userEvent.clear(datoFelt);
    userEvent.type(datoFelt, datoStreng);
    fireEvent.blur(datoFelt);

    /**
     * Velg en venteårsak
     */
    const venteArsakFelt = screen.getByLabelText('Hva venter vi på?');
    userEvent.selectOptions(venteArsakFelt, venteArsakType.UTV_FRIST);

    /**
     * Ssubmit
     */
    userEvent.click(screen.getByText(/Sett på vent/i));

    expect(settBehandlingPaVent).toHaveBeenCalledWith({
      behandlingVersjon: 1,
      behandlingId: 3,
      frist: format(testDato, 'yyyy-MM-dd'),
      ventearsak: venteArsakType.UTV_FRIST,
    });
  });
});
