import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ArbeidsforholdV2 from '@k9-sak-web/types/src/arbeidsforholdV2TsType';
import PermisjonPeriode from './PermisjonPeriode';

describe('<PermisjonPeriode>', () => {
  it('skal ikke vise permisjon når arbeidsforholdet har undefined permisjoner', () => {
    const wrapper = shallow(
      <PermisjonPeriode
        arbeidsforhold={
          {
            permisjoner: undefined,
          } as ArbeidsforholdV2
        }
      />,
    );
    expect(wrapper.find('MemoizedFormattedMessage')).to.have.length(0);
    expect(wrapper.find('PeriodLabel')).to.have.length(0);
  });
  it('skal ikke vise permisjon når arbeidsforholdet en tom liste med permisjoner', () => {
    const wrapper = shallow(
      <PermisjonPeriode
        arbeidsforhold={
          {
            permisjoner: [],
          } as ArbeidsforholdV2
        }
      />,
    );
    expect(wrapper.find('MemoizedFormattedMessage')).to.have.length(0);
    expect(wrapper.find('PeriodLabel')).to.have.length(0);
  });
  it('skal vise permisjon når arbeidsforholdet har kun en permisjon', () => {
    const wrapper = shallow(
      <PermisjonPeriode
        arbeidsforhold={
          {
            permisjoner: [
              {
                permisjonFom: '2018-10-10',
                permisjonTom: undefined,
                permisjonsprosent: 100,
              },
            ],
          } as ArbeidsforholdV2
        }
      />,
    );
    const msg = wrapper.find('MemoizedFormattedMessage');
    expect(msg).to.have.length(1);
    expect(msg.props().id).to.eql('PersonArbeidsforholdDetailForm.Permisjon');
    const periode = wrapper.find('PeriodLabel');
    expect(periode).to.have.length(1);
    // @ts-ignore
    expect(periode.props().dateStringFom).to.eql('2018-10-10');
    // @ts-ignore
    expect(periode.props().dateStringTom).to.eql('');
  });
  it('skal vise permisjoner når arbeidsforholdet har flere permisjoner', () => {
    const wrapper = shallow(
      <PermisjonPeriode
        arbeidsforhold={
          {
            permisjoner: [
              {
                permisjonFom: '2015-01-01',
                permisjonTom: undefined,
                permisjonsprosent: 100,
              },
              {
                permisjonFom: '2017-01-01',
                permisjonTom: '2019-01-01',
                permisjonsprosent: 100,
              },
            ],
          } as ArbeidsforholdV2
        }
      />,
    );
    const msg = wrapper.find('MemoizedFormattedMessage');
    expect(msg).to.have.length(1);
    expect(msg.prop('id')).to.eql('PersonArbeidsforholdDetailForm.Permisjoner');
    const perioder = wrapper.find('PeriodLabel');
    expect(perioder.get(0).props.dateStringFom).to.eql('2015-01-01');
    expect(perioder.get(0).props.dateStringTom).to.eql('');
    expect(perioder.get(1).props.dateStringFom).to.eql('2017-01-01');
    expect(perioder.get(1).props.dateStringTom).to.eql('2019-01-01');
  });
});
