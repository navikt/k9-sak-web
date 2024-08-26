import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer } from 'redux-form';
import messages from '../../i18n/nb_NO.json';
import SoknadsfristVilkarHeader from './SoknadsfristVilkarHeader';

describe('<SoknadsfristVilkarHeader>', () => {
  it('skal rendre header', () => {
    render(
      <Provider store={createStore(combineReducers({ form: reducer }))}>
        <IntlProvider locale="nb-NO" messages={messages}>
          <SoknadsfristVilkarHeader
            erVilkarOk
            overstyringApKode="5011"
            lovReferanse="§23"
            overrideReadOnly={false}
            kanOverstyreAccess={{
              isEnabled: true,
            }}
            aksjonspunktCodes={[]}
            toggleOverstyring={() => undefined}
            panelTittelKode="Inngangsvilkar.Soknadsfrist"
            erOverstyrt
            aksjonspunkter={[]}
          />
        </IntlProvider>
      </Provider>,
    );

    expect(screen.getByRole('heading', { name: 'Søknadsfrist' })).toBeInTheDocument();
    expect(screen.getByText('§23')).toBeInTheDocument();
  });
});
