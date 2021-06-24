import { mount } from 'enzyme';
import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer } from 'redux-form';
import messages from '../../i18n/nb_NO.json';
import SoknadsfristVilkarHeader from './SoknadsfristVilkarHeader';

describe('<SoknadsfristVilkarHeader>', () => {
  it('skal rendre header', () => {
    const wrapper = mount(
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
            panelTittelKode="Behandlingspunkt.Soknadsfristvilkaret"
            erOverstyrt
            aksjonspunkter={[]}
          />
        </IntlProvider>
      </Provider>,
    );
    const melding = wrapper.find(FormattedMessage);
    expect(melding).toHaveLength(2);
    expect(melding.first().prop('id')).toEqual('Behandlingspunkt.Soknadsfristvilkaret');

    const normaltekst = wrapper.find(Undertekst);
    expect(normaltekst).toHaveLength(1);
    expect(normaltekst.childAt(0).text()).toEqual('§23');
  });
});
