import React from 'react';
import FaktaBarnIndex from '@k9-sak-web/fakta-barn-oms';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';

export default {
  title: 'omsorgspenger/fakta/Barn',
  component: FaktaBarnIndex,
};

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
    barnType: BarnType.UTENLANDSK_BARN,
  },
  {
    personIdent: '05051952104',
    fødselsdato: '2019-05-05',
    harSammeBosted: true,
    dødsdato: '2020-03-03',
    barnType: BarnType.FOSTERBARN,
  },
];

export const treBarn = () => <FaktaBarnIndex barn={barn} />;

export const ingenBarn = () => <FaktaBarnIndex barn={[]} />;
