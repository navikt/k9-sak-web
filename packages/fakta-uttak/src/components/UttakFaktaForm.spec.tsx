import React from 'react';
import { expect } from 'chai';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import sinon from 'sinon';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-fakta-uttak';
import { oppdaterPerioderFor, UttakFaktaFormImpl } from './UttakFaktaForm';
import UttakFormKolonne from './UttakFormKolonne';
import ArbeidsforholdPeriode from './types/ArbeidsforholdPeriode';
import Arbeid from './types/Arbeid';

describe('<UttakFaktaForm>', () => {
  const arbeid: Arbeid[] = [
    {
      arbeidsforhold: {
        organisasjonsnummer: '111111111',
        arbeidsforholdId: '123',
        type: 'Arbeidstaker',
      },
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
      arbeidsforhold: {
        organisasjonsnummer: '222222222',
        arbeidsforholdId: '456',
        type: 'Arbeidstaker',
      },
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
  ];
  it('oppdaterer arbeidsgivere basert på ny periodeinput', async () => {
    const formChanges = [];
    const wrapper = shallowWithIntl(
      <UttakFaktaFormImpl
        {...reduxFormPropsMock}
        arbeid={arbeid}
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
      arbeid,
      arbeid[1].arbeidsforhold.arbeidsforholdId,
      setValgtPeriodeSpy,
      oppdaterFormSpy,
    )(nyPeriode);

    // eslint-disable-next-line no-unused-expressions
    expect(setValgtPeriodeSpy.calledOnceWith(1)).to.be.true;

    expect(oppdaterFormSpy.getCalls()).to.have.length(1);
    const oppdaterteArbeidsgivere: Arbeid[] = oppdaterFormSpy.getCalls()[0].args[0];

    expect(oppdaterteArbeidsgivere).to.have.length(2);
    expect(oppdaterteArbeidsgivere[0]).to.eql(arbeid[0]);
    expect(oppdaterteArbeidsgivere[1].arbeidsforhold).to.eql(arbeid[1].arbeidsforhold);
    const expectedPerioder: ArbeidsforholdPeriode[] = [
      {
        ...arbeid[1].perioder[0],
        tom: '2020-03-06',
      },
      nyPeriode,
      {
        ...arbeid[1].perioder[0],
        fom: '2020-03-15',
      },
      arbeid[1].perioder[1],
    ];

    expect(oppdaterteArbeidsgivere[1].perioder).to.eql(expectedPerioder);
  });
});
