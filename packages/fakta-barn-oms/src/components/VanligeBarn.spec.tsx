import React from 'react';
import { expect } from 'chai';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { shallowWithIntl } from '../../i18n';
import BarnInfo from './BarnInfo';
import VanligeBarn from './VanligeBarn';

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
        barnType: BarnType.VANLIG,
      },
      {
        personIdent: '05051952104',
        fødselsdato: '2019-05-05',
        harSammeBosted: true,
        dødsdato: '2020-03-03',
        barnType: BarnType.VANLIG,
      },
    ];
    const wrapper = shallowWithIntl(<VanligeBarn barn={barn} />);

    expect(wrapper.find(BarnInfo)).to.have.length(barn.length);
  });
});
