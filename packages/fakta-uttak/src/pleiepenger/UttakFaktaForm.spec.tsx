import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import sinon from 'sinon';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-uttak';
import { oppdaterPerioderFor, UttakFaktaFormImpl } from './UttakFaktaForm2';
import Arbeidsgiver from './types/Arbeidsgiver';
import UttakFormKolonne from './UttakFormKolonne';
import ArbeidsforholdPeriode from './types/ArbeidsforholdPeriode';

describe('<UttakFaktaForm2>', () => {
  const arbeidsgivere: Arbeidsgiver[] = [
    {
      navn: 'NAV',
      organisasjonsnummer: '123',
      arbeidsforhold: [
        {
          arbeidsgiversArbeidsforholdId: '1234',
          perioder: [
            {
              timerIJobbTilVanlig: 37.5,
              timerFårJobbet: 15,
              fom: '2020-03-01',
              tom: '2020-04-01',
            },
          ],
        },
        {
          arbeidsgiversArbeidsforholdId: '5678',
          perioder: [
            {
              timerIJobbTilVanlig: 22.5,
              timerFårJobbet: 7.5,
              fom: '2020-03-01',
              tom: '2020-04-01',
            },
            {
              timerIJobbTilVanlig: 15,
              timerFårJobbet: 7.5,
              fom: '2020-04-02',
              tom: '2020-05-01',
            },
          ],
        },
      ],
    },
  ];
  it('oppdaterer arbeidsgivere basert på ny periodeinput', async () => {
    const formChanges = [];
    const wrapper = shallowWithIntl(
      <UttakFaktaFormImpl
        {...reduxFormPropsMock}
        arbeidsgivere={arbeidsgivere}
        behandlingId={1}
        behandlingVersjon={1}
        submitCallback={() => undefined}
        resetForm={() => undefined}
        reduxFormChange={(formName, formPropName, newVal) => formChanges.push({ formPropName, newVal })}
      />,
    );

    const kolonner = wrapper.find(UttakFormKolonne);
    expect(kolonner).to.have.length(3);
  });

  it('oppdaterer arbeidsgivere basert på ny periode', () => {
    const nyPeriode: ArbeidsforholdPeriode = {
      fom: '2020-03-07',
      tom: '2020-03-14',
      timerFårJobbet: 10,
      timerIJobbTilVanlig: 22.5,
    };

    const setValgtPeriodeSpy = sinon.spy();
    const oppdaterFormSpy = sinon.spy();
    oppdaterPerioderFor(
      arbeidsgivere,
      arbeidsgivere[0].organisasjonsnummer,
      arbeidsgivere[0].arbeidsforhold[1].arbeidsgiversArbeidsforholdId,
      setValgtPeriodeSpy,
      oppdaterFormSpy,
    )(nyPeriode);

    // eslint-disable-next-line no-unused-expressions
    expect(setValgtPeriodeSpy.calledOnceWith(1)).to.be.true;

    expect(oppdaterFormSpy.getCalls()).to.have.length(1);
    const oppdaterteArbeidsgivere = oppdaterFormSpy.getCalls()[0].args[0];
    expect(oppdaterteArbeidsgivere).to.eql([
      {
        ...arbeidsgivere[0],
        arbeidsforhold: [
          arbeidsgivere[0].arbeidsforhold[0],
          {
            ...arbeidsgivere[0].arbeidsforhold[1],
            perioder: [
              {
                ...arbeidsgivere[0].arbeidsforhold[1].perioder[0],
                tom: '2020-03-06',
              },
              nyPeriode,
              {
                ...arbeidsgivere[0].arbeidsforhold[1].perioder[0],
                fom: '2020-03-15',
              },
              arbeidsgivere[0].arbeidsforhold[1].perioder[1],
            ],
          },
        ],
      },
    ]);
  });
});
