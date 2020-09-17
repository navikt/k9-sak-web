import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import { createBrowserHistory } from 'history';
import configureStore from '@fpsak-frontend/sak-app/src/configureStore';
import { expect } from 'chai';
import { mountWithIntl } from '../../i18n';
import NyArbeidsperiode from './NyArbeidsperiode';

const history = createBrowserHistory({
  basename: '/k9/web/',
});

describe('<NyArbeidsperiode>', () => {
  it('setter og oppdaterer formverdier', async () => {
    const store = configureStore(history);
    const oppdaterPerioderSpy = sinon.spy();
    const avbrytSpy = sinon.spy();
    const wrapper = mountWithIntl(
      <Provider store={store}>
        <NyArbeidsperiode
          oppdaterPerioder={oppdaterPerioderSpy}
          behandlingId={1}
          behandlingVersjon={1}
          avbryt={avbrytSpy}
        />
      </Provider>,
    );
    const periodeInput = wrapper.find('input[placeholder="dd.mm.åååå - dd.mm.åååå"]');
    await periodeInput.simulate('change', { target: { value: '07.03.2020 - 14.03.2020' } });

    const timerIJobbTilVanligInput = wrapper.find('input[name="timerIJobbTilVanlig"]');
    await timerIJobbTilVanligInput.simulate('change', { target: { value: '20,5' } });

    const timerFårJobbetInput = wrapper.find('input[name="timerFårJobbet"]');
    await timerFårJobbetInput.simulate('change', { target: { value: '10.9' } });

    const leggTilPeriodeKnapp = wrapper
      .find('button')
      .findWhere(button => button.text().includes('Legg til') && button.type() === 'button');
    await leggTilPeriodeKnapp.simulate('click');

    // eslint-disable-next-line no-unused-expressions
    expect(
      oppdaterPerioderSpy.calledOnceWith({
        fom: '2020-03-07',
        tom: '2020-03-14',
        timerIJobbTilVanlig: 20.5,
        timerFårJobbet: 10.9,
      }),
    ).is.true;

    // eslint-disable-next-line no-unused-expressions
    expect(avbrytSpy.calledOnce).is.true;
  });
});
