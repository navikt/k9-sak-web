import React from 'react';
import FaktaBarnIndex from '@k9-sak-web/fakta-barn-oms';
import BarnDto, { BarnType } from '@k9-sak-web/prosess-aarskvantum-oms/src/dto/BarnDto';
import { Rammevedtak } from '@k9-sak-web/types';
import { RammevedtakEnum } from '@k9-sak-web/types/src/omsorgspenger/Rammevedtak';

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
    deltBostedPerioder: ["2022-02-07/2022-02-08", "2022-02-07/2022-02-08"],
    dødsdato: '2020-03-03',
    barnType: BarnType.FOSTERBARN,
  },
];

const rammevedtak: Rammevedtak[] = [
  {
    type: 'Fosterbarn',
    vedtatt: '2021-03-17',
    lengde: 'PT0S',
    gyldigFraOgMed: '2021-03-17',
    gyldigTilOgMed: '2033-12-31',
    mottaker: '05051952104',
  },
  {
    type: 'UtvidetRett',
    vedtatt: '2021-03-17',
    lengde: 'PT0S',
    gyldigFraOgMed: '2021-03-17',
    gyldigTilOgMed: '2033-12-31',
    utvidetRettFor: '150915 #2',
  },
  {
    type: RammevedtakEnum.UIDENTIFISERT,
    fritekst: '03070189827 @9-6,20 D (Denne mangler type)',
  },
];

export const treBarn = () => <FaktaBarnIndex barn={barn} rammevedtak={rammevedtak} />;

export const ingenBarn = () => <FaktaBarnIndex barn={[]} rammevedtak={rammevedtak} />;
