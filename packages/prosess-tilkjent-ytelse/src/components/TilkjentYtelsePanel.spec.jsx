import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { Undertittel } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { TilkjentYtelsePanelImpl } from './TilkjentYtelsePanel';
import Tilbaketrekkpanel from './tilbaketrekk/Tilbaketrekkpanel';
import shallowWithIntl from '../../i18n';

const tilbaketrekkAP = {
  definisjon: {
    kode: aksjonspunktCodes.VURDER_TILBAKETREKK,
  },
  status: {
    kode: 'OPPR',
  },
  begrunnelse: undefined,
};

const getKodeverknavn = kodeverk => {
  if (kodeverk.kode === aktivitetStatuser.ARBEIDSTAKER) {
    return 'Arbeidstaker';
  }
  if (kodeverk.kode === aktivitetStatuser.SELVSTENDIG_NAERINGSDRIVENDE) {
    return 'Selvstendig næringsdrivende';
  }
  return '';
};

describe('<TilkjentYtelsePanelImpl>', () => {
  it('skall innehålla rätt undertekst', () => {
    const familieDate = new Date('2018-04-04');
    const wrapper = shallowWithIntl(
      <TilkjentYtelsePanelImpl
        intl={intlMock}
        readOnly
        beregningsresultatMedUttaksplan={null}
        hovedsokerKjonn="K"
        medsokerKjonn="M"
        familiehendelseDato={familieDate}
        stonadskontoer={null}
        submitCallback={sinon.spy()}
        readOnlySubmitButton
        getKodeverknavn={getKodeverknavn}
        behandlingId={1}
        behandlingVersjon={1}
      />,
    );
    expect(wrapper.find(Undertittel)).to.have.length(1);
    expect(wrapper.find(Undertittel).props().children.props.id).to.equal('TilkjentYtelse.Title');
    expect(wrapper.find(Tilbaketrekkpanel)).to.have.length(0);
  });

  it('Skal vise tilbaketrekkpanel gitt tilbaketrekkaksjonspunkt', () => {
    const familieDate = new Date('2018-04-04');
    const wrapper = shallowWithIntl(
      <TilkjentYtelsePanelImpl
        intl={intlMock}
        readOnly
        beregningsresultatMedUttaksplan={null}
        hovedsokerKjonn="K"
        medsokerKjonn="M"
        familiehendelseDato={familieDate}
        stonadskontoer={null}
        submitCallback={sinon.spy()}
        readOnlySubmitButton
        vurderTilbaketrekkAP={tilbaketrekkAP}
        getKodeverknavn={getKodeverknavn}
        behandlingId={1}
        behandlingVersjon={1}
      />,
    );
    expect(wrapper.find(Tilbaketrekkpanel)).to.have.length(1);
  });
});
