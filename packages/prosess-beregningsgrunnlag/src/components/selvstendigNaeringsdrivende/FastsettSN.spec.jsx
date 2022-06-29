import { expect } from 'chai';
import React from 'react';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import FastsettSN, { FastsettSN as UnwrappedForm, begrunnelseFieldname, fastsettInntektFieldname } from './FastsettSN';

import shallowWithIntl, { intlMock } from '../../../i18n';

const mockAvklaringsbehovMedKodeOgStatus = (apKode, begrunnelse) => ({
  definisjon: apKode,
  status: 'OPPR',
  begrunnelse,
});

const lagAndel = (status, fastsattBelop) => ({
  aktivitetStatus: status,
  beregnetPrAar: 200000,
  overstyrtPrAar: fastsattBelop,
  beregningsperiodeFom: '2015-01-01',
  beregningsperiodeTom: '2017-01-01',
});

describe('<FastsettSN>', () => {
  it('Skal teste at det rendres riktig antall rader', () => {
    const avklaringsbehov = [
      mockAvklaringsbehovMedKodeOgStatus(avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, 'Ok.'),
    ];
    const wrapper = shallowWithIntl(
      <UnwrappedForm
        readOnly={false}
        isAvklaringsbehovClosed={false}
        erVarigEndring
        erNyArbLivet
        avklaringsbehov={avklaringsbehov}
        endretTekst={{}}
        intl={intlMock}
        fieldArrayID="dummyId"
      />,
    );

    const rows = wrapper.find('Row');
    expect(rows.length).to.equal(2);
  });
  it('Skal teste at buildInitialValues bygges korrekt når ikke tidligere fastsatt på sn ny i arbliv', () => {
    const andeler = [
      lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, null),
      lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000),
    ];
    const avklaringsbehov = [
      mockAvklaringsbehovMedKodeOgStatus(avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, null),
    ];

    const actualValues = FastsettSN.buildInitialValuesNyIArbeidslivet(andeler, avklaringsbehov);
    const expectedValues = {
      [fastsettInntektFieldname]: undefined,
      [begrunnelseFieldname]: '',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at buildInitialValues bygges korrekt når ikke tidligere fastsatt på sn ny i arbliv 2', () => {
    const andeler = [
      lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 500000),
      lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000),
    ];
    const avklaringsbehov = [
      mockAvklaringsbehovMedKodeOgStatus(avklaringsbehovCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET, 'Ok!!!'),
    ];

    const actualValues = FastsettSN.buildInitialValuesNyIArbeidslivet(andeler, avklaringsbehov);

    const expectedValues = {
      [fastsettInntektFieldname]: '500 000',
      [begrunnelseFieldname]: 'Ok!!!',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });
});
