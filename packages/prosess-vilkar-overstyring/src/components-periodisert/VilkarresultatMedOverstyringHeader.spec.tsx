import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer } from 'redux-form';
import messages from '../../i18n/nb_NO.json';
import VilkarresultatMedOverstyringHeader from './VilkarresultatMedOverstyringHeader';

describe('<VilkarresultatMedOverstyringHeader>', () => {
  it('skal rendre header', () => {
    renderWithIntl(
      <Provider store={createStore(combineReducers({ form: reducer }))}>
        <VilkarresultatMedOverstyringHeader
          erVilkarOk
          overstyringApKode="5011"
          lovReferanse="§23"
          overrideReadOnly={false}
          kanOverstyreAccess={{
            isEnabled: true,
          }}
          aksjonspunktCodes={[]}
          toggleOverstyring={() => undefined}
          panelTittelKode="Inngangsvilkar.Medlemskapsvilkaret"
          erOverstyrt
          aksjonspunkter={[]}
        />
      </Provider>,
      { messages },
    );
    expect(screen.getByRole('heading', { name: 'Medlemskap' })).toBeInTheDocument();
    expect(screen.getByText('§23')).toBeInTheDocument();
  });
});
