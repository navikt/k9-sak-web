import { Undertekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { reducer } from 'redux-form';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import messages from '../../i18n/nb_NO.json';
import VilkarresultatMedOverstyringHeader from './VilkarresultatMedOverstyringHeader';

describe('<VilkarresultatMedOverstyringHeader>', () => {
  it('skal rendre header', () => {
    const wrapper = mountWithIntl(
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
      messages,
    );
    const melding = wrapper.find(FormattedMessage);
    expect(melding).toHaveLength(2);
    expect(melding.first().prop('id')).toEqual('Inngangsvilkar.Medlemskapsvilkaret');

    const normaltekst = wrapper.find(Undertekst);
    expect(normaltekst).toHaveLength(1);
    expect(normaltekst.childAt(0).text()).toEqual('§23');
  });
});
