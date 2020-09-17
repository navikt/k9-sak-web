import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mountWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import TilkjentYtelseTimeLineData from './TilkjentYtelseTimelineData';
import { createVisningsnavnForAndel } from './TilkjentYteleseUtils';

const selectedItemDataFL = {
  andeler: [
    {
      aktivitetStatus: {
        kode: 'FL',
        kodeverk: 'AKTIVITET_STATUS',
      },
      inntektskategori: {
        kode: 'ARBEIDSTAKER',
        kodeverk: 'INNTEKTSKATEGORI',
      },
      aktørId: null,
      arbeidsforholdId: null,
      arbeidsforholdType: {
        kode: '-',
        kodeverk: 'OPPTJENING_AKTIVITET_TYPE',
      },
      arbeidsgiverNavn: null,
      arbeidsgiverOrgnr: '',
      eksternArbeidsforholdId: null,
      refusjon: 768,
      sisteUtbetalingsdato: '2020-04-28',
      stillingsprosent: 0,
      tilSoker: 0,
      utbetalingsgrad: 100,
      uttak: [
        {
          periode: {
            fom: '2020-04-20',
            tom: '2020-04-24',
          },
          utbetalingsgrad: 100,
          utfall: 'INNVILGET',
        },
      ],
    },
  ],
  dagsats: 768,
  fom: '2020-04-20',
  tom: '2020-04-24',
  id: 0,
};

const selectedItemStartDate = '2020-04-24';
const selectedItemEndDate = '2020-04-24';

const callbackForward = sinon.spy();
const callbackBackward = sinon.spy();

const getKodeverknavn = kodeverk => {
  if (kodeverk.kode === 'AT') {
    return 'Arbeidstaker';
  }
  if (kodeverk.kode === 'SN') {
    return 'Selvstendig næringsdrivende';
  }
  if (kodeverk.kode === 'FL') {
    return 'Frilans';
  }
  return '';
};

describe('<TilkjentYtelseTimeLineData>', () => {
  it('Skal vise riktig aktivitetsStatus', () => {
    const wrapper = mountWithIntl(
      <TilkjentYtelseTimeLineData
        callbackForward={callbackForward}
        callbackBackward={callbackBackward}
        selectedItemData={selectedItemDataFL}
        selectedItemStartDate={selectedItemStartDate}
        selectedItemEndDate={selectedItemEndDate}
        getKodeverknavn={getKodeverknavn}
      />,
    );
    expect(wrapper.find('FormattedMessage')).to.have.lengthOf(12);
    expect(wrapper.find('FormattedMessage').at(7).props().id).to.equal('TilkjentYtelse.PeriodeData.Aktivitetsstatus');

    expect(createVisningsnavnForAndel(selectedItemDataFL.andeler[0], getKodeverknavn)).to.equal('Frilans');
  });
});
