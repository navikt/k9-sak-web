import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import configureStore from '@fpsak-frontend/sak-app/src/configureStore';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles/src/behandlingForm';

import { mountWithIntl } from '../../i18n/intl-enzyme-test-helper-fakta-uttak';
import UttakFaktaForm, { uttakFaktaFormName } from './UttakFaktaForm2';
import { Arbeidsgiver } from './UttakFaktaIndex2';

const history = createBrowserHistory({
  basename: '/k9/web/',
});

// TODO: Legg til enda en periode. Skal da ikke overskrive!
describe('<UttakFaktaForm2>', () => {
  it('oppdaterer arbeidsgivere basert på ny periodeinput', async () => {
    const arbeidsgivere: Arbeidsgiver[] = [
      {
        navn: 'NAV',
        organisasjonsnummer: '123',
        arbeidsforhold: [
          {
            stillingsnavn: 'Utvikler',
            perioder: [
              {
                timerIJobbTilVanlig: 37.5,
                timerFårJobbet: 15,
                fom: '2020-03-01',
                tom: '2020-04-01',
              },
            ],
          },
        ],
      },
    ];

    const store = configureStore(history);
    const wrapper = mountWithIntl(
      <Provider store={store}>
        <UttakFaktaForm
          {...reduxFormPropsMock}
          behandlingVersjon={1}
          behandlingId={1}
          submitCallback={() => undefined}
          arbeidsgivere={arbeidsgivere}
        />
      </Provider>,
    );

    const expandPanelKnapp = wrapper.find('button');
    await expandPanelKnapp.simulate('click');

    const endreKnapp = wrapper
      .find('button')
      .findWhere(button => button.text() === 'Endre' && button.type() === 'button');
    await endreKnapp.simulate('click');

    const periodeInput = wrapper.find('input[placeholder="dd.mm.åååå - dd.mm.åååå"]');
    await periodeInput.simulate('change', { target: { value: '07.03.2020 - 14.03.2020' } });

    const timerIJobbTilVanligInput = wrapper.find('input[name="timerIJobbTilVanlig"]');
    await timerIJobbTilVanligInput.simulate('change', { target: { value: '20' } });

    const timerFårJobbetInput = wrapper.find('input[name="timerFårJobbet"]');
    await timerFårJobbetInput.simulate('change', { target: { value: '10' } });

    const leggTilKnapp = wrapper
      .find('button')
      .findWhere(button => button.text() === 'Legg til' && button.type() === 'button');
    await leggTilKnapp.simulate('click');

    // TODO: assert faktiske verdier i skjermbildet
    // arbeidsgivere.forEach((arbeidsgiver, arbeidsgiverIndex) => {
    //   arbeidsgiver.arbeidsforhold.forEach((arbeidsforhold, arbeidsforholdIndex) => {
    //     arbeidsforhold.perioder.forEach((periode, periodeIndex) => {
    //       const fieldNamePrefix = `arbeidsgivere[${arbeidsgiverIndex}].arbeidsforhold[${arbeidsforholdIndex}].perioder[${periodeIndex}]`;
    //       const felt = wrapper.find(`Field[name="${fieldNamePrefix}.timerIJobbTilVanlig"]`);
    //     });
    //   });
    // });
    //
    // wrapper.find('fieldset').forEach(periodeElement => {
    //   // console.log(periode.debug());
    //   // const periode = periodeElement.find('p[className="typo-normal"]').text();
    //   console.log(periodeElement.debug());
    // });
    // console.log(perioder.debug());

    const oppdaterteArbeidsgivere = wrapper.props().store.getState().form[getBehandlingFormPrefix(1, 1)][
      uttakFaktaFormName
    ].values.arbeidsgivere;

    expect(oppdaterteArbeidsgivere).to.eql([
      {
        ...arbeidsgivere[0],
        arbeidsforhold: [
          {
            ...arbeidsgivere[0].arbeidsforhold[0],
            perioder: [
              {
                ...arbeidsgivere[0].arbeidsforhold[0].perioder[0],
                tom: '2020-03-06',
              },
              {
                fom: '2020-03-07',
                tom: '2020-03-14',
                timerIJobbTilVanlig: 20,
                timerFårJobbet: 10,
              },
              {
                ...arbeidsgivere[0].arbeidsforhold[0].perioder[0],
                fom: '2020-03-15',
              },
            ],
          },
        ],
      },
    ]);
  });
});
