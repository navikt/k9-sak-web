import React from 'react';
import { expect } from 'chai';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';

import NaeringsopplysningsPanel from './NaeringsOpplysningsPanel';

import shallowWithIntl, { intlMock } from '../../../i18n';

const andelerForstePeriode = {
  aktivitetStatus: {
    kode: aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
    kodeverk: 'AKTIVITET_STATUS',
  },
  næringer: [
    {
      begrunnelse: 'Endringsbeskrivelse',
      endringsdato: '2019-11-22',
      erNyIArbeidslivet: false,
      erNyoppstartet: true,
      erVarigEndret: true,
      kanRegnskapsførerKontaktes: false,
      kode: 'ANNEN',
      kodeverk: 'VIRKSOMHET_TYPE',
      oppgittInntekt: 1500000,
      oppstartsdato: '2019-09-16',
      orgnr: '910909088',
      regnskapsførerNavn: 'Regnar Regnskap',
      regnskapsførerTlf: '99999999',
      utenlandskvirksomhetsnavn: null,
      virksomhetType: {
        kode: 'ANNEN',
        kodeverk: 'VIRKSOMHET_TYPE',
      },
    },
  ],
};

describe('NaeringsopplysningsPanel', () => {
  it('Skal teste at komponenten renderer riktige verdier', () => {
    const wrapper = shallowWithIntl(
      <NaeringsopplysningsPanel.WrappedComponent alleAndelerIForstePeriode={[andelerForstePeriode]} intl={intlMock} />,
    );
    const formattedMessages = wrapper.find('MemoizedFormattedMessage');
    expect(formattedMessages).to.be.lengthOf(3);
    expect(formattedMessages.first().props().id).to.equal('Beregningsgrunnlag.NaeringsOpplysningsPanel.Overskrift');
    expect(formattedMessages.at(1).props().id).to.equal('Beregningsgrunnlag.NaeringsOpplysningsPanel.OppgittAar');
    expect(formattedMessages.at(2).props().id).to.equal(
      'Beregningsgrunnlag.NaeringsOpplysningsPanel.VirksomhetsType.ANNEN',
    );

    const messages = wrapper.find('Normaltekst');
    expect(messages).to.be.lengthOf(5);
    expect(messages.at(1).childAt(0).text()).to.equal(
      formatCurrencyNoKr(andelerForstePeriode.næringer[0].oppgittInntekt),
    );
    expect(messages.at(2).childAt(0).text()).to.equal(andelerForstePeriode.næringer[0].orgnr);
    const lesMer = wrapper.find('Lesmerpanel');
    expect(lesMer.length).to.equal(1);
  });
});
