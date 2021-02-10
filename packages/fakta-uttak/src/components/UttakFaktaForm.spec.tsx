import React from 'react';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import shallowWithIntl from '../../i18n';
import { oppdaterPerioderFor, transformValues, UttakFaktaFormImpl } from './UttakFaktaForm';
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
  it('oppdaterer arbeidsgivere basert på ny periodeinput', () => {
    const wrapper = shallowWithIntl(
      <UttakFaktaFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        arbeid={arbeid}
        behandlingId={1}
        behandlingVersjon={1}
        submitCallback={() => undefined}
        resetForm={() => undefined}
        reduxFormChange={() => undefined}
      />,
    );

    const kolonner = wrapper.find(UttakFormKolonne);
    expect(kolonner).toHaveLength(3);
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
    expect(setValgtPeriodeSpy.calledOnceWith(1)).toBe(true);

    expect(oppdaterFormSpy.getCalls()).toHaveLength(1);
    const oppdaterteArbeidsgivere: Arbeid[] = oppdaterFormSpy.getCalls()[0].args[0];

    expect(oppdaterteArbeidsgivere).toHaveLength(2);
    expect(oppdaterteArbeidsgivere[0]).toEqual(arbeid[0]);
    expect(oppdaterteArbeidsgivere[1].arbeidsforhold).toEqual(arbeid[1].arbeidsforhold);
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

    expect(oppdaterteArbeidsgivere[1].perioder).toEqual(expectedPerioder);
  });

  it('transformerer skjemaverdier til dto onSubmit', () => {
    const skjemaverdier: { arbeid: Arbeid[]; begrunnelse: string } = {
      arbeid: [arbeid[0]],
      begrunnelse: 'begr',
    };
    const perioden = arbeid[0].perioder[0];

    const transformert = transformValues(skjemaverdier);

    expect(transformert).toEqual([
      {
        begrunnelse: skjemaverdier.begrunnelse,
        kode: 'FAKE_CODE',
        arbeid: [
          {
            ...arbeid[0],
            perioder: {
              [`${perioden.fom}/${perioden.tom}`]: {
                jobberNormaltPerUke: 'PT37H30M',
                skalJobbeProsent: '40',
              },
            },
          },
        ],
      },
    ]);
  });
});
