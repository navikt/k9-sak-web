import React from 'react';
import { expect } from 'chai';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { shallowWithIntl } from '../../i18n/intl-enzyme-test-helper-fakta-barn-oms';
import BarnInfo, { BarnPanel } from './BarnInfo';

describe('<BarnInfo>', () => {
  it('Rendrer hvert barn', () => {
    const barn: BarnDto[] = [
      {
        personIdent: '010116',
        fødselsdato: '2016-01-01',
        harSammeBosted: true,
        barnType: BarnType.VANLIG,
      },
      {
        personIdent: '02031845962',
        fødselsdato: '2018-03-02',
        harSammeBosted: false,
        barnType: BarnType.FOSTERBARN,
      },
      {
        personIdent: '05051952104',
        fødselsdato: '2019-05-05',
        harSammeBosted: true,
        dødsdato: '2020-03-03',
        barnType: BarnType.UTENLANDSK_BARN,
      },
    ];
    const wrapper = shallowWithIntl(<BarnInfo barn={barn} />);

    expect(wrapper.find(BarnPanel)).to.have.length(barn.length);
  });
});
